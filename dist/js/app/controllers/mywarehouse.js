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

    $scope.reset();

    $scope.assetData = $localStorage.assetData;
    controller.pageType = 0;
    controller.warehouseFilter = -1;
    $scope.tabStage = 1;

    if($routeParams.pageType){
      controller.pageType = $routeParams.pageType; 
      if ($scope.assetData.warehouse_under_management) {
        controller.warehouseFilter = $scope.assetData.warehouse_under_management.id;
      } 
    }
    else{
      controller.warehouse = $scope.assetData.warehouse_under_management;
    }


    this.selectWareHouseModal = function(){
      controller.tmp.searchQuery = '';
      mainAsset.openModal('#warehouseModal');
      controller.search('warehouse');
    }
    
    this.selectWarehouse = function(obj){
      controller.warehouse = obj;
      mainAsset.closeModal('#warehouseModal');
      $routeParams.id = obj.id;
      setTimeout(
        function () {
          $('#myTabs a').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
          })
          $('#myTabs a:first').tab('show') 
        },500);
      
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

});
