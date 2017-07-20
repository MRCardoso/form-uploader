'use strict';

angular.module("app.controller",[])
    .controller('FormController', ['$scope', function ($scope)
    {
        $scope.sendUrl = "/api/send";
        $scope.removeUrl = "/api/remove";
        $scope.isMany = true;
    }]);