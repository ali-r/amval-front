angular.module("assetAdminPanel").controller('userCtrl', function($scope,$http,mainAsset){

  var controller = this;
  $scope.page = 1;
  this.perPage = 10;
  this.firstNameSearch = "";
  this.lastNameSearch = "";
  this.cardNoSearch = "";
  this.sortType = "";
  this.sortOrder = "";
  $scope.load = false;

  $scope.serverUrl = mainAsset.getUrl();
  this.getUrl = $scope.serverUrl + "user?page=1&per_page=10";
  $scope.header = {'Content-Type': 'application/json; charset=UTF-8'};

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

  this.getOptionChange = function(){
    controller.getUrl = controller.makeUrl();
    this.getData();
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
