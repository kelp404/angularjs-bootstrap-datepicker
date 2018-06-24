# angularjs-bootstrap-datepicker


## Installation
```bash
$ bower install angularjs-bootstrap-datepicker -S
```


## Start
```html
<link type="text/css" rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.10/angular.min.js"></script>

<!-- datepicker -->
<link type="text/css" rel="stylesheet" href="/bower_components/angularjs-bootstrap-datepicker/dist/datepicker.css"/>
<script type="text/javascript" src="/bower_components/angularjs-bootstrap-datepicker/dist/datepicker.js"></script>
```


## Example
```js
angular.module('your-module', ['bootstrap.datepicker'])
.controller('YourController', ['$scope', function ($scope) {
  $scope.form = {
    date: null
  };
}]);
```

```html
<div class="form-group">
  <label class="control-label" for="input-date">Date</label>
  <input ng-model="form.date"
         bootstrap-datepicker="{format: 'yyyy-MM-dd'}"
         class="form-control"
         id="input-date" type="text" placeholder="yyyy-MM-dd"/>
</div>
```


## Options
```js
bootstrap-datepicker = {
  format: 'M/d/yyyy',
  days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
};
```
