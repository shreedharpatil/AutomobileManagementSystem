var module = angular.module('ABS');

module.controller('DealerProfileController', ['$scope', 'DealerProfileService', function (scope, dealerProfileService) {
    scope.Model = dealerProfileService;
    scope.Model.Initialize();
    scope.Model.GetTransactions();
}]);