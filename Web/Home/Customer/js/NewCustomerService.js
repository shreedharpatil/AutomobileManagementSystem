var module = angular.module('ABS');

module.service('NewCustomerService', ['$http', 'CaptureImageService', function (http, captureImageService) {
    return new NewCustomerServiceViewModel(http, captureImageService);
}]);

var NewCustomerServiceViewModel = (function () {
    var model = function (http, captureImageService) {
        var self = this;
        self.Customer = {};
        self.ShowLoader = false;

        self.CreateNewCustomer = function () {
            self.ShowLoader = true;
            self.Customer.IsImageCaptured = (captureImageService.Image != null);
            http({
                url: '/api/Customer',
                method: 'POST',
                data: self.Customer
            })
            .success(function (data) {
                if (self.Customer.IsImageCaptured) {
                    self.UploadPhoto(data);
                }
                else {
                    alert(data.Message);
                    self.Clear();
                    self.ShowLoader = false;
                    self.Close({QueryData : true});
                }
            })
            .error(function (error) {
                self.ShowLoader = false;
                alert(error);                
            });
        };

        self.Initialize = function () {
            self.Customer = {CustomerVehicleType : '', CustomerTitle :''};
        };

        self.UploadPhoto = function (data) {
            var self = this;
            var formData = new FormData();
            formData.append('CustomerPhoto', dataURItoBlob(captureImageService.Image), data.FileName );
            //console.log(formData);
            http.post('/api/UploadPhoto', formData, {
                headers: {
                    'Content-Type': undefined,
                    'foldername' : 'Customer'
                },

                transformRequest: angular.identity
            }).success(function (result) {
                console.log(result);
                // self.ShowMessage('Student Registration', data.Message);
                alert(data.Message);
                captureImageService.Image = null;
                self.Clear();
                self.ShowLoader = false;
                self.Close({ QueryData: true });
            }).error(function (error) {
                console.log("There was an error while uploading photo. Please try again later. However customer registration is successful.");
                captureImageService.Image = null;
                self.Clear();
                self.ShowLoader = false;
                self.Close({ QueryData: false });
                alert("There was an error while uploading photo. Please try again later. However customer registration is successful.");
            });
        };

        var dataURItoBlob = function (dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            var bb = new Blob([ab], { "type": mimeString });
            return bb;
        }

        self.Clear = function () {
            self.Customer = {};
        };
    };

    return model;
})();