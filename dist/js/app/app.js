var app = angular.module("assetAdminPanel", ["ngRoute","ngCookies"]);
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
    $routeProvider
    .when("/database", {
        templateUrl : "../dist/templates/database.html",
        controller : "databaseCtrl",
        controllerAs : "db"
    })
    .when("/user", {
        templateUrl : "../dist/templates/user.html",
        controller : "userCtrl",
        controllerAs : "user"
    })
    .when("/seller", {
        templateUrl : "../dist/templates/seller.html",
        controller : "sellerCtrl",
        controllerAs : "seller"
    })
    .when("/producer", {
        templateUrl : "../dist/templates/producer.html",
        controller : "producerCtrl",
        controllerAs : "producer"
    });
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
    this.pagination = function(status,meta){
      var pageMeta = meta;
      switch (status) {
        case 'old':
          if (pageMeta.next === null) {
            return true;
          }else{
            return false;
          };
          break;
        case 'new':
          if (pageMeta.prev == null) {
            return true;
          }else{
            return false;
          };
          break;
        case 'end':
          if (pageMeta.pages > 1 && pageMeta.page < pageMeta.pages -1 ) {
            return false;
          }else{
            return true;
          };
          break;
        case 'first':
          if (pageMeta.page > 2) {
            return false;
          }else{
            return true;
          };
          break;
      };
    };

    this.pageSet = function(mode,page,meta){
      switch (mode) {
        case 'new':
          page -=1;
          break;
        case 'old':
          page +=1;
          break;
        case 'first':
          page = 1;
          break;
        case 'end':
          page = meta.pages;
          break;
      }
      return page;
    };
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
