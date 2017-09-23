var module = angular.module('ABS');

module.controller('NewGuestController', ['$scope', 'SellStockService', '$modalInstance', function (scope, sellStockService, modalInstance) {
    scope.Model = sellStockService;
    scope.Model.Close = function (data) {
        modalInstance.close({IsGuestUser : data, Customer : scope.Customer});
    }
    scope.Customer = { CustomerTitle : '', CustomerFirstName : '' , CustomerLastName : '', CustomerMobile : '',CustomerAddress : '' };
    scope.ValidationMessage = new ValidationMessage();
    // scope.Model.Clear();
}]);