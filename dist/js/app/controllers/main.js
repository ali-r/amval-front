angular.module("assetAdminPanel").controller('mainCtrl',
  function( $scope, requestHelper, $localStorage, $window, mainAsset){


    /*console.log($localStorage.assetData);*/
    if(!$localStorage.assetData)
    {
      setTimeout(
      function () {
        $window.location.href = "../index.html";
      },1000);
    }else{
      var nowTime = new Date();
      nowTime = Math.floor(nowTime.getTime()/1000);
      var difTime = nowTime - $localStorage.assetData.login_time;
      if( difTime > $localStorage.assetData.expire_duration){

        while ($localStorage.assetData) {
          delete $localStorage.assetData;
        }

        setTimeout(
        function () {
          $window.location.href = "../index.html";
        },1000);

      }else{
        $scope.userData = $localStorage.assetData;
        $scope.per = $localStorage.assetData.permissions;
      }
    }



    this.checkPer = function (param){
      if( $scope.per[param] == 'none' || typeof($scope.per[param]) == "undefined"){
        return false;
      }else{
        return true;
      }
    }

    $scope.notifList = []
    $scope.notifDisplayLimit = 5;
    this.loadNotifications = function(){
      var url = mainAsset.getUrl() + 'notification';
      requestHelper.get(url, $scope,
      function(response){
        console.log(response.data);
        $scope.notifList = response.data.notifications;
        setTimeout(
          function () {
            
            for(var i =0;i<$scope.notifDisplayLimit;i++){
              marked($scope.notifList[i].message,function(err,content){
                $('#msg-'+i)[0].innerHTML = content ;            
                
              })
            }

          },500);
        
      });
    }
    this.loadNotifications();

});