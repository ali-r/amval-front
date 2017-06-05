angular.module("assetAdminPanel").controller('guarantorCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, pagination, crud) {

  var controller = this;
  var apiName = 'guarantor';

  controller.searchObject = [
    {'fname' : 'نام دبیر', 'field' : 'secretary_first_name'},
    {'fname' : 'نام خانوادگی دبیر', 'field' : 'secretary_last_name'},
    {'fname' : 'شماره تلفن', 'field' : 'office_phone'}
  ];

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');

  $scope.apiUrl = mainAsset.getUrl() + apiName;
  $scope.getUrl = pagination.makeUrl($scope);

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
