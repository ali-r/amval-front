angular.module("assetAdminPanel").controller('ticketCtrl',
  function($scope, $http, $localStorage, $cookieStore, mainAsset, requestHelper, crud, ADMdtpConvertor, $routeParams) {

  var controller = this;
  var apiName = 'ticket';
  headers = requestHelper.headers;
  controller.searchObject = [
    {'fname' : 'عنوان', 'field' : 'title'},
    {'fname' : 'تاریخ ایجاد', 'field' : 'datetime','show_in_search' : false}
  ];

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');

  controller.obj = {};
  controller.tmp = {};
  controller.tmp.formShow = false;
  $scope.selectStage = 0;
  controller.addOne={};
  controller.addOne.extra={};
  controller.addOne.reportFields={};
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
      fa : 'شناسه',
      en : 'unique_id'
    },
    table : [
      {fa:'مدل کالا',en:'product',filter:'productName'},
      {fa:'مبدا',en:'source',filter:'userOrWarehouseName'},
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

  controller.selectFromWarehouseObj = {
    title : { fa : 'انبار مبدا', en : 'from_warehouse'},
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
  $scope.userId = $localStorage.assetData.id;

  controller.objConfig = function(obj){
    var outObj = angular.copy(obj);
    if($scope.editMode){ //config object for editing

    }
    else{ //config object for creating
      if(outObj.product)
        outObj.product = outObj.product.id;
      
      outObj.from_warehouse = controller.relateWarehouseId;
      
      if(outObj.transaction) outObj.transaction = outObj.transaction.id;
      else delete outObj['transaction'];

      if(!outObj.to_warehouse || outObj.to_warehouse=="" || !controller.allowedSource){
        delete outObj['to_warehouse'];
      }
      else{ outObj['to_warehouse'] = outObj.to_warehouse.id;}
      
      outObj.reason = parseInt(outObj.reason);
      outObj.ticket_type = parseInt(outObj.ticket_type);
    }
    return outObj;
  };

  
  controller.getConfig = function(obj){
    setTimeout(function () {
      $('.message-list-container')[0].scrollTop = $('.message-list-container')[0].scrollHeight;
    },500);
    return obj;
  }

  crud.initModals($scope, controller, apiName, []);
  crud.init($scope, controller, apiName, controller.objConfig, controller.getConfig);
  controller.allowedSource = false;
  controller.addProduct = function(list){
    controller.obj.product = list;
    $scope.stage = 0;
  };
  
  controller.setNewTicketForm = function(){
    $scope.reset();
    controller.tmp.formShow = true;
  };

  controller.readTicket = function(id){
    $scope.reset();
    $scope.loadSide = true;
    controller.tmp.formShow = true;
    controller.getObject(id);
  };

  controller.createTicket = function(editMode_){
    $scope.loadSide = true;
    controller.sendOrEdit(editMode_);
  }

  controller.selectObj = function(field_,item_){
    controller.obj[field_] = item_;
    mainAsset.closeModal('#selectModal');

  }

  controller.closeModal = function(){
    mainAsset.closeModal('#selectModal')
  }

  controller.setSourceType = function(){
    var url = assetPanelData.serverUrl + 'warehouse/'+controller.relateWarehouseId;
    requestHelper.get(
      url,$scope,
      function(response){
        if(response.data.parent_warehouse){controller.allowedSource = false;}
        else{controller.allowedSource = true;}
    },true);
  }
  controller.setSourceType();

  controller.addMessage = function(){
    var url = assetPanelData.serverUrl + apiName+'/' + controller.obj.id + '/message';
    var sendObj={};
    if(controller.tmp.text && controller.tmp.text!=""){
      sendObj['text'] = controller.tmp.text;
    }
    else if(controller.tmp.transaction){
      sendObj['attachments'] = [
        {
          type: 'transaction',
          data: controller.tmp.transaction.id
        }
      ]
    }
    else{
      new PNotify({
        title: 'خطا',
        text: 'پیام باید حاوی متن بوده یا یک تراکنش به آن ضمبمه شده باشد.',
        type: 'error'
      }); 
      return;
    }
    $scope.sendingMessage = true;
    var responseFunction;
    if(controller.obj.status == 2){
      responseFunction = function(response){ // with status change
        controller.obj = response.data;
        console.log(response.data);
        delete controller.tmp['text'];
        delete controller.tmp['transaction'];        
        setTimeout(function () {
          $('.message-list-container')[0].scrollTop = $('.message-list-container')[0].scrollHeight;
        },500);
        $scope.sendingMessage = false;
        controller.getData();
      }
    }
    else{
      responseFunction = function(response){ // no status change
        controller.obj = response.data;
        console.log(response.data);
        delete controller.tmp['text'];
        delete controller.tmp['transaction'];        
        setTimeout(function () {
          $('.message-list-container')[0].scrollTop = $('.message-list-container')[0].scrollHeight;
        },500);
        $scope.sendingMessage = false;
      }
    }
    $http.put(url, sendObj, {headers: headers})
      .then(
      responseFunction, //for success response
      function(response){ //for error response
        requestHelper.errorCallback(response);
        $scope.sendingMessage = false;
      }
    );
  }

  controller.changeStatus = function(status_){
    var url = assetPanelData.serverUrl + apiName+'/' + controller.obj.id + '/status/' + status_;
    $scope.loadStatus = true;
    $http.put(url, {}, {headers: headers})
      .then(
      function(response) { //for success response
        requestHelper.successCallback(response);
        controller.obj = response.data;
        console.log(response.data);
        $scope.loadStatus = false;
        controller.getData();
      },
      function(response){ //for error response
        requestHelper.errorCallback(response);
        $scope.loadStatus = false;
      }
    );
  }

  controller.getFilteredData = function(){

    var editedObj = angular.copy(controller.addOne);
    Object.assign(editedObj.extra,controller.addOne.reportFields);    //merge extra with reportFields
    
    if(editedObj.extra.datetime__gte){
      editedObj.extra.datetime__gte = mainAsset.toGregorianDate(controller.addOne.extra.datetime__gte);
    }
    else{editedObj.extra.datetime__gte=""}
    if(editedObj.extra.datetime__lte){
      editedObj.extra.datetime__lte = mainAsset.toGregorianDate(controller.addOne.extra.datetime__lte);
    }
    else{editedObj.extra.datetime__lte=""}

    if(editedObj.extra.from_warehouse) editedObj.extra.from_warehouse = editedObj.extra.from_warehouse.id 

    if(editedObj.extra.not_closed){
      editedObj.extra.status__ne = "2";
    }
    
    delete editedObj.extra['not_closed'];
    

    $scope.page = 1;
    controller.paginationConfig.addOne = editedObj;
    $scope.getUrl = controller.makeUrl($scope.page, controller.paginationConfig);
    controller.getData();
  }
});
