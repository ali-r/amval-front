angular.module("assetAdminPanel").controller('logoutCtrl',
  function($scope, $localStorage, requestHelper, mainAsset){

    var controller = this;
    $scope.serverUrl = mainAsset.getUrl();
    $scope.assetData = $localStorage.assetData;
    this.logoutUrl = $scope.serverUrl + "user/logout";
    $scope.load = true;

    /*delete $localStorage.assetData;
    $localStorage.$reset();*/
    
    if ($localStorage.assetData) {
      
      requestHelper.delete(controller.logoutUrl, $scope, function() {
        localStorage.removeItem('ngStorage-assetData');
        $scope.load = false;
      } ,false);

    while ($localStorage.assetData) {
      delete $localStorage.assetData;
    }

    }else{
      $scope.load = false;
    }
});
