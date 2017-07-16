angular.module("assetAdminPanel").controller('productCtrl',
  function($scope, mainAsset, requestHelper, pagination, crud) {

  var controller = this;
  var apiName = 'product';

  controller.searchObject = [
    {'fname' : 'شماره سریال', 'field' : 'serial_number'},
    {'fname' : 'مدل کالا', 'field' : 'model'},
    {'fname' : 'شماره کارت', 'field' : 'card_no'}
  ];

  controller.selectHolderObj = {
    title : { fa : 'نگهدارنده', en : 'holder'},
    searchItem : {
      fa : 'کاربر',
      en : 'user'
    },
    searchAt : {
      fa : 'نام خانوادگی',
      en : 'last_name'
    },
    table : [
      {fa:'نام',en:'first_name'},
      {fa:'نام خانوادگی',en:'last_name'},
      {fa:'شماره کارت',en:'card_no'}
    ]
  };

  controller.selectProducerObj = {
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

  controller.selectSellerObj = {
    title : { fa : 'فروشنده', en : 'seller'},
    searchItem : {
      fa : 'فروشنده',
      en : 'seller'
    },
    searchAt : {
      fa : 'نام فروشگاه',
      en : 'store_name'
    },
    table : [
      {fa:'نام فروشگاه',en:'store_name'},
      {fa:'نام',en:'first_name'},
      {fa:'نام خانوادگی',en:'last_name'}
    ]
  };

  controller.selectGuarantorObj = {
    title : { fa : 'گارانتی', en : 'guarantor'},
    searchItem : {
      fa : 'گارانتی',
      en : 'guarantor'
    },
    searchAt : {
      fa : 'نام خانوادگی دبیر',
      en : 'secretary_last_name'
    },
    table : [
      {fa:'نام دبیر ',en:'secretary_first_name'},
      {fa:'نام خانوادگی دبیر',en:'secretary_last_name'}
    ]
  };

  controller.selectSubGroupObj = {
    title : { fa : 'زیرگروه', en : 'subgroup'},
    searchItem : {
      fa : 'زیر گروه',
      en : 'subgroup'
    },
    searchAt : {
      fa : 'عنوان زیرگروه',
      en : 'title'
    },
    table : [
      {fa:'نام دبیر ',en:'secretary_first_name'},
      {fa:'نام خانوادگی دبیر',en:'secretary_last_name'}
    ]
  };

  $scope.page = 1;

  $scope.apiUrl = mainAsset.getUrl() + apiName;
  $scope.getUrl = pagination.makeUrl($scope)

  controller.objConfig = function (obj) {
    if (obj.warehouse)
      obj.warehouse = obj.warehouse.id;
    return obj;
  };

  crud.initModals($scope, controller, apiName)
  crud.init($scope, controller, apiName, controller.objConfig)
  pagination.initPagination($scope, controller, 'meta', 'page', 'getUrl', 'searchObject', 'searchValue');

  this.resetPass = function(id) {
    requestHelper.put(
      $scope.apiUrl + '/' + id + '/password', {'new_password': controller.passToReset}, $scope,
      function(response) {
        $('#resetPassModal').modal('hide');
      });
  };

  this.openResetPassModal = function(id) {
    controller.toResetPassId = id;
    controller.passToReset = null;
    controller.passToResetConf = '';
    $scope.resetPassForm.pass.$pristine = true;
    mainAsset.openModal('#resetPassModal');
  };

  controller.obj.qr_code = '';
  this.uploadPic = function() {
    console.log($scope.productForm.file.$error)
    if(!$scope.productForm.file.$error.maxSize && controller.qrCodeFile)
    {
      requestHelper.uploadFileReq(controller.qrCodeFile, 'signature', $scope, function(data){
        controller.obj.qr_code = data.file_url;
        
        /*setTimeout(function () {
        var qr = QCodeDecoder();
        var code = document.getElementById(qrCodeImage);
        qr.decodeFromImage(code, function (err, result) {
          if (err) {console.log(err);};
          console.log(result);
        });
        },1000);*/
        
      });
    }
  }

});
