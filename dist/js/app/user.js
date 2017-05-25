angular.module("assetAdminPanel").controller('userCtrl', function($scope,$http,$cookieStore,mainAsset, requestHelper){

  var controller = this;
  $scope.assetData = $cookieStore.get('assetData');
  $scope.page = 1;
  this.perPage = 10;
  this.firstNameSearch = "";
  this.lastNameSearch = "";
  this.cardNoSearch = "";
  this.sortType = "";
  this.sortOrder = "";
  $scope.load = false;
  $scope.editMode = false;
  $scope.loadModal = false;

  $scope.serverUrl = mainAsset.getUrl();
  $scope.apiUrl = mainAsset.getUrl() + "user";
  this.getUrl = $scope.serverUrl + "user?page=1&per_page=10";
  $scope.header = {'Content-Type': 'application/json; charset=UTF-8','Access-Token':$scope.assetData.access_token};

  this.makeUrl = function(){
    var url = this.getUrl = $scope.serverUrl + "user?page=" + $scope.page + "&per_page=" + controller.perPage;
    if (controller.firstNameSearch !== "") {
      url += "&first_name__contains=" + controller.firstNameSearch;
    }
    if (controller.lastNameSearch !== "") {
      url += "&last_name__contains=" + controller.lastNameSearch;
    }
    if (controller.cardNoSearch !== "") {
      url += "&card_no__contains=" + controller.cardNoSearch;
    }
    if (controller.sortType !== "") {
      url += "&sort=" + controller.sortOrder + controller.sortType;
    }
    return url;
  }

  $scope.reset = function(){

    $scope.load = false;
    $scope.loadModal = false;
    $scope.editMode = false;

  }

  this.openModal = function (modal) {
    $(modal).modal({
        backdrop: 'static',
        keyboard: false
      });
    $(modal).modal('show');
  }

  this.getData = function(){
    NProgress.start();
    $scope.load = true;
    $http.get(controller.getUrl,{headers: $scope.header})
    .then(function successCallback(response) {
        $scope.meta = response.data.meta;
        controller.note = response.data.users;
        NProgress.done();
        $scope.load = false;
      }, function errorCallback(response) {
        NProgress.done();
        $scope.load = false;
    });
  };

  this.getData();

  this.getObject = function(id){
    $scope.toEditId = id;
    $scope.editMode = true;
    $scope.loadModal = true;
    controller.openModal('#userModal');

    requestHelper.get(
      $scope.apiUrl + "/" + id,  $scope,
      function(response) {
        console.log(response.data);
        controller.obj = response.data
        $scope.loadModal = false;
      });
  };

  this.deleteObject = function(id){
    requestHelper.delete(
      $scope.apiUrl + "/" + id,  $scope,
      function(response) {
        controller.getData();
        $('#deleteModal').modal('hide');
      });
  };

  this.getOptionChange = function(){
    $scope.page = 1;
    controller.getUrl = controller.makeUrl();
    this.getData();
  };

  this.resetPass = function(id){
    $scope.loadModal = true;
    $http.put($scope.serverUrl + 'user/' + id + '/password' , {'new_password':controller.passToReset},{headers: $scope.header})
    .then(function successCallback(response) {
      $('#resetPassModal').modal('hide');
      $scope.loadModal = false;
      new PNotify({
      title: 'موفق',
      text: 'تغییر کلمه عبور با موفقیت انجام شد',
      type: 'success'
      });

    }, function errorCallback(response) {
      $scope.loadModal = false;
      new PNotify({
      title: 'خطا',
      text: 'عملیات موفقیت آمیز نبود',
      type: 'error'
      });
    });
  }

  this.openResetPassModal = function(id)
  {
    controller.toResetPassId = id;
    controller.passToReset = null;
    $scope.resetPassForm.pass.$pristine = true;
    controller.openModal('#resetPassModal');
  };

  $scope.pageSet = function(mode){
    if (!$scope.pagination(mode)) {
      $scope.page = mainAsset.pageSet(mode,$scope.page,$scope.meta);
      this.getUrl = controller.makeUrl();
      controller.getData();
    };
    };

  $scope.pagination = function(status){
    return mainAsset.pagination(status,$scope.meta);
  };
});
