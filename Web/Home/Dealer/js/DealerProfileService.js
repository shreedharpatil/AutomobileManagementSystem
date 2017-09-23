var module = angular.module('ABS');

module.service('DealerProfileService', ['$http', '$rootScope', 'DealerService', function (http, rootScope, dealerService) {
    return new DealerProfileServiceViewModel(http, rootScope, dealerService);
}]);

var DealerProfileServiceViewModel = (function () {
    var model = function (http, rootScope, dealerService) {
        var self = this;
        self.Transactions = [];
        self.Transaction = { FromDate: new Date(), ToDate: new Date(), TransactionStatus: 'All' };
        self.Initialize = function () {
            self.ShowLoader = false;
            var today = new Date();
            today.setMonth(today.getMonth() - 3);
            self.Transaction.FromDate = today;
            self.Transaction.ToDate = new Date();
            self.Dealer = rootScope.CurrentDealerProfile;
        };

        self.Toggle = function (trans, view) {
            if (view == 'EditTrans') {
                trans.UpdationFailed = false;
                trans.UpdationSuccess = false;
                trans.NewPaidAmount = '';
            }
            trans.CurrentView = view;
        };

        self.Back = function () {
            dealerService.DealerProfileTemplate = '';
        };

        self.CalculateNewDueAmount = function (trans) {
            var paid = isNaN(trans.PaidAmount) ? 0 : parseFloat(trans.PaidAmount);
            trans.DueAmount = trans.TotalAmount - paid;
        };

        self.CloseMesageBox = function (trans) {
            trans.UpdationSuccess = false;
        };

        self.CloseErrorMessageBox = function (trans) {
            trans.UpdationFailed = false;
        };

        self.UpdateTransaction = function (trans) {
            if (!trans.NewPaidAmount) {
                alert('Enter new paid amount');
                return;
            }
            trans.ShowLoader = true;
            var paid = isNaN(trans.PaidAmount) ? 0 : parseFloat(trans.PaidAmount);
            var newpaid = isNaN(trans.NewPaidAmount) ? 0 : parseFloat(trans.NewPaidAmount);
            trans.PaidAmount = paid.ToDecimalPlaces(2) + newpaid.ToDecimalPlaces(2);
            var total = isNaN(trans.TotalAmount) ? 0 : parseFloat(trans.TotalAmount);
            trans.DueAmount = total - trans.PaidAmount;
            trans.DueAmount = trans.DueAmount.ToDecimalPlaces(2);
            http({
                method: 'PUT',
                url: '/api/DealerTransaction',
                data: trans
            })
            .success(function (data) {
                trans.UpdationFailed = false;
                trans.ShowLoader = false;
                if (trans.DueAmount <= 0) {
                    trans.TransactionStatus = "Paid";
                }
                trans.UpdationSuccess = true;
                trans.CurrentView = 'Trans';
            })
            .error(function (error) {
                trans.PaidAmount -= newpaid;
                trans.DueAmount = total - trans.PaidAmount;
                trans.UpdationFailed = true;
                trans.ShowLoader = false;
                trans.UpdationSuccess = false;
                trans.CurrentView = 'Trans';
            });
        };

        self.GetTransactions = function () {            
            self.ShowLoader = true;
            http({
                method: 'GET',
                url :'/api/DealerTransaction?FromDate=' + self.Transaction.FromDate.toDateString() + '&ToDate=' + self.Transaction.ToDate.toDateString() + '&TransactionStatus=' + self.Transaction.TransactionStatus + '&DealerId=' + self.Dealer.Id
            })
            .success(function (data) {
                self.Transactions = data;
                self.ShowLoader = false;
            })
            .error(function (error) {
                self.ShowLoader = false;
                alert(error);
            });
        };
    };

    return model;
})();