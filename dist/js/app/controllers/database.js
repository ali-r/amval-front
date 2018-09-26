angular.module("assetAdminPanel").controller('databaseCtrl',
  function($scope, $http, $cookieStore, mainAsset, requestHelper, $window, Upload,crud){

    var controller = this;
    $scope.uploadPercentage = 0;
    $scope.assetData = $cookieStore.get("assetData");
    $scope.serverUrl = mainAsset.getUrl();
    $scope.uploadUrl = mainAsset.getUploadUrl();
    controller.downloadUrl = null;
    $('#myTabs a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
    $('#myTabs a:first').tab('show') 

    this.databaseUrl = $scope.serverUrl + 'database';

    crud.init($scope, controller, '')
  
    this.download = function(){
      controller.downloadUrl = null;
      requestHelper.post(controller.databaseUrl + '/backup', {}, $scope, function(response) {
        $window.open(response.data.data.download_url, '_blanck');
        controller.downloadUrl = response.data.data.download_url;
      },true)
    }

    this.downloadFile = function(){
      controller.downloadUrl = null;
      requestHelper.post($scope.uploadUrl + '/database/backup', {}, $scope, function(response) {
        $window.open($scope.uploadUrl + response.data.data.download_url, '_blanck');
        controller.downloadUrl = $scope.uploadUrl + response.data.data.download_url;
      },true)
    }

    requestHelper.init($scope);

    this.upload = function(){
      if (!$scope.restoreForm.file.$error.pattern && controller.file) {
        $scope.preRequest = {
            type: 'uploadDatabase',
            method: 'PUT',
            scope: $scope,
            url: controller.databaseUrl,
            data: null,
            successCallback: '',
            errorCallback: '',
            handler: ''
        }
        requestHelper.uploadDatabase($scope,$scope.preRequest,controller.file)
      }
    }

    this.uploadServer = function(){
      if (!$scope.uploadForm.file.$error.pattern && controller.uploadFile) {
        $scope.uploading = true;
        $scope.preRequest = {
          type: 'uploadServer',
          method: 'PUT',
          scope: $scope,
          url: $scope.uploadUrl + 'database',
          data: null,
          successCallback: '',
          errorCallback: '',
          handler: ''
        }
        requestHelper.uploadDatabase($scope,$scope.preRequest,controller.uploadFile)
      }
    }


});
