# Angular form uploader

## Installation
````
$ bower install mrc-form-uploader
````

Add third party dependencies

```Html
<script language="Javascript" src="./bower_components/angular-file-upload/dist/angular-file-upload.min.js"></script>
<link rel="stylesheet" type="text/css" href="./bower_components/ng-img-crop/compile/minified/ng-img-crop.css.css">
<script language="Javascript" src="./bower_components/ng-img-crop/compile/minified/ng-img-crop.css.js"></script>
```

Add the css and javascript files

```Html
<link rel="stylesheet" type="text/css" href="./bower_components/form-uploader/dist/css/form-uploader.min.css">
<script language="JavaScript" src="./bower_components/form-uploader/dist/js/form-uploader.min.js"></script>
```

Add the dependence in the your module:

```Javascript
angular.module('app', ['form.uploader'])
```

# Directives

## form-uploader
* **sendUrl:** String, required The url request of send and upload of the file
* **removeUrl:** String,(default null) The url request to remove the uploaded file(s)
* **many:** Bool, (default: false) Define if the upload is to many or only one file
* **defaultLimit:** Int, (default 3MB) The max size of the file uploaded
* **allowType:** String, (default: undefined e.g.:[jpg|gif|png]) The allowed extensions to the upload, by default all extensions are allowed
* **validators:** Array, (default: []) A list of array with filters for the upload, an array of objects with properties:
    * **name:** the name of the filter
    * **fn:** the function with the rule of the filter, has two arguments(item, options)

```Html
<form-uploader 
    [send-url="String"]
    [remove-url="String"] 
    [many="Bool"]
    [allow-type="String"]
    [default-limit="Int"]
    [validators="Array({name: String, values: String|Int, type: String|Function, message: String})"]>
</form-uploader>
```

## Response

### Upload Request

The response pattern, must be a object equal to:

* **success:** An Object with response data:
    * **message:** The message with success
    * **path:** The path when the file was stored, used for delete the currently file uploaded
    * **file:** The uploaded file object
    * **data:** can be the own uploaded file, or the response of a external sevice, like s3 bucket object 
* **error:** An Object with the proprerty 'message'

### Delete Request

The response pattern, must be a object equal to:

* **success:** An Object with the proprerty 'message'
* **error:** An Object with the proprerty 'message'

## $broadcast event

Event when the upload start
```
$rootScope.$on('form.uploader.begin', function(e){
    // put here your method when the upload begin
});
```
Event when the upload finish
```
$rootScope.$on('form.uploader.finish', function(e){
    // put here your method when the upload finish
});
```

## Changelog

Please see the [releases page](https://github.com/MRCardoso/form-uploader/releases) for details
of each released version.

## Licence

MIT
