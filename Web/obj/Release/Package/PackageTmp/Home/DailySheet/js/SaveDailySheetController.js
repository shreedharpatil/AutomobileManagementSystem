var module = angular.module('ABS');

module.controller('SaveDailySheetController', ['$scope', 'SaveDailySheetService', function (scope, saveDailySheetService) {
    scope.Model = saveDailySheetService;
    scope.Model.Initialize();
}]);