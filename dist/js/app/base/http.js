app.service('requestHelper', function($localStorage, $http, Upload, mainAsset, $window, $cookies) {
  scope = null
  httpService = this
  headers = {'Content-Type': 'application/json; charset=UTF-8'}
  httpService.headers = headers;
  this.init = function(scope) {
    this.scope = scope
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

  this.startLoading = function(needProgressBar) {
    if ( typeof(needProgressBar) == 'undefined' ) {
      needProgressBar = false;
    }
    if (needProgressBar) {
      NProgress.start();
      this.scope.load = true;
    }
  }

  this.stopLoading = function() {
    NProgress.done();
    this.scope.load = false;
    this.scope.loadModal = false;
    this.scope.loadSearch = false;
    this.scope.loadSide = false;
  }

  this.successCallback = function(response, callback , notifyEnable) {

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

  this.errorCallback = function(response) {
    var notif = {};

    if(response.data.message.type == 'warn'){
      notif.type = 'warn';
      notif.title = 'هشدار';
      notif.text = response.data.message.fa;
    }
    else{
      notif.type == 'error';
      notif.title = 'خطا';
    }

    if(response.data.message.fa){
      notif.text = response.data.message.fa;
    }
    else{
      notif.text = 'عملیات موفقیت آمیز نبود.';
    }
    console.log('notif:')
    console.log(notif)
    new PNotify(notif);      
    
    if(notif.type == 'warn'){ // handling confirm
      console.log('TODO:');
      console.log('a confirm modal must be displayed');
    }
    mainAsset.log(response);
    if (response.status === 401) {
      $localStorage.$reset();
      setTimeout(function () {
        $window.location.href = "../index.html";
      },500);
    };
    httpService.stopLoading();
  }

  this.get = function(url, scope, callback ,progressBar) {
    this.init(scope);
    this.startLoading(progressBar);

    $http.get(url , {headers: headers})
      .then(function(response) {
        httpService.successCallback(response, callback, false)
      },
      this.errorCallback
    );
  };

  this.put = function(url, json, scope, callback, progressBar) {
    this.init(scope);
    this.startLoading(progressBar);

    $http.put(url, json, {headers: headers})
      .then(function(response) {
        httpService.successCallback(response, callback)
      },
      this.errorCallback
    );
  };

  this.post = function(url, json, scope, callback, progressBar) {
    this.init(scope);
    this.startLoading(progressBar);

    $http.post(url, json, {headers: headers})
      .then(function(response) {
        httpService.successCallback(response, callback)
      },
      this.errorCallback
    );
  };

  this.delete = function(url, scope, callback, progressBar) {
    this.init(scope);
    this.startLoading(progressBar);

    $http.delete(url , {headers: headers})
      .then(function(response) {
        httpService.successCallback(response, callback)
      },
      function(response) {
        httpService.errorCallback(response);
        $('.modal').modal('hide');
      }
    );
  };

  this.uploadFileReq = function(file, type, scope, callback){
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
        this.errorCallback(resp.status);
    }, function (evt) {
        scope.uploadPercentage = parseInt(100.0 * evt.loaded / evt.total) + '%';
    });
  }

});
