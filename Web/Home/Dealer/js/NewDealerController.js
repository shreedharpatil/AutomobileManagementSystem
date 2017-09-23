var module = angular.module('ABS');

module.controller('NewDealerController', ['$scope', 'NewDealerService', '$modalInstance',
    function (scope, newDealerService, modalInstance) {
        scope.Model = newDealerService;
        scope.ValidationMessage = new ValidationMessage();
        console.log(scope.dealerform);
    scope.Model.Close = function (data) {
        modalInstance.close(data);
    }
}]);