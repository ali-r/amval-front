angular.module("assetAdminPanel").controller('configCtrl',
function($scope, $http, $cookieStore, mainAsset, requestHelper, $window, Upload){

  var controller = this;
  $scope.assetData = $cookieStore.get("assetData");
  $scope.serverUrl = mainAsset.getUrl();
  $scope.uploadUrl = mainAsset.getUploadUrl();
  controller.downloadUrl = null;
  $('#myTabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  })
  $('#myTabs a:first').tab('show') 

  this.configUrl = $scope.serverUrl + 'config';

  requestHelper.init($scope);

});
