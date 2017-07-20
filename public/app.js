'use strict';
angular.module("fu", [
        'ngRoute',
        'ngResource',
        'form.uploader',
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