angular.module('memeGen.controllers', ['ngOpenFB'])

.controller('LoginCtrl', function($scope, $openFB, $state, $stateParams, $ionicPopup){
    
    $scope.fbLogin = function () {// run the login script and get the FB info we want
        $openFB.login({scope: 'email'}).then(function( token ) {
            $openFB.api({
                    path: '/me',
                    params: {fields: 'email'}
                }).then(function (user) {
                        $scope.user = user;
                        localStorage.setItem('UserEmail', user.email);
                        $state.go('image');
                    },function (error) {
                        $ionicPopup.alert({
                            title: 'Login Error',
                            template: '<div class="col">'+ error.error_description +'</div>'
                        });
                    });
        }, function( err ) {
            $ionicPopup.alert({
                title: 'Login Error',
                template: '<div class="col">'+ err +'</div>'
            });
        });
    }
})
//
//
.controller('MenuCtrl', function($scope, ionicMaterialMotion, $state, $ionicPopup, $localStorage){
    ionicMaterialMotion.ripple();
})
//
//
.controller('ImageCtrl', function($scope, $state, $stateParams, $cordovaCamera, $log, $window, $ionicPopup, $localStorage, $ionicLoading, $ionicActionSheet, $ionicModal){
    var canvas = document.getElementById('meme');
    canvasDraw = canvas.getContext('2d');
    var fontSize = "100"; //set value to prevent errors
    var textFillColor = "#000"; //set value to prevent errors 
    var fontFace = "serif"; //set value to prevent errors
    var fontWeight = "bold"; //set value to prevent errors
    var fontStyle = "normal"; //set value to prevent errors
    $scope.text = {}
    $scope.font = {}
    var image;


    // Triggered on a button click, or some other target
    $scope.show = function() {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Photo Library' },
                { text: 'Camera' }
            ],
            cancelText: 'Cancel',
            cancel: function() {
                $ionicPopup.alert({
                    title: 'Oh No',
                    template: '<div class="col">You didn\'t do anything, you need an image for this to work...</div>'
                });
            },
            buttonClicked: function(index) {
                switch (index){
                    case 0: 
                        var photolib = {
                            quality: 100,
                            destinationType: Camera.DestinationType.FILE_URL,
                            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                            saveToPhotoAlbum: false,
                            correctOrientation:true
                        };

                        $cordovaCamera.getPicture(photolib).then(function(imageData) {
                            image = imageData;
                            img = new Image();
                            img.src = image;
                            img.onload = function(){
                                imageWidth = img.width;
                                imageHeight = img.height;
                                canvas.width = imageWidth;
                                canvas.height = imageHeight;
                                canvasDraw.drawImage(img,0,0);
                            }
                        }, function(err) {
                            $ionicPopup.alert({
                                title: 'Oh No',
                                template: '<div class="col">You didn\'t select an image. Kinda need one of those for this to work...</div>'
                            });
                        });
                        return true;
                        break;

                    case 1:
                        var cameraGet = {
                            quality: 100,
                            destinationType: Camera.DestinationType.FILE_URL,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            saveToPhotoAlbum: false,
                            correctOrientation:true
                        };

                        $cordovaCamera.getPicture(cameraGet).then(function(imageData) {
                            image = imageData;
                            img = new Image();
                            img.src = image;
                            img.onload = function(){
                                imageWidth = img.width;
                                imageHeight = img.height;
                                canvas.width = imageWidth;
                                canvas.height = imageHeight;
                                canvasDraw.drawImage(img,0,0);
                            }
                        }, function(err) {
                            $ionicPopup.alert({
                                title: 'Oh No',
                                template: '<div class="col">You didn\'t take an image. Kinda need one of those for this to work...</div>'
                            });
                        });
                        return true;
                        break;
                }
            }
        });
     };

    $scope.addText = function(){
        $ionicModal.fromTemplateUrl('templates/add-text.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    }

    $scope.draw = function(){
        topText = $scope.text.top;
        bottomText = $scope.text.bottom;
        fontWeight = $scope.font.weight;
        fontStyle = $scope.font.style;
        fontSize = $scope.font.size;
        fontFace = $scope.font.face;
        textFillColor = $scope.font.color;
        redraw();
    }
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.saveImage = function(){
        $ionicLoading.show().then(function(){
            canvas2ImagePlugin.saveImageDataToLibrary(
                function(msg){
                    $ionicLoading.hide();
                    console.log(msg);
                    var $popUp = $ionicPopup.alert({
                        title: 'Image Saved', // String. The title of the popup.
                        cssClass: 'modal-create', // String, The custom CSS class name
                        template: '<p>Hey it saved, go look!!'
                    });
                },
                function(err){
                    $ionicPopup.alert({
                        title: 'Oh No',
                        template: '<div class="col">Hmm it didn\'t save, and thi smessage proves it! <span>'+err+'</span></div>'
                    });
                    console.log(err);
                },
                document.getElementById('meme')
            ); 
        });
        
    }


    function redraw(){
        canvasDraw.clearRect(0, 0, canvas.width, canvas.height);
        img = new Image();
        img.src = image;
        img = canvasDraw.drawImage(img,0,0);
        //start top text redraw
        var top = canvas.getContext('2d'); 
            top.fillStyle = textFillColor;
            top.font = fontWeight + " " + fontStyle + " " + fontSize + "px " + fontFace;
            top.textAlign = "center";
            top.fillText(topText, canvas.width / 2, 200);

        //start bottom text redraw
        var bottom = canvas.getContext('2d');
            bottom.fillStyle = textFillColor;
            bottom.font = fontWeight + " " + fontStyle + " " + fontSize + "px " + fontFace;
            bottom.textAlign = "center";
            bottom.fillText(bottomText, canvas.width / 2, canvas.height - 50);
    }

});
//
//
