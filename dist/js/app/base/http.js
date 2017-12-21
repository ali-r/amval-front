app.service('requestHelper', function($localStorage, $http, Upload, mainAsset, $window, $cookies) {
  scope = null
  httpService = this
  headers = {'Content-Type': 'application/json; charset=UTF-8'}
  httpService.headers = headers;
  httpService.init = function(scope) {
    httpService.scope = scope
    scope.assetData = $localStorage.assetData;
    if(!scope.assetData)
    {
      $localStorage.$reset();
      setTimeout(
      function () {
        $window.location.href = "../index.html";
      },500);
    }else{
      headers['Access-Token'] = scope.assetData.access_token;
    }

  }

  httpService.startLoading = function(needProgressBar) {
    if ( typeof(needProgressBar) == 'undefined' ) {
      needProgressBar = false;
    }
    if (needProgressBar) {
      NProgress.start();
      httpService.scope.load = true;
    }
  }

  httpService.stopLoading = function() {
    NProgress.done();
    httpService.scope.load = false;
    httpService.scope.loadModal = false;
    httpService.scope.loadSearch = false;
    httpService.scope.loadSide = false;
  }

  httpService.successCallback = function(response, callback , notifyEnable) {

    if ( typeof(callback) == 'undefined' ) {
      callback = function(){};
    }

    if ( typeof(notifyEnable) == 'undefined' ) {
      notifyEnable = true;
    }
    /*mainAsset.log(response.data.data);*/
    callback(response)

    var notif = {};
    
    if(response.data.message && response.data.message.type) notif.type = response.data.message.type;
    else notif.type = 'info'

    if(notif.type == 'info') notif.title = 'موفق';
    else notif.title = 'هشدار'

    if(response.data.message && response.data.message.fa){
      mainAsset.convertMarkdownToHtml(response.data.message.fa,function(content_){
        notif.text = content_;
      })
    } 
    else notif.text = 'عملیات موفقیت آمیز بود';

    if (notifyEnable)
      new PNotify(notif);
    httpService.stopLoading();
  }

  httpService.errorCallback = function(response,scope) {
    var notif = {};

    if(response.data.message && response.data.message.type == 'warn'){
      notif.type = 'warn';
      notif.title = 'هشدار';
      mainAsset.convertMarkdownToHtml(response.data.message.fa,function(content_){
        notif.text = content_;
      })
    }
    else{
      notif.type = 'error';
      notif.title = 'خطا';
    }

    if(response.data.message && response.data.message.fa){
      mainAsset.convertMarkdownToHtml(response.data.message.fa,function(content_){
        notif.text = content_;
      })
    }
    else{
      notif.text = 'عملیات موفقیت آمیز نبود.';
    }

    PNotify.prototype.options.delay = notif.text.length * 30 ;
    
    if(notif.type == 'warn'){ // handling confirm
      (new PNotify({
        title: notif.title,
        text: notif.text,
        type: notif.type,
        icon: 'glyphicon glyphicon-question-sign',
        hide: false,
        confirm: {
            confirm: true,
            buttons: [{
              text: 'تایید',
              addClass: 'btn'
            },
            {
              text: 'انصراف',
              addClass: 'btn'
            }
          ]
        },
        buttons: {
            closer: false,
            sticker: false
        },
        history: {
            history: false
        },
        addclass: 'stack-modal',
        stack: {
            'dir1': 'down',
            'dir2': 'right',
            'modal': true
        }
        })).get().on('pnotify.confirm', function() {
            httpService.scope.doConfirm(httpService.scope.preRequest);
        }).on('pnotify.cancel', function() {
          // doing nothing
        });
    }
    else new PNotify(notif);

    PNotify.prototype.options.delay = 2000 ;
    
    mainAsset.log(response);
    if (response.status === 401) {
      $localStorage.$reset();
      setTimeout(function () {
        $window.location.href = "../index.html";
      },500);
    };
    httpService.stopLoading();
  }

  httpService.get = function(url, scope, callback ,progressBar) {
    httpService.init(scope);
    httpService.startLoading(progressBar);

    $http.get(url , {headers: headers})
      .then(function(response) {
        httpService.successCallback(response, callback, false)
      },
      function(response){
        httpService.errorCallback(response,scope)        
      }
    );
  };

  httpService.put = function(url, json, scope, callback, progressBar) {
    httpService.init(scope);
    httpService.startLoading(progressBar);

    $http.put(url, json, {headers: headers})
      .then(function(response) {
        httpService.successCallback(response, callback)
      },
      function(response){
        httpService.errorCallback(response,scope)        
      }
    );
  };

  httpService.post = function(url, json, scope, callback, progressBar) {
    httpService.init(scope);
    httpService.startLoading(progressBar);

    $http.post(url, json, {headers: headers})
      .then(function(response) {
        httpService.successCallback(response, callback)
      },
      function(response){
        httpService.errorCallback(response,scope)        
      }
    );
  };

  httpService.delete = function(url, scope, callback, progressBar) {
    httpService.init(scope);
    httpService.startLoading(progressBar);

    $http.delete(url , {headers: headers})
      .then(function(response) {
        httpService.successCallback(response, callback)
      },
      function(response) {
        httpService.errorCallback(response,scope);
        $('.modal').modal('hide');
      }
    );
  };

  httpService.uploadFileReq = function(file, type, scope, callback){
    scope.uploading = true;
    Upload.upload({
        url: mainAsset.getUploadUrl(),
        data: {image: file, 'type': type}
    }).then(function (resp) {
        mainAsset.log('Success ' + 'uploaded. Response: ');
        scope.uploadPercentage = 0;
        callback(resp.data);
        scope.uploading = false;
    }, function (resp) {
        scope.uploading = false;
        scope.uploadPercentage = 0;
        httpService.errorCallback(resp.status,scope);
    }, function (evt) {
        scope.uploadPercentage = parseInt(100.0 * evt.loaded / evt.total) + '%';
    });
  }

  httpService.openConfirmModal = function(_message,scope){
    mainAsset.openModal('#confirmModal');
    scope.confirmMessage = _message;
  }

  httpService.uploadDatabase = function(_scope,_request){
    httpService.init(_scope);
    
    httpService.scope.uploading = true;        

    Upload.upload({
      url: _request.url,
      method : _request.method,
      headers: httpService.headers,
      data: {'database' : _request.data}
    }).then(function (resp) {
      httpService.scope.uploading = false;
      httpService.scope.uploadPercentage = 0;
          
      if(typeof(_request.successCallback)==='function'){
        _request.successCallback(resp);
      }else{
        httpService.successCallback(resp);
      }
            
    }, function (resp) {
      if(typeof(_request.errorCallback)==='function'){
        _request.errorCallback(resp)
      }else{
        httpService.scope.uploading = false;
        httpService.scope.uploadPercentage = 0;
        httpService.errorCallback(resp);
      }
          
    }, function (evt) {
      if(typeof(_request.handler)==='function'){
        _request.handler(evt)
      }else{
        httpService.scope.uploadPercentage = parseInt(100.0 * evt.loaded / evt.total) + '%';
      }
    });
  }
    
  
});
