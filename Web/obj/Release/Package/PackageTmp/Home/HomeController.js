var module = angular.module('ABS');

module.controller('HomeController', ['$scope', 'HomeService', function (scope, homeService) {
    scope.Model = homeService;
}]);


module.service('HomeService', ['$http', function (http) {
    return new HomeServiceViewModel(http);
}]);

var HomeServiceViewModel = (function () {
    var model = function (http) {
        var self = this;
        self.HeaderTemplate = '/Home/Common/HeaderTemplate.html';
        self.FooterTemplate = '/Home/Common/FooterTemplate.html';

        self.Logout = function () {
            http({
                method: 'POST',
                url : '/api/Logout'
            })
            .success(function (data) {
                window.location.href = data;
            })
            .error(function (error) {
                alert(error);
            });
        };
    };

    return model;
})();


angular.module('ABS').config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/home', {
            templateUrl: '/Home/Common/HomeIconsTemplate.html',
            controller: ''
        })
        .when('/managedealers', {
            templateUrl: '/Home/Dealer/html/DealerTemplate.html',
            controller: 'DealerController'
        })
        .when('/managecustomers', {
            templateUrl: '/Home/Customer/html/CustomerTemplate.html',
            controller: 'CustomerController'
        })
        .when('/managestocks', {
            templateUrl: '/Home/Stock/html/StockTemplate.html',
            controller: 'StockController'
        })
        .when('/buystocks', {
            templateUrl: '/Home/BuyStock/html/BuyStockTemplate.html',
            controller: 'BuyStockController'
        })
         .when('/sellstocks', {
             templateUrl: '/Home/SellStock/html/SellStockTemplate.html',
             controller: 'SellStockController'
         })
    .when('/reports', {
        templateUrl: '/Home/Reports/html/ReportsTemplate.html',
        controller: 'ReportsController'
    })
        .when('/dailysheet', {
            templateUrl: '/Home/DailySheet/html/DailySheetTemplate.html',
            controller: 'DailySheetController'
        })
            .when('/aboutus', {
                templateUrl: '/Home/AboutUs/AboutUs.html',
                controller: ''
            })
        .otherwise({
            redirectTo: '/home'
        });
}]);