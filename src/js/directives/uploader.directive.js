angular.module('form.uploader')
    .directive('formUploader',function(){
        return {
            restrict: 'E',
            templateUrl: 'form-uploader.html',
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
                sendUrl: '=?sendUrl'
            },
            controller: ["$scope", "FileUploader", "$http", "$filter", function($scope, FileUploader, $http, $filter)
            {
                if( angular.isUndefined($scope.sendUrl) )
                {
                    return console.warn("Por Favor, Defina uma 'url' para este upload");
                }

                var listFile = [];
                
                /*
                | ------------------------------------------------------------------------------------
                | Default method, that call the http request for remove the uploaded file
                | ------------------------------------------------------------------------------------
                | in the 'data' property of the http response:
                | success: object with the proprerty 'message'
                | error: object with the proprerty 'message'
                */
                var removeFile = function(arrayFiles, callback){
                    $http
                    .post($scope.removeUrl, {Keys: arrayFiles})
                    .then(function(reason){
                        callback(reason);
                    },function(err){
                        $scope.messages.danger = err.data.message;
                    });
                }
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
                };

                // uploader.onProgressItem = function (fileItem, progress) {};// have onProgressAll
                // uploader.onSuccessItem = function (fileItem, response, status, headers) {};
                // uploader.onErrorItem = function (fileItem, response, status, headers) {};
            }]
        }
    });