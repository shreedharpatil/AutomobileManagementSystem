var module = angular.module('ABS');

module.service('NewStockService', ['$http', '$rootScope', 'WarningMessageService', function (http, rootScope, warningMessageService) {
    return new NewStockServiceViewModel(http, rootScope, warningMessageService);
}]);

var NewStockServiceViewModel = (function () {
    var model = function (http, rootScope ,warningMessageService) {
        var self = this;
        self.Stock = {};
        self.ShowLoader = false;

        self.Initialize = function () {
            self.Stock.StockId = rootScope.CurrentStockId;
            self.Stock.StockName = '';
        };

        self.CreateNewStock = function () {
            self.ShowLoader = true;
            http({
                url: '/api/Stock',
                method: 'POST',
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