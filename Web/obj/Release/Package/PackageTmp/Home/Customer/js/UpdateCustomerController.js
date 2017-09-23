var module = angular.module('ABS');

module.controller('UpdateCustomerController', ['$scope', 'UpdateCustomerService', '$modalInstance', '$rootScope',
    function (scope, updateCustomerService, modalInstance, rootScope) {
    scope.Model = updateCustomerService;
    scope.Model.LoadCustomer();
    scope.Model.CurrentTemplateView = rootScope.CurrentTemplateView;    
    scope.ValidationMessage = new ValidationMessage();
    scope.Model.Close = function (data)
    {
        modalInstance.close(data);
    }
}]);