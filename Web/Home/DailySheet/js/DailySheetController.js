var module = angular.module('ABS');

module.controller('DailySheetController', ['$scope', 'DailySheetService', function (scope, dailySheetService) {
    scope.Model = dailySheetService;
}]);