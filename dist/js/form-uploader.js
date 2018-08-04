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
            'ngThumbCanvas',
            'formCustomChange',
            'formDragDrop',
            'simple.upload'
        ])
        .run(["$rootScope", function($rootScope){
        }]);
}());
angular.module('form.uploader').run(['$templateCache', function($templateCache) {$templateCache.put('form-uploader-simple.html','\n<div ng-repeat="(type, msg) in messages">\n    <div ng-show="msg" class="alert alert-{{type}} alert-dismissible flash" role="alert">\n        <button type="button" ng-click="cleanMessage(type)" class="close">\n            <span aria-hidden="true">&times;</span>\n        </button>\n        <strong>\n            <i ng-class="{\'fa-warning\': type==\'danger\', \'fa-info\': type==\'info\', \'fa-check\': type==\'success\'}" class="fa"></i>\n        </strong>\n        {{msg}}\n    </div>\n</div>\n\n<div class="clear"></div>\n\n<div class="text-center">\n    <input type="file" ng-if="many" multiple id="file" custom-change="onChangeFile" ng-hide="true">\n    <input type="file" ng-if="!many" id="file" custom-change="onChangeFile" ng-hide="true">\n    <div class="upFile" data-id="default" role="button">\n        <div ng-click="openFile()">\n            <div over-class="another-file-over" drag-drop-over="nv-file-over" drag-drop class="well my-drop-zone">\n                Arrate aqui ou clique para efetuar o upload\n                <i class="fa fa-upload"></i>\n            </div>\n        </div>\n    </div>\n</div>\n\n<div class="file-group" ng-show="fileItems.length>0">\n    <div ng-repeat="item in fileItems" class="file-group-item">\n        <div class="badge pull-left">\n            <span tooltip="Size" tooltip-placement="top" tooltip-trigger="mouseenter" nowrap>\n                {{ item.file.size/1024/1024|number:2 }} MB\n            </span>\n        </div>\n        <div class="text-right">\n            <button type="button" uib-tooltip="Remover" class="btn btn-danger btn-xs" ng-click="deleteItem(item)">\n                <span class="glyphicon glyphicon-remove"></span>\n            </button>\n        </div>\n\n        <div class="text-center" uib-tooltip="{{item.file.name}}">\n            <div ng-switch="isImage(true, item.file)">\n                <div ng-switch-when="true" class="image-preview" ng-mouseover="hoverCrop = true" ng-mouseleave="hoverCrop = false">\n                    <i class="fa fa-cut" ng-show="hoverCrop"></i>\n                    <div ng-click="setInstance(item, $event)" data-toggle="modal" data-target="#modal-crop" ng-thumb="{file: item.file, height: 80}"></div>\n                </div>\n                <i ng-switch-when="false" class="glyphicon glyphicon-file"></i>\n\n                <div ng-show="true">\n                    <div class="progress" style="margin-bottom: 0;">\n                        <div class="progress-bar" role="progressbar" ng-style="{ \'width\': item.progress + \'%\' }">\n                            {{item.progress + \'%\'}}\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n\n<!-- Modal -->\n<div class="modal fade" id="modal-crop" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\n    <div class="modal-dialog" role="document">\n        <div class="modal-content">\n            <div class="modal-header">\n                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                    <span aria-hidden="true">&times;</span>\n                </button>\n                <h4 class="modal-title" id="myModalLabel">Cortar imagem</h4>\n            </div>\n            <div class="modal-body">\n                <!-- Nav tabs -->\n                <ul class="nav nav-tabs nav-justified" role="tablist">\n                    <li role="presentation" class="active">\n                        <a role="tab" data-target="#crop" data-toggle="tab">Corte</a>\n                    </li>\n                    <li role="presentation">\n                        <a role="tab" data-target="#preview" data-toggle="tab">Pre-visualiza\xE7\xE3o</a>\n                    </li>\n                </ul>\n                <!-- Tab panes -->\n                <div class="tab-content">\n                    <div role="tabpanel" class="tab-pane active" id="crop">\n                        <div class="cropArea">\n                            <img-crop image="cropImage" result-image="cropImageResult" area-type="square" area-min-size="50" result-image-quality="1.0"\n                                result-image-size="cropSize"></img-crop>\n                        </div>\n                    </div>\n                    <div role="tabpanel" class="tab-pane" id="preview">\n                        <img ng-src="{{cropImageResult}}" width="100%" height="350" />\n                    </div>\n                </div>\n            </div>\n            <div class="modal-footer">\n                <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>\n                <button type="button" class="btn btn-primary" ng-click="saveCrop()">Salvar</button>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('form-uploader.html','<div ng-if="uploader" class="form-uploader-container">\n    <div ng-repeat="(type, msg) in messages">\n        <div ng-show="msg" class="alert alert-{{type}} alert-dismissible flash" role="alert">\n            <button type="button" ng-click="cleanMessage(type)" class="close">\n                <span aria-hidden="true">&times;</span>\n            </button>\n            <strong>\n                <i ng-class="{\'fa-warning\': type==\'danger\', \'fa-info\': type==\'info\', \'fa-check\': type==\'success\'}" class="fa"></i>\n            </strong>\n            {{msg}}\n        </div>\n    </div>\n\n    <div class="clear"></div>\n\n    <div class="text-center">\n        <input type="file" nv-file-select multiple uploader="uploader" id="file" ng-hide="true">\n        <div ng-show="uploader.isHTML5" class="upFile" data-id="default" role="button">\n            <div nv-file-drop="" uploader="uploader" ng-click="openFile()">\n                <div nv-file-over="file-over" uploader="uploader" over-class="another-file-over" class="well my-drop-zone">\n                    Arrate aqui ou clique para efetuar o upload\n                    <i class="fa fa-upload"></i>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div ng-show="uploader.queue.length>1">\n        <div class="file-group">\n            <div class="col-md-4">\n                <button type="button" class="btn btn-success btn-xs" ng-click="uploader.uploadAll()" ng-disabled="!uploader.getNotUploadedItems().length"\n                        uib-tooltip="Enviar tudo" uib-tooltip-placement="top" uib-tooltip-trigger="mouseenter">\n                    <span class="glyphicon glyphicon-upload"></span>\n                </button>\n                <button type="button" class="btn btn-warning btn-xs" ng-click="uploader.cancelAll()" ng-disabled="!uploader.isUploading"\n                        uib-tooltip="Cancelar tudo" uib-tooltip-placement="top" uib-tooltip-trigger="mouseenter">\n                    <span class="glyphicon glyphicon-ban-circle"></span>\n                </button>\n                <button type="button" class="btn btn-danger btn-xs" ng-click="deleteAll(uploader)" ng-disabled="!uploader.queue.length"\n                        uib-tooltip="Remover tudo" uib-tooltip-placement="top" uib-tooltip-trigger="mouseenter">\n                    <span class="glyphicon glyphicon-remove"></span>\n                </button>\n\n                <div class="badge pull-right">\n                    Total de arquivos: {{uploader.queue.length}}\n                </div>\n            </div>\n            <div class="col-md-8">\n                <div ng-show="uploader.isHTML5">\n                    <div class="progress" style="margin-bottom: 0;">\n                        <div class="progress-bar" role="progressbar" ng-style="{ \'width\': uploader.progress + \'%\' }">{{ uploader.progress + \'%\'}}</div>\n                    </div>\n                </div>\n            </div>\n\n            <div class="clear"></div>\n        </div>\n    </div>\n\n    <div class="file-group" ng-show="uploader.queue.length>0">\n        <div ng-repeat="item in uploader.queue" class="file-group-item">\n            <div class="badge pull-left">\n                <span tooltip="Size" tooltip-placement="top" tooltip-trigger="mouseenter" ng-show="uploader.isHTML5" nowrap>\n                    {{ item.file.size/1024/1024|number:2 }} MB\n                </span>\n            </div>\n            <div class="text-right">\n                <button type="button" class="btn btn-success btn-xs" uib-tooltip="Enviar" ng-click="item.upload()" ng-disabled="item.isReady || item.isUploading || item.isSuccess">\n                    <span class="glyphicon glyphicon-upload"></span>\n                </button>\n                <button type="button" class="btn btn-warning btn-xs" uib-tooltip="Cancelar" ng-click="item.cancel()" ng-disabled="!item.isUploading">\n                    <span class="glyphicon glyphicon-ban-circle"></span>\n                </button>\n                <button type="button" uib-tooltip="Remover" class="btn btn-danger btn-xs" ng-click="deleteItem(item)">\n                    <span class="glyphicon glyphicon-remove"></span>\n                </button>\n                \n                <i ng-show="item.showLoading" class="loader glyphicon glyphicon-repeat"></i>\n\n                <span uib-tooltip="Progresso bem-sucedido" class="label label-success" ng-show="item.isSuccess">\n                    <i class="glyphicon glyphicon-ok"></i>\n                </span>\n                <span uib-tooltip="Progresso cancelado" class="label label-warning" ng-show="item.isCancel">\n                    <i class="glyphicon glyphicon-ban-circle"></i>\n                </span>\n                <span uib-tooltip="Erro no progresso" class="label label-danger" ng-show="item.isError">\n                    <i class="glyphicon glyphicon-alert"></i>\n                </span>\n            </div>\n\n            <div class="text-center" uib-tooltip="{{item.file.name}}">\n                <div ng-switch="isImage(uploader.isHTML5, item.file)">\n                    <div ng-switch-when="true" class="image-preview" ng-mouseover="hoverCrop = true" ng-mouseleave="hoverCrop = false">\n                        <i class="fa fa-cut" ng-show="hoverCrop"></i>\n                        <div ng-click="setInstance(item,$event)" data-toggle="modal" data-target="#modal-crop" ng-thumb="{file: item._file, height: 80}"></div>\n                    </div>\n                    <i ng-switch-when="false" class="glyphicon glyphicon-file"></i>\n                    \n                    <div ng-show="uploader.isHTML5">\n                        <div class="progress" style="margin-bottom: 0;">\n                            <div class="progress-bar" role="progressbar" ng-style="{ \'width\': item.progress + \'%\' }">\n                                {{item.progress + \'%\'}}\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n\n<!-- Modal -->\n<div class="modal fade" id="modal-crop" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\n    <div class="modal-dialog" role="document">\n        <div class="modal-content">\n            <div class="modal-header">\n                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                    <span aria-hidden="true">&times;</span>\n                </button>\n                <h4 class="modal-title" id="myModalLabel">Cortar imagem</h4>\n            </div>\n            <div class="modal-body">\n                <!-- Nav tabs -->\n                <ul class="nav nav-tabs nav-justified" role="tablist">\n                    <li role="presentation" class="active">\n                        <a role="tab" data-target="#crop" data-toggle="tab">Corte</a>\n                    </li>\n                    <li role="presentation">\n                        <a role="tab" data-target="#preview" data-toggle="tab">Pre-visualiza\xE7\xE3o</a>\n                    </li>\n                </ul>\n                <!-- Tab panes -->\n                <div class="tab-content">\n                    <div role="tabpanel" class="tab-pane active" id="crop">\n                        <div class="cropArea">\n                            <img-crop image="cropImage" result-image="cropImageResult" area-type="square" area-min-size="50" result-image-quality="1.0"\n                                result-image-size="cropSize"></img-crop>\n                        </div>\n                    </div>\n                    <div role="tabpanel" class="tab-pane" id="preview">\n                        <img ng-src="{{cropImageResult}}" width="100%" height="350" />\n                    </div>\n                </div>\n            </div>\n            <div class="modal-footer">\n                <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>\n                <button type="button" class="btn btn-primary" ng-click="saveCrop()">Salvar</button>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('uploader-simple.html','<div class="file-group">\n    <div class="file-group-item" ng-if="fileItem==null">\n        <input type="file" ng-if="!many" id="file" custom-change="onChangeFile" ng-hide="true">\n        <div ng-click="openFile()" class="upFile text-center" drag-drop-over="nv-file-over" drag-drop>\n            <div ng-bind-html="renderData()"></div>\n            <p ng-if="message" ng-bind="message" class="text-warning"></p>\n        </div>\n    </div>\n    <div class="file-group-item" ng-if="fileItem!=null">\n        <div class="badge pull-left">\n            <span tooltip="Size" tooltip-placement="top" tooltip-trigger="mouseenter" nowrap>\n                {{ fileItem.file.size/1024/1024|number:2 }} MB\n            </span>\n        </div>\n        <div class="text-right">\n            <button type="button" uib-tooltip="Remover" class="btn btn-danger btn-xs" ng-click="deleteItem(item)">\n                <span class="glyphicon glyphicon-remove"></span>\n            </button>\n        </div>\n\n        <div class="text-center" uib-tooltip="{{fileItem.file.name}}">\n            <div ng-switch="isImage(true, fileItem.file)">\n                <div ng-switch-when="true" class="image-preview" ng-mouseover="hoverCrop = true" ng-mouseleave="hoverCrop = false">\n                    <i class="fa fa-cut" ng-show="hoverCrop"></i>\n                    <div ng-click="setInstance(item, $event)" data-toggle="modal" data-target="#modal-crop" ng-thumb="{file: fileItem.file, height: 80}"></div>\n                </div>\n                <i ng-switch-when="false" class="glyphicon glyphicon-file"></i>\n            </div>\n        </div>\n    </div>\n</div>\n\n<!-- Modal -->\n<div class="modal fade" id="modal-crop" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\n    <div class="modal-dialog" role="document">\n        <div class="modal-content">\n            <div class="modal-header">\n                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n                    <span aria-hidden="true">&times;</span>\n                </button>\n                <h4 class="modal-title" id="myModalLabel">Cortar imagem</h4>\n            </div>\n            <div class="modal-body">\n                <!-- Nav tabs -->\n                <ul class="nav nav-tabs nav-justified" role="tablist">\n                    <li role="presentation" class="active">\n                        <a role="tab" data-target="#crop" data-toggle="tab">Corte</a>\n                    </li>\n                    <li role="presentation">\n                        <a role="tab" data-target="#preview" data-toggle="tab">Pre-visualiza\xE7\xE3o</a>\n                    </li>\n                </ul>\n                <!-- Tab panes -->\n                <div class="tab-content">\n                    <div role="tabpanel" class="tab-pane active" id="crop">\n                        <div class="cropArea">\n                            <img-crop image="cropImage" result-image="cropImageResult" area-type="square" area-min-size="50" result-image-quality="1.0"\n                                result-image-size="cropSize"></img-crop>\n                        </div>\n                    </div>\n                    <div role="tabpanel" class="tab-pane" id="preview">\n                        <img ng-src="{{cropImageResult}}" width="100%" height="350" />\n                    </div>\n                </div>\n            </div>\n            <div class="modal-footer">\n                <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>\n                <button type="button" class="btn btn-primary" ng-click="saveCrop()">Salvar</button>\n            </div>\n        </div>\n    </div>\n</div>');}]);
angular.module('ngThumbCanvas',[])
    // Angular File Upload module does not include this directive
    // Only for example


    /**
     * The ng-thumb directive
     * @author: nerv
     * @version: 0.1.2, 2014-01-09
     */
    .directive('ngThumb', ['$window', function($window) {
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
angular.module('formCustomChange',[])
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
]);
angular.module('formDragDrop',[])
.directive('dragDrop', function () {
    return {
        link: function (scope, element, attrs) {
            element.on('dragover', function (event) {
                event.preventDefault();
                element.addClass(attrs.dragDropOver);
            });
            element.on('dragleave', function (event) {
                event.preventDefault();
                element.removeClass(attrs.dragDropOver);
            });
            element.on('drop', function (event) {
                event.preventDefault();
                element.removeClass(attrs.dragDropOver);
                scope.onChangeFile({
                    target: {
                        files: event.originalEvent.dataTransfer.files
                    }
                });
            });
        }

    };
})

angular.module('simple.upload', [])
    .directive('simpleUpload',function(){
        return {
            restrict: 'E',
            templateUrl: 'uploader-simple.html',
            scope: {
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
                fileItem: '=?fileItem',
                uploadTemplate: '=?uploadTemplate'
            },
            controller: ["$scope", "$sce", function($scope, $sce)
            {
                var IImage = null;

                $scope.message = null;
                $scope.validators = angular.isUndefined($scope.validators) ? [] : $scope.validators;
                $scope.defaultLimit = angular.isUndefined($scope.defaultLimit) ? (3 * 1024 * 1024) : $scope.defaultLimit;
                $scope.renderData = function() {
                    return $sce.trustAsHtml($scope.uploadTemplate)
                }
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
                    $scope.fileItem = null;
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
                    reader.readAsDataURL(instance.file);
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
                    
                    IImage.file = file;
                    angular.element(document.getElementById('modal-crop')).modal('hide');
                    delete image;
                };

                $scope.fileItem = angular.isUndefined($scope.fileItem) ? null : $scope.fileItem;
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
                                $scope.message = "Extensão inválida, o arquivo deve ser '"+$scope.allowType.replace(/(\|)/ig,", ")+"'";
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
                            $scope.message = "O arquivo excedeu o tamanho máximo permitido "+$filter('number')($scope.defaultLimit,2)+"MB";

                        return !validation;
                    }
                });

                $scope.onChangeFile = function (event) {
                    var data = event.target.files[0];
                    var errors = filters.map(function (r) {
                        return r.fn(data, {});
                    }).filter(function (r) {
                        return r == false;
                    });

                    console.log(errors);
                    if (errors.length == 0) {
                        $scope.fileItem = { file: data };
                    }
                    $scope.$digest();
                };
            }]
        }
    });
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
                if (angular.isUndefined($scope.sendUrl)) {
                    return console.warn("Por Favor, Defina uma 'url' para este upload");
                }
                var listFile = [];
                var IImage = null;

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
                    if( !$scope.uploadOnSubmit && 'uploadedPath' in item && $scope.removeUrl != null )
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

                /*
                | ------------------------------------------------------------------------------------
                | upload images by ajax with FileUploader
                | ------------------------------------------------------------------------------------
                */
                var uploader = $scope.uploader = new FileUploader({
                    url: $scope.sendUrl,
                    queueLimit: $scope.defaultLimit
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