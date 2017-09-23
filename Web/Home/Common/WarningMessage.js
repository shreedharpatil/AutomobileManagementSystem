var commonmodule = angular.module('ABS');

commonmodule.service('WarningMessageService', ['$dialogs', '$rootScope', function ($dialogs, $rootScope) {
    return new warningmessageviewModel($dialogs, $rootScope);
}]);

var warningmessageviewModel = (function () {
    var model = function (dialog, rootScope) {
        this.OpenPopup = function (data) {
            rootScope.Title = data.Heading;
            rootScope.Content = data.Body;
            rootScope.HtmlBody = data.HtmlBody;
            dlg = dialog.create(data.template, data.controller, {}, { key: true, back: 'static' });
            dlg.result.then(function (data1) {
                if (data.Callback) {
                    data.Callback(data1);
                }
            }, function () {
            });
        };
    }
    return model;
})();/**
 * Created by shreedhar on 5/24/2015.
 */
