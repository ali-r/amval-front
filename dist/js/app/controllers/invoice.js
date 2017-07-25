var testVar;
angular.module("assetAdminPanel").controller('invoiceCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, pagination, crud, ADMdtpConvertor)
  {

      var controller = this;
      var apiName = 'invoice';
      controller.emptyForm = true;
      controller.editCreate = true;    //Edit: true, Create: false
      $scope.buyerSeller = true;       //Buyer:true, Seller:false, usage in select modal

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
        $scope.buyerSeller = true;
        controller.openModal('select');
        controller.tmp.searchQuery = '';
        controller.search('user','last_name');
      };

      controller.selectSeller = function(){
        $scope.buyerSeller = false;
        controller.openModal('select');
        controller.tmp.searchQuery = '';
        controller.search('seller','last_name');
      };

      controller.selectPerson = function(id, title, titleFiled, variable){
        controller.selectTarget(id, title, titleFiled, variable);
        controller.closeModal('select');
      }

      controller.addProduct = function(){

      };

      controller.selectProduct = function(){

      };

      controller.deleteInvoiceImage = function(){

      };

      controller.editOrCreate = function (state) {

      }


  }
);