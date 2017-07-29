angular.module("assetAdminPanel").controller('invoiceCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, pagination, crud, ADMdtpConvertor, $q)
  {
      var controller = this;
      var apiName = 'invoice';
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

      $scope.page = 1;
      $scope.assetData = $cookieStore.get('assetData');

      $scope.apiUrl = mainAsset.getUrl() + apiName;
      $scope.getUrl = pagination.makeUrl($scope);


      controller.objConfig = function(obj){
        var obj2 = new Object();
        obj2 = angular.copy(controller.obj);

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

      crud.initModals($scope, controller, apiName, []);
      crud.init($scope, controller, apiName,controller.objConfig, controller.getConfig);
      pagination.initPagination($scope, controller, 'meta', 'page', 'getUrl', 'searchObject', 'searchValue');
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
        controller.tmp.searchQuery = '';
        controller.search('user','last_name');
      };

      controller.selectSeller = function(){
        $scope.selectStage = 2;
        controller.openModal('select');
        controller.tmp.searchQuery = '';
        controller.search('seller','last_name');
      };

      controller.selectItem = function(id, title, titleFiled, variable){
        controller.selectTarget(id, title, titleFiled, variable);
        controller.closeModal('select');
      }

      controller.addProduct = function(){
        // ToDo : Mr.Kabiri will code this function.
      };

      controller.selectProduct = function(){
        $scope.selectStage = 3;
        controller.openModal('select');
        controller.tmp.searchQuery = '';
        controller.search('product','model');
      };

      controller.pushProduct = function(item){
        if(controller.obj.products === undefined){controller.obj.products = []};
        controller.obj.products.push(item)
        controller.obj.num_of_products = controller.obj.products.length;
        controller.closeModal('select');
      }

      controller.deleteProduct = function(item_index){
        controller.obj.products.remove(item_index);
        controller.obj.num_of_products = controller.obj.products.length;
        controller.closeModal('delete');
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