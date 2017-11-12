angular.module("assetAdminPanel").controller('databaseCtrl',
  function($scope, $http, $cookieStore, mainAsset, requestHelper, $window, Upload){

    var controller = this;
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
      if (!$scope.databaseForm.file.$error.pattern && controller.file) {
        requestHelper.startLoading(true);
        $scope.uploading = true;        
        Upload.upload({
            url: controller.databaseUrl,
            method : 'PUT',
            headers: {'Access-Token': $scope.assetData.access_token},
            data: {'database' : controller.file}
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

    this.uploadServer = function(){
      if (!$scope.uploadForm.file.$error.pattern && controller.uploadFile) {
        requestHelper.startLoading(true);
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
            console.log($scope.uploadPercentage)
        });
      }
    }


});
