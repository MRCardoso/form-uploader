'use strict';
angular.module("fu", [
        'ngRoute',
        'ngResource',
        'form.uploader',
        'ngImgCrop',
        'app.controller'
    ])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider.
            when('/',{
                templateUrl: '/home.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);