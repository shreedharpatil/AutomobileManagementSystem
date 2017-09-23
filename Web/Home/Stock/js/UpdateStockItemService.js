var module = angular.module('ABS');

module.service('UpdateStockItemService', ['$http', '$rootScope', 'WarningMessageService', function (http, rootScope, warningMessageService) {
    return new UpdateStockItemServiceViewModel(http, rootScope, warningMessageService);
}]);

var UpdateStockItemServiceViewModel = (function () {
    var model = function (http, rootScope ,warningMessageService) {
        var self = this;
        self.StockItem = {};
        self.ShowLoader = false;

        self.LoadStockItem = function () {
            self.StockItem = rootScope.stockItemToBeUpdated;
        };

        self.UpdateStockItem = function () {
            self.ShowLoader = true;
            http({
                url: '/api/StockItem',
                method: 'PUT',
                    data : self.StockItem
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
            self.StockItem = {};
        };        
    };

    return model;
})();