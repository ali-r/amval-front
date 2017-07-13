angular.module("assetAdminPanel").controller('productCtrl',
  function($scope, mainAsset, requestHelper, pagination, crud) {

  var controller = this;
  var apiName = 'product';

  controller.searchObject = [
    {'fname' : 'شماره سریال', 'field' : 'serial_number'},
    {'fname' : 'مدل کالا', 'field' : 'model'},
    {'fname' : 'شماره کارت', 'field' : 'card_no'}
  ];

  $scope.page = 1;

  $scope.apiUrl = mainAsset.getUrl() + apiName;
  $scope.getUrl = pagination.makeUrl($scope)

  controller.objConfig = function (obj) {
    if (obj.warehouse)
      obj.warehouse = obj.warehouse.id;
    return obj;
  };

  crud.initModals($scope, controller, apiName)
  crud.init($scope, controller, apiName, controller.objConfig)
  pagination.initPagination($scope, controller)

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
        controller.obj.scanned_signature = data.file_url;
      });
    }
  }

});
