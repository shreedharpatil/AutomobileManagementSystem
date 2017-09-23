angular.module('ABS', ['ngRoute', 'dialogs', 'ui.bootstrap']);

function customInterceptor() {
    return {
        responseError: function (res) {
            if (res.headers('sessionexpired')) {
                window.location.href = res.headers('redirectlocation');
            }
            if (res.headers('applicationexpired')) {
                window.location.href = res.headers('redirectlocation');
            }
            console.log(res.headers());
            return res;
        }

    }
}

angular.module('ABS')
.factory('customInterceptor', customInterceptor)
.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('customInterceptor');
}]);