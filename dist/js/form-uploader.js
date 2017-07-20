/**
 * form-uploader - AngularJS module to easily the criation of container for uploader of files
 * 
 * Copyright 2017 Marlon R Cardoso <marlonrcardoso@yahoo.com.br>
 */
(function(){
    'use strict';
    angular
        .module('form.uploader',[
            'angularFileUpload',
            'ngThumbCanvas'
        ])
        .run(["$rootScope", function($rootScope){
        }]);
}());
angular.module('form.uploader').run(['$templateCache', function($templateCache) {$templateCache.put('form-uploader.html','<div ng-if="uploader">\r\n    \r\n    <div ng-repeat="(type, msg) in messages">\r\n        <div ng-show="msg" class="alert alert-{{type}} alert-dismissible flash" role="alert">\r\n            <button type="button" ng-click="cleanMessage(type)" class="close">\r\n                <span aria-hidden="true">&times;</span>\r\n            </button>\r\n            <strong>\r\n                <i ng-class="{\'fa-warning\': type==\'danger\', \'fa-info\': type==\'info\', \'fa-check\': type==\'success\'}" class="fa"></i>\r\n            </strong>\r\n            {{msg}}\r\n        </div>\r\n    </div>\r\n\r\n    <div class="clear"></div>\r\n\r\n    <div class="text-center">\r\n        <input type="file" nv-file-select multiple uploader="uploader" id="file" ng-hide="true">\r\n        <div ng-show="uploader.isHTML5" class="upFile" data-id="default" role="button">\r\n            <div nv-file-drop="" uploader="uploader" ng-click="openFile()">\r\n                <div nv-file-over="file-over" uploader="uploader" over-class="another-file-over" class="well my-drop-zone">\r\n                    Arrate aqui ou clique para efetuar o upload\r\n                    <i class="fa fa-upload"></i>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <div ng-show="uploader.queue.length>1">\r\n        <div class="file-group-item">\r\n            <div class="col-md-3">\r\n                <button type="button" class="btn btn-success btn-xs" ng-click="uploader.uploadAll()" ng-disabled="!uploader.getNotUploadedItems().length"\r\n                        uib-tooltip="Enviar tudo" uib-tooltip-placement="top" uib-tooltip-trigger="mouseenter">\r\n                    <span class="glyphicon glyphicon-upload"></span>\r\n                </button>\r\n                <button type="button" class="btn btn-warning btn-xs" ng-click="uploader.cancelAll()" ng-disabled="!uploader.isUploading"\r\n                        uib-tooltip="Cancelar tudo" uib-tooltip-placement="top" uib-tooltip-trigger="mouseenter">\r\n                    <span class="glyphicon glyphicon-ban-circle"></span>\r\n                </button>\r\n                <button type="button" class="btn btn-danger btn-xs" ng-click="deleteAll(uploader)" ng-disabled="!uploader.queue.length"\r\n                        uib-tooltip="Remover tudo" uib-tooltip-placement="top" uib-tooltip-trigger="mouseenter">\r\n                    <span class="glyphicon glyphicon-remove"></span>\r\n                </button>\r\n            </div>\r\n            <div class="col-md-2 text-center">\r\n                <span class="badge" ng-bind="uploader.queue.length"></span>\r\n            </div>\r\n            <div class="col-md-7">\r\n                <div ng-show="uploader.isHTML5">\r\n                    <div class="progress" style="margin-bottom: 0;">\r\n                        <div class="progress-bar" role="progressbar" ng-style="{ \'width\': uploader.progress + \'%\' }">{{ uploader.progress + \'%\'}}</div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class="clear"></div>\r\n        </div>\r\n    </div>\r\n\r\n    <div ng-repeat="item in uploader.queue">\r\n        <div class="file-group-item">\r\n            <div class="col-md-3">\r\n                <button type="button" class="btn btn-success btn-xs" uib-tooltip="Enviar" ng-click="item.upload()" ng-disabled="item.isReady || item.isUploading || item.isSuccess">\r\n                    <span class="glyphicon glyphicon-upload"></span>\r\n                </button>\r\n                <button type="button" class="btn btn-warning btn-xs" uib-tooltip="Cancelar" ng-click="item.cancel()" ng-disabled="!item.isUploading">\r\n                    <span class="glyphicon glyphicon-ban-circle"></span>\r\n                </button>\r\n                <button type="button" uib-tooltip="Remover" class="btn btn-danger btn-xs" ng-click="deleteItem(item)">\r\n                    <span class="glyphicon glyphicon-remove"></span>\r\n                </button>\r\n                \r\n                <i ng-show="item.showLoading" class="loader glyphicon glyphicon-repeat"></i>\r\n\r\n                <span uib-tooltip="Progresso bem-sucedido" class="label label-success" ng-show="item.isSuccess">\r\n                    <i class="glyphicon glyphicon-ok"></i>\r\n                </span>\r\n                <span uib-tooltip="Progresso cancelado" class="label label-warning" ng-show="item.isCancel">\r\n                    <i class="glyphicon glyphicon-ban-circle"></i>\r\n                </span>\r\n                <span uib-tooltip="Erro no progresso" class="label label-danger" ng-show="item.isError">\r\n                    <i class="glyphicon glyphicon-alert"></i>\r\n                </span>\r\n            </div>\r\n\r\n            <div class="col-md-2 text-center">\r\n                <div ng-show="isImage(uploader.isHTML5, item.file)" ng-thumb="{ file: item._file, height: 80 }"></div>\r\n                <i class="glyphicon glyphicon-file" ng-hide="isImage(uploader.isHTML5, item.file)"></i>\r\n            </div>\r\n            <div class="col-md-4 text-center">\r\n                <div class="force-text" ng-bind="item.file.name| shortName:17:true" uib-tooltip="{{item.file.name}}"></div>\r\n            </div>\r\n            <div class="col-md-1">\r\n                <span tooltip="Size" tooltip-placement="top" tooltip-trigger="mouseenter" ng-show="uploader.isHTML5" nowrap>\r\n                    {{ item.file.size/1024/1024|number:2 }} MB\r\n                </span>\r\n            </div>\r\n            <div class="col-md-2">\r\n                <div ng-show="uploader.isHTML5">\r\n                    <div class="progress" style="margin-bottom: 0;">\r\n                        <div class="progress-bar" role="progressbar" ng-style="{ \'width\': item.progress + \'%\' }">\r\n                            {{item.progress + \'%\'}}\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class="clear"></div>\r\n        </div>\r\n    </div>\r\n</div>');}]);
angular.module('ngThumbCanvas',[])
    // Angular File Upload module does not include this directive
    // Only for example


    /**
     * The ng-thumb directive
     * @author: nerv
     * @version: 0.1.2, 2014-01-09
     */
    .directive('ngThumb', ['$window', function($window) {
        console.log('bennngn');
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }]);
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
angular.module('form.uploader')
    /*
    | --------------------------------------------------------------------------------------------
    | Reduce the size in output of a string text, 
    | when the third argument is true, i know that the string have extension, 
    | and gona concat the new short string with the .ext value in output
    | --------------------------------------------------------------------------------------------
    */
    .filter('shortName', function(){
        return function(string, size, hasExt){
            size = size || 20;
            hasExt = angular.isDefined(hasExt) ? hasExt : false;
            if( string.length > 20 )
            {
                var newText = string.substr(0, size);
                if( hasExt ){
                    var ext = string.split('.').pop();
                    newText += ['...(.', ext,')'].join('');
                }
                return newText;
            }
            return string;
        }
    });