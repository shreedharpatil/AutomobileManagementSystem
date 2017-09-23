var module = angular.module('ABS');

module.service('UpdateDealerService', ['$http', '$rootScope', function (http, rootScope) {
    return new UpdateDealerServiceViewModel(http, rootScope);
}]);

var UpdateDealerServiceViewModel = (function () {
    var model = function (http, rootScope) {
        var self = this;
        //self.Dealer = { "Id": 1, "Title": "Mr.", "LastName": "Patil", "FirstName": "shreedhar", "Address": "MLBCC Badami", "Place": "Badami", "EmailId": "shreedhar.patil@gmail.coom", "ContactNumber": "8998989834", "TinNumber": '2438294809' };
        self.ShowLoader = false;
        self.LoadDealer = function () {
            self.Dealer = rootScope.dealerToBeUpdated;
        };

        self.UpdateDealer = function () {
            self.ShowLoader = true;
            http({
                url: '/api/Dealer',
                method: 'PUT',
                data: self.Dealer
            })
            .success(function (data) {
                alert(data);
                self.Clear();
                self.ShowLoader = false;
                self.Close({ QueryData: true });
            })
            .error(function (error) {
                self.ShowLoader = false;
                alert(error);
            });
        };

        self.Clear = function () {
            self.Dealer = {};
        };
    };

    return model;
})();