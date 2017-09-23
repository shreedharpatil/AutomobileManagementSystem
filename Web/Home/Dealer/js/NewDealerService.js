var module = angular.module('ABS');

module.service('NewDealerService', ['$http', function (http) {
    return new NewDealerServiceViewModel(http);
}]);

var NewDealerServiceViewModel = (function () {
    var model = function (http) {
        var self = this;
        self.Dealer = {  };
        self.ShowLoader = false;

        self.CreateNewDealer = function () {
            self.ShowLoader = true;
            http({
                url: '/api/Dealer',
                method: 'POST',
                data : self.Dealer
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
            self.Dealer = {};
        };
    };

    return model;
})();