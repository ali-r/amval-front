angular.module("assetAdminPanel").controller('ticketCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, crud, ADMdtpConvertor, $routeParams) {

  var controller = this;
  var apiName = 'ticket';
  controller.searchObject = [
    {'fname' : 'عنوان', 'field' : 'title'},
  ];

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');
  controller.obj = {};
  controller.tmp = {};
  controller.addOne={};
  controller.addOne.extra={};
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
      {fa:'مدل کالا',en:'model'},
      {fa:'شماره سریال',en:'serial_number'}
    ],
    searchFilter : {
      key: 'use_case',
      value: '0'
    }
  }
  controller.selectTransactionObj = {
    title : { fa : 'تراکنش', en : 'transaction'},
    searchItem : {
      fa : 'تراکنش',
      en : 'transaction'
    },
    searchAt : {
      fa : 'مدل کالای',
      en : 'product.model'
    },
    table : [
      {fa:'مدل کالا',en:'product',filter:'productName'},
      {fa:'منبع',en:'source',filter:'userOrWarehouseName'},
      {fa:'مقصد',en:'destination',filter:'userOrWarehouseName'},
      {fa:'علت تراکنش',en:'reason',filter:'reasonType'},
      {fa:'نوع تراکنش',en:'transaction_type',filter:'transactionType'}
    ]
  }
  controller.selectDestinationObj = {
    title : { fa : 'انبار مقصد', en : 'to_warehouse'},
    searchItem : {
      fa : 'انبار',
      en : 'warehouse'
    },
    searchAt : {
      fa : 'نام',
      en : 'title'
    },
    table : [
      {fa:'نام انبار',en:'title'},
      {fa:'محل',en:'location'}
      ]
  }
  controller.paginationConfig = {
    'addOne' : controller.addOne
  }



  $scope.apiUrl = mainAsset.getUrl() + apiName;
  controller.relateWarehouseId = $routeParams.id;
  
  controller.objConfig = function(obj){
    var outObj = angular.copy(obj);
    console.log($scope.editMode);
    if($scope.editMode){ //config object for editing

    }
    else{ //config object for creating
      outObj.product = outObj.product.id;
      outObj.from_warehouse = controller.relateWarehouseId;
      
      if(outObj.transaction) outObj.transaction = outObj.transaction.id;
      else delete outObj['transaction'];

      if(!outObj.to_warehouse || outObj.to_warehouse=="" || !outObj.allowedSource){
        delete outObj['to_warehouse'];
      }
      else{ outObj['to_warehouse'] = outObj.to_warehouse.id;}
      
      outObj.reason = parseInt(outObj.reason);
      outObj.ticket_type = parseInt(outObj.ticket_type);
      delete outObj['allowedSource'];
    }
    return outObj;
  }
  controller.getConfig = function(obj){
    obj.reason = obj.reason + '';
    obj.ticket_type = obj.ticket_type + '';
    return obj;
  }

  crud.initModals($scope, controller, apiName, []);
  crud.init($scope, controller, apiName, controller.objConfig, controller.getConfig);
  controller.obj.allowedSource = false;
  controller.addProduct = function(list){
    controller.obj.product = list;
    $scope.stage = 0;
  };
  
  controller.setSourceType = function(){
    var url = assetPanelData.serverUrl + 'warehouse/'+controller.relateWarehouseId;
    requestHelper.get(
      url,$scope,
      function(response){
        if(response.data.parent_warehouse){controller.obj.allowedSource = false;}
        else{controller.obj.allowedSource = true;}
    },true);
  }
  controller.setSourceType();

  controller.addMessage = function(){
    var url = assetPanelData.serverUrl + apiName+'/' + controller.obj.id + '/message';
    console.log(url);
    var sendObj = {
      text : controller.tmp.text
    };
    console.log(sendObj)
    requestHelper.put(url,sendObj,$scope,
      function(response){
        controller.obj = controller.getConfig(response.data);
        console.log(response.data);
        delete controller.tmp['text'];
        controller.getObject(controller.obj.id)
      });

  }

});
