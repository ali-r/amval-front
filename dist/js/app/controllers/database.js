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
        /*requestHelper.get(response.data.data.download_url, $scope, function(res) {
          //uriContent = "data:application/octet-stream;charset=utf-8," + encodeURIComponent(res.data);
          //$window.open(uriContent,'file.txt');
          var str = res.data;
          var uri = 'data:text/csv;charset=utf-8,' + str;
          var d = new Date();
          var downloadLink = document.createElement("a");
          downloadLink.href = uri;
          downloadLink.download = "database-" + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate()
          + '_' + d.getHours() + ':' + d.getMinutes() + ".asset";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        },true)*/
      },true)
    }

    this.downloadFile = function(){
      controller.downloadUrl = null;
      requestHelper.post($scope.uploadUrl + '/database/backup', {}, $scope, function(response) {
        $window.open(response.data.data.download_url, '_blanck');
        controller.downloadUrl = response.data.data.download_url;
      },true)
    }

    requestHelper.init($scope);

    this.upload = function(){
      if (!$scope.databaseForm.file.$error.pattern && controller.file) {
        requestHelper.startLoading(true);
        Upload.upload({
            url: controller.databaseUrl,
            method : 'PUT',
            headers: {'Access-Token': $scope.assetData.access_token},
            data: {'database' : controller.file}
        }).then(function (resp) {
            requestHelper.successCallback();
        }, function (resp) {
            requestHelper.errorCallback(resp.status);
        }, function (evt) {
        });
      }
    }

    this.uploadServer = function(){
      if (!$scope.uploadForm.file.$error.pattern && controller.uploadFile) {
        requestHelper.startLoading(true);
        Upload.upload({
            url: $scope.uploadUrl + '/database',
            method : 'PUT',
            data: {'database' : controller.uploadFile}
        }).then(function (resp) {
            requestHelper.successCallback();
        }, function (resp) {
            requestHelper.errorCallback(resp.status);
        }, function (evt) {
        });
      }
    }


});
