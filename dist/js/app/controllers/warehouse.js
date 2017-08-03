angular.module("assetAdminPanel").controller('warehouseCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, crud) {

  var controller = this;
  var apiName = 'warehouse';

  controller.searchObject = [
    {'fname' : 'انبار', 'field' : 'title'}
  ];

  $scope.productShow = false;

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');

  $scope.apiUrl = mainAsset.getUrl() + apiName;

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

  controller.selectUser = function(){
    $scope.stage = 1;
    controller.tmp.searchQuery = '';
    controller.search('user','last_name');
  };

  controller.getProducts = function(id){
    $scope.loadSide = true;
    $scope.productShow = true;
    requestHelper.get($scope.apiUrl + '/' + id + '/products', $scope, function(response){
      controller.products = response.data.products;
      controller.productsMeta = response.data.meta;
      controller.productsPage = response.data.meta.page;
      console.log(controller.productsMeta)
      $scope.loadSide = false;
    });
  };

});
