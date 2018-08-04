angular.module('simple.upload', [])
    .directive('simpleUpload',function(){
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