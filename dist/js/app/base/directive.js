app.directive('reqPagination', function() {
  return {
    restrict: 'E',
    replace : false,
    scope : {
      itempage : '=',
      itemmeta : '=',
      config : '=',
      controller : '=',
      obj: '=?'
    },
    link: function(scope, element, attr){
      
      if(scope.$parent.$parent.apiUrl){
        scope.dParent = scope.$parent.$parent;
      }else{
        scope.dParent = scope.$parent;
      }

      if(!scope.config){
        var paginationConfig = {};
      }else{
        var paginationConfig = scope.config;
      }

      if(!scope.itemmeta)
        scope.itemmeta = {};

      function safeApply(fn) {
        var phase = scope.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
          if(fn && (typeof(fn) === 'function')) {
            fn();
          }
        } else {
          this.$apply(fn);
        }
      };

      scope.pagination = function(status) {
        var pageMeta = scope.itemmeta;
        switch (status) {
          case 'old':
            if (pageMeta.next === null) {
              return true;
            } else {
              return false;
            };
            break;
          case 'new':
            if (pageMeta.prev == null) {
              return true;
            } else {
              return false;
            };
            break;
          case 'end':
            if (pageMeta.pages > 1 && pageMeta.page < pageMeta.pages -1 ) {
              return false;
            } else {
              return true;
            };
            break;
          case 'first':
            if (pageMeta.page > 2) {
              return false;
            } else {
              return true;
            };
            break;
          case 'first_mid':
            var prevPage = pageMeta.page - 1;
            if(prevPage - 1 > 1) return false;
            else return true;
            break;
          case 'end_mid':
            var nextPage = pageMeta.page + 1;
            if(pageMeta.pages - nextPage > 1) return false;
            else return true;
            break;
        };
      };

      scope.pageSet = function(mode){

        if( !scope.pagination(mode) ){
          switch (mode) {
          case 'new':
            scope.itempage -= 1;
            break;
          case 'old':
            scope.itempage += 1;
            break;
          case 'first':
            scope.itempage = 1;
            break;
          case 'end':
            scope.itempage = scope.itemmeta.pages;
            break;
          }
          safeApply(scope.itempage);
        }
        if(paginationConfig.url){
          paginationConfig.getFunc(scope.itempage, scope.obj);
        }else{
          scope.dParent.getUrl = scope.controller.makeUrl(scope.itempage, paginationConfig);
          scope.controller.getData();
        }

      };

    },
    templateUrl: '/dist/js/app/directive/pagination.html'
    //template : '<p id="test">{{itempage}}</p>'
  }
});

app.directive('searchTools', function() {
  return {
    restrict: 'E',
    replace : true,
    transclude: true,
    scope : {
      sobject : '=',
      scontroller : '='
    },
    link:function(scope,element,attr){
      $('#more-filters').on('click',function(){
        $('div#report-field').toggle();
        $('#more-filters').hide();
        $('#less-filters').show();
      });

      $('#less-filters').on('click',function(){
        $('div#report-field').toggle();
        $('#more-filters').show();
        $('#less-filters').hide();
        scope.scontroller.addOne.reportFields = {} 
        scope.$apply();
      });

      var reportDivExist = ($('#report-field').length>0);
      var reportFiltersExist = ($('#report-field').children().length>0);
      if(!reportDivExist || !reportFiltersExist){
        $('div.more-filter-link-container').hide();
      }

    },
    templateUrl: '/dist/js/app/directive/search.html'
  }
});

// search stage is deprycated, please use search modal
app.directive('searchStage', function() {
  return {
    restrict: 'E',
    replace : true,
    scope : {
      obj : '=',
      controller : '=',
      filterId: '@',
      target : '@',
      subbase: '@',
      func: '@'
    },
    link : function(scope, element, attr){
      if (!scope.target) {
        scope.target = 'obj';
      }
      if(!scope.subbase || scope.subbase==''){
        scope.subbase = undefined;
      }
      if(!scope.func || scope.func==''){
        scope.func = undefined
      }
      if(!scope.filterId || scope.filterId==''){
        scope.filterId = undefined
      }
    },
    templateUrl: '/dist/js/app/directive/searchStage.html'
  }
});

