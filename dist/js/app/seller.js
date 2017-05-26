angular.module("assetAdminPanel").controller('sellerCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, pagination, crud) {

  var controller = this;

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');

  $scope.apiUrl = mainAsset.getUrl() + "seller";
  controller.getUrl = pagination.makeUrl($scope)

  this.makeUrl = function() {
    return pagination.makeUrl($scope, {
      'first_name__contains': controller.firstNameSearch,
      'last_name__contains': controller.lastNameSearch,
      'store_name__contains': controller.storeNameSearch,
      'phone__contains': controller.phoneSearch,
      'cellphone__contains': controller.cellPhoneSearch,
      'sort': controller.sortOrder + controller.sortType,
    })
  }

  controller.obj = {}
  crud.initModals($scope, controller, 'seller', [
    controller.obj.first_name,
    controller.obj.last_name,
    controller.obj.store_name,
    controller.obj.phone,
    controller.obj.cellphone,
    controller.obj.address
  ])
  crud.init($scope, controller, 'seller')
  pagination.initPagination($scope, controller)
});
