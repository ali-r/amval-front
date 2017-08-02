angular.module("assetAdminPanel").controller('invoiceCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, crud, ADMdtpConvertor, $q)
  {
      var controller = this;
      controller.apiName = 'invoice';
      $scope.editMode = true;    //Edit: true, Create: false
      $scope.selectStage = 0;       //Buyer:1, Seller:2, Product:3 usage in select modal
      $scope.deleteStage = 1;       //Product:1 , Invoice:2 , usage in delete modal

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

      $scope.apiUrl = mainAsset.getUrl() + controller.apiName;


      controller.objConfig = function(obj){
        var obj2 = new Object();
        obj2 = angular.copy(obj);

        obj2.datetime = controller.convertToG(controller.obj.datetime);
        
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

        
        obj2.seller = controller.obj.seller['id'];
        obj2.buyer = controller.obj.buyer['id'];
        
        return obj2;
      }

      controller.getConfig = function(obj){
        obj.datetime = controller.convertToJ(obj.datetime);
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

      controller.openDeleteModal=function(id_,title_,stage_){
        controller.toDeleteId = id_;
        controller.toDeleteTitle = title_;
        $scope.deleteStage = stage_;
        controller.openModal('delete');
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
        controller.tmp.formShow = true;
        controller.getObject(id)
      };

      controller.convertToJ = function(datetime){
        var dt = datetime.split("T")[0].split("-");
        dt = ADMdtpConvertor.toJalali(parseInt(dt[0]),parseInt(dt[1]),parseInt(dt[2]));
        return(dt.year+"-"+dt.month+"-"+dt.day); 
      }

      controller.convertToG = function(datetime){
        var gdt = datetime.split("-");
        gdt = ADMdtpConvertor.toGregorian(parseInt(gdt[0]),parseInt(gdt[1]),parseInt(gdt[2]));
        return(gdt.year+"-"+gdt.month+"-"+gdt.day);
      }

      controller.selectBuyer = function(){
        $scope.selectStage = 1;
        controller.openModal('select');
        if(controller.tmp.searchField==undefined){controller.tmp.searchField = "";}
        controller.tmp.searchQuery = controller.tmp.searchField;
        controller.search('user','last_name');
      };

      controller.selectSeller = function(){
        $scope.selectStage = 2;
        controller.openModal('select');
        if(controller.tmp.searchField==undefined){controller.tmp.searchField = "";}
        controller.tmp.searchQuery = controller.tmp.searchField;
        controller.search('seller','last_name');
      };

      controller.selectItem = function(id, title, titleFiled, variable){
        controller.selectTarget(id, title, titleFiled, variable);
        controller.closeModal('select');
      }

      controller.openProductModal = function(){
        controller.openModal('product');
      };

      controller.selectProduct = function(){
        $scope.selectStage = 3;
        controller.openModal('select');
        if(controller.tmp.searchField==undefined){controller.tmp.searchField = "";}
        controller.tmp.searchQuery = controller.tmp.searchField+"&holder=None";
        controller.search('product','model');
      };

      controller.pushProduct = function(item){
        if(controller.tmp.selectedProducts === undefined){controller.tmp.selectedProducts = []};
        controller.tmp.selectedProducts.push(item);
      }

      controller.deselect = function(item_index){
        controller.tmp.selectedProducts.remove(item_index);
      }

      controller.deleteProduct = function(item_index){
        controller.obj.products.remove(item_index);
        controller.obj.num_of_products = controller.obj.products.length;
        controller.closeModal('delete');
      }

      controller.pushSelectedProducts = function(){
        if(controller.obj.products === undefined){controller.obj.products = []};
        controller.tmp.selectedProducts.forEach(function(item,index){
          controller.obj.products.push(item);
        });
        controller.obj.num_of_products = controller.obj.products.length;
        controller.tmp.selectedProducts = [];
        controller.closeModal('select');
      }

      controller.creatProductCallback = function(goods){
        if(!controller.obj.products){
          controller.obj.products = [];
        }
        controller.obj.products.push(goods);
        controller.obj.num_of_products = controller.obj.products.length;
      }

      this.uploadPic = function() {
        console.log($scope.invoiceForm.file.$error)
        if(!$scope.invoiceForm.file.$error.maxSize && controller.scannedFile)
        {
          requestHelper.uploadFileReq(controller.scannedFile, 'invoice', $scope, function(data){
            controller.obj.scanned_invoice = data.file_url;
          });
        }
      }

  }
);