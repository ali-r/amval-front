angular.module("assetAdminPanel").controller('userCtrl',
  function($scope, mainAsset, requestHelper, crud) {

  var controller = this;
  var apiName = 'user';
  
  $scope.uploadUrl = mainAsset.getUploadUrl();

  controller.searchObject = [
    {'fname' : 'نام', 'field' : 'first_name'},
    {'fname' : 'نام خانوادگی', 'field' : 'last_name'},
    {'fname' : 'شماره کارت', 'field' : 'card_no'}
  ];

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
      {fa:'عنوان',en:'title'},
      {fa:'محل',en:'location'}
    ]
  };

  $scope.page = 1;

  $scope.apiUrl = mainAsset.getUrl() + apiName;

  controller.objConfig = function (obj) {
    if (obj.warehouse)
      obj.warehouse = obj.warehouse.id;

    if (obj.warehouse_under_management && obj.clearance_level == 1)
      {obj.warehouse_under_management = obj.warehouse_under_management.id;}
      else{
        delete obj.warehouse_under_management;
      }


    return obj;
  };

  crud.initModals($scope, controller, apiName)
  crud.init($scope, controller, apiName, controller.objConfig)
  
  this.resetPass = function(id) {
    requestHelper.put(
      $scope.apiUrl + '/' + id + '/password', {'new_password': controller.passToReset}, $scope,
      function(response) {
        $('#resetPassModal').modal('hide');
      });
  };

  this.openResetPassModal = function(id) {
    controller.toResetPassId = id;
    controller.passToReset = null;
    controller.passToResetConf = '';
    $scope.resetPassForm.pass.$pristine = true;
    mainAsset.openModal('#resetPassModal');
  };

  controller.obj.scanned_signature = '';
  this.uploadPic = function() {
    console.log($scope.userForm.file.$error)
    if(!$scope.userForm.file.$error.maxSize && controller.sigFile)
    {
      requestHelper.uploadFileReq(controller.sigFile, 'signature', $scope, function(data){
        controller.obj.scanned_signature = mainAsset.getUploadUrl()+data.file_url;
      });
    }
  }

  controller.selectWareHouse = function() {
    $scope.stage = 1;
    controller.tmp.searchQuery = '';
    controller.search('warehouse','title');
  }
});
