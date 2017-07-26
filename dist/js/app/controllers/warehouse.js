angular.module("assetAdminPanel").controller('warehouseCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, pagination, crud) {

  var controller = this;
  var apiName = 'warehouse';

  controller.searchObject = [
    {'fname' : 'انبار', 'field' : 'title'}
  ];

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');

  $scope.apiUrl = mainAsset.getUrl() + apiName;
  $scope.getUrl = pagination.makeUrl($scope);

  controller.objConfig = function (obj) {
    sendCopyObj = angular.copy(obj);

    if (sendCopyObj.clerk)
      sendCopyObj.clerk = sendCopyObj.clerk.id;

    if($scope.editMode){
      delete sendCopyObj.parent_warehouse;
    }

    return sendCopyObj;
  };

  controller.obj = {}
  crud.initModals($scope, controller, apiName, [
    controller.obj.title,
    controller.obj.location,
    controller.obj.phone
  ]);
  crud.init($scope, controller, apiName, controller.objConfig)
  pagination.initPagination($scope, controller, 'meta', 'page', 'getUrl', 'searchObject', 'searchValue');

  controller.selectUser = function(){
    $scope.stage = 1;
    controller.tmp.searchQuery = '';
    controller.search('user','last_name');
  };

  controller.getProducts = function(id){
    mainAsset.openModal('#productsModal');
    requestHelper.get($scope.apiUrl + '/' + id + '/products', $scope, function(){

    });
  };

});
