var module = angular.module('ABS');

module.controller('UpdateStockController', ['$scope', 'UpdateStockService', '$modalInstance', function (scope, updateStockService, modalInstance) {
    scope.Model = updateStockService;
    scope.Model.LoadStock();
    scope.Model.Close = function (data) {
        modalInstance.close(data);
    }
}]);