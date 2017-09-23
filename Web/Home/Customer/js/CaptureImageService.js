﻿angular.module('ABS').service('CaptureImageService', function () {
    return new CaptureImageServiceViewModel();
});

var CaptureImageServiceViewModel = (function () {

    var model = function () {
        var self = this;
        var width = 400;    // We will scale the photo width to this
        var height = 0;     // This will be computed based on the input stream
        self.IsCameraStarted = false;
        var streaming = false;
        self.Image = null;
        var video = null;
        var canvas = null;
        var photo = null;
        var startbutton = null;        
        var Stream = null;

        self.Initialize = function () {
            self.IsCameraStarted = false;
            streaming = false;
            self.Image = null;
            video = null;
            canvas = null;
            photo = null;
            startbutton = null;
            Stream = null;
        };

        self.StartCamera = function () {
            video = document.getElementById('video');
            canvas = document.getElementById('canvas');
            photo = document.getElementById('photo');
            startbutton = document.getElementById('startbutton');
            self.IsCameraStarted = true;
            navigator.getMedia = (navigator.getUserMedia ||
                                   navigator.webkitGetUserMedia ||
                                   navigator.mozGetUserMedia ||
                                   navigator.msGetUserMedia);

            navigator.getMedia(
              {
                  video: true,
                  audio: false
              },
              function (stream) {
                  if (navigator.mozGetUserMedia) {
                      video.mozSrcObject = stream;
                  } else {
                      var vendorURL = window.URL || window.webkitURL;
                      video.src = vendorURL.createObjectURL(stream);
                  }
                Stream = stream;
                video.play();
                
              },
              function (err) {
                  console.log("An error occured! " + err);
              }
            );

            video.addEventListener('canplay', function (ev) {
                if (!streaming) {
                    height = video.videoHeight / (video.videoWidth / width);

                    // Firefox currently has a bug where the height can't be read from
                    // the video, so we will make assumptions if this happens.

                    if (isNaN(height)) {
                        height = width / (4 / 3);
                    }

                    video.setAttribute('width', width);
                    video.setAttribute('height', height);
                    canvas.setAttribute('width', width);
                    canvas.setAttribute('height', height);
                    streaming = true;
                }
            }, false);

            startbutton.addEventListener('click', function (ev) {
                takepicture();
                ev.preventDefault();
            }, false);

            clearphoto();            
        };

        self.StopCamera = function () {
            //if (Stream.stop) {
            //    Stream.stop();
            //}
            Stream.getVideoTracks().forEach(function (track) {
                track.stop();
            });
            Stream = null;
            video.mozSrcObject = null;
            video.src = null;
            self.IsCameraStarted = false;
        };

        self.Close = function () {
            self.StopCamera();
            self.closedialog();
        };

        function clearphoto() {
            var context = canvas.getContext('2d');
            context.fillStyle = "#AAA";
            context.fillRect(0, 0, canvas.width, canvas.height);

            var data = canvas.toDataURL('image/png');
           // photo.setAttribute('src', data);
        }

        function takepicture() {
            var context = canvas.getContext('2d');
            if (width && height) {
                canvas.width = width;
                canvas.height = height;
                context.drawImage(video, 0, 0, width, height);

                var data = canvas.toDataURL('image/png');
                //dataURItoBlob("data:image/jpeg;base64,"+imageData);

                self.Image = data;
                // photo.setAttribute('src', data);
            } else {
                clearphoto();
            }
        }
    };

    return model;
})();