var module = angular.module('ABS');

module.controller('StockController', ['$scope', 'StockService', function (scope, stockService) {
    scope.Model = stockService;
    scope.Model.Initialize();
    scope.Model.LoadStockList();
}]);