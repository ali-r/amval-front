angular.module("assetAdminPanel").controller('warehouseCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, pagination, crud) {

  var controller = this;
  var apiName = 'warehouse';

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');

  $scope.apiUrl = mainAsset.getUrl() + apiName;
  $scope.getUrl = pagination.makeUrl($scope);

  this.makeUrl = function() {
    return pagination.makeUrl($scope, {
      'title__contains': controller.titleSearch,
      'location__contains': controller.locationSearch,
      'phone__contains': controller.phoneSearch
    })
  }

  controller.obj = {}
  crud.initModals($scope, controller, apiName, [
    controller.obj.title,
    controller.obj.location,
    controller.obj.phone
  ]);
  crud.init($scope, controller, apiName);
  pagination.initPagination($scope, controller);
});
