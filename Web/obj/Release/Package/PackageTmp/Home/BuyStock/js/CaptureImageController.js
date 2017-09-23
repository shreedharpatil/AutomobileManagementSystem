angular.module('ABS').controller('CaptureImageController', ['$scope', '$modalInstance','CaptureImageService',function ($scope, $modalInstance,CaptureImageService) {
    $scope.Model = CaptureImageService;
    $scope.Model.Initialize();
    $scope.Model.closedialog = function () {
        $modalInstance.close('closed');
    }
}]);