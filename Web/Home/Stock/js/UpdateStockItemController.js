var module = angular.module('ABS');

module.controller('UpdateStockItemController', ['$scope', 'UpdateStockItemService', '$modalInstance', function (scope, updateStockItemService, modalInstance) {
    scope.Model = updateStockItemService;
    scope.Model.LoadStockItem();
    scope.Model.Close = function (data) {
        modalInstance.close(data);
    }
}]);