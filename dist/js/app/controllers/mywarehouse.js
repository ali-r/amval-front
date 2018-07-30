angular.module("assetAdminPanel").controller('mywarehouseCtrl',
  function($scope, $localStorage, requestHelper, mainAsset, crud, $routeParams){

    var controller = this;    

    $scope.reset = function() {

      $scope.load = false;
      $scope.loadModal = false;
      $scope.loadSearch = false;
      $scope.editMode = false;
      $scope.uploadPercentage = 0;
      $scope.uploading = false;
      $scope.stage = 0;
      $scope.loadSide = false;

      controller.obj = {};
      controller.tmp = {};
    }

    function setWarehouse(obj) {
      controller.warehouse = obj;
      setTimeout(
        function () {
          $('#myTabs a').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
          })
          $('#myTabs a:first').tab('show') 
          
        },200);
    }
    
    controller.deleteKey = function(obj, key){
      delete obj[key];
    }
    
    $scope.reset();

    $scope.assetData = $localStorage.assetData;
    controller.pageType = 0;
    controller.warehouseFilter = -1;
    $scope.tabStage = 0;

    if($routeParams.linked_warehouse){ // comes from warehouse link
      controller.pageType = 2;

      // get linked warehouse by its id
      var url = mainAsset.getUrl() + 'warehouse/' + $routeParams.linked_warehouse;
      requestHelper.get(url,$scope,
      function(response){
        controller.warehouse = response.data.data;
        $localStorage.assetData.warehouse_under_management = controller.warehouse;
        $localStorage.assetData.selectedWarehouse = controller.warehouse;
        setWarehouse($localStorage.assetData.warehouse_under_management);
        $routeParams.id = $routeParams.linked_warehouse; // setting id for usage in ticket page
      })
   
    }
    else if($routeParams.ticket_id && $scope.assetData.warehouse_under_management){ //directing to unread ticket notification
      setWarehouse($scope.assetData.warehouse_under_management);
      controller.pageType = 0;
      $scope.tabStage = 1;
    }
    else if($routeParams.pageType){ // not my_warehouse
      controller.pageType = $routeParams.pageType; 

      if ($scope.assetData.warehouse_under_management) { //filter warehouse under management in select warehouse modal
        controller.warehouseFilter = $scope.assetData.warehouse_under_management.id;
      }

      if($localStorage.assetData.selectedWarehouse){  // a warehouse has been selected previously
        $routeParams.id = $localStorage.assetData.selectedWarehouse.id; // setting id for usage in ticket page
        setWarehouse($localStorage.assetData.selectedWarehouse);
      }
      else{
        controller.deleteKey(controller, 'warehouse');
      }
    }
    else{ // my_warehouse page
      if($scope.assetData.warehouse_under_management){
        setWarehouse($scope.assetData.warehouse_under_management);
      }
      else{
        controller.pageType = 2;
        $scope.tabStage = 0;
      }
    }

    controller.ctrlList = [
      {'src':'' ,'name':''},
      {'src':'../dist/templates/ticket.html' ,'ctrl':'ticketCtrl as ticket'},
      {'src':'../dist/templates/transaction.html' ,'ctrl':'transactionCtrl as transaction'},
      {'src':'../dist/templates/product.html' ,'ctrl':'productCtrl as product'},
      {'src':'../dist/templates/user.html' ,'ctrl':'userCtrl as user'}
    ];

    crud.init($scope, controller);
    
    controller.search = function(cat, field,filter){
      var filterSection = '';
      if(!!filter && !!filter.key && !!filter.value){
        filterSection = '&' + filter.key + '=' + filter.value;
      }
      $scope.loadSearch = true;
      var searchUrl = mainAsset.getUrl() + cat;
      if(field){
        if(field.indexOf('?') == -1 && field != ''){
          searchUrl += '?' + field  + filterSection;
        }else{
          searchUrl += field + filterSection;
        }
      }
      else{
        searchUrl += '?' + filterSection;
      }

      if(controller.tmp.searchQuery && controller.tmp.searchQuery!=''){
        searchUrl += '&text_search='+ controller.tmp.searchQuery;        
      }
      
      mainAsset.log(searchUrl);
      requestHelper.get(
        searchUrl, $scope,
        function(response) {
          controller.tmp.searchResult = response.data.data[cat + 's'];
          $scope.loadSearch = false;
        });
    };

    controller.deleteWarehouse = function(){
      controller.deleteKey(controller, 'warehouse');
      $localStorage.assetData.selectedWarehouse = null;
    };

    controller.getWarehouses = function(page){
      $scope.loadSearch = true;
      controller.warehousePageConf.searchOpt.text_search = controller.tmp.searchQuery;
      var getUrl = controller.makeUrl(page, controller.warehousePageConf);

      requestHelper.get(getUrl, $scope, function(response){
        mainAsset.log(response.data.data)
        controller.tmp.searchResult = response.data.data.warehouses;
        controller.warehousesMeta = response.data.meta;
        controller.warehousesPage = response.data.meta.page;
        $scope.loadSearch = false;
      });
    };
  
    controller.warehousePageConf = {
      getFunc : controller.getWarehouses,
      url: mainAsset.getUrl()+ '/warehouse',
      searchOpt : {
        'text_search': ''
      }
    };

    this.selectWareHouseModal = function(){
      controller.tmp.searchQuery = '';
      mainAsset.openModal('#warehouseModal');
      controller.getWarehouses(1);
    }

    
    this.selectWarehouse = function(obj){
      mainAsset.closeModal('#warehouseModal');
      $routeParams.id = obj.id;
      $localStorage.assetData.selectedWarehouse = obj;
      setWarehouse(obj);
    }


});
