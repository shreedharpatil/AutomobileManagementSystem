var module = angular.module('ABS');

module.controller('NewStockItemController', ['$scope', 'NewStockItemService', '$modalInstance','$rootScope', function (scope, newStockItemService, modalInstance,rootScope) {
    scope.Model = newStockItemService;
    scope.Model.Initialize();
    scope.Model.Close = function (data) {
        rootScope.CurrentStockItemId = '';
        modalInstance.close(data);
    }
}]);