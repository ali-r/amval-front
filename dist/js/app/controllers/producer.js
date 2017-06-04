angular.module("assetAdminPanel").controller('producerCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, pagination, crud) {

  var controller = this;
  var apiName = 'producer';

  controller.searchObject = [
    {'fname' : 'نام برند', 'field' : 'brand_name'}
  ];

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');

  $scope.apiUrl = mainAsset.getUrl() + apiName;
  $scope.getUrl = pagination.makeUrl($scope);

  controller.obj = {}
  crud.initModals($scope, controller, apiName, [
    controller.obj.brand_name
  ]);
  crud.init($scope, controller, apiName);
  pagination.initPagination($scope, controller);
});
