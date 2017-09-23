var module = angular.module('ABS');

module.service('UpdateCustomerService', ['$http', '$rootScope', function (http, rootScope) {
    return new UpdateCustomerServiceViewModel(http, rootScope);
}]);

var UpdateCustomerServiceViewModel = (function () {
    var model = function (http, rootScope) {
        var self = this;
        //self.Dealer = { "Id": 1, "Title": "Mr.", "LastName": "Patil", "FirstName": "shreedhar", "Address": "MLBCC Badami", "Place": "Badami", "EmailId": "shreedhar.patil@gmail.coom", "ContactNumber": "8998989834", "TinNumber": '2438294809' };
        self.ShowLoader = false;
        self.LoadCustomer = function () {
            self.Customer = rootScope.customerToBeUpdated;
        };

        self.UpdateCustomer = function () {
            self.ShowLoader = true;
            http({
                url: '/api/Customer',
                method: 'PUT',
                data: self.Customer
            })
            .success(function (data) {
                alert(data);
                self.Clear();
                self.ShowLoader = false;
                self.Close({QueryData : true});
            })
            .error(function (error) {
                self.ShowLoader = false;
                alert(error);
            });
        };

        self.Clear = function () {
            self.Customer = {};
        };       
    };

    return model;
})();