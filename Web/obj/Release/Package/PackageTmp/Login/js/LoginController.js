var module = angular.module('ABS');

module.controller('LoginController', ['$scope', 'LoginService', function (scope, loginService) {
    scope.Model = loginService;
}]);