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

  controller.selectProductObj = {
    title : { fa : 'کالا', en : 'parent_bundle'},
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
      {fa:'سریال کالا',en:'serial_number'},
    ],
    searchFilter:{
      key: 'is_bundle',
      value: 'True'
    }
  }

  controller.selectUserHolderObj = {
    title : { fa : 'کاربر نگهدارنده', en : 'holder'},
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
      {fa:'نوع کاربر',en:'clearance_level',filter:'userType'}
    ]
  }

  controller.selectWarehouseHolderObj = {
    title : { fa : 'انبار نگهدارنده', en : 'holder'},
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
      {fa:'آدرس',en:'location'}
    ]
  }

  controller.selectRelateWarehouseObj = {
    title : { fa : 'انبار مرتبط', en : 'related_warehouse'},
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
      {fa:'آدرس',en:'location'}
    ]
  }

  $scope.page = 1;
  controller.product = {};
  controller.obj = {};
  controller.addOne={};
  controller.addOne.extra={};
  controller.addOne.extra.product_filter = "";
  controller.paginationConfig = {
    'addOne' : controller.addOne
  }
  // controller.addOne.extra.group = {};
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
    controller.tmp.meta = obj.subgroup;
    /*
    var meta;
    for (var i = 0; i < controller.tmp.meta.meta_template.length; i++) {
      for (var j = 0; j < obj.meta_data.meta_template.length; j++) {

        console.log(controller.tmp.meta[i]);
        console.log(obj.meta_data[i]);
        
      }
    
      meta = { key:obj.subgroup.meta_template[i].key, value: ''};
      controller.obj.meta_data.push({key : obj.subgroup.meta_template[i].key});
    
    }
    */
    controller.product = obj;
    return obj;
  };

  crud.initModals($scope, controller, apiName)
  crud.init($scope, controller, apiName, controller.objConfig, controller.getConfig)

  

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

  this.openSelectionModal = function(stage_, field_, var_){
    mainAsset.openModal('#selectModal');
    controller.selectThings(stage_,field_,var_);
  }

  this.closeSelectionModal = function(){
    mainAsset.closeModal('#selectModal');
    $scope.reset();
  }

  this.selectReportOption = function(id, title, titleFiled, variable, targetObj){
    if(!targetObj) targetObj = controller.addOne.extra;
    if(!variable) {console.log('unable to set report option: not a valid variable'); return}

    if(!targetObj[variable]) targetObj[variable] = {};

    targetObj[variable][titleFiled] = title;
    targetObj[variable]['id'] = id;
    mainAsset.closeModal('#selectModal');
  }

});
