angular.module('form.uploader')
    .directive('customChange', [
        function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs, controller) {
                    var onChangeHandler = scope.$eval(attrs.customChange);
                    element.bind('change', onChangeHandler);
                }
            };
        }
    ])
    .directive('formUploader',function(){
        return {
            restrict: 'E',
            // templateUrl: 'form-uploader.html',
            templateUrl: function(element, attrs) {
                var view = angular.isUndefined(attrs.uploadOnSubmit) ? false : attrs.uploadOnSubmit;
                return (view ? 'form-uploader-simple.html' : 'form-uploader.html');
            },
            scope: {
                /*
                | ------------------------------------------------------------------------------------
                | Bool, (default: false) Define if the upload is to many or only one file
                | ------------------------------------------------------------------------------------
                */
                many: '=?many',
                /*
                | ------------------------------------------------------------------------------------
                | String, (default: undefined) a list os extensions allowed to upload, when not informed, all extension are allowed
                | the pattern is 'jpg|gif|png' ...
                | ------------------------------------------------------------------------------------
                */
                allowType: '@allowType',
                /*
                | ------------------------------------------------------------------------------------
                | Array, (default: []) A list of array with filters for the upload, an array of objects with properties:
                | name: the name of the filter
                | fn: the function with the rule of the filter, has two arguments(item, options)
                | ------------------------------------------------------------------------------------
                */
                validators: '=?validators',
                /*
                | ------------------------------------------------------------------------------------
                | Int, (default 3MB) The max size of the file uploaded
                | ------------------------------------------------------------------------------------
                */
                defaultLimit: '=?defaultLimit',
                /*
                | ------------------------------------------------------------------------------------
                | String,(default null) The url request to remove the uploaded file(s)
                | ------------------------------------------------------------------------------------
                */
                removeUrl: '=?removeUrl',
                /*
                | ------------------------------------------------------------------------------------
                | String, required The url request of send and upload of the file
                | ------------------------------------------------------------------------------------
                */
                sendUrl: '=?sendUrl',
                uploadOnSubmit: '=?uploadOnSubmit'
            },
            controller: ["$scope", "FileUploader", "$http", "$filter", function($scope, FileUploader, $http, $filter)
            {
                if( angular.isUndefined($scope.sendUrl) )
                {
                    return console.warn("Por Favor, Defina uma 'url' para este upload");
                }

                var listFile = [];
                $scope.fileItems = [];

                $scope.onChangeFile = function(event) {
                    var files = [];
                    for (var i = 0; i < event.target.files.length; i++) {
                        var current = event.target.files[i];
                        files.push({
                            name: current.name,
                            size: current.size,
                            type: current.type,
                            file: current
                        });
                    }
                    $scope.fileItems = files;
                    $scope.$digest();
                    console.log(files);
                }
                var IImage = null;
                /*
                | ------------------------------------------------------------------------------------
                | Default labels with the messages, for success, info or error in upload
                | ------------------------------------------------------------------------------------
                */
                $scope.messages = {danger: null, success: null, info: null};
                
                $scope.many = angular.isUndefined($scope.many) ? false : $scope.many;
                $scope.validators = angular.isUndefined($scope.validators) ? [] : $scope.validators;
                $scope.removeUrl = angular.isUndefined($scope.removeUrl) ? null : $scope.removeUrl;
                $scope.defaultLimit = angular.isUndefined($scope.defaultLimit) ? (3 * 1024 * 1024) : $scope.defaultLimit;
                $scope.uploadOnSubmit = angular.isUndefined($scope.uploadOnSubmit) ? false : $scope.uploadOnSubmit;
                
                $scope.cleanMessage = function(item)
                {
                    $scope.messages[item] = null;
                };

                /*
                | ------------------------------------------------------------------------------------
                | Call the event click in input#file
                | ------------------------------------------------------------------------------------
                */
                $scope.openFile = function ()
                {
                    var $el = angular.element;
                    $el(document).off('click.upFile').on('click.upFile', '.upFile', function ()
                    {
                        $el("#file").off('click').trigger('click');
                    });
                };
                
                /*
                | ------------------------------------------------------------------------------------
                | Validate the type of file uploaded
                | ------------------------------------------------------------------------------------
                */
                $scope.isImage = function(isHtml5, file){
                    if( /(gif|jpg|jpeg|png|x-png|pjpeg)/.test(file.type) )
                        return isHtml5;
                    return false;
                }

                /*
                | ------------------------------------------------------------------------------------
                | Delete one currently file uploaded
                | ------------------------------------------------------------------------------------
                */
                $scope.deleteItem = function(item)
                {
                    if( 'uploadedPath' in item && $scope.removeUrl != null )
                    {
                        item.showLoading = true;                        
                        removeFile([item.uploadedPath], function(reason){
                            item.showLoading = false;
                            $scope.messages.success = reason.data.message;
                            item.remove();
                        });
                    }
                    else
                    {
                        item.remove();
                    }
                };

                /*
                | ------------------------------------------------------------------------------------
                | Delete all files currently uploaded
                | ------------------------------------------------------------------------------------
                */
                $scope.deleteAll = function(uploader)
                {
                    if( listFile.length > 0 && $scope.removeUrl != null )
                    {
                        removeFile(listFile, function(reason){
                            listFile = [];
                            $scope.messages.success = reason.data.message;
                            uploader.clearQueue();
                        });
                    }
                    else
                    {
                        uploader.clearQueue();
                    }
                };

                /**
                | ------------------------------------------------------------------------------------
                | Store the currente file selected to be crop and update
                | ------------------------------------------------------------------------------------
                * @param {object} instance the current file item instance
                */
                $scope.setInstance = function (instance, event) {
                    $scope.cropImage = '';
                    $scope.cropImageResult = '';
                    $scope.cropSize = 600;
                    IImage = instance;
                    IImage.element = event;

                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        $scope.$apply(function () {
                            $scope.cropImage = evt.target.result;
                            var image = new Image();
                            image.onload = function () {
                                $scope.cropSize = this.width;
                            };
                            image.src = $scope.cropImage;
                            delete image;
                        });
                    };
                    reader.readAsDataURL(instance._file);
                };

                /**
                | ------------------------------------------------------------------------------------
                | crop and update the image to be upload
                | ------------------------------------------------------------------------------------
                */
                $scope.saveCrop = function () {
                    var arr = $scope.cropImageResult.split(','),
                        bstr = atob(arr[1]),
                        n = bstr.length,
                        u8arr = new Uint8Array(n);

                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    
                    var target = IImage.element.target;
                    var file = new File([u8arr], IImage.file.name, { type: IImage.file.type });
                    var image = new Image();

                    image.onload = function() {
                        target.getContext('2d').drawImage(this, 0, 0, target.width, target.height);
                    };
                    image.src = $scope.cropImageResult;
                    
                    IImage._file = file;
                    angular.element(document.getElementById('modal-crop')).modal('hide');
                    delete image;
                };
                
                /*
                | ------------------------------------------------------------------------------------
                | Default method, that call the http request for remove the uploaded file
                | ------------------------------------------------------------------------------------
                | in the 'data' property of the http response:
                | success: object with the proprerty 'message'
                | error: object with the proprerty 'message'
                */
                var removeFile = function (arrayFiles, callback) {
                    $http
                        .post($scope.removeUrl, { Keys: arrayFiles })
                        .then(function (reason) {
                            callback(reason);
                        }, function (err) {
                            $scope.messages.danger = err.data.message;
                        });
                }
                /*
                | ------------------------------------------------------------------------------------
                | upload images by ajax with FileUploader
                | ------------------------------------------------------------------------------------
                */
                var uploader = $scope.uploader = new FileUploader({
                    url: $scope.sendUrl,
                    queueLimit: $scope.defaultLimit
                });

                var filters = $scope.validators;

                /*
                | ------------------------------------------------------------------------------------
                | Set filter by type of file, when the 'allowType' is declared
                | ------------------------------------------------------------------------------------
                */
                if( !(angular.isUndefined($scope.allowType)) )
                {
                    filters.push({
                        name: 'typeAllow',
                        fn: function(item /*{File|FileLikeObject}*/, options) {
                            var regex = new RegExp($scope.allowType, "i");
                            var validation = regex.test(item.name);
                            if( !(validation) )
                                $scope.messages.info = "Extensão inválida, o arquivo deve ser '"+$scope.allowType.replace(/(\|)/ig,", ")+"'";
                            return validation;
                        }
                    });
                }

                /*
                | ------------------------------------------------------------------------------------
                | Set filter for max size of the file uploaded
                | ------------------------------------------------------------------------------------
                */
                filters.push({
                    name: 'sizeAllow',
                    fn: function(item /*{File|FileLikeObject}*/, options) {
                        var validation = item.size > $scope.defaultLimit;
                        if( validation )
                            $scope.messages.info = "O arquivo excedeu o tamanho máximo permitido "+$filter('number')($scope.defaultLimit,2)+"MB";

                        return !validation;
                    }
                });

                uploader.filters = filters;

                /*
                | ------------------------------------------------------------------------------------
                | Event running after the file will be added (have onAfterAddingAll)
                | ------------------------------------------------------------------------------------
                */
                uploader.onAfterAddingFile = function (fileItem){
                    // enabled option to execute only one upload
                    // to enabled the upload of the many files enough remove clause
                    if( !$scope.many)
                    {
                        if (fileItem.uploader.queue.length > 1)
                        {
                            fileItem.uploader.queue = [fileItem.uploader.queue[fileItem.uploader.queue.length-1]];
                        }
                    }
                };
                uploader.onBeforeUploadItem = function (item) {
                    item.showLoading = true;
                    $scope.$root.$broadcast('form.uploader.begin');
                };
                uploader.onCancelItem = function (fileItem, response, status, headers)
                {
                    $scope.messages.info = "Envio abortado com sucess!";                   
                };
                /*
                | ------------------------------------------------------------------------------------
                | The conclusion of the upload, in the success or fail(have the onCompleteAll)
                | ------------------------------------------------------------------------------------
                | success: object with the pattern:
                |   message: The message with success
                |   path: The path when the file was stored, used for delete the currently file uploaded
                |   file: The uploaded file object
                |   data: can be the own uploaded file, or the response of a external sevice, like s3 bucket object 
                | error: object with the proprerty 'message'
                */
                uploader.onCompleteItem = function (fileItem, response, status, headers)
                {
                    fileItem.showLoading = false;
                    if( status != 0 && response != '')
                    {
                        if( status == 200 )
                        {
                            fileItem.uploadedPath = response.path;
                            listFile.push(response.path);
                            $scope.messages.success = response.message;
                        }
                        else
                        {
                            $scope.messages.danger = response.message;
                        }
                    }
                    $scope.$root.$broadcast('form.uploader.finish', response);
                };

                // uploader.onProgressItem = function (fileItem, progress) {};// have onProgressAll
                // uploader.onSuccessItem = function (fileItem, response, status, headers) {};
                // uploader.onErrorItem = function (fileItem, response, status, headers) {};
            }]
        }
    });