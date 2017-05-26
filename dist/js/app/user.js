angular.module("assetAdminPanel").controller('userCtrl',
  function($scope,$http,$cookieStore,mainAsset, requestHelper, pagination){

  var controller = this;
  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');

  $scope.apiUrl = mainAsset.getUrl() + "user";
  controller.getUrl = pagination.makeUrl($scope)

  this.makeUrl = function() {
    return pagination.makeUrl($scope, {
      'first_name__contains': this.firstNameSearch,
      'last_name__contains': this.lastNameSearch,
      'card_no__contains': this.cardNoSearch,
      'sort': this.sortOrder + this.sortType
    })
  }

  $scope.reset = function() {
    $scope.load = false;
    $scope.loadModal = false;
    $scope.editMode = false;
  }
  $scope.reset()

  this.getData = function() {
    requestHelper.get(
      controller.getUrl, $scope,
      function(response) {
        $scope.meta = response.data.meta;
        controller.note = response.data.users;
      });
  };
  this.getData();

  this.getFilteredData = function() {
    $scope.page = 1;
    controller.getUrl = controller.makeUrl();
    this.getData();
  };

  this.getObject = function(id) {
    $scope.toEditId = id;
    $scope.editMode = true;
    mainAsset.openModal('#userModal');

    requestHelper.get(
      $scope.apiUrl + "/" + id,  $scope,
      function(response) {
        controller.obj = response.data
      });
  };

  this.deleteObject = function(id) {
    requestHelper.delete(
      $scope.apiUrl + "/" + id,  $scope,
      function(response) {
        controller.getData();
        $('#deleteModal').modal('hide');
      });
  };

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

  $scope.pageSet = function(mode) {
    if (!$scope.pagination(mode)) {
      $scope.page = pagination.pageSet(mode, $scope.page, $scope.meta);
      controller.getUrl = controller.makeUrl();
      controller.getData();
    };
  };

  $scope.pagination = function(status) {
    return pagination.pagination(status, $scope.meta);
  };
});
