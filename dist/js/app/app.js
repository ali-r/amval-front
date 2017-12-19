var app = angular.module("assetAdminPanel", ["ngRoute", "ngCookies", "ngStorage", "ngFileUpload", "ADM-dateTimePicker", "ngPersian", "ui.tree"]);
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

    var assetPages = ['home','database','seller','producer','guarantor','warehouse','changepass','group','invoice','mywarehouse','config','notification','emptydatabase'];

    for (var i = 0; i < assetPages.length; i++) {
      $routeProvider.when("/" + assetPages[i] , {
          templateUrl : "/dist/templates/" + assetPages[i] + ".html",
          controller : assetPages[i] + "Ctrl",
          controllerAs : assetPages[i]
      });
    };
    $routeProvider
    .when("/product/:id?" , {
      templateUrl : "/dist/templates/product.html",
      controller : "productCtrl",
      controllerAs : "product"
    })
    .when("/user/:id?" , {
      templateUrl : "/dist/templates/user.html",
      controller : "userCtrl",
      controllerAs : "user"
    })
    .when("/ticket/:id?" , {
      templateUrl : "/dist/templates/ticket.html",
      controller : "ticketCtrl",
      controllerAs : "ticket"
    })
    .when("/transaction/:id?" , {
      templateUrl : "/dist/templates/transaction.html",
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
          keyboard: true
        });
      
      $(modal).modal('show');
    };

    this.closeModal = function (modal) {
      $(modal).modal('hide');
    };

    this.toGregorianDate = function(pDate,config){
      if(!pDate)
        pDate = '';

      if(!config) config = {}
      var outDate = ''
      if(pDate.indexOf(' ') >= 0){
        var splitted = pDate.split(' ');
        var time = splitted[0];
        var dateArray = splitted[1].split('-');
        var gDate = ADMdtpConvertor.toGregorian(Number(dateArray[0]), Number(dateArray[1]), Number(dateArray[2]));
        outDate = moment( gDate.year + '-' + gDate.month + '-' + gDate.day + ' ' + time + ':00' ,"YYYY-MM-DD HH:mm:ss");
        outDate = moment(outDate).utcOffset(0).format('YYYY-MM-DDTHH:mm:ss')
      }
      else{
        var dateArray = pDate.split('-');
        var gDate = ADMdtpConvertor.toGregorian(Number(dateArray[0]), Number(dateArray[1]), Number(dateArray[2]));
        outDate = gDate.year + '-' + gDate.month + '-' + gDate.day;
      }

      if(config.noTime && outDate.indexOf('T')>=0) outDate = outDate.split('T')[0];
      return (outDate);        
    }

    this.toJalaliDate = function(pDate,config){
      if(!pDate)
        pDate = '';

      if(!config) config = {};
      if(!config.baseOffset) config.baseOffset = 480;
      if(!config.timeText) config.timeText = "در ساعت";
      if(config.deleteTime && pDate.indexOf('T')>=0) pDate = pDate.split('T')[0]; 

      if( pDate.indexOf('T') >= 0 )
        {
          if ( moment(pDate).isDST() ) {
            pDate = moment(pDate).utcOffset(config.baseOffset+60).format('YYYY-MM-DDTHH:mm');
          }else{
            pDate = moment(pDate).utcOffset(config.baseOffset).format('YYYY-MM-DDTHH:mm');
          }
        }
      pDate = pDate.split('T');
      var dateArray = pDate[0].split('-');
      var transactionTime = pDate[1];
      var gDate = ADMdtpConvertor.toJalali(Number(dateArray[0]), Number(dateArray[1]), Number(dateArray[2]));
      var output = gDate.year + '/' + gDate.month + '/' + gDate.day;
      if ( typeof(transactionTime) != 'undefined') {
        output = output + "  ساعت " + transactionTime
      }
      return output;
    };

    this.log = function(logText){
      if(assetPanelData.devMode){
        console.log(logText)
      }
    };

    this.convertMarkdownToHtml = function(data_,resultHandler_){
      marked(data_,function(err,content){
        if(err){
          mainAsset.log(err);
        }
        else{
          if(typeof(resultHandler_)==='function'){
            resultHandler_(content);
          }
          else{
            resultHandler_ = content          
          }
        }
      })
    }

});

app.filter('filterObjById',function(){
  return function( items, filterId) {
    var filtered = [];
    angular.forEach(items, function(item) {
      if(item.id != filterId) {
        filtered.push(item);
      }
    });
    return filtered;
  };
})

app.filter('jalaliDate', function (mainAsset) {
      return function (inputDate) {
        var date = mainAsset.toJalaliDate(inputDate);
        return date;
    }
});

app.filter('currentJalaliDate', function (mainAsset) {
  return function (inputDate) {
    var date = mainAsset.toJalaliDate(inputDate,{baseOffset:210});
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
          output = "درخواست شده";
        break;
        case 1:
          output = "در حال پیگیری";
        break;
        case 2:
          output = "پایان یافته";
        break;
    }
    return output;
  }
});

app.filter('ticketType', function() {
  return function(input) {
    var output="";
    if(input==0 || input=="0") output = "غیره";
    else if(input==1 || input=="1") output = "خرید";
    else if(input==2 || input=="2") output = "تخصیص";
    else if(input==3 || input=="3") output = "عودت";
    return output;
  }
});

app.filter('ticketReason', function() {
  return function(input) {
    var output = "";
    if(input==0 || input=="0") output = "غیره";
    else if(input==1 || input=="1") output = "تسویه";
    else if(input==2 || input=="2") output = "خرابی";
    else if(input==3 || input=="3") output = "استهلاک";
    return output;
  }
});

app.filter('metaType', function() {
  return function(input) {
    var output;
    switch(input){
        case 'num':
          output = "عدد";
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
    input = Number(input)
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
    input = Number(input)
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
        {return (input.obj.first_name + ' ' + input.obj.last_name || '')}
      else
        {return (input.obj.title || '')}
    }
  }
});

app.filter('productName',function(){
  return function(input){
    if(input){
      return (input.model || '')
    }
  }
});

app.filter('nullFilter',function(){
  return function(input){return(input || '−−ندارد−−');}
});

app.filter('clerkFilter',function(){
  return function(input){
    var output;
    if (input) {
      output = input.first_name + ' ' + input.last_name
    }else{
      output = '-- ندارد --'
    }
    return(output);
  }
});

app.filter('useFilter', function($filter) {
    return function() {
        var filterName = [].splice.call(arguments, 1, 1)[0];
        if(!!filterName){return $filter(filterName).apply(null, arguments);}
        else{return $filter('nullFilter').apply(null, arguments);}
        
    };
});

app.filter('transactionIdDisplay', function() {
  return function(input) {
    var output;
    if (!input || input=='') {
      output = '− بدون شناسه −'
    }else{
      output = input;
    }
    return output;
  }
});