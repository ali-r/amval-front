angular.module("assetAdminPanel").controller('transactionCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, crud, ADMdtpConvertor) {

  var controller = this;
  var apiName = 'transaction';
  controller.searchObject = [];

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');
  controller.obj = {}
  controller.addOne={};
  controller.addOne.extra={};
  controller.addOne.extra.reason = '';
  controller.addOne.extra.transaction_type = '';
  controller.addOne.extra.time__gte = '';
  controller.addOne.extra.time__lte = '';

  controller.paginationConfig = {
    'addOne' : controller.addOne
  }

  $scope.apiUrl = mainAsset.getUrl() + apiName;

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

  controller.toGregorianDate = function(pDate,date_included,time_included){
    if(!pDate){return '';}

    if(date_included && time_included){
      var dateTimeSplitted = pDate.split(' ');
      console.log(dateTimeSplitted);
      var dateArray = dateTimeSplitted[1].split('-');
      var gDate = ADMdtpConvertor.toGregorian(Number(dateArray[0]), Number(dateArray[1]), Number(dateArray[2]));
      console.log(gDate.year + '-' + gDate.month + '-' + gDate.day+'T'+dateTimeSplitted[0]);
      return (gDate.year + '-' + gDate.month + '-' + gDate.day+'T'+dateTimeSplitted[0]+':00');
    }
    else if(date_included){
      var dateArray = pDate.split('-');
      var gDate = ADMdtpConvertor.toGregorian(Number(dateArray[0]), Number(dateArray[1]), Number(dateArray[2]));
      return (gDate.year + '-' + gDate.month + '-' + gDate.day);  
    }
    else{
      return pDate;
    }
    
  }

  controller.toJalaliDate = function(pDate){
    if(!pDate){return '';}
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

  controller.getFilteredData = function(){

    var editedObj = angular.copy(controller.addOne);

    if(editedObj.extra.reason){editedObj.extra.reason = parseInt(controller.addOne.extra.reason);}
    if(editedObj.extra.transaction_type){editedObj.extra.transaction_type = parseInt(controller.addOne.extra.transaction_type);}
    if(editedObj.extra.time__gte){
      editedObj.extra.time__gte = controller.toGregorianDate(controller.addOne.extra.time__gte,true,true);
    }
    else{editedObj.extra.time__gte=""}
    if(editedObj.extra.time__lte){
      editedObj.extra.time__lte = controller.toGregorianDate(controller.addOne.extra.time__lte,true,true);
    }
    else{editedObj.extra.time__lte=""}
    $scope.page = 1;
    controller.paginationConfig.addOne = editedObj;
    $scope.getUrl = controller.makeUrl($scope.page, controller.paginationConfig);
    controller.getData();
  }
  
});
