var module = angular.module('ABS');

module.controller('UpdateDealerController', ['$scope', 'UpdateDealerService', '$modalInstance', function (scope, updateDealerService, modalInstance) {
    scope.Model = updateDealerService;
    scope.Model.LoadDealer();
    scope.ValidationMessage = new ValidationMessage();
    scope.Model.Close = function (data) {
        modalInstance.close(data);
    }
}]);