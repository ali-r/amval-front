angular.module("assetAdminPanel").controller('invoiceCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, crud, ADMdtpConvertor, $q)
  {
      var controller = this;
      controller.apiName = 'invoice';
      $scope.editMode = true;    //Edit: true, Create: false
      $scope.selectStage = 0;       //Buyer:1, Seller:2, Product:3 usage in select modal

      controller.searchObject = [
          {'fname' : 'شماره فاکتور', 'field' : 'invoice_no'},
      ];

      controller.setFormHeight = function(){
        var formHeight = $(window).height()/(2);
        $("#invoiceEditCreateForm").css('height',formHeight);
        $("#invoiceEditCreateForm").css('overflow-y',"auto");
         
      }
      // controller.setFormHeight();

      controller.product = {};

      $scope.page = 1;
      $scope.assetData = $cookieStore.get('assetData');
      controller.obj = {};
      controller.addOne={};
      controller.addOne.extra={};
      controller.addOne.reportFields={};
      controller.paginationConfig = {
        'addOne' : controller.addOne
      }
      $scope.apiUrl = mainAsset.getUrl() + controller.apiName;


      controller.objConfig = function(obj){
        var obj2 = new Object();
        obj2 = angular.copy(obj);

        obj2.datetime = mainAsset.toGregorianDate(controller.obj.datetime);
        
        obj2.price = 0
        controller.obj.products.forEach(function(item,index){
          obj2.price += item.price;
        })

        obj2.products = [];
        controller.obj.products.forEach(function(item,index){
          obj2.products.push({
            id: item.id,
            price: item.price
          });
        })

        delete obj2.id;
        obj2.seller = controller.obj.seller['id'];
        obj2.buyer = controller.obj.buyer['id'];
        
        return obj2;
      }

      controller.getConfig = function(obj){
        obj.datetime = mainAsset.toJalaliDate(obj.datetime,{deleteTime:true});
        $scope.editMode = true;
        controller.tmp.formShow = true;
        return obj;
      }

      controller.openModal = function(name){
        mainAsset.openModal('#' + name + 'Modal');
      }

      controller.closeModal = function(name){
        mainAsset.closeModal('#' + name + 'Modal')
      }

      crud.initModals($scope, controller, controller.apiName, []);
      crud.init($scope, controller, controller.apiName,controller.objConfig, controller.getConfig);
      controller.tmp.formShow = false;

      controller.setNewInvoiceForm = function(){
        $scope.reset();
        controller.tmp.formShow = true;
      };

      controller.readInvoice = function(id){
        $scope.reset();
        $scope.loadSide = true;
        controller.tmp.formShow = true;
        controller.getObject(id)
      };

      controller.selectBuyer = function(){
        controller.tmp.searchQuery = '';
        $scope.selectStage = 1;
        controller.openModal('select');
        if(controller.tmp.searchField==undefined){controller.tmp.searchField = "";}
        controller.tmp.searchQuery = controller.tmp.searchField;
        controller.search('user');
      };

      controller.selectSeller = function(){
        controller.tmp.searchQuery = '';
        $scope.selectStage = 2;
        controller.openModal('select');
        if(controller.tmp.searchField==undefined){controller.tmp.searchField = "";}
        controller.tmp.searchQuery = controller.tmp.searchField;
        controller.search('seller');
      };

      controller.openProductModal = function(){
        controller.openModal('product');
      };

      controller.selectProduct = function(){
        controller.tmp.searchQuery = '';
        $scope.selectStage = 3;
        controller.openModal('select');
        controller.getProducts(1);
      };

      controller.pushProduct = function(item){
        if(controller.obj.products === undefined){controller.obj.products = []};
        item.price = null;
        controller.obj.products.push(item);
      }

      controller.deselect = function(item_index){
        controller.obj.products.remove(item_index);
      }

      controller.creatProductCallback = function(goods){
        if(!controller.obj.products){
          controller.obj.products = [];
        }
        goods.price = null;
        controller.obj.products.push(goods.data);
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

      this.uploadPic = function() {
        mainAsset.log($scope.invoiceForm.file.$error)
        if(!$scope.invoiceForm.file.$error.maxSize && controller.scannedFile)
        {
          requestHelper.uploadFileReq(controller.scannedFile, 'invoice', $scope, function(data){
            controller.obj.scanned_invoice = data.data.file_url;
          });
        }
      }

      controller.checkTotalPrice = function(){
        var bank = 0;

        controller.obj.products.forEach(function(item,index){
          bank += item.price;
        })
        
        mainAsset.log(bank)
        if (bank == controller.obj.price) {
          return false;
        }else{
          return true;
        }
      }

      controller.validateForm = function(){
        var notifObj = {};
        notifObj.type = 'error';
        notifObj.title = "خطا در تکمیل فرم";
        if(!$scope.invoiceForm.invoice_no.$valid){
          notifObj.text = "شماره فاکتور را وارد نمایید.";
          new PNotify(notifObj);
          return false;
        }
        else if(controller.obj.datetime==undefined || controller.obj.datetime==""){
          notifObj.text = "تاریخ فاکتور را انتخاب نمایید.";
          new PNotify(notifObj);
          return false; 
        }
        else if(controller.obj.buyer==undefined){
          notifObj.text = "خریدار را انتخاب کنید.";
          new PNotify(notifObj);
          return false; 
        }
        else if(controller.obj.seller==undefined){
          notifObj.text = "فروشنده را انتخاب کنید.";
          new PNotify(notifObj);
          return false; 
        }
        else if(controller.checkTotalPrice()){
          notifObj.text = "قیمت کل به درستی وارد نشده است";
          new PNotify(notifObj);
          return false; 
        }
        else if(controller.obj.products.length != controller.obj.num_of_products){
          notifObj.text = 'تعداد کالا های به درستی وارد نشده است';
          new PNotify(notifObj);
          return false; 
        }
        else if(controller.obj.products==undefined || controller.obj.products.length==0){
          notifObj.text = "حداقل یک کالا باید در فاکتور وجود داشته باشد.";
          new PNotify(notifObj);
          return false; 
        }
        else if(controller.obj.scanned_invoice==undefined || controller.obj.scanned_invoice==""){
          if($scope.uploading){
            notifObj.text = "لطفا تا پایان بارگذاری تصویر منتظر بمانید.";
            new PNotify(notifObj);
            return false;
          }
          else{
            notifObj.text = "تصویر فاکتور را آپلود نمایید.";
            new PNotify(notifObj);
            return false;  
          }
           
        }
        else{
          var validPriceFlag = true;
          controller.obj.products.forEach(function(item,index){
            if(item.price<0 || item.price==undefined){validPriceFlag=false;return;}
          });
          if(validPriceFlag){
            $scope.loadSide = true;
            controller.sendOrEdit($scope.editMode);
            return true;  
          }
          else{
            notifObj.text = "قیمت کالا نمیتواند اعشاری یا منفی باشد";
            new PNotify(notifObj);
            return false;
          }
        }

      }

      controller.getFilteredData = function(){
        var editedObj = angular.copy(controller.addOne);
        var ex = editedObj.extra;
        Object.assign(ex,controller.addOne.reportFields);    //merge extra with reportFields
        
        if(ex.datetime__gte) ex.datetime__gte = mainAsset.toGregorianDate(ex.datetime__gte);
    
        if(ex.datetime__lte) ex.datetime__lte = mainAsset.toGregorianDate(ex.datetime__lte);
    
        $scope.page = 1;
        controller.paginationConfig.addOne = editedObj;
        $scope.getUrl = controller.makeUrl($scope.page, controller.paginationConfig);
        controller.getData();
      }


      controller.getProducts = function(page){
        $scope.loadSearch = true;
        controller.productPageConf.searchOpt.text_search = controller.tmp.searchQuery;
        var getUrl = controller.makeUrl(page, controller.productPageConf);

        requestHelper.get(getUrl, $scope, function(response){
          mainAsset.log(response.data.data)
          controller.tmp.searchResult = response.data.data.products;
          controller.productsMeta = response.data.meta;
          controller.productsPage = response.data.meta.page;
          $scope.loadSearch = false;
        });
      };
    
      controller.productPageConf = {
        getFunc : controller.getProducts,
        url: mainAsset.getUrl()+ '/product',
        searchOpt : {
          'use_case':'0',
          'text_search': ''
        }
      };

  }
);