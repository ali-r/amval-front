angular.module("assetAdminPanel").controller('productCtrl',
  function($scope, mainAsset, requestHelper, crud, ADMdtpConvertor) {

  var controller = this;
  var apiName = 'product';

  controller.searchObject = [
    {'fname' : 'شماره سریال', 'field' : 'serial_number'},
    {'fname' : 'مدل کالا', 'field' : 'model'},
    {'fname' : 'شماره کارت', 'field' : 'card_no'}
  ];

  controller.selectProducerObj = {
    title : { fa : 'تولید کننده', en : 'producer'},
    searchItem : {
      fa : 'تولید کننده',
      en : 'producer'
    },
    searchAt : {
      fa : 'نام برند',
      en : 'brand_name'
    },
    table : [
      {fa:'نام برند',en:'brand_name'}
    ]
  };

  controller.selectSellerObj = {
    title : { fa : 'فروشنده', en : 'seller'},
    searchItem : {
      fa : 'فروشنده',
      en : 'seller'
    },
    searchAt : {
      fa : 'نام فروشگاه',
      en : 'store_name'
    },
    table : [
      {fa:'نام فروشگاه',en:'store_name'},
      {fa:'نام',en:'first_name'},
      {fa:'نام خانوادگی',en:'last_name'}
    ]
  };

  controller.selectGuarantorObj = {
    title : { fa : 'گارانتی', en : 'guarantor'},
    searchItem : {
      fa : 'گارانتی',
      en : 'guarantor'
    },
    searchAt : {
      fa : 'نام خانوادگی مسئول',
      en : 'secretary_last_name'
    },
    table : [
      {fa:'نام مسئول ',en:'secretary_first_name'},
      {fa:'نام خانوادگی مسئول',en:'secretary_last_name'}
    ]
  };

  controller.selectGroupObj = {
    title : { fa : 'زیرگروه', en : 'group'},
    searchItem : {
      fa : 'زیر گروه',
      en : 'group'
    },
    searchAt : {
      fa : 'عنوان',
      en : 'title'
    },
    table : [
      {fa:'عنوان',en:'title'},
      {fa:'توضیحات',en:'description'}
    ]
  };

  $scope.page = 1;

  $scope.apiUrl = mainAsset.getUrl() + apiName;

  this.toGregorianDate = function(pDate){
    var dateArray = pDate.split('-');
    var gDate = ADMdtpConvertor.toGregorian(Number(dateArray[0]), Number(dateArray[1]), Number(dateArray[2]));
    return (gDate.year + '-' + gDate.month + '-' + gDate.day);
  }

  this.toJalaliDate = function(pDate){
    var dateArray = pDate.split('-');
    var gDate = ADMdtpConvertor.toJalali(Number(dateArray[0]), Number(dateArray[1]), Number(dateArray[2]));
    return (gDate.year + '-' + gDate.month + '-' + gDate.day);
  }

  controller.objConfig = function (obj) {
    sendCopyObj = angular.copy(obj);

    /*sendCopyObj.seller = sendCopyObj.seller.id;*/
    sendCopyObj.guarantor = sendCopyObj.guarantor.id;
    sendCopyObj.producer = sendCopyObj.producer.id;
    sendCopyObj.subgroup = sendCopyObj.subgroup.id;
    if(!sendCopyObj.is_out_of_system)
        sendCopyObj.is_out_of_system = false;

    if(!sendCopyObj.is_bundle){
      sendCopyObj.is_bundle = false;
      delete sendCopyObj.children;
    }

    sendCopyObj.deprication_type = Number(sendCopyObj.deprication_type);
    delete sendCopyObj.price;

    if($scope.editMode){
      delete sendCopyObj.is_bundle;
      delete sendCopyObj.deprication_time;
      delete sendCopyObj.holder;
      delete sendCopyObj.parent_bundle;
    }

    sendCopyObj.guarantee_end_date = controller.toGregorianDate(sendCopyObj.guarantee_end_date);
    sendCopyObj.guarantee_start_date = controller.toGregorianDate(sendCopyObj.guarantee_start_date);
    sendCopyObj.production_date = controller.toGregorianDate(sendCopyObj.production_date);
    
    sendCopyObj.meta_data = [];
    obj.meta_data.forEach(function(item,index){
      if(item.value != undefined && item.value !=""){sendCopyObj.meta_data.push(item);}
    });

    if(obj.children){
      sendCopyObj.children = [];
      for (var i = 0; i < obj.children.length; i++) {
        sendCopyObj.children.push(obj.children[i].id);
      }
    }

    return sendCopyObj;
  };

  controller.getConfig = function(obj){
    obj.deprication_type += '';
    obj.guarantee_end_date = controller.toJalaliDate(obj.guarantee_end_date);
    obj.guarantee_start_date = controller.toJalaliDate(obj.guarantee_start_date);
    obj.production_date = controller.toJalaliDate(obj.production_date);
    controller.tmp.meta = {meta_template:[]};

    var meta;
    for (var i = 0; i < obj.meta_data.length; i++) {
      switch( typeof(obj.meta_data[i].value) ){
        case 'boolean':
          meta = { key:obj.meta_data[i].key, type:'bool'};
        break;
        case 'string':
          meta = { key:obj.meta_data[i].key, type:'str'};
        break;
        case 'number':
          meta = { key:obj.meta_data[i].key, type:'int'};
        break;
      }
      controller.tmp.meta.meta_template.push(meta);
      
    }
    return obj;
  };

  this.setGroupStage = function(){
    $scope.stage = 3;
    $scope.loadSearch = true;
    var searchUrl = mainAsset.getUrl() + 'group?group_type=group&page=1&per_page=25';
    requestHelper.get(
      searchUrl, $scope,
      function(response) {
        controller.tmp.searchResult = response.data.groups;
        $scope.loadSearch = false;
      });
  };

  this.loadMeta = function(id){
    $scope.loadModal = true;
    var metaUrl = mainAsset.getUrl() + 'group/' + id;
    requestHelper.get(
      metaUrl, $scope,
      function(response) {
        // if(!$scope.editMode) [AM-192] clear fields after changing group
        controller.obj.meta_data = [];
        controller.tmp.meta = response.data;
        controller.tmp.meta.meta_template.forEach(function(item,index){
          controller.obj.meta_data.push({key:item.key});
        })
        console.log(controller.tmp.meta);
        $scope.loadSearch = false;
      });
  }

  crud.initModals($scope, controller, apiName)
  crud.init($scope, controller, apiName, controller.objConfig, controller.getConfig)

  this.deleteChild = function(index){
    controller.obj.children.splice (index, 1);
  };

  this.deleteField = function(obj,field){
    delete obj[field];
  }

  this.checkDuplicate = function (obj, array) {
    var checkResult = true;

    if(!array)
      array = [];

    for (var i = 0; i < array.length; i++) {
      if( array[i].id == obj.id){
        checkResult = false;
      };
    }
    return checkResult;
  }

  this.addBundleProduct = function(list){

    if(!controller.obj.children)
      controller.obj.children = [];

    controller.obj.children.push(list);
    //$scope.stage = 0;
  };

  controller.obj.qr_code = '';
  this.uploadPic = function() {
    console.log($scope.productForm.file.$error)
    if(!$scope.productForm.file.$error.maxSize && controller.qrCodeFile)
    {
      requestHelper.uploadFileReq(controller.qrCodeFile, 'signature', $scope, function(data){
        controller.obj.qr_code = data.file_url;
        
        /*setTimeout(function () {
        var qr = QCodeDecoder();
        var code = document.getElementById(qrCodeImage);
        qr.decodeFromImage(code, function (err, result) {
          if (err) {console.log(err);};
          console.log(result);
        });
        },1000);*/
        
      });
    }
  }

});
