var testVar;
angular.module("assetAdminPanel").controller('invoiceCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, pagination, crud, ADMdtpConvertor)
  {

      var controller = this;
      var apiName = 'invoice';
      controller.emptyForm = true;
      controller.editCreate = true;    //Edit: true, Create: false
      $scope.selectStage = 0;       //Buyer:1, Seller:2, Product:3 usage in select modal
      $scope.deleteStage = 1;       //Product:1 , Invoice:2 , usage in delete modal

      controller.searchObject = [
          {'fname' : 'شماره فاکتور', 'field' : 'invoice_no'},
          {'fname' : 'قیمت فاکتور', 'field' : 'price'},
          {'fname' : 'خریدار', 'field' : 'buyer'},
          {'fname' : 'فروشنده', 'field' : 'seller'}
      ];

      $scope.page = 1;
      $scope.assetData = $cookieStore.get('assetData');

      $scope.apiUrl = mainAsset.getUrl() + apiName;
      $scope.getUrl = pagination.makeUrl($scope);

      controller.obj = {};
      controller.obj.buyer = '';
      controller.obj.seller = '';
      controller.obj.invoice_no='';
      controller.obj.datetime ='';
      controller.obj.datetimeJ ='';
      controller.obj.num_of_products='';
      controller.obj.products=[];
      controller.obj.scanned_invoice='';

      controller.objConfig = function(obj){return obj;}

      controller.getConfig = function(obj){
        obj.datetime = controller.convertToJ(obj.datetime);
        controller.editCreate = true;
        controller.emptyForm = false;
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


      controller.resetInvoiceForm = function(){
          controller.obj.buyer = '';
          controller.obj.seller = '';
          controller.obj.invoice_no='';
          controller.obj.datetime ='';
          controller.obj.datetimeJ ='';
          controller.obj.num_of_products='';
          controller.obj.products=[];
          controller.obj.scanned_invoice='';
          controller.emptyForm = true;
      };

      controller.setNewInvoiceForm = function(){
          controller.resetInvoiceForm();
          controller.emptyForm = false;
          controller.editCreate = false;
      };

      controller.readInvoice = function(id){
        controller.resetInvoiceForm();
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

      };

      controller.selectProduct = function(){
        $scope.selectStage = 3;
        controller.openModal('select');
        controller.tmp.searchQuery = '';
        controller.search('product','model');
      };

      controller.pushProduct = function(id_, model_,price_){
        controller.obj.products.push({
          id:id_,
          model:model_,
          price:price_
        })
        controller.obj.num_of_products = controller.obj.products.length;
        controller.closeModal('select');
      }

      controller.deleteProduct = function(item_index){
        controller.obj.products.remove(item_index);
        controller.obj.num_of_products = controller.obj.products.length;
        controller.closeModal('delete');
      }

      controller.deleteInvoiceImage = function(){

      };

      controller.editOrCreate = function (state) {
        //preparing data 
        var obj = new Object();
        obj.datetime = controller.convertToG(controller.obj.datetime);
        
        obj.price = 0
        controller.obj.products.forEach(function(item,index){
          obj.price += item.price;
        })

        obj.products = [];
        controller.obj.products.forEach(function(item,index){
          obj.products.push({
            id: item.id,
            price: item.price
          });
        })

        
        obj.seller = controller.obj.seller['id'];
        obj.buyer = controller.obj.buyer['id'];
        obj.invoice_no = controller.obj.invoice_no;
        obj.scanned_invoice = controller.obj.scanned_invoice;
        obj.num_of_products = controller.obj.num_of_products;

        //sending request using requestHelper service
        $scope.loadModal = true;
        console.log(obj);
        if(state) {
          requestHelper.put($scope.apiUrl + "/" + $scope.toEditId , obj, $scope,
          function(response) {
            controller.emptyForm = true;
            controller.getData();
            $scope.reset();
          });
        } else {
          requestHelper.post($scope.apiUrl , obj, $scope,
          function(response) {
            controller.emptyForm = true;
            controller.getData();
            $scope.reset();
          });
        }
      }


  }
);