var module = angular.module('ABS');

module.service('DailySheetService', [ function () {
    return new DailySheetServiceViewModel();
}]);

var DailySheetServiceViewModel = (function () {
    var model = function () {
        var self = this;
        self.DailySheetTemplate = '/Home/DailySheet/html/SaveDailySheetTemplate.html';
    };

    return model;
})();