angular.module("assetAdminPanel").controller('transactionCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, pagination, crud) {

  var controller = this;
  var apiName = 'transaction';

  controller.searchObject = [
    {'fname' : 'نام', 'field' : 'first_name'},
    {'fname' : 'شماره موبایل', 'field' : 'cellphone'}
  ];

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');

  $scope.apiUrl = mainAsset.getUrl() + apiName;
  $scope.getUrl = pagination.makeUrl($scope);

  controller.obj = {}
  crud.initModals($scope, controller, apiName, [
   
  ]);
  crud.init($scope, controller, apiName);
  pagination.initPagination($scope, controller, 'meta', 'page', 'getUrl', 'searchObject', 'searchValue');

  controller.addProduct = function(list){
    controller.obj.product = list;
    $scope.stage = 0;
  };

});