// Search Modal is a refactored version of search Stage
app.directive('searchModal', function(mainAsset, requestHelper) {
  return {
    restrict: 'E',
    replace : true,
    scope : {
      obj : '=',
      controller : '=',
      filterId: '@',
      target : '@',
      subbase: '@',
      func: '@'
    },
    link : function(scope, element, attr){

      if (!scope.target) {
        scope.target = 'obj';
      }
      if(!scope.subbase || scope.subbase==''){
        scope.subbase = undefined;
      }
      if(!scope.func || scope.func==''){
        scope.func = undefined
      }
      if(!scope.filterId || scope.filterId==''){
        scope.filterId = undefined
      }
    },
    templateUrl: '/dist/js/app/directive/searchModal.html'
  }
});

// Search Modal Specified for groups
app.directive('groupSearchmodal', function(mainAsset, requestHelper) {
  return {
    restrict: 'E',
    replace : true,
    scope : {
      obj : '=',
      controller : '=',
      filterId: '@',
      target : '@',
      subbase: '@',
      func: '@'
    },
    link : function(scope, element, attr){

      if (!scope.target) {
        scope.target = 'obj';
      }
      if(!scope.subbase || scope.subbase==''){
        scope.subbase = undefined;
      }
      if(!scope.func || scope.func==''){
        scope.func = undefined
      }
      if(!scope.filterId || scope.filterId==''){
        scope.filterId = undefined
      }
    },
    templateUrl: '/dist/js/app/directive/groupSearchmodal.html'
  }
});

