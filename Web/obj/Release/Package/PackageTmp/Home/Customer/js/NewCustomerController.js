var module = angular.module('ABS');

module.controller('NewCustomerController', ['$scope', 'NewCustomerService', '$modalInstance', 'CaptureImageService','$rootScope',
    function (scope, newCustomerService, modalInstance, captureImageService, rootScope) {
        scope.Model = newCustomerService;
        scope.Model.Initialize();
        scope.ImageService = captureImageService;
        scope.ImageService.Initialize();
        scope.ValidationMessage = new ValidationMessage();
        scope.Model.CurrentTemplateView = rootScope.CurrentTemplateView;
        scope.Model.Close = function (data) {
            if (scope.ImageService.IsCameraStarted) {
                scope.ImageService.StopCamera();
            }
            modalInstance.close(data);
        }
}]);