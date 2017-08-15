angular.module("assetAdminPanel").controller('productCtrl',
  function($scope, mainAsset, requestHelper, crud, ADMdtpConvertor, $routeParams) {

  var controller = this;
  var apiName = 'product';

  controller.searchObject = [
    {'fname' : 'مدل کالا', 'field' : 'model'},
    {'fname' : 'شماره سریال', 'field' : 'serial_number'},
    {'fname' : 'قیمت', 'field' : 'price', 'show_in_search' : false}
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
  controller.product = {};
  controller.obj = {};
  controller.addOne={};
  controller.addOne.extra={};
  controller.addOne.extra.product_filter = "";
  controller.paginationConfig = {
    'addOne' : controller.addOne
  }

  controller.relateWarehouseId = $routeParams.id;
  $scope.apiUrl = mainAsset.getUrl() + apiName;

  controller.creatProductCallback = function(){
    controller.getData();
  }

  controller.getConfig = function(obj){
    obj.deprication_type += '';
    obj.guarantee_end_date = mainAsset.toJalaliDate(obj.guarantee_end_date);
    obj.guarantee_start_date = mainAsset.toJalaliDate(obj.guarantee_start_date);
    obj.production_date = mainAsset.toJalaliDate(obj.production_date);
    controller.tmp.meta = {meta_template:[]};
    controller.obj.meta_data = [];
    
    controller.tmp.meta = obj.subgroup;
    
    var meta;
    for (var i = 0; i < controller.tmp.meta.meta_template.length; i++) {
      for (var j = 0; j < obj.meta_data.meta_template.length; j++) {

        console.log(controller.tmp.meta[i]);
        console.log(obj.meta_data[i]);
        
      }
      /*
      meta = { key:obj.subgroup.meta_template[i].key, value: ''};
      controller.obj.meta_data.push({key : obj.subgroup.meta_template[i].key});
      */
    }
    
    controller.product = obj;
    return obj;
  };

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
      requestHelper.uploadFileReq(controller.qrCodeFile, 'qrcode', $scope, function(data){
        delete controller.qrCodeFile;
        controller.obj.qr_code = data.file_url;
      });
    }
  }

});
