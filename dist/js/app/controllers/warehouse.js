angular.module("assetAdminPanel").controller('warehouseCtrl',
  function($scope, mainAsset, requestHelper, crud, $routeParams, $location, $localStorage) {

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

  controller.getProducts = function(page){
    $scope.loadSide = true;
    var getUrl = controller.makeUrl(page, controller.productPageConf);
    requestHelper.get(getUrl, $scope, function(response){
      mainAsset.log(response.data.data)
      controller.products = response.data.data.products;
      controller.productsMeta = response.data.meta;
      controller.productsPage = response.data.meta.page;
      if(response.data.data.total_price) $scope.products_total_price = response.data.data.total_price;
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

  controller.openMywarehouse= function(_id){
    $location.url('/mywarehouse?linked_warehouse='+_id+'&pageType=2');
    
  }

  controller.afterDelete = function(_id){
    if($localStorage.assetData.selectedWarehouse.id == _id)
      $localStorage.assetData.selectedWarehouse = null;
  }

  controller.selectUserObj = {
    title : { fa : 'کاربر', en : 'user'},
    searchItem : {
      fa : 'کاربر',
      en : 'user'
    },
    searchAt : {
      fa : 'نام خانوادگی',
      en : 'last_name'
    },
    table : [
      {fa:'نام',en:'first_name'},
      {fa:'نام خانوادگی',en:'last_name'},
      {fa:'شماره کارت',en:'card_no'},
      {fa:'نوع کاربری',en:'clearance_level',filter:'userType'}
    ],
    pageConfig: {
      url: mainAsset.getUrl()+'user',
      getFunc: controller.searchWithPagination,
      cat: 'user',
      searchOpt: {
        'text_search': '',
      }
    },
    searchResult:[],
    searchMeta:{},
    searchPage: 1,
    searchQuery: '',
  }

});
