angular.module("assetAdminPanel").controller('mywarehouseCtrl',
  function($scope, $localStorage, requestHelper, mainAsset, crud, $routeParams){

    var controller = this;
    $scope.assetData = $localStorage.assetData;
    controller.pageType = 0;
    controller.warehouseFilter = -1;
    if($routeParams.pageType){
      controller.pageType = $routeParams.pageType; 
      if ($scope.assetData.warehouse_under_management) {
        controller.warehouseFilter = $scope.assetData.warehouse_under_management.id;
      } 
      console.log('To Do')
    }
    else{
      controller.warehouse = $scope.assetData.warehouse_under_management;
    }

    crud.initModals($scope, controller)
    crud.init($scope, controller, '', controller.objConfig)

    this.selectWareHouseModal = function(){
      controller.tmp.searchQuery = '';
      mainAsset.openModal('#warehouseModal');
      controller.search('warehouse', 'title');
    }
    
    this.selectWarehouse = function(obj){
      controller.warehouse = obj;
      mainAsset.closeModal('#warehouseModal');
    }

});
