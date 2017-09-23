var module = angular.module('ABS');

module.controller('ViewDailySheetController', ['$scope', 'ViewDailySheetService', function (scope, viewDailySheetService) {
    
    scope.Model = viewDailySheetService;
    scope.Model.Initialize();
}]);