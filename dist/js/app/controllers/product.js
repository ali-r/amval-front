angular.module("assetAdminPanel").controller('productCtrl',
  function($scope, mainAsset, requestHelper, pagination, crud) {

  var controller = this;
  var apiName = 'product';

  controller.searchObject = [
    {'fname' : 'شماره سریال', 'field' : 'serial_number'},
    {'fname' : 'مدل کالا', 'field' : 'model'},
    {'fname' : 'شماره کارت', 'field' : 'card_no'}
  ];

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

  controller.selectGroupObj = {
    title : { fa : 'زیرگروه', en : 'group'},
    searchItem : {
      fa : 'زیر گروه',
      en : 'group'
    },
    searchAt : {
      fa : 'عنوان',
      en : 'title'
    },
    table : [
      {fa:'عنوان',en:'title'},
      {fa:'توضیحات',en:'description'}
    ]
  };

  $scope.page = 1;

  $scope.apiUrl = mainAsset.getUrl() + apiName;
  $scope.getUrl = pagination.makeUrl($scope)

  controller.objConfig = function (obj) {
    sendCopyObj = angular.copy(obj);

    /*sendCopyObj.seller = sendCopyObj.seller.id;*/
    sendCopyObj.guarantor = sendCopyObj.guarantor.id;
    sendCopyObj.producer = sendCopyObj.producer.id;
    sendCopyObj.subgroup = sendCopyObj.subgroup.id;
    if(!sendCopyObj.is_out_of_system)
        sendCopyObj.is_out_of_system = false;

    if(!sendCopyObj.is_bundle)
        sendCopyObj.is_bundle = false;

    sendCopyObj.deprication_type = Number(sendCopyObj.deprication_type)

    return sendCopyObj;
  };

  this.setGroupStage = function(){
    $scope.stage = 3;
    $scope.loadSearch = true;
    var searchUrl = mainAsset.getUrl() + 'group?group_type=group&page=1&per_page=25';
    requestHelper.get(
      searchUrl, $scope,
      function(response) {
        controller.tmp.searchResult = response.data.groups;
        $scope.loadSearch = false;
      });
  };

  this.loadMeta = function(id){
    $scope.loadModal = true;
    var metaUrl = mainAsset.getUrl() + 'group/' + id;
    requestHelper.get(
      metaUrl, $scope,
      function(response) {
        controller.tmp.meta = response.data;
        if(!$scope.editMode)
          controller.obj.meta_data = [];
        console.log(controller.tmp.meta);
        $scope.loadSearch = false;
      });
  }

  crud.initModals($scope, controller, apiName)
  crud.init($scope, controller, apiName, controller.objConfig)
  pagination.initPagination($scope, controller, 'meta', 'page', 'getUrl', 'searchObject', 'searchValue');

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
