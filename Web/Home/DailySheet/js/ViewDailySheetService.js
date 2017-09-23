var module = angular.module('ABS');

module.service('ViewDailySheetService', ['$http', 'DailySheetService', function (http, dailySheetService) {
    return new ViewDailySheetServiceViewModel(http, dailySheetService);
}]);

var ViewDailySheetServiceViewModel = (function () {
    var model = function (http, dailySheetService) {
        var self = this;
        self.ShowLoader = false;
        self.DailySheets = [];
        self.DailyExpenditureSheets = [];
        self.TotalDailySheetAmount = 0;
        self.TotalDailyExpenditureSheetAmount = 0;

        self.ToggleState = function () {
            dailySheetService.DailySheetTemplate = '/Home/DailySheet/html/SaveDailySheetTemplate.html';
        };
        
        self.Initialize = function () {
            self.DateOfExpenditure = new Date();
            self.DailySheets = [];
            self.DailyExpenditureSheets = [];
        };

        self.LoadDailySheets = function () {
            self.ShowLoader = true;
            http({
                method: 'GET',
                url: '/api/DailySheet?DateOfExpenditure=' + self.DateOfExpenditure.toDateString()
            })
            .success(function (data) {
                console.log(data);
                self.ShowLoader = false;
                self.DailySheets = data.DailySheets;
                self.DailyExpenditureSheets = data.DailyExpenditureSheets
                self.TotalDailySheetAmount = data.TotalDailySheetAmount;
                self.TotalDailyExpenditureSheetAmount = data.TotalDailyExpenditureSheetAmount;
            })
            .error(function (error) {
                alert(error);
                self.ShowLoader = false;
            });
        };
    };

    return model;
})();