'use strict';

angular.module("app.controller",[])
    .controller('FormController', ['$scope', function ($scope)
    {
        $scope.sendUrl = "/api/send";
        $scope.removeUrl = "/api/remove";
        $scope.isMany = true;
        $scope.fileItem = null;
        $scope.save = function() {
            console.log($scope.fileItem);
        }
        $scope.myHtml = "<p>Arrate aqui ou clique para efetuar o upload</p><i class='fa fa-upload'></i>";
    }]);