var module = angular.module('ABS');

module.controller('DealerController', ['$scope', 'DealerService', function (scope, dealerService) {
    scope.Model = dealerService;
    scope.Model.LoadDealerList();
}]);