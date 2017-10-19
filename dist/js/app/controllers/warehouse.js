angular.module("assetAdminPanel").controller('warehouseCtrl',
  function($scope, mainAsset, requestHelper, crud, $routeParams) {

  var controller = this;
  var apiName = 'warehouse';

  controller.searchObject = [
    {'fname' : 'انبار', 'field' : 'title'}
  ];


  $scope.productShow = false;

  $scope.page = 1;

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
    controller.search('user');
  };

  controller.getProducts = function(page){
    $scope.loadSide = true;
    var getUrl = controller.makeUrl(page, controller.productPageConf);
    requestHelper.get(getUrl, $scope, function(response){
      mainAsset.log(response.data)
      controller.products = response.data.products;
      controller.productsMeta = response.data.meta;
      controller.productsPage = response.data.meta.page;
      if(response.data.total_price) $scope.products_total_price = response.data.total_price;
      else delete $scope['products_total_price']
      $scope.loadSide = false;
    });
  };

  controller.productPageConf = {
    getFunc : controller.getProducts,
    searchOpt : {}
  };

  controller.openSide = function(obj){
    $scope.wareHouseId = obj.id;
    controller.productPageConf.searchOpt = {};
    controller.productPageConf.searchOpt.product_filter = "0";
    $scope.selectedWarehouse = obj.title;
    controller.productPageConf.url = $scope.apiUrl + '/' + $scope.wareHouseId + '/products';
    $scope.productShow = true;
    controller.getProducts();
  }

  $scope.closeSide = function(){
    $scope.productShow = false; 
    $scope.wareHouseId='';
  }

  if($routeParams.warehouse_id){
    controller.getObject($routeParams.warehouse_id);
  }
});
