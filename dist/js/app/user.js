angular.module("assetAdminPanel").controller('userCtrl', function($scope,$http,mainAsset){

  var controller = this;
  $scope.serverUrl = mainAsset.getUrl();
  this.loginUrl = $scope.serverUrl + "user/";
  $scope.header = {'Content-Type': 'application/json; charset=UTF-8'};

  

});
