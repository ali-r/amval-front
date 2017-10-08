angular.module("assetAdminPanel").controller('transactionCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, crud, ADMdtpConvertor, $routeParams) {

  var controller = this;
  var apiName = 'transaction';
  controller.searchObject = [
    {'fname' : 'شناسه', 'field' : 'unique_id'}
  ];
  controller.selectProductObj = {
    title : { fa : 'کالا', en : 'product'},
    searchItem : {
      fa : 'کالا',
      en : 'product'
    },
    searchAt : {
      fa : 'مدل',
      en : 'model'
    },
    table : [
      {fa:'مدل',en:'model'},
      {fa:'سریال کالا',en:'serial_number'}
    ],
    searchFilter:{
      key: 'use_case',
      value: '1'
    }
  }
  controller.selectUserSourceObj = {
    title : { fa : 'کاربر مبدا', en : 'source'},
    searchItem : {
      fa : 'کاربر',
      en : 'user'
    },
    searchAt : {
      fa : 'نام خانوادگی',
      en : 'last_name'
    },
    table : [
      {fa:'نام',en:'first_name'},
      {fa:'نام خانوادگی',en:'last_name'},
      {fa:'شماره کارت',en:'card_no'},
      {fa:'نوع کاربری',en:'clearance_level',filter:'userType'}
    ]
  }
  controller.selectUserDestinationObj = {
    title : { fa : 'کاربر مقصد', en : 'destination'},
    searchItem : {
      fa : 'کاربر',
      en : 'user'
    },
    searchAt : {
      fa : 'نام خانوادگی',
      en : 'last_name'
    },
    table : [
      {fa:'نام',en:'first_name'},
      {fa:'نام خانوادگی',en:'last_name'},
      {fa:'شماره کارت',en:'card_no'},
      {fa:'نوع کاربری',en:'clearance_level',filter:'userType'}
    ]
  }
  controller.selectWarehouseSourceObj = {
    title : { fa : 'انبار مبدا', en : 'source'},
    searchItem : {
      fa : 'انبار',
      en : 'warehouse'
    },
    searchAt : {
      fa : 'نام',
      en : 'title'
    },
    table : [
      {fa:'نام',en:'title'},
      {fa:'آدرس',en:'location'}
    ]
  }
  controller.selectWarehouseDestinationObj = {
    title : { fa : 'انبار مقصد', en : 'destination'},
    searchItem : {
      fa : 'انبار',
      en : 'warehouse'
    },
    searchAt : {
      fa : 'نام',
      en : 'title'
    },
    table : [
      {fa:'نام',en:'title'},
      {fa:'آدرس',en:'location'}
    ]
  }

  controller.selectAuthorObj = {
    title : { fa : 'کاربر اعمال کننده تراکنش', en : 'auth_by'},
    searchItem : {
      fa : 'کاربر',
      en : 'user'
    },
    searchAt : {
      fa : 'نام خانوادگی',
      en : 'last_name'
    },
    table : [
      {fa:'نام',en:'first_name'},
      {fa:'نام خانوادگی',en:'last_name'},
      {fa:'شماره کارت',en:'card_no'},
      {fa:'نوع کاربری',en:'clearance_level',filter:'userType'}
    ]
  }

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');
  controller.obj = {}
  controller.addOne={};
  controller.addOne.extra={};
  controller.addOne.reportFields={};
  controller.addOne.extra.reason = '';
  controller.addOne.extra.transaction_type = '';
  controller.addOne.extra.time__gte = '';
  controller.addOne.extra.time__lte = '';

  controller.paginationConfig = {
    'addOne' : controller.addOne
  }

  $scope.apiUrl = mainAsset.getUrl() + apiName;
  controller.relateWarehouseId = $routeParams.id;

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
    obj.datetime = mainAsset.toJalaliDate(obj.datetime);
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
    pDate = pDate.split('T');
    console.log(pDate)
    var dateArray = pDate[0].split('-');
    var transactionTime = pDate[1];
    var gDate = ADMdtpConvertor.toJalali(Number(dateArray[0]), Number(dateArray[1]), Number(dateArray[2]));
    var output = gDate.year + '/' + gDate.month + '/' + gDate.day;
    if ( typeof(transactionTime) != 'undefined') {
      output = output + " در ساعت " + transactionTime
    }
    return output;
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
    var ex = editedObj.extra;
    Object.assign(ex,controller.addOne.reportFields);    //merge extra with reportFields
    
    if(ex.reason){ex.reason = parseInt(ex.reason);}
    
    if(ex.transaction_type){ex.transaction_type = parseInt(ex.transaction_type);}
    
    if(ex.datetime__gte){
      if(ex.datetime__gte=="") delete ex['datetime__gte'];
      else ex.datetime__gte = mainAsset.toGregorianDate(ex.datetime__gte);
    }

    if(ex.datetime__lte){
      if(ex.datetime__lte=="") delete ex['datetime__lte']; 
      else ex.datetime__lte = mainAsset.toGregorianDate(ex.datetime__lte);
    }

    if(ex.product) ex.product = ex.product.id;

    if(ex.auth_by) ex.auth_by = ex.auth_by.id;

    if(ex.source) ex.source = ex.source.id;
    delete ex['source_type'];
    if(ex.destination) ex.destination = ex.destination.id;
    delete ex['destination_type'];
    
    $scope.page = 1;
    controller.paginationConfig.addOne = editedObj;
    $scope.getUrl = controller.makeUrl($scope.page, controller.paginationConfig);
    controller.getData();
  }

  if($routeParams.product_id){
    $scope.openModal();
    $scope.loadModal = true;    
    requestHelper.get(
      mainAsset.getUrl() + 'product/'+$routeParams.product_id
      , $scope,
      function(response) {
        controller.obj.product = response.data;
        controller.obj.holder = controller.obj.product.holder;
        $scope.loadModal = false;
    });
    requestHelper.get(
      mainAsset.getUrl() + 'warehouse/'+$routeParams.destination_id
      , $scope,
      function(response) {
        controller.obj.destination = {
          type: 'Warehouse',
          obj: response.data
        };
        $scope.loadModal = false;
    });
  }
  
});
