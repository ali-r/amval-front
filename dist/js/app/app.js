var app = angular.module("assetAdminPanel", ["ngRoute"]);
app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);
angular.module("assetAdminPanel").config(function($routeProvider) {
    $routeProvider
    .when("/database", {
        templateUrl : "../dist/templates/database.html",
        controller : "databaseCtrl",
        controllerAs : "db",
    })
    .otherwise({
        redirectTo: "/database"
    });
});
app.service('mainUrl', function($window) {
    this.devMode = maghazamConfigData.dev_mode;
    this.get = function () {
      return maghazamConfigData.url;
    };
    this.getUploadUrl = function () {
      return maghazamConfigData.upload_url;
    };
    this.errorFunction = function (err,status) {
      switch(status){
          case 401:
            $window.location.href = "../index.html";
          break;
        }
    };
});
app.filter('jalaliDate', function () {
              return function (inputDate, format) {
                moment.loadPersian();
                var date = moment(inputDate).utcOffset(420);
                return date.format(format);
            }
        });
app.filter('homePage', function() {
  return function(input) {
    var output;
    switch(input){
        case 'business':
          output = "کسب و کار";
        break;
        case 'collection':
          output = "مجموعه";
        break;
        case 'product':
          output = "محصول";
        break;
    }
    return output;
  }
});
