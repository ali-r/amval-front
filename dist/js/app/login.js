angular.module("assetAdminPanel").controller('loginCtrl',
  function( $scope, $http, $localStorage, $window, mainAsset){

  var controller = this;
  $scope.serverUrl = mainAsset.getUrl();
  this.loginUrl = $scope.serverUrl + "user/login";
  $scope.header = {'Content-Type': 'application/json; charset=UTF-8'};
  this.user = "";
  this.pass = "";

  if ( $localStorage.assetData ) {
    $window.location.href = '/panel/#/user';
  }

  this.login = function(){
    NProgress.start();
    var loginData = {};
    loginData.username = controller.user;
    loginData.password = controller.pass;
    $http.post(controller.loginUrl, loginData,{headers: $scope.header})
    .then(function successCallback(response) {

      $localStorage.assetData = response.data;
      console.log(response.data.access_token);
      NProgress.done();
      $window.location.href = '/panel/#/user';
      }, function errorCallback(response) {
        NProgress.done();
    });

  };
});
