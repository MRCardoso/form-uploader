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
