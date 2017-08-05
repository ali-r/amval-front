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

  controller.getProducts = function(page){
    $scope.loadSide = true;
    var getUrl = controller.makeUrl(page, controller.productPageConf);
    requestHelper.get(getUrl, $scope, function(response){
      controller.products = response.data.products;
      controller.productsMeta = response.data.meta;
      controller.productsPage = response.data.meta.page;
      $scope.loadSide = false;
    });
  };

  controller.productPageConf = {
    getFunc : controller.getProducts
  };

  controller.openSide = function(obj){
    $scope.wareHouseId = obj.id;
    $scope.selectedWarehouse = obj.title;
    controller.productPageConf.url = $scope.apiUrl + '/' + $scope.wareHouseId + '/products';
    $scope.productShow = true;
    controller.getProducts();
  }

  controller.getProductStat = function(id){
    $scope.loadModal = true;
    var getUrl = mainAsset.getUrl() + '/product/' + id + '/stats'
    requestHelper.get(getUrl, $scope, function(response){
      controller.productStat = response.data;
      console.log(controller.productStat)
      $scope.loadModal = false;
    });

  }

  controller.openProductModal = function(goods){
    mainAsset.openModal('#productModal');
    controller.getProductStat(goods.id);
  }

});
