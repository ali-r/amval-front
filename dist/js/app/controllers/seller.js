angular.module("assetAdminPanel").controller('sellerCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, crud) {

  var controller = this;
  var apiName = 'seller';

  controller.searchObject = [
    {'fname' : 'نام', 'field' : 'first_name'},
    {'fname' : 'نام خانوادگی', 'field' : 'last_name'},
    {'fname' : 'نام فروشگاه', 'field' : 'store_name'},
    {'fname' : 'تلفن', 'field' : 'phone'},
    {'fname' : 'شماره موبایل', 'field' : 'cellphone'}
  ];

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');

  $scope.apiUrl = mainAsset.getUrl() + apiName;

  controller.obj = {}
  crud.initModals($scope, controller, apiName, [
    controller.obj.first_name,
    controller.obj.last_name,
    controller.obj.store_name,
    controller.obj.phone,
    controller.obj.cellphone,
    controller.obj.address
  ]);
  crud.init($scope, controller, apiName);
});
