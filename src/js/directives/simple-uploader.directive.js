angular.module('form.uploader')
    .directive('simpleUploader',function(){
        return {
            restrict: 'E',
            templateUrl: 'uploader-simple.html',
            transclude: true,
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
                /*
                | ------------------------------------------------------------------------------------
                | ng-model, the instance of the client to storage the uploaded file
                | ------------------------------------------------------------------------------------
                */
                fileItem: '=?fileItem',
            },
            controller: ["$scope", "ImageService", function ($scope, ImageService)
            {
                $scope.message = null;
                $scope.validators = angular.isUndefined($scope.validators) ? [] : $scope.validators;
                $scope.defaultLimit = angular.isUndefined($scope.defaultLimit) ? (3 * 1024 * 1024) : $scope.defaultLimit;
                $scope.fileItem = angular.isUndefined($scope.fileItem) ? null : $scope.fileItem;
                
                ImageService.setDefaultValidators($scope.allowType, $scope.defaultLimit);
                
                var filters = ImageService.getValidators($scope.validators);
                var el = $scope.elKey = ImageService.getElementKey();
                /*
                | ------------------------------------------------------------------------------------
                | Call the event click in input#file
                | ------------------------------------------------------------------------------------
                */
                $scope.openFile = function ()
                {
                    var $el = angular.element;
                    $el(document).off('click.'+el).on('click.'+el, '.'+el, function ()
                    {
                        $el("#file-"+el).off('click').trigger('click');
                    });
                };

                /*
                | ------------------------------------------------------------------------------------
                | Delete one currently file uploaded
                | ------------------------------------------------------------------------------------
                */
                $scope.deleteItem = function(item)
                {
                    $scope.fileItem = null;
                };

                /*
                | ------------------------------------------------------------------------------------
                | Trigger change file event, and refrash the ng-model[fileItem]
                | ------------------------------------------------------------------------------------
                */
                $scope.onChangeFile = function (event) {
                    var data = event.target.files[0];
                    var errors = filters.map(function (r) {
                        return (r.fn(data) ? null : ImageService.getError(r.name));
                    }).filter(function (r) {
                        return r != null;
                    });

                    if (errors.length == 0) {
                        $scope.fileItem = { file: data, _file: data };
                    } else {
                        $scope.message = errors.join('<br>');
                    }
                    $scope.$root.$broadcast('form.uploader.added', $scope.fileItem);
                    $scope.$digest();
                };

                $scope.limitToMB = function (value) {
                    return ImageService.limitToMB(value);
                };

                $scope.isImage = function (isHtml5, file) {
                    return ImageService.isImage(isHtml5, file.type);
                };

                $scope.setInstance = function (instance, event) {
                    ImageService.setCrop($scope, instance, event);
                };

                $scope.saveCrop = function () {
                    ImageService.saveCrop($scope);
                };
            }]
        }
    });