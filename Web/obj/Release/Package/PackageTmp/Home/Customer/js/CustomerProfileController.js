var module = angular.module('ABS');

module.controller('CustomerProfileController', ['$scope', 'CustomerProfileService', function (scope, customerProfileService) {
    scope.Model = customerProfileService;
    scope.Model.Initialize();
    scope.Model.GetTransactions();
}]);