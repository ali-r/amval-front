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
    
    if(response.data.message.type) notif.type = response.data.message.type;
    else notif.type = 'info'

    if(notif.type == 'info') notif.title = 'موفق';
    else notif.title = 'هشدار'

    if(response.data.message.fa) notif.text = response.data.message.fa;
    else notif.text = 'عملیات موفقیت آمیز بود';

    if (notifyEnable)
      new PNotify(notif);
    httpService.stopLoading();
  }

  httpService.errorCallback = function(response,scope) {
    var notif = {};

    if(response.data.message.type == 'warn'){
      notif.type = 'warn';
      notif.title = 'هشدار';
      notif.text = response.data.message.fa;
    }
    else{
      notif.type = 'error';
      notif.title = 'خطا';
    }

    if(response.data.message.fa){
      notif.text = response.data.message.fa;
    }
    else{
      notif.text = 'عملیات موفقیت آمیز نبود.';
    }
          
    if(notif.type == 'warn'){ // handling confirm
      httpService.openConfirmModal(notif,scope)
    }
    else new PNotify(notif);
    
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

  

});
