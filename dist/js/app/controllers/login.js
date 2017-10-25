angular.module("assetAdminPanel").controller('loginCtrl',
  function( $scope, $http, $localStorage, $window, mainAsset, requestHelper){

  var controller = this;
  $scope.serverUrl = mainAsset.getUrl();
  this.loginUrl = $scope.serverUrl + "user/login";
  $scope.header = {'Content-Type': 'application/json; charset=UTF-8'};
  this.user = "";
  this.pass = "";

  if ( $localStorage.assetData ) {

    var nowTime = new Date();
    nowTime = Math.floor(nowTime.getTime()/1000);
    var difTime = nowTime - $localStorage.assetData.login_time;

    if( difTime > $localStorage.assetData.expire_duration){

      while ($localStorage.assetData) {
        delete $localStorage.assetData;
      }
    }else{
      $window.location.href = '/panel/#/home';
    }
  }

  this.login = function(){
    NProgress.start();
    var loginData = {};
    loginData.username = controller.user;
    loginData.password = controller.pass;
    $http.post(controller.loginUrl, loginData,{headers: $scope.header})
    .then(function successCallback(response) {
      var loginTime = new Date();
      $localStorage.assetData = response.data.data;
      $localStorage.assetData.login_time = Math.floor(loginTime.getTime()/1000);
      /*$localStorage.assetData.permissions.user = 'read';*/
      NProgress.done();
      $window.location.href = '/panel/#/home';

      }, function errorCallback(response) {
        NProgress.done();
        mainAsset.log(response)
        new PNotify({
          title: 'خطا ' ,
          text: response.data.data.fa,
          type: 'error'
        });
    });
  };

  this.makeTargetUrl = function (perList, baseUrl) {


  }
});
