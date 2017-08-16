app.service('requestHelper', function($localStorage, $http, Upload, mainAsset, $window, $cookies) {
  scope = null
  httpService = this
  headers = {'Content-Type': 'application/json; charset=UTF-8'}

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
    /*console.log(response.data);*/
    callback(response)
    if (notifyEnable)
      new PNotify({
        title: 'موفق',
        text: 'عملیات موفقیت آمیز بود',
        type: 'success'
      });
    httpService.stopLoading();
  }

  this.errorCallback = function(response) {
    var notif = {};
    notif.title = 'خطا';
    if(response.data.fa){
      notif.text = response.data.fa;
    }else{
      notif.text = 'عملیات موفقیت آمیز نبود.';
    }
    notif.type = 'error';
    new PNotify(notif);
    console.log(response);
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
        console.log('Success ' + 'uploaded. Response: ');
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
