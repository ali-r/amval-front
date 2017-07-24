var app = angular.module("assetAdminPanel", ["ngRoute", "ngCookies", "ngStorage", "ngFileUpload", "ADM-dateTimePicker"]);
app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);
app.config(function ($httpProvider) {

  if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
  }
  $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
  $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
});
app.config(['ADMdtpProvider', function(ADMdtp) {
    ADMdtp.setOptions({
        calType: "jalali", 
        format: "YYYY-MM-DD", 
        zIndex : 1100, 
        dtpType : "date", 
        freezeInput : "true", 
        multiple : false, 
        autoClose :true,
        transition : false
    });
}]);
angular.module("assetAdminPanel").config(function($routeProvider) {

    var assetPages = ['home','database','user','seller','producer','guarantor','warehouse','changepass','product','group'];

    for (var i = 0; i < assetPages.length; i++) {
      $routeProvider.when("/" + assetPages[i] , {
          templateUrl : "../dist/templates/" + assetPages[i] + ".html",
          controller : assetPages[i] + "Ctrl",
          controllerAs : assetPages[i]
      });
    };
});
app.service('mainAsset', function($window, $http) {
    this.devMode = assetPanelData.devMode;
    this.getUrl = function () {
      return assetPanelData.serverUrl;
    };
    this.getUploadUrl = function () {
      return assetPanelData.uploadUrl;
    };
    this.openModal = function (modal) {
      $(modal).modal({
          backdrop: 'static',
          keyboard: false
        });
      $(modal).modal('show');
    }
    this.closeModal = function (modal) {
      $(modal).modal('hide');
    }
});
app.filter('jalaliDate', function () {
      return function (inputDate, format) {
        moment.loadPersian();
        var date = moment(inputDate).utcOffset(420);
        return date.format(format);
    }
});
app.filter('userType', function() {
  return function(input) {
    var output;
    switch(input){
        case 3:
          output = "مدیر";
        break;
        case 2:
          output = "انباردار مرکزی";
        break;
        case 1:
          output = "انباردار";
        break;
        case 0:
          output = "کاربر";
        break;
    }
    return output;
  }
});

app.filter('metaType', function() {
  return function(input) {
    var output;
    switch(input){
        case 'int':
          output = "عدد صحیح";
        break;
        case 'str':
          output = "رشته";
        break;
        case 'bool':
          output = "دو حالتی";
        break;
    }
    return output;
  }
});

app.directive('reqPagination', function() {
  return {
    restrict: 'E',
    replace : false,
    scope : {
      itempage : '=',
      itemmeta : '='
    },
    templateUrl: '/dist/js/app/directive/pagination.html'
    //template : '<p id="test">{{itempage}}</p>'
  }
});

app.directive('searchTools', function() {
  return {
    restrict: 'E',
    replace : true,
    transclude: true,
    scope : {
      sobject : '=',
      scontroller : '='
    },
    templateUrl: '/dist/js/app/directive/search.html'
  }
});


app.directive('searchStage', function() {
  return {
    restrict: 'E',
    replace : true,
    scope : {
      obj : '=',
      controller : '='
    },
    templateUrl: '/dist/js/app/directive/searchStage.html'
  }
});

angular.module("assetAdminPanel").controller('mainCtrl',
  function( $scope, $http, $localStorage){


    /*console.log($localStorage.assetData);*/
    if(!$localStorage.assetData)
    {
      setTimeout(
      function () {
        $window.location.href = "../index.html";
      },500);
    }else{
      $scope.userData = $localStorage.assetData;
      $scope.per = $localStorage.assetData.permissions;
    }

    this.checkPer = function (param){
      if( $scope.per[param] == 'none' || typeof($scope.per[param]) == "undefined"){
        return false;
      }else{
        return true;
      }
    }

});
