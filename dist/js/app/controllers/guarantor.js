angular.module("assetAdminPanel").controller('guarantorCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, crud) {

  var controller = this;
  var apiName = 'guarantor';

  controller.searchObject = [
    {'fname' : 'نام شرکت', 'field' : 'company_name'},
    {'fname' : 'آدرس سایت', 'field' : 'website_address'},
    {'fname' : 'شماره تلفن', 'field' : 'office_phone'}
  ];

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');

  $scope.apiUrl = mainAsset.getUrl() + apiName;

  controller.obj = {}
  crud.initModals($scope, controller, apiName, [
    controller.obj.company_name,
    controller.obj.website_address,
    controller.obj.office_phone,
    controller.obj.address
  ]);
  crud.init($scope, controller, apiName);
});
