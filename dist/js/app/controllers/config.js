angular.module("assetAdminPanel").controller('configCtrl',
function($scope, $http, $cookieStore, mainAsset, requestHelper){
    $scope.loadModal = true;
  var controller = this;
  $scope.assetData = $cookieStore.get("assetData");
  $scope.serverUrl = mainAsset.getUrl();
  $('#myTabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  })
  $('#myTabs a:first').tab('show') 
  $(":input").inputmask();
  var apiName = 'config'
  $scope.page = 1;
  $scope.apiUrl = mainAsset.getUrl() + apiName;

  this.configUrl = $scope.serverUrl + 'config';
  this.initialConfig = {}
  this.obj = {}

  requestHelper.init($scope);
  $scope.ipConfigObject = {
    allowPort: true
  };
  controller.loadConfig = function(){
    $scope.loadModal = true;    
    requestHelper.get(
        controller.configUrl, $scope,
        function(response){
            mainAsset.log(response.data);
            controller.initialConfig = response.data;
            controller.obj = angular.copy(controller.initialConfig);
            $scope.loadModal = false;
        },
        function(response){
            mainAsset.log('Error loading config:');
            mainAsset.log(response)
            $scope.loadModal = false;
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
        }, '');

  }

    $('#ldap-host').on('change',function(){
        controller.obj.ldap.hostname = $('#ldap-host').val();
        if(controller.hasChanges('ldap'))
            $('#ldap-submit').show();
        else
            $('#ldap-submit').hide();        
    })

    $('#syslog-host').on('change',function(){
        controller.obj.syslog.hostname =$('#syslog-host').val()
        
        if(controller.hasChanges('syslog'))
            $('#syslog-submit').show();
        else
            $('#syslog-submit').hide();
    })

    $('#ldap_on_off').on('click',function(){
        controller.obj.ldap.ldap_on = $('#ldap_on_off').val();
        if(controller.hasChanges('ldap'))
            $('#ldap-submit').show();
        else
            $('#ldap-submit').hide();
    })

    $('#syslog_on_off').on('click',function(){
        controller.obj.syslog.syslog_on = $('#syslog_on_off').val();
        if(controller.hasChanges('syslog'))
            $('#syslog-submit').show();
        else
            $('#syslog-submit').hide();
    })

    controller.hasChanges = function(configType){
        var compareResult = angular.equals(controller.initialConfig[configType],controller.obj[configType]);
        return (!compareResult);
    }

});
