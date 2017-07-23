angular.module("assetAdminPanel").controller('invoiceCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, pagination, crud)
  {

      var controller = this;
      var apiName = 'seller';
      var emptyForm = true;

      controller.searchObject = [
          {'fname' : '‘„«—Â ›«ò Ê—', 'field' : 'invoice_no'},
          {'fname' : 'ﬁ?„  ›«ò Ê—', 'field' : 'price'},
          {'fname' : 'Œ—?œ«—', 'field' : 'buyer'},
          {'fname' : '›—Ê‘‰œÂ', 'field' : 'seller'}
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
      controller.obj.products='';
      controller.obj.scanned_invoice='';

      crud.init($scope, controller, apiName);
      pagination.initPagination($scope, controller, 'meta', 'page', 'getUrl', 'searchObject', 'searchValue');


  }
);