var app = angular.module("assetAdminPanel", ["ngRoute", "ngCookies", "ngStorage", "ngFileUpload", "ADM-dateTimePicker", "ngPersian"]);
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

    var assetPages = ['home','database','seller','producer','guarantor','warehouse','changepass','group','invoice','mywarehouse'];

    for (var i = 0; i < assetPages.length; i++) {
      $routeProvider.when("/" + assetPages[i] , {
          templateUrl : "../dist/templates/" + assetPages[i] + ".html",
          controller : assetPages[i] + "Ctrl",
          controllerAs : assetPages[i]
      });
    };
    $routeProvider
    .when("/product/:id?" , {
      templateUrl : "../dist/templates/product.html",
      controller : "productCtrl",
      controllerAs : "product"
    })
    .when("/user/:id?" , {
      templateUrl : "../dist/templates/user.html",
      controller : "userCtrl",
      controllerAs : "user"
    })
    .when("/ticket/:id?" , {
      templateUrl : "../dist/templates/ticket.html",
      controller : "ticketCtrl",
      controllerAs : "ticket"
    })
    .when("/transaction/:id?" , {
      templateUrl : "../dist/templates/transaction.html",
      controller : "transactionCtrl",
      controllerAs : "transaction"
    });
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
      if(!pDate)
        pDate = '';
      if( pDate.indexOf('T') >= 0 )
        {
          if ( moment(pDate).isDST() ) {
            pDate = moment(pDate).utcOffset(540).format('YYYY-MM-DDTHH:mm')
          }else{
            pDate = moment(pDate).utcOffset(480).format('YYYY-MM-DDTHH:mm')
          }
        }
      pDate = pDate.split('T');
      var dateArray = pDate[0].split('-');
      var transactionTime = pDate[1];
      var gDate = ADMdtpConvertor.toJalali(Number(dateArray[0]), Number(dateArray[1]), Number(dateArray[2]));
      var output = gDate.year + '/' + gDate.month + '/' + gDate.day;
      if ( typeof(transactionTime) != 'undefined') {
        output = output + " در ساعت " + transactionTime
      }
      return output;
    };


});

app.filter('filterObjById',function(){
  return function(input,itemId){
    var index = -1;
    if(!input) input = [];
    if(!input.length) input.length = 0;
    for(var i = 0; i<input.length;i++){
      if(input[i].id == itemId){
        index = i;
        break;
      }
    }

    if(index>-1) input.splice(index,1);
    return input
  }
})

app.filter('jalaliDate', function (mainAsset) {
      return function (inputDate) {
        var date = mainAsset.toJalaliDate(inputDate);
        return date;
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

app.filter('holderType', function() {
  return function(input) {
    var output;
    switch(input){
        case 'User':
          output = "کاربر";
        break;
        case 'Warehouse':
          output = "انبار";
        break;
    }
    return output;
  }
});

app.filter('ticketStatus', function() {
  return function(input) {
    var output;
    switch(input){
        case 0:
          output = "درخواست";
        break;
        case 1:
          output = "در حال پردازش";
        break;
        case 2:
          output = "بسته شده";
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
        case 'float':
          output = "عدد اعشاری";
        break;
    }
    return output;
  }
});

app.filter('productPrice', function() {
  return function(input) {
    var output;
    if (input == -1) {
      output = '− بدون قیمت −'
    }else{
      output = input;
    }
    return output;
  }
});

app.filter('depricateType', function() {
  return function(input) {
    var output;
    switch(input){
        case 0:
          output = "شروع استفاده";
        break;
        case 1:
          output = "تولید";
        break;
    }
    return output;
  }
});

app.filter('lengthLimit',function(){
  return function(input,customLength){
    if(typeof(input)=="string" && input.length > customLength){
      input = input.slice(0,customLength) + "...";
    }
    return input;
  }
});

app.filter('reasonType', function() {
  return function(input) {
    var output;
    switch(input){
        case 3:
          output = "بدون دلیل";
        break;
        case 2:
          output = "استهلاک";
        break;
        case 1:
          output = "تعمیرات";
        break;
        case 0:
          output = "تامین";
        break;
    }
    return output;
  }
});

app.filter('transactionType', function() {
  return function(input) {
    var output;
    switch(input){
        case 2:
          output = "انتقال";
        break;
        case 1:
          output = "عودت";
        break;
        case 0:
          output = "تخصیص";
        break;
    }
    return output;
  }
});

app.filter('userOrWarehouseName',function(){
  return function(input){
    if(input){
      if(input.type=="User")
        {return (input.obj.last_name || '')}
      else
        {return (input.obj.title || '')}
    }
  }
});
