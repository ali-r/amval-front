angular.module("assetAdminPanel").controller('transactionCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, pagination, crud, ADMdtpConvertor) {

  var controller = this;
  var apiName = 'transaction';

  controller.searchObject = [
    {'fname' : 'نام', 'field' : 'first_name'},
    {'fname' : 'شماره موبایل', 'field' : 'cellphone'}
  ];

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');

  $scope.apiUrl = mainAsset.getUrl() + apiName;
  $scope.getUrl = pagination.makeUrl($scope);

  controller.obj = {}
  controller.trConfig = function(obj){
    var finalObj = angular.copy(obj);
    finalObj.transaction_type = parseInt(obj.transaction_type);
    finalObj.reason = parseInt(obj.reason);
    finalObj.product = obj.product.id;
    delete(finalObj.time);
    delete(finalObj.destination.obj);
    return(finalObj);
  }
  controller.trGetConfig = function(obj){
    obj.time = controller.toJalaliDate(obj.time);
    obj.reason = obj.reason +'';
    obj.transaction_type = obj.transaction_type+'';
    return(obj);
  }
  crud.initModals($scope, controller, apiName, [
   
  ]);
  crud.init($scope, controller, apiName, controller.trConfig, controller.trGetConfig);
  pagination.initPagination($scope, controller, 'meta', 'page', 'getUrl', 'searchObject', 'searchValue');

  controller.toGregorianDate = function(pDate){
    var dateArray = pDate.split('-');
    var gDate = ADMdtpConvertor.toGregorian(Number(dateArray[0]), Number(dateArray[1]), Number(dateArray[2]));
    return (gDate.year + '-' + gDate.month + '-' + gDate.day);
  }

  controller.toJalaliDate = function(pDate){
    var dateArray = pDate.split('-');
    var gDate = ADMdtpConvertor.toJalali(Number(dateArray[0]), Number(dateArray[1]), Number(dateArray[2]));
    return (gDate.year + '-' + gDate.month + '-' + gDate.day);
  }

  controller.addProduct = function(list){
    controller.obj.product = list;
    $scope.stage = 0;
  };

  controller.addDestination = function(type_,item){
    controller.obj.destination = {
      type: type_,
      id: item.id,
      obj:{}
    }
    if(item.last_name){controller.obj.destination.obj['last_name']=item.last_name;}
    else{controller.obj.destination.obj['title']=item.title;}
    $scope.stage = 0;
  };


});
