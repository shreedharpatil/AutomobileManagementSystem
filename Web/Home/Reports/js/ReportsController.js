var module = angular.module('ABS');

module.controller('ReportsController', ['$scope', 'ReportsService', function (scope, reportsService) {
    scope.Model = reportsService;    
}]);