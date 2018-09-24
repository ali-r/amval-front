angular.module("assetAdminPanel").controller('productCtrl',
  function($scope, mainAsset, requestHelper, crud, ADMdtpConvertor, $routeParams) {
  
  var controller = this;
  var apiName = 'product';

  controller.searchObject = [
    {'fname' : 'بارکد', 'field' : 'internal_id'},
    {'fname' : 'شماره سریال کارخانه', 'field' : 'serial_number'},
    {'fname' : 'قیمت', 'field' : 'price', 'show_in_search' : false}
  ];

  

  $scope.page = 1;
  controller.product = {};
  controller.obj = {};
  controller.addOne={};
  controller.addOne.extra={};
  controller.addOne.reportFields = {}
  controller.paginationConfig = {
    'addOne' : controller.addOne
  }
  // controller.addOne.extra.group = {};
  controller.relateWarehouseId = $routeParams.id;
  $scope.apiUrl = mainAsset.getUrl() + apiName;
  controller.priceLoaded = false;

  controller.creatProductCallback = function(){
    controller.getData();
  }

  controller.getConfig = function(obj){
    obj.deprication_type += '';
    obj.guarantee_end_date = mainAsset.toJalaliDateTime2(obj.guarantee_end_date,true,false,'jYYYY/jM/jD');
    obj.guarantee_start_date = mainAsset.toJalaliDateTime2(obj.guarantee_start_date,true,false,'jYYYY/jM/jD');
    obj.production_date = mainAsset.toJalaliDateTime2(obj.production_date,true,false,'jYYYY/jM/jD');
    controller.tmp.meta = {meta_template:[]};    
    controller.tmp.meta = obj.subgroup;
    /*
    var meta;
    for (var i = 0; i < controller.tmp.meta.meta_template.length; i++) {
      for (var j = 0; j < obj.meta_data.meta_template.length; j++) {

        mainAsset.log(controller.tmp.meta[i]);
        mainAsset.log(obj.meta_data[i]);
        
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
  controller.getTotalPrice();
  
  controller.obj.qr_code = '';
  this.uploadPic = function() {
    mainAsset.log($scope.productForm.file.$error)
    if(!$scope.productForm.file.$error.maxSize && controller.qrCodeFile)
    {
      requestHelper.uploadFileReq(controller.qrCodeFile, 'qrcode', $scope, function(data){
        delete controller.qrCodeFile;
        controller.obj.qr_code = data.data.file_url;
      });
    }
  }

  this.selectReportOption = function(id, title, titleFiled, variable, targetObj){
    if(!targetObj) targetObj = controller.addOne.extra;
    if(!variable) {mainAsset.log('unable to set report option: not a valid variable'); return}

    if(!targetObj[variable]) targetObj[variable] = {};

    targetObj[variable][titleFiled] = title;
    targetObj[variable]['id'] = id;
    mainAsset.closeModal('#selectModal');
  }

  this.getFilteredData = function(){
    var editedObj = angular.copy(controller.addOne);
    var ex = editedObj.extra;
    Object.assign(ex,controller.addOne.reportFields);    //merge extra with reportFields

    if(ex.group) ex.group = ex.group.id;

    // if(ex.parent_bundle) ex.parent_bundle = ex.parent_bundle.id;

    if(ex.holder) ex.holder = ex.holder.id;
    delete ex['holder_type'];

    if(ex.producer) ex.producer = ex.producer.id;

    if(ex.guarantor) ex.guarantor = ex.guarantor.id;

    if(ex.related_warehouse) ex.related_warehouse = ex.related_warehouse.id;
    
    if(ex.seller) ex.seller = ex.seller.id;

    if(ex.return_datetime__gte) ex.return_datetime__gte = mainAsset.toGregorianDateTime2(ex.return_datetime__gte,true,'HH:mm jYYYY-jM-jD');

    if(ex.return_datetime__lte) ex.return_datetime__lte = mainAsset.toGregorianDateTime2(ex.return_datetime__lte,true,'HH:mm jYYYY-jM-jD');

    if(ex.deprecated)
      ex.deprication_time__lte = moment().utcOffset(0).format('YYYY-MM-DDTHH:mm:ss');
    delete ex['deprecated'];

    if(ex.requested_for_repair){
      ex.requested_for_repair = "True";
    }
    else{
      delete ex['requested_for_repair'];
    }

    $scope.page = 1;
    controller.paginationConfig.addOne = editedObj;
    $scope.getUrl = controller.makeUrl($scope.page, controller.paginationConfig);
    controller.getData();
    controller.getTotalPrice($scope.getUrl);    
  }

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
    ],
    pageConfig: {
      url: mainAsset.getUrl()+'producer',
      getFunc: controller.searchWithPagination,
      cat: 'producer',
      searchOpt: {
        'text_search': '',
      }
    },
    searchResult:[],
    searchMeta:{},
    searchPage: 1,
    searchQuery: '',
  };

  controller.selectSellerObj = {
    title : { fa : 'فروشنده', en : 'seller'},
    searchItem : {
      fa : 'فروشنده',
      en : 'seller'
    },
    searchAt : {
      fa : 'نام خانوادگی',
      en : 'last_name'
    },
    table : [
      {fa:'نام',en:'first_name'},
      {fa:'نام خانوادگی',en:'last_name'},
      {fa:'نام فروشگاه',en:'store_name'},
      {fa:'آدرس',en:'address'},
      
    ],
    pageConfig: {
      url: mainAsset.getUrl()+'seller',
      getFunc: controller.searchWithPagination,
      cat: 'seller',
      searchOpt: {
        'text_search': '',
      }
    },
    searchResult:[],
    searchMeta:{},
    searchPage: 1,
    searchQuery: '',
  };
  
  controller.selectGuarantorObj = {
    title : { fa : 'گارانتی', en : 'guarantor'},
    searchItem : {
      fa : 'گارانتی',
      en : 'guarantor'
    },
    searchAt : {
      fa : 'نام شرکت',
      en : 'company_name'
    },
    table : [
      {fa:'نام شرکت',en:'company_name'},
      {fa:'آدرس',en:'address'}
    ],
    pageConfig: {
      url: mainAsset.getUrl()+'guarantor',
      getFunc: controller.searchWithPagination,
      cat: 'guarantor',
      searchOpt: {
        'text_search': '',
      }
    },
    searchResult:[],
    searchMeta:{},
    searchPage: 1,
    searchQuery: '',
  };

  controller.selectGroupObj = {
    title : { fa : 'گروه', en : 'group'},
    searchItem : {
      fa : 'نام',
      en : 'subgroup'
    },
    searchAt : {
      fa : 'عنوان',
      en : 'title'
    },
    table : [
      {fa:'عنوان',en:'title'},
      {fa:'توضیحات',en:'description'}
    ],
    pageConfig: {
      url: mainAsset.getUrl()+'group',
      getFunc: controller.searchGroupWithPagination,
      cat: 'group',
      searchOpt: {
        'text_search': '',
      }
    },
    searchResult:[],
    searchMeta:{},
    searchPage: 1,
    searchQuery: '',
  };

  controller.selectProductObj = {
    title : { fa : 'کالا', en : 'parent_bundle'},
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
      {fa:'سریال کارخانه کالا',en:'serial_number'},
    ],
    searchFilter:{
      key: 'is_bundle',
      value: 'True'
    },
    pageConfig: {
      url: mainAsset.getUrl()+'product',
      getFunc: controller.searchWithPagination,
      cat: 'product',
      searchOpt: {
        'is_bundle': 'True',
        'text_search': '',
      }
    },
    searchResult:[],
    searchMeta:{},
    searchPage: 1,
    searchQuery: '',
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