app.directive('creatProduct', function(mainAsset, requestHelper) {
  return {
    restrict: 'E',
    replace : true,
    scope : {
      controller : '=',
      editproduct: '='
    },
    link : function(scope, element, attr){

      if(scope.$parent.$parent.apiUrl){
        scope.dParent = scope.$parent.$parent;
      }else{
        scope.dParent = scope.$parent;
      }

      scope.uploadUrl = mainAsset.getUploadUrl();
      scope.controller.bundleHolderId = '';
      
      scope.selectProducerObj = {
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
          getFunc: scope.controller.searchWithPagination,
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

      scope.selectGuarantorObj = {
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
          getFunc: scope.controller.searchWithPagination,
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

      scope.selectGroupObj = {
        title : { fa : 'نام گروه', en : 'subgroup'},
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
          getFunc: scope.controller.searchGroupWithPagination,
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

      

      scope.controller.productReset = function(){
        scope.dParent.load = false;
        scope.dParent.loadModal = false;
        scope.dParent.loadSearch = false;
        scope.dParent.uploadPercentage = 0;
        scope.dParent.uploading = false;
        scope.dParent.stage = 0;
        scope.editproduct = false;
        scope.makeDuplicate = false;
        scope.controller.product = {};
        scope.controller.tmp.meta = {};
        scope.controller.bundleHolderId = '';
      }

      scope.setGroupStage = function(){
        scope.controller.tmp.searchD = false;
        scope.controller.tmp.searchQuery = "";
        scope.dParent.stage = 3;
        scope.dParent.loadSearch = true;
        var searchUrl = mainAsset.getUrl() + 'group?depth__lt=2&page=1&per_page=25';
        requestHelper.get(
          searchUrl, scope.dParent,
          function(response) {
            scope.controller.tmp.searchResult = response.data.data.groups;
            scope.dParent.loadSearch = false;
          });
      };

      scope.loadMeta = function(id){
        scope.dParent.loadModal = true;
        var metaUrl = mainAsset.getUrl() + 'group/' + id;
        requestHelper.get(
          metaUrl, scope.dParent,
          function(response) {
            scope.controller.tmp.meta = response.data.data;
            var reqMetaData = response.data.data.meta_template;
            scope.controller.product.name = response.data.data.products_name;
            scope.controller.product.meta_data = [];
            for (var i = 0; i < reqMetaData.length; i++) {
             scope.controller.product.meta_data[i] = {'key' : reqMetaData[i].key, 'value': null}
            }
            scope.dParent.loadSearch = false;
          });
      }
      
      scope.controller.product.qr_code = '';
      scope.controller.uploadProductPic = function() {
        if(!scope.productForm.productPic.$error.maxSize && scope.controller.qrCodeFile)
        {
          requestHelper.uploadFileReq(scope.controller.qrCodeFile, 'qrcode', scope, function(data){
            scope.controller.product.qr_code = data.data.file_url;
          });
        }
      }

      scope.objConfig = function (obj) {
        sendCopyObj = angular.copy(obj);

        sendCopyObj.guarantor = sendCopyObj.guarantor.id;
        sendCopyObj.producer = sendCopyObj.producer.id;
        sendCopyObj.subgroup = sendCopyObj.subgroup.id;
        if(!sendCopyObj.is_out_of_system)
            sendCopyObj.is_out_of_system = false;

        sendCopyObj.deprication_type = Number(sendCopyObj.deprication_type);

        if(!sendCopyObj.is_bundle){
          sendCopyObj.is_bundle = false;
          delete sendCopyObj.children;
        }

        if(scope.editproduct){
          delete sendCopyObj.deprication_time;
          delete sendCopyObj.holder;
          delete sendCopyObj.parent_bundle;
          delete sendCopyObj.is_bundle;
          delete sendCopyObj.price;
          delete sendCopyObj.id;
        }else{
          if(!sendCopyObj.is_bundle)
            sendCopyObj.is_out_of_system = true;
        }

        delete sendCopyObj.name;
        
        sendCopyObj.guarantee_end_date = mainAsset.toGregorianDate(sendCopyObj.guarantee_end_date);
        sendCopyObj.guarantee_start_date = mainAsset.toGregorianDate(sendCopyObj.guarantee_start_date);
        sendCopyObj.production_date = mainAsset.toGregorianDate(sendCopyObj.production_date);
        if(!!sendCopyObj.children){
          sendCopyObj.children = [];
          for (var i = 0; i < obj.children.length; i++) {
            sendCopyObj.children.push(obj.children[i].id);
          }
        }
        var tempList = [];
        if(!obj.meta_data){
          sendCopyObj.meta_data = [];
        }
        else{
          tempList = obj.meta_data;
        }
        
        for (var i = tempList.length-1 ; i >= 0; i--) {
          if( !tempList[i]['value'] )
            {
              sendCopyObj.meta_data.splice(i, 1);
            }
        }
        
        return sendCopyObj;
      };

      scope.closeModal = function(){
        scope.controller.tmp = {};
        scope.controller.bundleHolderId = '';
        scope.controller.tmp.formShow = true;
        $('#productModal').modal('hide');
        scope.controller.product = {};

      }

      scope.sendOrEdit = function(eMode, colse){
        if( !close ){ close = true }
        scope.controller.sendOrEdit(eMode, scope.objConfig(scope.controller.product), mainAsset.getUrl() + 'product', function(data){
          scope.controller.creatProductCallback(data.data);
          if(scope.makeDuplicate){
            scope.controller.product.serial_number = '';
            scope.controller.product.internal_id = '';
            delete scope.controller.product.qr_code;
            scope.controller.product.children = [];
          }else if( !colse ){
            scope.controller.productReset();
            setTimeout(function(){
              document.getElementById("productBarcode").focus();
            }, 400)
          }else{
            $('#productModal').modal('hide');
            scope.controller.productReset();
          }
        });
      }

      scope.controller.deleteChild = function(index){
        scope.controller.product.children.splice (index, 1);
        if(scope.controller.product.children.length==0 && !scope.controller.product.holder){
          scope.controller.bundleHolderId = '';
          scope.controller.bundleProductSearch();
        }
      };
    
      scope.controller.checkDuplicate = function (obj, array) {
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

      scope.controller.addBundleProduct = function(list){
        if(!scope.controller.product.children)
          scope.controller.product.children = [];
                 
        if(scope.controller.product.children.length===0 && (!scope.controller.product.holder || scope.controller.product.holder==='' )){
          scope.controller.bundleHolderId = list.holder.obj.id;
          scope.controller.bundleProductSearch(1);
        }

        scope.controller.product.children.push(list);
      };

      scope.controller.openBundleSelection = function(){
        scope.dParent.loadSearch = true;
        scope.controller.tmp.searchD = false;
        scope.controller.productPageConf.searchOpt.text_search = scope.controller.tmp.searchQuery;
        if(scope.controller.product.holder){
          scope.controller.productPageConf.searchOpt.holder = scope.controller.product.holder.obj.id;          
        }
        else if(typeof(scope.controller.bundleHolderId)=="string" && scope.controller.bundleHolderId != ''){
          scope.controller.productPageConf.searchOpt.holder = scope.controller.bundleHolderId;
        }
        var getUrl = scope.controller.makeUrl(1, scope.controller.productPageConf);
        scope.dParent.stage = 2;
        requestHelper.get(getUrl, scope, function(response){
          mainAsset.log(response.data.data)
          scope.controller.tmp.searchResult = response.data.data.products;
          scope.controller.productsMeta = response.data.meta;
          scope.controller.productsPage = response.data.meta.page;
          scope.dParent.loadSearch = false;
        });
        scope.controller.tmp.searchD = true;
        
      }

      scope.controller.bundleProductSearch = function(page){
        scope.dParent.loadSearch = true;
        scope.controller.tmp.searchD = false;
        scope.controller.productPageConf.searchOpt.text_search = scope.controller.tmp.searchQuery;
        if(scope.controller.product.holder){
          scope.controller.productPageConf.searchOpt.holder = scope.controller.product.holder.obj.id;          
        }
        else if(typeof(scope.controller.bundleHolderId)=="string" && scope.controller.bundleHolderId != ''){
          scope.controller.productPageConf.searchOpt.holder = scope.controller.bundleHolderId;
        }
        var getUrl = scope.controller.makeUrl(page, scope.controller.productPageConf);
        requestHelper.get(getUrl, scope, function(response){
          mainAsset.log(response.data.data)
          scope.controller.tmp.searchResult = response.data.data.products;
          scope.controller.productsMeta = response.data.meta;
          scope.controller.productsPage = response.data.meta.page;
          scope.dParent.loadSearch = false;
        });
        scope.controller.tmp.searchD = true;
      }
    
      scope.controller.productPageConf = {
        getFunc : scope.controller.bundleProductSearch,
        url: mainAsset.getUrl()+ '/product',
        searchOpt : {
          'use_case':'2', // must be packable
          'text_search': ''
        }
      };
    },
    templateUrl: '/dist/js/app/directive/creatproduct.html'
  }
});

app.directive('productStat', function(mainAsset, requestHelper) {
  return {
    restrict: 'E',
    replace : true,
    scope : {
      controller : '='
    },
    link : function(scope, element, attr){

      if(scope.$parent.$parent.apiUrl){
        scope.dParent = scope.$parent.$parent;
      }else{
        scope.dParent = scope.$parent;
      }

      scope.controller.getProductStat = function(id){
        scope.dParent.loadModal = true;
        var getUrl = mainAsset.getUrl() + 'product/' + id + '/stats'
        requestHelper.get(getUrl, scope.dParent, function(response){
          scope.controller.productStat = response.data.data;
          scope.controller.productStat.qr_code = scope.dParent.uploadUrl + scope.controller.productStat.qr_code;
          mainAsset.log(scope.controller.productStat)
          scope.dParent.loadModal = false;
        });

      }

      scope.controller.openProductModal = function(goods){
        mainAsset.openModal('#productStatModal');
        scope.controller.getProductStat(goods.id);
      }

    },
    templateUrl: '/dist/js/app/directive/productstat.html'
  }
});

app.directive('exportFile', function(mainAsset, requestHelper) {
  return {
    restrict: 'E',
    replace : true,
    scope : {
      exptype : '@',
      id : '='
    },
    link : function(scope, element, attr){

      if(scope.$parent.$parent.apiUrl){
        scope.dParent = scope.$parent.$parent;
      }else{
        scope.dParent = scope.$parent;
      }
      
      scope.makeExport = function(expFromat){
        if( scope.id ){

          var exportConf = {
            'file_type' : expFromat,
            'id' : scope.id
          };

        }else{

          var exportConf = {
            'file_type' : expFromat,
            'request_url' : scope.dParent.getUrl
          };

        }

        var makeExportUrl = mainAsset.getUrl() + 'export/' + scope.exptype;
        
        requestHelper.post( makeExportUrl, exportConf, scope,
          function(response) {
            var notifText = 'در صورت شروع نشدن دانلود بصورت خودکار' + '<a target="_blank" href="' + response.data.data.download_url + '"> اینجا </a>' + 'را کلیک کنید'
            new PNotify({
              title: 'دریافت گزارش',
              text: notifText,
              type: 'info'
             });

            var link = document.createElement("a");
            link.download = name;
            link.target = '_blank'
            link.href = response.data.data.download_url;
            link.click();
        }, true);
      };

    },
    templateUrl: '/dist/js/app/directive/exportToFile.html'
  }
});

app.directive('toggle', function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs){
      if (attrs.toggle=="tooltip"){
        $(element).tooltip();
      }
      if (attrs.toggle=="popover"){
        $(element).popover();
      }
    }
  };
});

app.directive('deleteModal', function(){
  return {
    restrict: 'E',
    replace : true,
    scope : {
      controller : '='
    },
    templateUrl: '/dist/js/app/directive/deleteModal.html'
  }
});

app.directive('enterEvent', function () { //sample usage: enterEvent = "checkMark,function"
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        var enterEventList = attrs.enterEvent.split(',');
        var checkMark = scope.$eval(enterEventList[0]);
        if(checkMark){
          scope.$apply(function (){
            scope.$eval(enterEventList[1]);
          });  
        }
        else{
          if(!!enterEventList[2]){
            scope.$apply(function (){
              scope.$eval(enterEventList[2]);
            }); 
          }
          else{
            new PNotify({
              title: 'خطا',
              text: 'درخواست مجاز نیست.',
              type: 'error'
            });  
          }
        }
        event.preventDefault();
      }
    });
  };
});

app.directive('escEvent', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress keyup", function (event) {
      if(event.which === 27 || event.keyCode ===27) {
        scope.$apply(function (){
          scope.$eval(attrs.escEvent);
        });
        event.preventDefault();
      }
    });
  };
});

app.directive('transactionStat', function(mainAsset, requestHelper) {
  return {
    restrict: 'E',
    replace : true,
    scope : {
      controller : '='
    },
    link : function(scope, element, attr){

      scope.controller.getTransactionStat = function(id){
        scope.$parent.loadingTransactionData = true;
        var getUrl = mainAsset.getUrl() + 'transaction/' + id
        requestHelper.get(getUrl, scope.$parent, function(response){
          scope.controller.transactionStat = response.data.data;
          mainAsset.log(scope.controller.transactionStat)
          scope.$parent.loadingTransactionData = false;
        });

      }

      scope.controller.openTransactionStatModal = function(id){
        mainAsset.openModal('#transactionStatModal');
        scope.controller.getTransactionStat(id);
      }
      

    },
    templateUrl: '/dist/js/app/directive/transactionStat.html'
  }
});

