angular.module("assetAdminPanel").controller('guarantorCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, pagination, crud) {

  var controller = this;
  var apiName = 'guarantor';

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');

  $scope.apiUrl = mainAsset.getUrl() + apiName;
  $scope.getUrl = pagination.makeUrl($scope);

  this.makeUrl = function() {
    return pagination.makeUrl($scope, {
      'secretary_first_name__contains': controller.secretaryFirstNameSearch,
      'secretary_last_name__contains': controller.secretaryLastNameSearch,
      'office_phone__contains': controller.officePhoneSearch,
      'address__contains': controller.addressSearch
    })
  }

  controller.obj = {}
  crud.initModals($scope, controller, apiName, [
    controller.obj.secretary_first_name,
    controller.obj.secretary_last_name,
    controller.obj.office_phone,
    controller.obj.address
  ]);
  crud.init($scope, controller, apiName);
  pagination.initPagination($scope, controller);
});
