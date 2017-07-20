angular.module('form.uploader')
    .directive('formUploader',function(){
        return {
            restrict: 'E',
            templateUrl: 'form-uploader.html',
            scope: {
                many: '=?many',
                allowType: '@allowType',
                validators: '=?validators',
                defaultLimit: '=?defaultLimit',
                removeUrl: '=?removeUrl',
                sendUrl: '=?sendUrl'
            },
            controller: ["$scope", "FileUploader", "$http", function($scope, FileUploader, $http){
                var $el = angular.element;
                var listFile = [];
                var deleteItem = function(item, arrayFiles, callback){
                    $scope.showLoading = true;
                    $http
                    .post($scope.removeUrl, {Keys: arrayFiles})
                    .then(function(reason){
                        $scope.showLoading = false;
                        callback(reason);
                    });
                }

                $scope.messages = {danger: null, success: null, info: null};
                
                $scope.many = angular.isUndefined($scope.many) ? false : $scope.many;
                $scope.validators = angular.isUndefined($scope.validators) ? [] : $scope.validators;
                $scope.removeUrl = angular.isUndefined($scope.removeUrl) ? null : $scope.removeUrl;
                $scope.defaultLimit = angular.isUndefined($scope.defaultLimit) ? (3 * 1024 * 1024) : $scope.defaultLimit;
                
                if( angular.isUndefined($scope.sendUrl) )
                {
                    return console.warn("Por Favor, Defina uma 'url' para este upload");
                }

                $scope.cleanMessage = function(item)
                {
                    $scope.messages[item] = null;
                };

                /*
                | ----------------------------------------------------------------------
                | Call the event click in input#file
                | ----------------------------------------------------------------------
                */
                $scope.openFile = function ()
                {
                    $el(document).off('click.upFile').on('click.upFile', '.upFile', function ()
                    {
                        $el("#file").off('click').trigger('click');
                    });
                };
                
                /*
                | ----------------------------------------------------------------------
                | Delete the image object from s3
                | ----------------------------------------------------------------------
                */
                $scope.deleteObject = function(item)
                {
                    if(listFile.length > 0 && $scope.removeUrl != null)
                    {
                        deleteItem(item, listFile, function(reason){
                            currentFile = [];
                            $scope.messages.success = reason.data.output;
                            item.remove();
                        });
                    }
                    else
                    {
                        item.remove();
                    }
                };
                /*
                 | ------------------------------------------------------------------------------------------------------
                 | upload images by ajax with FileUploader
                 | ------------------------------------------------------------------------------------------------------
                 */
                var uploader = $scope.uploader = new FileUploader({
                    url: $scope.sendUrl,
                    queueLimit: $scope.defaultLimit
                });

                var filters = $scope.validators;

                if( !(angular.isUndefined($scope.allowType)) )
                {
                    filters.push({
                        name: 'typeAllow',
                        fn: function(item /*{File|FileLikeObject}*/, options) {
                            var regex = new RegExp($scope.allowType, "i");
                            var validation = regex.test(item.name);
                            if( !(validation) )
                                $scope.messages.info = "Extensão inválida, o arquivo deve ser '"+$scope.allowType.replace("|",",")+"'";
                            return validation;
                        }
                    });
                }

                uploader.filters = filters;

                uploader.onProgressItem = function (fileItem, progress) {};// have onProgressAll
                uploader.onSuccessItem = function (fileItem, response, status, headers) {};
                uploader.onErrorItem = function (fileItem, response, status, headers) {};
                uploader.onBeforeUploadItem = function (item) {
                    item.showLoading = true;
                };
                uploader.onAfterAddingFile = function (fileItem){
                    // have onAfterAddingAll
                    // enabled option to execute only one upload
                    // to enabled the upload of the many files enough remove clause if
                    if( !$scope.many)
                    {
                        if (fileItem.uploader.queue.length > 1)
                        {
                            fileItem.uploader.queue.shift();
                        }
                    }
                };
                uploader.onCancelItem = function (fileItem, response, status, headers)
                {
                    deleteItem(fileItem, listFile, function(){
                        $scope.messages.info = "Envio abortado com sucess!";
                    });                    
                };
                //have the onCompleteAll
                uploader.onCompleteItem = function (fileItem, response, status, headers)
                {
                    fileItem.showLoading = false;
                    if( status != 0 && response != '')
                    {
                        if( status == 200 )
                        {
                            listFile.push(response.data.Key);
                            $scope.messages.success = response.message;
                        }
                        else
                        {
                            $scope.messages.danger = response.message;
                        }
                    }
                };
            }]
        }
    });