var module = angular.module('ABS');

module.controller('CustomerController', ['$scope', 'CustomerService', function (scope, customerService) {
    scope.Model = customerService;
    scope.Model.LoadCustomerList();
}]);