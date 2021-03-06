angular.module("assetAdminPanel").controller('userCtrl',
  function($scope, mainAsset, requestHelper, crud, $routeParams) {

  var controller = this;
  var apiName = 'user';
  
  $scope.uploadUrl = mainAsset.getUploadUrl();

  controller.searchObject = [
    {'fname' : 'نام', 'field' : 'first_name'},
    {'fname' : 'نام خانوادگی', 'field' : 'last_name'},
    {'fname' : 'شماره کارت', 'field' : 'card_no'}
  ];

  

  $scope.page = 1;

  $scope.apiUrl = mainAsset.getUrl() + apiName;
  controller.relateWarehouseId = $routeParams.id;

  controller.objConfig = function (obj) {
    sendCopyObj = angular.copy(obj);

    if (sendCopyObj.warehouse)
      sendCopyObj.warehouse = sendCopyObj.warehouse.id;

    if (sendCopyObj.warehouse_under_management && sendCopyObj.clearance_level == 1)
      {sendCopyObj.warehouse_under_management = sendCopyObj.warehouse_under_management.id;}
      else{
        delete sendCopyObj.warehouse_under_management;
      }

    if (sendCopyObj.clearance_level == 0) {
      delete sendCopyObj.password      
    }
    
    delete sendCopyObj.products;
    
    if(sendCopyObj.extension_number && sendCopyObj.extension_number=="")
      delete sendCopyObj.extension_number

    return sendCopyObj;
  };

  crud.initModals($scope, controller, apiName)
  crud.init($scope, controller, apiName, controller.objConfig)
  
  this.resetPass = function(id) {
    $scope.loadModal = true;
    requestHelper.put(
      $scope.apiUrl + '/' + id + '/password', {'new_password': controller.passToReset}, $scope,
      function(response) {
        $('#resetPassModal').modal('hide');
        $scope.loadModal = false;
      });
  };

  mainAsset.log($scope)
  this.openResetPassModal = function(id) {
    controller.toResetPassId = id;
    controller.passToReset = null;
    controller.passToResetConf = '';

    if($scope.resetPassForm){
      $scope.resetPassForm.pass.$pristine = true;
    }
    
    mainAsset.openModal('#resetPassModal');
  };

  controller.obj.scanned_signature = '';
  this.uploadPic = function() {
    mainAsset.log($scope.userForm.file.$error)
    if(!$scope.userForm.file.$error.maxSize && controller.sigFile)
    {
      requestHelper.uploadFileReq(controller.sigFile, 'signature', $scope, function(data){
        controller.obj.scanned_signature = data.data.file_url;
      });
    }
  }

  controller.selectWarehouseUnderManagementObj = {
    title : { fa : 'انبار تحت مدیریت', en : 'warehouse_under_management'},
    searchItem : {
      fa : 'انبار',
      en : 'warehouse'
    },
    searchAt : {
      fa : 'عنوان',
      en : 'title'
    },
    table : [
      {fa:'نام انبار',en:'title'},
      {fa:'محل',en:'location'}
    ],
    searchFilter: {key:'parent_warehouse__ne',value:'None'},
    pageConfig: {
      url: mainAsset.getUrl()+'warehouse',
      getFunc: controller.searchWithPagination,
      cat: 'warehouse',
      searchOpt: {
        'parent_warehouse__ne': 'None',
        'text_search': '',
      }
    },
    searchResult:[],
    searchMeta:{},
    searchPage: 1,
    searchQuery: '',
  };

  controller.selectRefrenceWarehouseObj = {
    title : { fa : 'انبار مرجع تحویل کالا', en : 'warehouse'},
    searchItem : {
      fa : 'انبار',
      en : 'warehouse'
    },
    searchAt : {
      fa : 'عنوان',
      en : 'title'
    },
    table : [
      {fa:'نام انبار',en:'title'},
      {fa:'محل',en:'location'}
    ],
    pageConfig: {
      url: mainAsset.getUrl()+'warehouse',
      getFunc: controller.searchWithPagination,
      cat: 'warehouse',
      searchOpt: {
        'text_search': '',
      }
    },
    searchResult:[],
    searchMeta:{},
    searchPage: 1,
    searchQuery: '',
  };

  controller.selectWareHouse = function() {
    $scope.stage = 1;
    controller.tmp.searchQuery = '';
    controller.search('warehouse');
  }

  if($routeParams.chp_user_id){
    controller.openResetPassModal($routeParams.chp_user_id)
  }
  if($routeParams.user_id){
    controller.getObject($routeParams.user_id)
  }
});
