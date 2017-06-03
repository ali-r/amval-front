var app = angular.module("assetAdminPanel", ["ngRoute","ngCookies","ngStorage","ngFileUpload"]);
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
angular.module("assetAdminPanel").config(function($routeProvider) {

    var assetPages = ['database','user','seller','producer','guarantor','warehouse','changepass'];

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
app.directive('reqPagination', function() {
  return {
    restrict: 'E',
    replace : true,
    scope : true,
    templateUrl: '/dist/js/app/directive/pagination.html'
  }
});
app.directive('searchTools', function() {
  return {
    restrict: 'E',
    replace : true,
    scope : {
      sobject : '=',
      scontroller : '='
    },
    templateUrl: '/dist/js/app/directive/search.html'
  }
});
angular.module("assetAdminPanel").controller('mainCtrl',
  function( $scope, $http, $localStorage){

    $scope.userData = $localStorage.assetData;
    $scope.per = $localStorage.assetData.permissions;
    /*console.log($localStorage.assetData);*/

    this.checkPer = function (param){
      if( $scope.per[param] == 'none' || typeof(param) == "undefined"){
        return false;
      }else{
        return true;
      }
    }



});
