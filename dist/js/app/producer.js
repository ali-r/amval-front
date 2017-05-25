angular.module("assetAdminPanel").controller('producerCtrl', function($scope,$http,mainAsset){

  var controller = this;
  $scope.page = 1;
  this.perPage = 10;
  $scope.serverUrl = mainAsset.getUrl();
  this.getUrl = $scope.serverUrl + "seller?page=1&per_page=10";
  $scope.header = {'Content-Type': 'application/json; charset=UTF-8'};

  /* sort and change thing */
  this.firstNameSearch = "";
  this.lastNameSearch = "";
  this.storeNameSearch = "";
  this.phoneSearch = "";
  this.cellPhoneSearch = "";
  this.sortType = "";
  this.sortOrder = "";


  $scope.reset = function(){
    $scope.load = false;
    $scope.editMode = false;
    $scope.loadModal = false;

    /* Form Data */
    controller.firstName = "";
    controller.lastName = "";
    controller.storeName = "";
    controller.phone = "";
    controller.cellphone = "";
    controller.address = "";

  };

  $scope.reset();

  this.makeUrl = function(){
    var url = this.getUrl = $scope.serverUrl + "seller?page=" + $scope.page + "&per_page=" + controller.perPage;
    if (controller.firstNameSearch !== "") {
      url += "&first_name__contains=" + controller.firstNameSearch;
    }
    if (controller.lastNameSearch !== "") {
      url += "&last_name__contains=" + controller.lastNameSearch;
    }
    if (controller.storeNameSearch !== "") {
      url += "&store_name__contains=" + controller.storeNameSearch;
    }
    if (controller.phoneSearch !== "") {
      url += "&phone__contains=" + controller.phoneSearch;
    }
    if (controller.cellPhoneSearch !== "") {
      url += "&cellphone__contains=" + controller.cellPhoneSearch;
    }
    if (controller.sortType !== "") {
      url += "&sort=" + controller.sortOrder + controller.sortType;
    }
    return url;
  }

  this.openModal = function(){
    $('#sellerModal').modal({
        backdrop: 'static',
        keyboard: false
      });
    $('#sellerModal').modal('show');
  };

  this.getData = function(){
    NProgress.start();
    $scope.load = true;
    $http.get(controller.getUrl,{headers: $scope.header})
    .then(function successCallback(response) {
        $scope.meta = response.data.meta;
        controller.note = response.data.sellers;
        NProgress.done();
        $scope.load = false;
      }, function errorCallback(response) {
        NProgress.done();
        $scope.load = false;
    });
  };

  this.getData();

  this.getOptionChange = function(){
    $scope.page = 1;
    controller.getUrl = controller.makeUrl();
    this.getData();
  };

  this.getObject = function(id){

    $scope.toEditId = id;
    $scope.editMode = true;
    $scope.loadModal = true;
    controller.openModal();

    $http.get($scope.serverUrl + 'seller/' + id ,{headers: $scope.header})
    .then(function successCallback(response) {

      controller.firstName = response.data.first_name;
      controller.lastName = response.data.last_name;
      controller.storeName = response.data.store_name;
      controller.phone = response.data.phone;
      controller.cellphone = response.data.cellphone;
      controller.address = response.data.address;
      $scope.loadModal = false;

      }, function errorCallback(response) {

      $scope.loadModal = false;
    });
  };

  this.sendOrEdit = function(editMode){
    var sendData = new Object();
    sendData.first_name = controller.firstName;
    sendData.last_name = controller.lastName;
    sendData.store_name = controller.storeName;
    sendData.phone = controller.phone;
    sendData.cellphone = controller.cellphone;
    sendData.address = controller.address;
    /* console.log(sendData);*/
    if(editMode){
      $scope.loadModal = true;
      $http.put($scope.serverUrl + "seller/" + $scope.toEditId  ,sendData,{headers: $scope.header})
      .then(function successCallback(response) {

        $('#sellerModal').modal('hide');
        controller.getData();
        $scope.reset();
        $scope.loadModal = false;

        }, function errorCallback(response) {
        $scope.loadModal = false;
      });

    }else{
      $scope.loadModal = true;
      $http.post($scope.serverUrl + "seller"  ,sendData,{headers: $scope.header})
      .then(function successCallback(response) {
        $('#sellerModal').modal('hide');
        controller.getData();
        $scope.reset();
        $scope.loadModal = false;
        }, function errorCallback(response) {
        $scope.loadModal = false;
      });
    }
  };

  this.deleteObject = function(id){
    $scope.loadModal = true;
    $http.delete($scope.serverUrl + "seller/" + id , {headers: $scope.header})
      .then(function successCallback(response) {
        controller.getData();
        $('#deleteModal').modal('hide');
        $scope.loadModal = false;
      }, function errorCallback(response) {

        $scope.loadModal = false;
      });
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
