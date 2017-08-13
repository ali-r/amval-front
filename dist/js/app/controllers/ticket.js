angular.module("assetAdminPanel").controller('ticketCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, crud, ADMdtpConvertor, $routeParams) {

  var controller = this;
  var apiName = 'ticket';
  controller.searchObject = [
    // just title here
  ];

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');
  controller.obj = {}
  controller.addOne={};
  controller.addOne.extra={};

  controller.paginationConfig = {
    'addOne' : controller.addOne
  }

  $scope.apiUrl = mainAsset.getUrl() + apiName;
  controller.relateWarehouseId = $routeParams.id;

  crud.initModals($scope, controller, apiName, []);
  crud.init($scope, controller, apiName);

  controller.addProduct = function(list){
    controller.obj.product = list;
    $scope.stage = 0;
  };
  
});
