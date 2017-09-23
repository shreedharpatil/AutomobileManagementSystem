var module = angular.module('ABS');

module.controller('SellStockController', ['$scope', 'SellStockService', function (scope, sellStockService) {
    scope.Model = sellStockService;
    scope.Model.LoadCustomerList();
    scope.Model.LoadStockList();
    scope.Model.Clear();
}]);