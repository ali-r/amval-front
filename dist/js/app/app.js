var app = angular.module("assetAdminPanel", ["ngRoute","ngCookies","ngFileUpload"]);
app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);
app.config(function ($httpProvider) {
  /*$httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};*/
});
angular.module("assetAdminPanel").config(function($routeProvider) {

    var assetPages = ['database','user','seller','producer','guarantor','warehouse'];

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
    this.errorFunction = function (err,status) {
      switch(status){
          case 401:
            $window.location.href = "../index.html";
          break;
        }
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
