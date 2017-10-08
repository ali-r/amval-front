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

    $scope.reset();

    $scope.assetData = $localStorage.assetData;
    controller.pageType = 0;
    controller.warehouseFilter = -1;
    $scope.tabStage = 0;

    console.log($scope.assetData)
    if($routeParams.ticket_id && $scope.assetData.warehouse_under_management){
      setWarehouse($scope.assetData.warehouse_under_management);
      controller.pageType = 0;
      $scope.tabStage = 1;
    }
    else if($routeParams.pageType){
      controller.pageType = $routeParams.pageType; 
      if ($scope.assetData.warehouse_under_management) {
        controller.warehouseFilter = $scope.assetData.warehouse_under_management.id;
      }
      if($localStorage.assetData.selectedWarehouse){
        setWarehouse($localStorage.assetData.selectedWarehouse);
      }
    }
    else{
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


    this.selectWareHouseModal = function(){
      controller.tmp.searchQuery = '';
      mainAsset.openModal('#warehouseModal');
      controller.search('warehouse');
    }

    controller.deleteKey = function(obj, key){
      delete obj[key];
    }
    
    this.selectWarehouse = function(obj){
      mainAsset.closeModal('#warehouseModal');
      $routeParams.id = obj.id;
      $localStorage.assetData.selectedWarehouse = obj;
      setWarehouse(obj);
    }

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
      
      console.log(searchUrl);
      requestHelper.get(
        searchUrl, $scope,
        function(response) {
          controller.tmp.searchResult = response.data[cat + 's'];
          $scope.loadSearch = false;
        });
    };

    controller.deleteWarehouse = function(){
      controller.deleteKey(controller, 'warehouse');
      $localStorage.assetData.selectedWarehouse = null;
    };

});
