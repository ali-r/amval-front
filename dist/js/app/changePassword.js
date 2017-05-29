angular.module("assetAdminPanel").controller('changepassCtrl', function($scope,$http,mainAsset,$cookieStore){

    var begir = this;
    $scope.assetData = $cookieStore.get("assetData")
    $scope.serverUrl = mainAsset.getUrl();
    $scope.header = {'Content-Type': 'application/json' , 'Access-Token': $scope.assetData.access_token} ;


      this.check=function(){
      if(begir.newPass === begir.newPassAgain)
      {
        return false;
      }
      else
        {
          return true;
        }

      };

    this.sendPassword = function(){
    var userPasswordData = {}
    userPasswordData.old_password = begir.oldPass;
    userPasswordData.new_password = begir.newPass;
    $http.put($scope.serverUrl + "user/" + $scope.assetData.id + "/password", userPasswordData , {headers: $scope.header})
    .then(function successCallback(response)
    {

    },
    function errorCallback(response)
    {

    });
  }

});
