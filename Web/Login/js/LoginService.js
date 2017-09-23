var module = angular.module('ABS');

module.service('LoginService', ['$http', '$location', function (http, location) {
    return new LoginServiceViewModel(http, location);
}]);

var LoginServiceViewModel = (function () {
    var model = function (http, location) {
        var self = this;
        self.Login = { UserName: '', Password: '' };
        self.HeaderTemplate = '/Home/Common/HeaderTemplate.html';
        self.FooterTemplate = '/Home/Common/FooterTemplate.html';
        self.ShowLoader = false;

        self.DoLogin = function () {
            self.ShowLoader = true;
            http({
                method: 'POST',
                url: '/api/Login',
                data: self.Login
            })
            .success(function (data) {
                self.ShowLoader = false;
                    if (data.Status) {
                        window.location.href = location.$$protocol + "://" + location.$$host + ":" + location.$$port + "/Home/Index.html";
                    } else {
                        self.ErrorMessage = data.Message;
                    }
                })
            .error(function (error) {
                self.ShowLoader = false;
                alert(error);
            });
        };
    }

    return model;
})();