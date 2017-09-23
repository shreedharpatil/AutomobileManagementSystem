var module = angular.module('ABS');

module.service('StockService', ['$http', '$rootScope', 'WarningMessageService', function (http, rootScope, warningMessageService) {
    return new StockServiceViewModel(http, rootScope, warningMessageService);
}]);

var StockServiceViewModel = (function () {
    var model = function (http, rootScope ,warningMessageService) {
        var self = this;
        self.StockItems = [];
        self.Stocks = [];
        self.StockLoader = false;
        self.StockItemLoader = false;

        self.Initialize = function () {
            rootScope.CurrentSelectedStock = null;
            self.StockItems = [];
            self.StockItemLoader = false;
            self.StockLoader = false;
            self.ActiveStockId = '';
        };

        self.StockClicked = function (stock) {
            self.ActiveStockId = stock.StockId;
        };

        self.LoadStockList = function () {
            self.StockLoader = true;
            http({
                url: '/api/Stock',
                method: 'GET',
            })
            .success(function (data) {
                self.StockLoader = false;
                self.Stocks = data;
            })
            .error(function (error) {
                self.StockLoader = false;
                alert(error);
            });
        };

        self.LoadStockItemList = function () {
            var stockId = rootScope.CurrentSelectedStock.StockId;
            self.StockItemLoader = true;
            http({
                url: '/api/StockItem?StockId=' + stockId + '&StockStatus=All',
                method: 'GET',
            })
            .success(function (data) {
                self.StockItems = data;
                self.StockItemLoader = false;
            })
            .error(function (error) {
                alert(error);
                self.StockItemLoader = false;
            });
        };

        self.OnStockSelected = function (stock) {
            rootScope.CurrentSelectedStock = angular.copy(stock);
            self.LoadStockItemList();
        };

        self.RefreshStockItemList = function (data) {
            if (data.QueryData) {
                self.LoadStockItemList();
            }
        };

        self.RefreshStockList = function (data) {
            if (data.QueryData) {
                self.LoadStockList();
            }
        };

        self.CreateNewStock = function () {
            var stockId;

            if (self.Stocks.length == 0) {
                stockId = 1;
            }
            else {
                var stockIds = _.pluck(self.Stocks, 'StockId');
                stockId = _.max(stockIds) + 1;
            }

            rootScope.CurrentStockId = stockId;
            warningMessageService.OpenPopup({ template: '/Home/Stock/html/NewStockTemplate.html', controller: 'NewStockController', Callback: self.RefreshStockList });
        };

        self.EditStock = function (stock) {
            rootScope.stockToBeUpdated = angular.copy(stock);
            warningMessageService.OpenPopup({ template: '/Home/Stock/html/UpdateStockTemplate.html', controller: 'UpdateStockController', Callback: self.RefreshStockList });
        };

        self.DeleteStock = function (stockId) {
            self.ShowLoader = true;
            http({
                url: '/api/Stock?StockId=' + stockId,
                method: 'DELETE'
            })
           .success(function (data) {
               alert(data);
               self.LoadStockList();
               rootScope.CurrentSelectedStock = null;
               self.StockItems = [];
           })
           .error(function (error) {
               self.ShowLoader = false;
               alert(error);
           });
        };

        self.CreateNewStockItem = function () {
            if (rootScope.CurrentSelectedStock == null) {
                alert('Please select a stock first from table');
                return;
            }
            var stockItemId;

            if (self.StockItems.length == 0) {
                stockItemId = (rootScope.CurrentSelectedStock.StockId * 10000) + 1;
            }
            else {
                var stockItemIds = _.pluck(self.StockItems, 'StockItemId');
                stockItemId = _.max(stockItemIds) + 1;
            }

            rootScope.CurrentStockItemId = stockItemId;
            warningMessageService.OpenPopup({ template: '/Home/Stock/html/NewStockItemModalTemplate.html', controller: 'NewStockItemController', Callback: self.RefreshStockItemList });
        };

        self.EditStockItem = function (stocstockItem) {
            rootScope.stockItemToBeUpdated = angular.copy(stocstockItem);
            warningMessageService.OpenPopup({ template: '/Home/Stock/html/UpdateStockItemModalTemplate.html', controller: 'UpdateStockItemController', Callback: self.RefreshStockItemList });
        };

        self.DeleteStockItem = function (stockItem) {
            self.ShowLoader = true;
            http({
                url: '/api/StockItem?StockId=' + stockItem.StockId + "&StockItemId=" + stockItem.StockItemId,
                method: 'DELETE'
            })
           .success(function (data) {
               alert(data);
               self.LoadStockItemList();
           })
           .error(function (error) {
               self.ShowLoader = false;
               alert(error);
           });
        };

        self.AddBackStockItem = function (stockItem) {
            self.ShowLoader = true;
            http({
                url: '/api/AddBackStockItem',
                method: 'PUT',
                data: stockItem
            })
           .success(function (data) {
               alert(data);
               self.LoadStockItemList();
           })
           .error(function (error) {
               self.ShowLoader = false;
               alert(error);
           });
        };

        self.AddBackStock = function (stock) {
            self.ShowLoader = true;
            http({
                url: '/api/AddBackStock',
                method: 'PUT',
                data: stock
            })
           .success(function (data) {
               alert(data);
               self.LoadStockList();
           })
           .error(function (error) {
               self.ShowLoader = false;
               alert(error);
           });
        };
    };

    return model;
})();