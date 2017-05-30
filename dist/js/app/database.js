angular.module("assetAdminPanel").controller('databaseCtrl',
  function($scope, $http, $cookieStore, mainAsset, requestHelper, $window){

    var controller = this;
    $scope.assetData = $cookieStore.get("assetData");
    $scope.serverUrl = mainAsset.getUrl();

    this.databaseUrl = $scope.serverUrl + 'database';

    this.download = function(){
      requestHelper.post(controller.databaseUrl + '/backup', {}, $scope, function(response) {
        requestHelper.get(response.data.download_url, $scope, function(res) {
          /*uriContent = "data:application/octet-stream;charset=utf-8," + encodeURIComponent(res.data);
          $window.open(uriContent,'file.txt');*/
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
        },true)
      },true)
    }

    this.upload = function(){
      requestHelper.put(controller.databaseUrl, {'database' : controller.file}, $scope, function() {

      },true);
    }
});
