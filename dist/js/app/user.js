angular.module("assetAdminPanel").controller('userCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, pagination, crud) {

  var controller = this;
  var apiName = 'user';

  controller.searchObject = [
    {'fname' : 'نام', 'field' : 'first_name'},
    {'fname' : 'نام خانوادگی', 'field' : 'last_name'},
    {'fname' : 'شماره کارت', 'field' : 'card_no'}
  ];

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');

  $scope.apiUrl = mainAsset.getUrl() + apiName;
  $scope.getUrl = pagination.makeUrl($scope)

  this.makeUrl = function() {
    return pagination.makeUrl($scope, controller.searchObject, controller.searchValue)
  }

  controller.objConfig = function (obj) {

    if (obj.warehouse) {
      obj.warehouse = obj.warehouse.id;
    }
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
    $scope.resetPassForm.pass.$pristine = true;
    mainAsset.openModal('#resetPassModal');
  };

  controller.obj.scanned_signature = '';
  this.uploadPic = function() {
    requestHelper.uploadFileReq(controller.sigFile, 'signature', $scope, function(data){
      controller.obj.scanned_signature = data.file_url;
    });
  }
});
