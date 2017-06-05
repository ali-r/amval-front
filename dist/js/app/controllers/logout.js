angular.module("assetAdminPanel").controller('logoutCtrl',
  function($scope, $localStorage, requestHelper, mainAsset){

    var controller = this;
    $scope.serverUrl = mainAsset.getUrl();
    $scope.assetData = $localStorage.assetData;
    this.logoutUrl = $scope.serverUrl + "user/logout";

    /*delete $localStorage.assetData;
    $localStorage.$reset();*/

    if ($scope.assetData) {
      requestHelper.delete(controller.logoutUrl, $scope, function() {
        localStorage.removeItem('ngStorage-assetData');
        while ($localStorage.assetData) {
          delete $localStorage.assetData;
        }
        console.log('ok!');
      },true);
    }
});
