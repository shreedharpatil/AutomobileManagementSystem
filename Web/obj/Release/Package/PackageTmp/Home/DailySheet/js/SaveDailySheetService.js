var module = angular.module('ABS');

module.service('SaveDailySheetService', ['$http', 'DailySheetService', function (http, dailySheetService) {
    return new SaveDailySheetServiceViewModel(http, dailySheetService);
}]);

var SaveDailySheetServiceViewModel = (function () {
    var model = function (http, dailySheetService) {
        var self = this;
        self.ShowLoader = false;
        self.DailySheets = [{Particulars : '', Quantity : '', Amount : '', ExpenditureType :'DailySheet'}];
        self.DailyExpenditureSheets = [{ Particulars: '', Quantity: '', Amount: '', ExpenditureType: 'DailyExpenditureSheet' }];

        self.Initialize = function () {
            self.DailySheets = [{ Particulars: '', Quantity: '', Amount: '', ExpenditureType: 'DailySheet', DateOfExpenditure: new Date() }];
            self.DailyExpenditureSheets = [{ Particulars: '', Quantity: '', Amount: '', ExpenditureType: 'DailyExpenditureSheet', DateOfExpenditure: new Date() }];
        };

        self.ToggleState = function () {
            dailySheetService.DailySheetTemplate = '/Home/DailySheet/html/ViewDailySheetTemplate.html';
        };

        self.NewDailySheet = function () {
            self.DailySheets.push({ Particulars: '', Quantity: '', Amount: '', ExpenditureType: 'DailySheet', DateOfExpenditure : new Date() });
        };

        self.NewDailyExpenditureSheet = function () {
            self.DailyExpenditureSheets.push({ Particulars: '', Quantity: '', Amount: '', ExpenditureType: 'DailyExpenditureSheet', DateOfExpenditure: new Date() });
        };

        self.RemoveDailySheet = function (index) {
            self.DailySheets.splice(index,1);
        };

        self.RemoveDailyExpenditureSheet = function (index) {
            self.DailyExpenditureSheets.splice(index, 1);
        };

        self.SaveDailySheets = function () {
            if (self.DailySheets.length == 0) {
                alert('Nothing to save.');
                return;
            }

            self.PostDailySheets(self.DailySheets,true);
        };

        self.SaveDailyExpenditureSheets = function () {
            if (self.DailyExpenditureSheets.length == 0) {
                alert('Nothing to save.');
                return;
            }
            self.PostDailySheets(self.DailyExpenditureSheets,false);
        };

        self.PostDailySheets = function (sheets,isTrue) {
            self.ShowLoader = true;
            http({
                method: 'POST',
                url: '/api/DailySheet',
                data : sheets
            })
            .success(function (data) {
                alert(data);
                self.ShowLoader = false;
                if (isTrue) {
                    self.DailySheets = [];
                }
                else {
                    self.DailyExpenditureSheets = [];
                }
            })
            .error(function (error) {
                alert(error);
                self.ShowLoader = false;
            });
        };
    };

    return model;
})();