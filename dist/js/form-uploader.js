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
angular.module('table.grid').run(['$templateCache', function($templateCache) {$templateCache.put('form-uploader.html','<div ng-if="uploader">\r\n    \r\n    <div ng-repeat="(type, msg) in messages">\r\n        <div ng-show="msg" class="alert alert-{{type}} alert-dismissible flash" role="alert">\r\n            <button type="button" ng-click="cleanMessage(type)" class="close">\r\n                <span aria-hidden="true">&times;</span>\r\n            </button>\r\n            <strong>\r\n                <i ng-class="{\'fa-warning\': type==\'danger\', \'fa-info\': type==\'info\', \'fa-check\': type==\'success\'}" class="fa"></i>\r\n            </strong>\r\n            {{msg}}\r\n        </div>\r\n    </div>\r\n\r\n    <div class="clear"></div>\r\n\r\n    <div class="text-center">\r\n        <div class="file-group-item">\r\n            <input type="file" nv-file-select multiple uploader="uploader" id="file" ng-hide="true">\r\n            <div ng-show="uploader.isHTML5" class="upFile" data-id="default" role="button">\r\n                <div nv-file-drop="" uploader="uploader" ng-click="openFile()">\r\n                    <div nv-file-over="file-over" uploader="uploader" over-class="another-file-over" class="well my-drop-zone">\r\n                        Arrate aqui ou clique para efetuar o upload\r\n                        <i class="fa fa-upload"></i>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div ng-show="uploader.queue.length>1">\r\n                <div class="col-md-3">\r\n                    <button type="button" class="btn btn-success btn-xs" ng-click="uploader.uploadAll()" ng-disabled="!uploader.getNotUploadedItems().length"\r\n                            tooltip="Enviar tudo" tooltip-placement="top" tooltip-trigger="mouseenter">\r\n                        <span class="glyphicon glyphicon-upload"></span>\r\n                    </button>\r\n                    <button type="button" class="btn btn-warning btn-xs" ng-click="uploader.cancelAll()" ng-disabled="!uploader.isUploading"\r\n                            tooltip="Cancelar tudo" tooltip-placement="top" tooltip-trigger="mouseenter">\r\n                        <span class="glyphicon glyphicon-ban-circle"></span>\r\n                    </button>\r\n                    <button type="button" class="btn btn-danger btn-xs" ng-click="uploader.clearQueue()" ng-disabled="!uploader.queue.length"\r\n                            tooltip="Remover tudo" tooltip-placement="top" tooltip-trigger="mouseenter">\r\n                        <span class="glyphicon glyphicon-remove"></span>\r\n                    </button>\r\n                </div>\r\n                <div class="col-md-2">\r\n                    <span class="badge" ng-bind="uploader.queue.length"></span>\r\n                </div>\r\n                <div class="col-md-7">\r\n                    <div ng-show="uploader.isHTML5">\r\n                        <div class="progress" style="margin-bottom: 0;">\r\n                            <div class="progress-bar" role="progressbar" ng-style="{ \'width\': uploader.progress + \'%\' }">{{ uploader.progress + \'%\'}}</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class="clear"></div>\r\n            </div>\r\n        </div>\r\n        \r\n    </div>\r\n\r\n    <div ng-repeat="item in uploader.queue">\r\n        <div class="file-group-item">\r\n            <div class="col-md-3">\r\n                <button type="button" class="btn btn-success btn-xs" uib-tooltip="Enviar" ng-click="item.upload()" ng-disabled="item.isReady || item.isUploading || item.isSuccess">\r\n                    <span class="glyphicon glyphicon-upload"></span>\r\n                </button>\r\n                <button type="button" class="btn btn-warning btn-xs" uib-tooltip="Cancelar" ng-click="item.cancel()" ng-disabled="!item.isUploading">\r\n                    <span class="glyphicon glyphicon-ban-circle"></span>\r\n                </button>\r\n                <button type="button" uib-tooltip="Remover" class="btn btn-danger btn-xs" ng-click="deleteObject(item)">\r\n                    <span class="glyphicon glyphicon-remove"></span>\r\n                </button>\r\n                \r\n                <i ng-show="item.showLoading" class="fa fa-spinner"></i>\r\n\r\n                <span uib-tooltip="Progresso bem-sucedido" class="label label-success" ng-show="item.isSuccess">\r\n                    <i class="glyphicon glyphicon-ok"></i>\r\n                </span>\r\n                <span uib-tooltip="Progresso cancelado" class="label label-warning" ng-show="item.isCancel">\r\n                    <i class="glyphicon glyphicon-ban-circle"></i>\r\n                </span>\r\n                <span uib-tooltip="Erro no progresso" class="label label-danger" ng-show="item.isError">\r\n                    <i class="glyphicon glyphicon-alert"></i>\r\n                </span>\r\n            </div>\r\n\r\n            <div class="col-md-2">\r\n                <div ng-show="isImage(uploader.isHTML5, item.file)" ng-thumb="{ file: item._file, height: 100 }"></div>\r\n                <i class="fa fa-file" ng-hide="isImage(uploader.isHTML5, item.file)"></i>\r\n            </div>\r\n            <div class="col-md-2">\r\n                <div class="force-text" ng-bind="item.file.name| shortName:17:true"></div>\r\n            </div>\r\n            <div class="col-md-3">\r\n                <span tooltip="Size" tooltip-placement="top" tooltip-trigger="mouseenter" ng-show="uploader.isHTML5" nowrap>\r\n                    {{ item.file.size/1024/1024|number:2 }} MB\r\n                </span>\r\n            </div>\r\n            <div class="col-md-2">\r\n                <div ng-show="uploader.isHTML5">\r\n                    <div class="progress" style="margin-bottom: 0;">\r\n                        <div class="progress-bar" role="progressbar" ng-style="{ \'width\': item.progress + \'%\' }">\r\n                            {{item.progress + \'%\'}}\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class="clear"></div>\r\n        </div>\r\n    </div>\r\n</div>');}]);
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
                | Validate the type of file uploaded
                | ----------------------------------------------------------------------
                */
                $scope.isImage = function(isHtml5, file){
                    if( /(gif|jpg|jpeg|png|x-png|pjpeg)/.test(file.type) )
                        return isHtml5;
                    return false;
                }

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