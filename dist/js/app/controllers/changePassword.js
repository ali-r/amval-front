angular.module("assetAdminPanel").controller('changepassCtrl',
  function($scope, $http, mainAsset, $cookieStore, requestHelper){

    var controller = this;

    $scope.assetData = $cookieStore.get("assetData");
    $scope.serverUrl = mainAsset.getUrl();

    this.changePassUrl = $scope.serverUrl + 'user/' + $scope.assetData.id + '/password';

    this.changePassword = function(){
      requestHelper.put(controller.changePassUrl, controller.obj, $scope, function() {

        controller.obj = {};
        controller.tmp = {};
      },true);
    }



});
