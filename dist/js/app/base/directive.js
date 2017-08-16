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
            if(pageMeta.pages<5 && pageMeta.prev && pageMeta.next) return true;
            else if(pageMeta.page>2) return false;
            else return true;
            break;
          case 'end_mid':
            if(pageMeta.pages<5 && pageMeta.prev && pageMeta.next) return true;
            else if(pageMeta.pages > 1 && pageMeta.page < pageMeta.pages -1) return false;
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
        console.log(scope.controller.productsPage)
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
      target : '='
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
          fa : 'نام خانوادگی مسئول',
          en : 'secretary_last_name'
        },
        table : [
          {fa:'نام مسئول ',en:'secretary_first_name'},
          {fa:'نام خانوادگی مسئول',en:'secretary_last_name'}
        ]
      };

      scope.productReset = function(){
        scope.controller.product = {};
        scope.controller.tmp.meta = {};
      }

      scope.setGroupStage = function(){
        scope.controller.tmp.searchD = false;
        scope.controller.tmp.searchQuery = "";
        scope.$parent.stage = 3;
        scope.$parent.loadSearch = true;
        var searchUrl = mainAsset.getUrl() + 'group?group_type=group&page=1&per_page=25';
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

        if(!sendCopyObj.is_bundle || sendCopyObj.is_bundle == false){
          sendCopyObj.is_bundle = false;
          delete sendCopyObj.children;
        }

        sendCopyObj.deprication_type = Number(sendCopyObj.deprication_type);

        if(scope.$parent.editMode){
          delete sendCopyObj.deprication_time;
          delete sendCopyObj.holder;
          delete sendCopyObj.parent_bundle;
          delete sendCopyObj.is_bundle;
          delete sendCopyObj.price;
          delete sendCopyObj.id;
        }

        sendCopyObj.guarantee_end_date = mainAsset.toGregorianDate(sendCopyObj.guarantee_end_date);
        sendCopyObj.guarantee_start_date = mainAsset.toGregorianDate(sendCopyObj.guarantee_start_date);
        sendCopyObj.production_date = mainAsset.toGregorianDate(sendCopyObj.production_date);

        if(obj.children){
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
        scope.controller.tmp.formShow = true;
        $('#productModal').modal('hide');
        scope.controller.product = {};

      }

      scope.sendOrEdit = function(eMode){
        scope.controller.sendOrEdit(eMode, scope.objConfig(scope.controller.product), mainAsset.getUrl() + 'product', function(data){
          scope.controller.creatProductCallback(data.data);
          $('#productModal').modal('hide');
          scope.controller.product = {};
        });
      }

      scope.controller.deleteChild = function(index){
        scope.controller.obj.children.splice (index, 1);
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

        if(!scope.controller.obj.children)
          scope.controller.obj.children = [];

        scope.controller.obj.children.push(list);
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
