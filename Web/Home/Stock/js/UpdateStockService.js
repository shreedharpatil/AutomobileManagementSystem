var module = angular.module('ABS');

module.service('UpdateStockService', ['$http', '$rootScope', 'WarningMessageService', function (http, rootScope, warningMessageService) {
    return new UpdateStockServiceViewModel(http, rootScope, warningMessageService);
}]);

var UpdateStockServiceViewModel = (function () {
    var model = function (http, rootScope ,warningMessageService) {
        var self = this;
        self.Stock = {};
        self.ShowLoader = false;

        self.LoadStock = function () {
            self.Stock = rootScope.stockToBeUpdated;
        };

        self.UpdateStock = function () {
            self.ShowLoader = true;
            http({
                url: '/api/Stock',
                method: 'PUT',
                    data : self.Stock
            })
            .success(function (data) {
                alert(data);
                self.ShowLoader = false;
                self.Clear();
                self.Close({QueryData : true});
            })
            .error(function (error) {
                self.ShowLoader = false;
                alert(error);
            });
        };

        self.Clear = function () {
            self.Stock = {};
        };        
    };

    return model;
})();