var module = angular.module('ABS');

module.service('CustomerProfileService', ['$http', '$rootScope', 'CustomerService', function (http, rootScope, customerService) {
    return new CustomerProfileServiceViewModel(http, rootScope, customerService);
}]);

var CustomerProfileServiceViewModel = (function () {
    var model = function (http, rootScope, customerService) {
        var self = this;
        self.Transactions = [];
        self.Transaction = { FromDate: new Date(), ToDate: new Date(), TransactionStatus: 'All' };
        self.Initialize = function () {
            self.ShowLoader = false;
            var today = new Date();
            today.setMonth(today.getMonth() - 3);
            self.Transaction.FromDate = today;
            self.Transaction.ToDate = new Date();
            self.Customer = rootScope.CurrentCustomerProfile;
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
            customerService.CustomerProfileTemplate = '';
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
                url: '/api/CustomerTransaction',
                data : trans
            })
            .success(function (data) {
                trans.UpdationFailed = false;
                trans.ShowLoader = false;
                if (trans.DueAmount <= 0)
                {
                    trans.TransactionStatus = "Paid";
                }
                trans.UpdationSuccess = true;
                trans.CurrentView = 'Trans';
            })
            .error(function (error) {
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
                url: '/api/CustomerTransaction?FromDate=' + self.Transaction.FromDate.toDateString() + '&ToDate=' + self.Transaction.ToDate.toDateString() + '&TransactionStatus=' + self.Transaction.TransactionStatus + '&CustomerId=' + self.Customer.CustomerId
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