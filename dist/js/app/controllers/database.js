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
            data: controller.file,
            successCallback: '',
            errorCallback: '',
            handler: ''
        }
        requestHelper.uploadDatabase($scope,$scope.preRequest)
      }
    }

    this.uploadServer = function(){
      if (!$scope.uploadForm.file.$error.pattern && controller.uploadFile) {
        $scope.uploading = true;
        Upload.upload({
            url: $scope.uploadUrl + '/database',
            method : 'PUT',
            data: {'database' : controller.uploadFile}
        }).then(function (resp) {
            requestHelper.successCallback(resp);
            $scope.uploading = false;
            $scope.uploadPercentage = 0;
        }, function (resp) {
            $scope.uploading = false;
            $scope.uploadPercentage = 0;
            requestHelper.errorCallback(resp);
        }, function (evt) {
            $scope.uploadPercentage = parseInt(100.0 * evt.loaded / evt.total) + '%';
        });
      }
    }


});
