var module = angular.module('ABS');

module.controller('BuyStockController', ['$scope', 'BuyStockService', function (scope, buyStockService) {
    scope.Model = buyStockService;
    scope.Model.LoadDealerList();
    scope.Model.LoadStockList();
    scope.Model.Clear();    
}]);