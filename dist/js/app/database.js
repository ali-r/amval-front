angular.module("assetAdminPanel").controller('databaseCtrl',
  function($scope, $http, $cookieStore, mainAsset, requestHelper){

    var controller = this;
    $scope.assetData = $cookieStore.get("assetData");
    $scope.serverUrl = mainAsset.getUrl();

    this.databaseUrl = $scope.serverUrl + 'database';

    this.download = function(){
      requestHelper.get(controller.databaseUrl + '/backup', $scope, function(data) {
        console.log(data);
      },true)
    }

    this.upload = function(){

      $scope.header = {'Access-Token':'User Request-Access token given after login'} ;

      $http.post($scope.serverUrl + "/database" + {headers: $scope.header}) ;

    }
});
