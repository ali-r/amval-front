angular.module("assetAdminPanel").controller('invoiceCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, pagination, crud)
  {

      var controller = this;
      var apiName = 'invoice';
      controller.emptyForm = true;
      controller.editCreate = true;    //Edit: true, Create: false

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
      controller.obj.datetime='';
      controller.obj.num_of_products='';
      controller.obj.products=[];
      controller.obj.scanned_invoice='';

      crud.init($scope, controller, apiName);
      pagination.initPagination($scope, controller, 'meta', 'page', 'getUrl', 'searchObject', 'searchValue');


      controller.resetInvoiceForm = function(){
          controller.obj.buyer = '';
          controller.obj.seller = '';
          controller.obj.invoice_no='';
          controller.obj.datetime='';
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
        controller.getObject(id);
        controller.resetInvoiceForm();
        controller.editCreate = true;
        controller.emptyForm = false;
      };

      controller.selectBuyer = function(){

      };

      controller.selectSeller = function(){

      };

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