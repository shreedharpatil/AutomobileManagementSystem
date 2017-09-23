var module = angular.module('ABS');

module.controller('NewStockController', ['$scope', 'NewStockService', '$modalInstance','$rootScope',
    function (scope, newStockService, modalInstance, rootScope) {
    scope.Model = newStockService;
    scope.Model.Initialize();
    scope.Model.Close = function (data) {
        rootScope.CurrentStockId = '';
        modalInstance.close(data);
    }
}]);