angular.module("assetAdminPanel").controller('userCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, pagination, crud) {

  var controller = this;

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');

  $scope.apiUrl = mainAsset.getUrl() + "user";
  controller.getUrl = pagination.makeUrl($scope)

  this.makeUrl = function() {
    return pagination.makeUrl($scope, {
      'first_name__contains': controller.firstNameSearch,
      'last_name__contains': controller.lastNameSearch,
      'card_no__contains': controller.cardNoSearch,
      'sort': controller.sortOrder + this.sortType
    })
  }

  crud.initModals($scope, controller, 'user')
  crud.init($scope, controller, 'user')
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
});
