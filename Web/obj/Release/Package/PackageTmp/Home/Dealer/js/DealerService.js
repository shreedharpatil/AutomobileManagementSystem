var module = angular.module('ABS');

module.service('DealerService', ['$http', '$rootScope', 'WarningMessageService', function (http, rootScope, warningMessageService) {
    return new DealerServiceViewModel(http, rootScope ,warningMessageService);
}]);

var DealerServiceViewModel = (function () {
    var model = function (http, rootScope ,warningMessageService) {
        var self = this;
        self.DealerProfileTemplate = '';
        self.Dealers = [];
        self.ShowLoader = false;

        self.LoadDealerList = function () {
            self.ShowLoader = true;
            http({
                url: '/api/Dealer',
                method: 'GET',
            })
            .success(function (data) {
                self.ShowLoader = false;
                self.Dealers = data;
            })
            .error(function (error) {
                self.ShowLoader = false;
                alert(error);
            });
        };

        self.RefreshDealerList = function (data) {
            if (data.QueryData) {
                self.LoadDealerList();
            }
        };

        self.CreateNewDealer = function () {
            warningMessageService.OpenPopup({ template: '/Home/Dealer/html/NewDealerModalTemplate.html', controller: 'NewDealerController', Callback: self.RefreshDealerList });
        };

        self.EditDealer = function (dealer) {
            rootScope.dealerToBeUpdated = angular.copy(dealer);
            warningMessageService.OpenPopup({ template: '/Home/Dealer/html/UpdateDealerModalTemplate.html', controller: 'UpdateDealerController', Callback: self.RefreshDealerList });
        };

        self.DeleteDealer = function (dealer) {
            http({
                url: '/api/Dealer?DealerId=' + dealer.DealerId,
                method: 'DELETE'
            })
           .success(function (data) {
               alert(data);
           })
           .error(function (error) {
               alert(error);
           });
        };

        self.ShowDealerProfile = function (dealer) {
            rootScope.CurrentDealerProfile = angular.copy(dealer);
            self.DealerProfileTemplate = '/Home/Dealer/html/DealerProfileTemplate.html';
        };
    };

    return model;
})();