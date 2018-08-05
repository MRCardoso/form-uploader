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