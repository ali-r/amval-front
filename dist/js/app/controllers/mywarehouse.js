angular.module("assetAdminPanel").controller('mywarehouseCtrl',
  function($scope, $localStorage, requestHelper, mainAsset, crud){

    var controller = this;
    $scope.assetData = $localStorage.assetData;

    if ($scope.assetData.warehouse_under_management) {
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
