angular.module("assetAdminPanel").controller('logoutCtrl',
  function($scope, $cookieStore, requestHelper, mainAsset){

    var controller = this;
    $scope.serverUrl = mainAsset.getUrl();
    $scope.assetData = $cookieStore.get('assetData');
    this.logoutUrl = $scope.serverUrl + "user/logout";

    if ($scope.assetData !== null) {
      requestHelper.delete(controller.logoutUrl, $scope, function() {
        $cookieStore.put('assetData', null);
        $cookieStore.put('per', null);
      });
    }
});
