angular.module('form.uploader')
    .factory('ImageService',["$filter", function($filter){
        var IImage = null;
        var filters = [];
        var errors = {};

        /**
        | ------------------------------------------------------------------------------------
        | Store the currente file selected to be crop and update
        | ------------------------------------------------------------------------------------
        * @param {scope} scope the scope of the controller called
        * @param {object} instance the current file item instance
        * @param {object} event the current element
        */
        var setCrop = function(scope, instance, event) {
            scope.cropImage = '';
            scope.cropImageResult = '';
            scope.cropSize = 600;
            IImage = instance;
            IImage.element = event;

            var reader = new FileReader();
            reader.onload = function (evt) {
                scope.$apply(function () {
                    scope.cropImage = evt.target.result;
                    var image = new Image();
                    image.onload = function () {
                        scope.cropSize = this.width;
                    };
                    image.src = scope.cropImage;
                    delete image;
                });
            };
            reader.readAsDataURL(instance._file);
        };

        /**
        | ------------------------------------------------------------------------------------
        | crop and update the image to be upload
        | ------------------------------------------------------------------------------------
        * @param {scope} scope the scope of the controller called
        */
        var saveCrop = function(scope) {
            var arr = scope.cropImageResult.split(','),
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            var target = IImage.element.target;
            var file = new File([u8arr], IImage.file.name, { type: IImage.file.type });
            var image = new Image();

            image.onload = function () {
                target.getContext('2d').drawImage(this, 0, 0, target.width, target.height);
            };
            image.src = scope.cropImageResult;

            IImage._file = file;
            angular.element(document.getElementById('modal-crop')).modal('hide');
            delete image;
        };

        /**
        | ------------------------------------------------------------------------------------
        | Set filter by type of file, when the 'allowType' is declared
        | Set filter for max size of the file uploaded
        | ------------------------------------------------------------------------------------
        * @param {string} type the extension allowed
        * @param {string} size the limit of the file allowed
        */
        var setDefaultValidators = function(type, size) {
            if (angular.isDefined(type)){
                setValidator('typeAllow', type, "rx", "A extensão deve ser '" + type.replace(/(\|)/ig, ", ") + "'");
            }
            setValidator('sizeAllow', size, "lt", "O tamanho deve ter até " + limitToMB(size) + "MB");
        };

        /**
        | ------------------------------------------------------------------------------------
        | Add a validation to this uploda
        | ------------------------------------------------------------------------------------
        * @param {string} name the name of the validator
        * @param {string|int} value the value to be validator
        * @param {string|function} type the kind of the validator
        * @param {string} message the message of error
        */
        var setValidator = function(name, values, type, message) {
            filters.push({
                name: name,
                fn: function (item /*{File|FileLikeObject}*/, options) {
                    var validation = true;
                    switch (type) {
                        case 'rx':
                            var regex = new RegExp(values, "i");
                            validation = regex.test(item.name);
                            break;
                        case 'lt':
                            validation = item.size < values;
                            break;
                        default:
                            if (typeof type == 'function')
                                validation = type(item, value);
                            break;
                    }
                    if (!(validation))
                        errors[name] = message;
                    return validation;
                }
            });
        };

        /**
        | ------------------------------------------------------------------------------------
        | Get the list of the validations to this upload
        | ------------------------------------------------------------------------------------
        * @param {array} customs the list of the custom validators
        */
        var getValidators = function(customs) {
            if(customs.length>0){
                customs.map(function(r) {
                    setValidator(r.name, r.values, r.type, r.message);
                });
            }
            return filters;
        };

        /*
        | ------------------------------------------------------------------------------------
        | Validate the type of file uploaded
        | ------------------------------------------------------------------------------------
        */
        var isImage = function(isHtml5, type) {
            if (/(gif|jpg|jpeg|png|x-png|pjpeg)/.test(type))
                return isHtml5;
            return false;
        };

        var limitToMB = function(value) {
            return $filter('number')(value / 1024 / 1024, 0);
        };

        return {
            setCrop: setCrop,
            saveCrop: saveCrop,
            getValidators: getValidators,
            setValidator: setValidator,
            setDefaultValidators: setDefaultValidators,
            isImage: isImage,
            limitToMB: limitToMB,
            getError: function(name) {
                return errors[name] || null;
            },
            getElementKey: function() {
                return "file-item-"+Math.floor((Math.random() * Date.now()) + 1);
            } 
        }
    }]);