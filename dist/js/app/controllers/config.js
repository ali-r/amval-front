angular.module("assetAdminPanel").controller('configCtrl',
function($scope, $http, $cookieStore, mainAsset, requestHelper){
    
  var controller = this;
  $scope.loadModal = true;
  controller.hostnamePattern = new RegExp('^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})(([:][0-9]{1,5}){0,1})$');
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

  controller.validateResult = {ldap:true,syslog:true,touched:false,ldap_touched:false,syslog_touched:false};
  controller.validateForm = function(configType,input_){
    controller.validateResult.touched = true;
    controller.validateResult[configType+"_touched"] = true;    
    controller.validateResult[configType] = controller.hostnamePattern.test(input_);
    $scope.$apply();
  }

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
        }, '');

  }

  $(document).ready(function(){
    $('#ldap-host').bind('propertychange change keyup keydown input paste',function(event){
        controller.obj.ldap.hostname = $('#ldap-host').val();
        controller.validateForm('ldap',controller.obj.ldap.hostname);
        $('#ldap-submit').show();
    })

    $('#syslog-host').bind('propertychange change keyup keydown input paste',function(){
        controller.obj.syslog.hostname =$('#syslog-host').val()
        controller.validateForm('syslog',controller.obj.syslog.hostname);
        $('#syslog-submit').show();
    })

    $('#ldap_on_off').on('click',function(){
        controller.obj.ldap.ldap_on = $('#ldap_on_off')[0].checked;
        controller.validateForm('ldap',controller.obj.ldap.hostname);
        controller.validateResult.touched = true;        
        $('#ldap-submit').show();
    })

    $('#syslog_on_off').on('click',function(){
        controller.obj.syslog.syslog_on = $('#syslog_on_off')[0].checked;
        controller.validateForm('syslog',controller.obj.syslog.hostname);
        controller.validateResult.touched = true;        
        $('#syslog-submit').show();
    })


  });
    
});
