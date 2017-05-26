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
    })
    .when("/guarantor", {
        templateUrl : "../dist/templates/guarantor.html",
        controller : "guarantorCtrl",
        controllerAs : "guarantor"
    })
    .when("/warehouse", {
        templateUrl : "../dist/templates/warehouse.html",
        controller : "warehouseCtrl",
        controllerAs : "warehouse"
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
    this.openModal = function (modal) {
      $(modal).modal({
          backdrop: 'static',
          keyboard: false
        });
      $(modal).modal('show');
    }
    this.closeModal = function (modal) {
      $(modal).modal({
          backdrop: 'static',
          keyboard: false
        });
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
