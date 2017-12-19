angular.module("assetAdminPanel").controller('emptydatabaseCtrl',
  function($scope, $http, $localStorage, mainAsset, requestHelper, crud, $window){

    var controller = this;
    var apiName = 'database';
  
    controller.emptySuccess = false;
    $scope.assetData = $localStorage.assetData;
    $scope.serverUrl = mainAsset.getUrl();
    $('#myTabs a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
    $('#myTabs a:first').tab('show') 

    this.databaseUrl = $scope.serverUrl + 'database';
    

    $scope.page = 1;
    $scope.apiUrl = mainAsset.getUrl() + apiName;

    crud.init($scope, controller, '')
  
    // requestHelper.init($scope);

    

    this.empty = function(){
        $scope.preRequest = {
          type: 'delete',
          url: controller.databaseUrl,
          scope: $scope, 
          callback: function(response) {
              controller.emptySuccess = true;

              $localStorage.$reset();
              setTimeout(
              function () {
                $window.location.href = "../index.html";
              },500);

            },
          progressBar:false
        }
        requestHelper.delete($scope.preRequest.url, $scope.preRequest.scope, 
            $scope.preRequest.callback, $scope.preRequest.progressBar);        
    }

});
