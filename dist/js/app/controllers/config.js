angular.module("assetAdminPanel").controller('configCtrl',
function($scope, $http, $cookieStore, mainAsset, requestHelper){
    
  var controller = this;
  $scope.loadModal = true;
  // $scope.ValidIpAddressRegex = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$";
  $scope.ValidIpAddressRegex = "^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})(([:][0-9]{1,5}){0,1})$";
  $scope.ValidHostnameRegex = "^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$";
  
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
  this.obj = {}

  requestHelper.init($scope);
  $scope.ipConfigObject = {
    allowPort: true
  };

  controller.validateResult = {touched:false,ldap_touched:false,syslog_touched:false};

  controller.loadConfig = function(){
    $scope.loadModal = true;    
    requestHelper.get(
        controller.configUrl, $scope,
        function(response){
            mainAsset.log(response.data);
            controller.initialConfig = response.data;
            controller.obj = angular.copy(controller.initialConfig);
            $scope.loadModal = false;
            controller.validateResult.touched = false;
        },
        function(response){
            mainAsset.log('Error loading config:');
            mainAsset.log(response)
            $scope.loadModal = false;
            controller.validateResult.touched = false;
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
            $('#ldap-submit').hide();
            $('#syslog-submit').hide();
            controller.validateResult['ldap_touched'] = false;
            controller.validateResult['syslog_touched'] = false;            
        }, '');

  }

  controller.configChange = function(configType){
    if(angular.equals(controller.initialConfig[configType],controller.obj[configType])) $('#'+configType+'-submit').hide();
    else $('#'+configType+'-submit').show();
    controller.validateResult.touched = true;
    controller.validateResult[configType+'_touched'] = true;
  }
});
