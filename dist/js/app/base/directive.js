app.directive('reqPagination', function() {
  return {
    restrict: 'E',
    replace : false,
    scope : {
      itempage : '=',
      itemmeta : '=',
      config : '=',
      controller : '='
    },
    link: function(scope, element, attr){

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
          paginationConfig.getFunc(scope.itempage);
        }else{
          scope.$parent.getUrl = scope.controller.makeUrl(scope.itempage, paginationConfig);
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

app.directive('creatProduct', function(mainAsset, requestHelper) {
  return {
    restrict: 'E',
    replace : true,
    scope : {
      controller : '='
    },
    link : function(scope, element, attr){

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
        ]
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
          {fa:'تلفن',en:'office_phone'}
        ]
      };

      scope.productReset = function(){
        scope.$parent.load = false;
        scope.$parent.loadModal = false;
        scope.$parent.loadSearch = false;
        scope.$parent.uploadPercentage = 0;
        scope.$parent.uploading = false;
        scope.$parent.stage = 0;
        scope.$parent.editMode = false;
        scope.makeDuplicate = false;
        scope.controller.product = {};
        scope.controller.tmp.meta = {};
        scope.controller.bundleHolderId = '';
      }

      scope.setGroupStage = function(){
        scope.controller.tmp.searchD = false;
        scope.controller.tmp.searchQuery = "";
        scope.$parent.stage = 3;
        scope.$parent.loadSearch = true;
        var searchUrl = mainAsset.getUrl() + 'group?depth__lt=2&page=1&per_page=25';
        requestHelper.get(
          searchUrl, scope.$parent,
          function(response) {
            scope.controller.tmp.searchResult = response.data.groups;
            scope.$parent.loadSearch = false;
          });
      };

      scope.loadMeta = function(id){
        scope.$parent.loadModal = true;
        var metaUrl = mainAsset.getUrl() + 'group/' + id;
        requestHelper.get(
          metaUrl, scope.$parent,
          function(response) {
            scope.controller.tmp.meta = response.data;
            scope.controller.product.meta_data = [];
            for (var i = 0; i < response.data.meta_template.length; i++) {
             scope.controller.product.meta_data[i] = {'key' : response.data.meta_template[i].key, 'value': null}
            }
            scope.$parent.loadSearch = false;
          });
      }
      
      scope.controller.product.qr_code = '';
      scope.controller.uploadProductPic = function() {
        if(!scope.productForm.productPic.$error.maxSize && scope.controller.qrCodeFile)
        {
          requestHelper.uploadFileReq(scope.controller.qrCodeFile, 'signature', scope, function(data){
            scope.controller.product.qr_code = data.file_url;
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

        if(scope.$parent.editMode){
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

        sendCopyObj.guarantee_end_date = mainAsset.toGregorianDate(sendCopyObj.guarantee_end_date);
        sendCopyObj.guarantee_start_date = mainAsset.toGregorianDate(sendCopyObj.guarantee_start_date);
        sendCopyObj.production_date = mainAsset.toGregorianDate(sendCopyObj.production_date);

        if(sendCopyObj.children){
          sendCopyObj.children = [];
          for (var i = 0; i < obj.children.length; i++) {
            sendCopyObj.children.push(obj.children[i].id);
          }
        }

        if(!sendCopyObj.meta_data){sendCopyObj.meta_data = [];}
        
        for (var i = obj.meta_data.length-1 ; i >= 0; i--) {
          if( !obj.meta_data[i]['value'] )
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

      scope.sendOrEdit = function(eMode){
        scope.controller.sendOrEdit(eMode, scope.objConfig(scope.controller.product), mainAsset.getUrl() + 'product', function(data){
          scope.controller.creatProductCallback(data.data);
          if(scope.makeDuplicate){
            scope.controller.product.serial_number = '';
            delete scope.controller.product.qr_code;
            scope.controller.product.children = [];
          }else{
            $('#productModal').modal('hide');
            scope.productReset();
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
                 
        if(scope.controller.product.children.length==0 && !scope.controller.product.holder){
          scope.controller.bundleHolderId = list.holder.obj.id;
          scope.controller.bundleProductSearch();
        }

        scope.controller.product.children.push(list);
      };

      scope.controller.openBundleSelection = function(){
        var searchQuery = '?use_case=2';  //must be packable
        
        if(scope.controller.product.holder)
          scope.controller.bundleHolderId = scope.controller.product.holder.obj.id;
        else if(!scope.controller.bundleHolderId)
          scope.controller.bundleHolderId = '';
        
        if(typeof(scope.controller.bundleHolderId)=="string" && scope.controller.bundleHolderId != ''){
          searchQuery += '&holder='+ scope.controller.bundleHolderId;
        }

        scope.controller.selectThings(2, 'product', searchQuery)
      }

      scope.controller.bundleProductSearch = function(){
        var searchQuery = '?use_case=2';  //must be packable
        if(typeof(scope.controller.bundleHolderId)=="string" && scope.controller.bundleHolderId != ''){
          searchQuery += '&holder='+ scope.controller.bundleHolderId;
        }
        scope.controller.search('product', searchQuery); 
        scope.controller.tmp.searchD = true;
      }
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

      scope.controller.getProductStat = function(id){
        scope.$parent.loadModal = true;
        var getUrl = mainAsset.getUrl() + 'product/' + id + '/stats'
        requestHelper.get(getUrl, scope.$parent, function(response){
          scope.controller.productStat = response.data;
          scope.controller.productStat.qr_code = scope.$parent.uploadUrl + scope.controller.productStat.qr_code;
          console.log(scope.controller.productStat)
          scope.$parent.loadModal = false;
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
      controller : '='
    },
    link : function(scope, element, attr){
      console.log(scope)
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
          scope.controller.transactionStat = response.data;
          console.log(scope.controller.transactionStat)
          scope.$parent.loadingTransactionData = false;
        });

      }

      scope.controller.openTransactionStatModal = function(t){
        mainAsset.openModal('#transactionStatModal');
        scope.controller.getTransactionStat(t.id);
      }

    },
    templateUrl: '/dist/js/app/directive/transactionStat.html'
  }
});

