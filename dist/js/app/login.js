angular.module("assetAdminPanel").controller('loginCtrl', function($scope,$http,mainAsset){

  var controller = this;
  $scope.serverUrl = mainAsset.getUrl();
  this.loginUrl = $scope.serverUrl + "login";

  this.login = function(){
    
    $http({
    method: 'POST',
    url: controller.loginUrl
      }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $scope.test = response;
    });

  };
});
