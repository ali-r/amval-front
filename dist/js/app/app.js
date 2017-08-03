var app = angular.module("assetAdminPanel", ["ngRoute", "ngCookies", "ngStorage", "ngFileUpload", "ADM-dateTimePicker"]);
app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);
app.config(function ($httpProvider) {

  if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
  }
  $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
  $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
});
app.config(['ADMdtpProvider', function(ADMdtp) {
    ADMdtp.setOptions({
        calType: "jalali", 
        format: "YYYY-MM-DD", 
        zIndex : 1100, 
        dtpType : "date", 
        freezeInput : "true", 
        multiple : false, 
        autoClose :true,
        transition : false
    });
}]);
angular.module("assetAdminPanel").config(function($routeProvider) {

    var assetPages = ['home','database','user','seller','producer','guarantor','warehouse','changepass','product','group','invoice','transaction'];

    for (var i = 0; i < assetPages.length; i++) {
      $routeProvider.when("/" + assetPages[i] , {
          templateUrl : "../dist/templates/" + assetPages[i] + ".html",
          controller : assetPages[i] + "Ctrl",
          controllerAs : assetPages[i]
      });
    };
});
app.service('mainAsset', function($window, $http, ADMdtpConvertor) {
    this.devMode = assetPanelData.devMode;
    this.getUrl = function () {
      return assetPanelData.serverUrl;
    };
    this.getUploadUrl = function () {
      return assetPanelData.uploadUrl;
    };

    this.openModal = function (modal) {
      $(modal).modal({
          backdrop: 'static',
          keyboard: false
        });
      $(modal).modal('show');
    };

    this.closeModal = function (modal) {
      $(modal).modal('hide');
    };

    this.toGregorianDate = function(pDate){
      var dateArray = pDate.split('-');
      var gDate = ADMdtpConvertor.toGregorian(Number(dateArray[0]), Number(dateArray[1]), Number(dateArray[2]));
      return (gDate.year + '-' + gDate.month + '-' + gDate.day);
    }

    this.toJalaliDate = function(pDate){
      var dateArray = pDate.split('-');
      var gDate = ADMdtpConvertor.toJalali(Number(dateArray[0]), Number(dateArray[1]), Number(dateArray[2]));
      return (gDate.year + '-' + gDate.month + '-' + gDate.day);
    };

});

app.filter('jalaliDate', function () {
      return function (inputDate, format) {
        moment.loadPersian();
        var date = moment(inputDate).utcOffset(420);
        return date.format(format);
    }
});

app.filter('userType', function() {
  return function(input) {
    var output;
    switch(input){
        case 3:
          output = "مدیر";
        break;
        case 2:
          output = "انباردار مرکزی";
        break;
        case 1:
          output = "انباردار";
        break;
        case 0:
          output = "کاربر";
        break;
    }
    return output;
  }
});

app.filter('metaType', function() {
  return function(input) {
    var output;
    switch(input){
        case 'int':
          output = "عدد صحیح";
        break;
        case 'str':
          output = "رشته";
        break;
        case 'bool':
          output = "دو حالتی";
        break;
    }
    return output;
  }
});

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
        }

        if(paginationConfig.url){
          
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

      scope.setGroupStage = function(){
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
             scope.controller.product.meta_data[i] = {'key' : response.data.meta_template[i].key, value: ''}
            }

            console.log(scope.controller.tmp.meta);
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

        if(!sendCopyObj.is_bundle){
          sendCopyObj.is_bundle = false;
          delete sendCopyObj.children;
        }

        sendCopyObj.deprication_type = Number(sendCopyObj.deprication_type);

        if(scope.$parent.editMode){
          delete sendCopyObj.deprication_time;
          delete sendCopyObj.holder;
          delete sendCopyObj.parent_bundle;
          delete sendCopyObj.price;
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

        for (var i = 0; i < sendCopyObj.meta_data.length; i++) {
          console.log(sendCopyObj.meta_data[i].value);
          if(!sendCopyObj.meta_data[i].value || typeof(sendCopyObj.meta_data[i].value) == 'undefined')
            {
              sendCopyObj.meta_data.splice(i, 1);
            }
          
        }

        return sendCopyObj;
      };

      scope.sendOrEdit = function(){
        scope.controller.sendOrEdit(false, scope.objConfig(scope.controller.product), mainAsset.getUrl() + 'product', function(data){
          scope.controller.creatProductCallback(data.data);
          $('#productModal').modal('hide');
          scope.controller.product = {};
        });
      }

    },
    templateUrl: '/dist/js/app/directive/creatproduct.html'
  }
});

angular.module("assetAdminPanel").controller('mainCtrl',
  function( $scope, $http, $localStorage, $window){


    /*console.log($localStorage.assetData);*/
    if(!$localStorage.assetData)
    {
      setTimeout(
      function () {
        $window.location.href = "../index.html";
      },1000);
    }else{
      var nowTime = new Date();
      nowTime = Math.floor(nowTime.getTime()/1000);
      var difTime = nowTime - $localStorage.assetData.login_time;
      if( difTime > 14400 ){

        while ($localStorage.assetData) {
          delete $localStorage.assetData;
        }

        setTimeout(
        function () {
          $window.location.href = "../index.html";
        },1000);

      }else{
        $scope.userData = $localStorage.assetData;
        $scope.per = $localStorage.assetData.permissions;
      }
    }



    this.checkPer = function (param){
      if( $scope.per[param] == 'none' || typeof($scope.per[param]) == "undefined"){
        return false;
      }else{
        return true;
      }
    }

});
