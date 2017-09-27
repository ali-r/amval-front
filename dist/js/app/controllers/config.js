angular.module("assetAdminPanel").controller('configCtrl',
function($scope, $http, $cookieStore, mainAsset, requestHelper, $window, Upload, crud){
    $scope.loadModal = true;
  var controller = this;
  $scope.assetData = $cookieStore.get("assetData");
  $scope.serverUrl = mainAsset.getUrl();
  $('#myTabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  })
  $('#myTabs a:first').tab('show') 

  var apiName = 'config'
  $scope.page = 1;
  $scope.apiUrl = mainAsset.getUrl() + apiName;

  this.configUrl = $scope.serverUrl + 'config';
  this.initialConfig = {}
  this.obj = {}

  requestHelper.init($scope);

  controller.loadConfig = function(){
    requestHelper.get(
        controller.configUrl, $scope,
        function(response){
            mainAsset.log(response.data);
            controller.initialConfig = response.data;
            controller.obj = angular.copy(controller.initialConfig);
        },
        function(response){
            mainAsset.log('Error loading config:');
            mainAsset.log(response)
        }
    )
  }
  controller.loadConfig();

  controller.setConfig = function(configType){
    var requestUrl = controller.configUrl + '/'+configType;
    var obj = controller.obj[configType];
    $scope.loadModal = true
    requestHelper.put(requestUrl, obj, $scope, 
        function(response){
            controller.loadConfig();
            mainAsset.log(response.data);
            $scope.loadModal = false;
        }, '');

  }

  controller.hasChanges = function(configType){
    return (!(controller.initialConfig[configType] == controller.obj[configType]));
  }

});
