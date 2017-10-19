angular.module("assetAdminPanel").controller('mainCtrl',
  function( $scope, requestHelper, $localStorage, $window, mainAsset){
    var mainController = this;
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


    $(document).on('click', 'ul#menu1', function (e) {
      if(!$('ul#menu1 a').is(e.target) && !$('ul#menu1 strong').is(e.target))
        e.stopPropagation();      
    });

    this.checkPer = function (param){
      if( $scope.per[param] == 'none' || typeof($scope.per[param]) == "undefined"){
        return false;
      }else{
        return true;
      }
    }

    $scope.notifList = []
    $scope.notifDisplayLimit = 5;
    mainController.loadingNotif = 0;
    this.loadNotifications = function(){
      var url = mainAsset.getUrl() + 'notification';
      mainController.loadingNotif = 1;
      requestHelper.get(url, $scope,
      function(response){
        if(!angular.equals($scope.notifList,response.data.notifications)){
          $scope.notifList = response.data.notifications;
          setTimeout(
            function () {
              for(var i =0;i<Math.min($scope.notifDisplayLimit,$scope.notifList.length);i++){
                marked($scope.notifList[i].message,function(err,content){
                  $('#msg-'+i)[0].innerHTML = content ;            
                })
              }
              mainController.loadingNotif = 0;
              $scope.$apply();
            },500);
        }
        else{
          mainController.loadingNotif = 0;          
        }
      });
    }
    this.loadNotifications();

  });