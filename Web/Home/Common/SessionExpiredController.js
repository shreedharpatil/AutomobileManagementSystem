var module = angular.module('ABS');

module.controller('SessionExpiredController', ['$scope', '$location', function (scope, location) {
    scope.HeaderTemplate = '/Home/Common/HeaderTemplate.html';
    scope.FooterTemplate = '/Home/Common/FooterTemplate.html';
    scope.loginurl = location.$$protocol + "://" + location.$$host + ":" + location.$$port + "/Login/index.html"
}]);