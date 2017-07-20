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