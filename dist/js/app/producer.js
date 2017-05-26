angular.module("assetAdminPanel").controller('producerCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, pagination, crud) {

  var controller = this;
  var apiName = 'producer';

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');

  $scope.apiUrl = mainAsset.getUrl() + apiName;
  $scope.getUrl = pagination.makeUrl($scope);

  this.makeUrl = function() {
    return pagination.makeUrl($scope, {
      'brand_name__contains': controller.brandNameSearch,
    })
  }

  controller.obj = {}
  crud.initModals($scope, controller, apiName, [
    controller.obj.brand_name
  ]);
  crud.init($scope, controller, apiName);
  pagination.initPagination($scope, controller);
});
