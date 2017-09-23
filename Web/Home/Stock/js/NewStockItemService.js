var module = angular.module('ABS');

module.service('NewStockItemService', ['$http', '$rootScope', 'WarningMessageService', function (http, rootScope, warningMessageService) {
    return new NewStockItemServiceViewModel(http, rootScope, warningMessageService);
}]);

var NewStockItemServiceViewModel = (function () {
    var model = function (http, rootScope ,warningMessageService) {
        var self = this;
        self.StockItem = {};
        self.ShowLoader = false;
        self.Initialize = function () {
            self.StockItem.StockItemId = rootScope.CurrentStockItemId;
        };


        self.CreateNewStockItem = function () {
            self.StockItem.StockId = rootScope.CurrentSelectedStock.StockId;
            self.ShowLoader = true;
            http({
                url: '/api/StockItem',
                method: 'POST',
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