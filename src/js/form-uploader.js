/**
 * form-uploader - AngularJS module to easily the criation of container for uploader of files
 * 
 * Copyright 2017 Marlon R Cardoso <marlonrcardoso@yahoo.com.br>
 */
(function(){
    'use strict';
    angular
        .module('form.uploader',[
            'angularFileUpload',
            'ngThumbCanvas',
            'formCustomChange',
            'formDragDrop'
        ])
        .run(["$rootScope", function($rootScope){
        }]);
}());