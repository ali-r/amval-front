angular.module("assetAdminPanel").controller('transactionCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, crud, ADMdtpConvertor, $routeParams) {

  var controller = this;
  var apiName = 'transaction';
  controller.searchObject = [
    {'fname' : 'شناسه', 'field' : 'unique_id'}
  ];
  
  

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
    obj.datetime = mainAsset.toJalaliDateTime2(obj.datetime,true,false,'jYYYY/jM/jD ساعت H:mm');
    obj.reason = obj.reason +'';
    obj.transaction_type = obj.transaction_type+'';
    return(obj);
  }
  crud.initModals($scope, controller, apiName, [
   
  ]);
  crud.init($scope, controller, apiName, controller.trConfig, controller.trGetConfig);

  controller.addProduct = function(list){
    controller.obj.product = list;
    $scope.stage = 0;
  };

  controller.addDestination = function(type_){
    var item = controller.obj.destination;
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
      else ex.datetime__gte = mainAsset.toGregorianDateTime2(ex.datetime__gte,true,'HH:mm jYYYY-jM-jD');
    }

    if(ex.datetime__lte){
      if(ex.datetime__lte=="") delete ex['datetime__lte']; 
      else ex.datetime__lte = mainAsset.toGregorianDateTime2(ex.datetime__lte,true,'HH:mm jYYYY-jM-jD');
    }

    if(ex.product) ex.product = ex.product.id;

    if(ex.auth_by) ex.auth_by = ex.auth_by.id;

    if(ex.source) ex.source = ex.source.id;
    delete ex['source_type'];
    if(ex.destination) ex.destination = ex.destination.id;
    delete ex['destination_type'];
    
    $scope.page = 1;
    $scope.$$childHead.page = 1;
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
        controller.obj.product = response.data.data;
        controller.obj.holder = controller.obj.product.holder;
        $scope.loadModal = false;
    });
    requestHelper.get(
      mainAsset.getUrl() + 'warehouse/'+$routeParams.destination_id
      , $scope,
      function(response) {
        controller.obj.destination = {
          type: 'Warehouse',
          obj: response.data.data
        };
        $scope.loadModal = false;
    });
  }

  controller.searchDestinationWithPagination = function(page,obj_){
    if(controller.obj.product){
      obj_.pageConfig.searchOpt.destination_for = controller.obj.product.id;
      controller.searchWithPagination(page,obj_);
    }
    else{
      obj_.pageConfig.searchOpt.destination_for = "-1";      
      new PNotify({
        title: 'اخطار',
        text: 'ابتدا کالا را انتخاب نمایید!',
        type: 'warn',
      });
      $scope.stage = 0;
    }

  }
  
  controller.selectProductObj = {
    title : { fa : 'کالا', en : 'product'},
    searchItem : {
      fa : 'کالا',
      en : 'product'
    },
    searchAt : {
      fa : 'نام',
      en : 'subgroup'
    },
    table : [
      {fa:'نام',en:'name'},
      {fa:'شماره سریال کارخانه',en:'serial_number'}
    ],
    searchFilter:{
      key: 'use_case',
      value: '1'
    },
    pageConfig: {
      url: mainAsset.getUrl()+'product',
      getFunc: controller.searchWithPagination,
      cat: 'product',
      searchOpt: {
        'use_case': '1',
        'text_search': '',
      }
    },
    searchResult:[],
    searchMeta:{},
    searchPage: 1,
    searchQuery: '',
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
    ],
    pageConfig: {
      url: mainAsset.getUrl()+'user',
      getFunc: controller.searchWithPagination,
      cat: 'user',
      searchOpt: {
        'text_search': '',
      }
    },
    searchResult:[],
    searchMeta:{},
    searchPage: 1,
    searchQuery: '',
  }

  controller.selectUserDestinationForObj = {
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
    ],
    pageConfig: {
      url: mainAsset.getUrl()+'user',
      getFunc: controller.searchDestinationWithPagination,
      cat: 'user',
      searchOpt: {
        'text_search': '',
      }
    },
    searchResult:[],
    searchMeta:{},
    searchPage: 1,
    searchQuery: '',
  }
  controller.selectUserDestinationObj = angular.copy(controller.selectUserDestinationForObj);
  controller.selectUserDestinationObj.pageConfig.getFunc = controller.searchWithPagination;

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
    ],
    pageConfig: {
      url: mainAsset.getUrl()+'warehouse',
      getFunc: controller.searchWithPagination,
      cat: 'warehouse',
      searchOpt: {
        'text_search': '',
      }
    },
    searchResult:[],
    searchMeta:{},
    searchPage: 1,
    searchQuery: '',
  }

  controller.selectWarehouseDestinationForObj = {
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
    ],
    pageConfig: {
      url: mainAsset.getUrl()+'warehouse',
      getFunc: controller.searchDestinationWithPagination,
      cat: 'warehouse',
      searchOpt: {
        'text_search': '',
      }
    },
    searchResult:[],
    searchMeta:{},
    searchPage: 1,
    searchQuery: '',
  }

  controller.selectWarehouseDestinationObj = angular.copy(controller.selectWarehouseDestinationForObj);
  controller.selectWarehouseDestinationObj.pageConfig.getFunc = controller.searchWithPagination;

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
    ],
    pageConfig: {
      url: mainAsset.getUrl()+'user',
      getFunc: controller.searchWithPagination,
      cat: 'user',
      searchOpt: {
        'text_search': '',
      }
    },
    searchResult:[],
    searchMeta:{},
    searchPage: 1,
    searchQuery: '',
  }

});
