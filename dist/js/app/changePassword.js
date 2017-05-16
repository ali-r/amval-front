angular.module("assetAdminPanel").controller('changePassword', function($scope,$http){

    var begir = this;

    $scope.serverUrl = "https://api.gandom.co/api/v1/user/:user_id/password" ;
    $scope.header = {'Content-Type': 'application/json'} ;

    this.sendPassword = function(){
    var userPasswordData = {}
    userPasswordData.old_password = begir.oldPassword;
    userPasswordData.new_password = begir.newPassword;
    userPasswordData.newPasswordConfig = begir.oldPasswordAgain;
    $http.put($scope.serverUrl + "user/:user_id/password", userPasswordData , {headers: $scope.header})
    .success(function(data){
      if(data.new_password === data.newPasswordConfig)
      {
        userPasswordData.old_password = userPasswordData.new_password ;
      }
      .error(function(error,status)
      {

      });

    });
  }

});
