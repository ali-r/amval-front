app.service('requestHelper', function($cookieStore, $http, Upload, mainAsset, $window) {
  scope = null
  httpService = this
  headers = {'Content-Type': 'application/json; charset=UTF-8'}

  this.init = function(scope) {
    this.scope = scope
    if(scope.assetData === null || typeof(scope.assetData) === "undefined")
    {
      $cookieStore.remove('assetData');
      $cookieStore.remove('per');
      setTimeout(
      function () {
        $window.location.href = "../index.html";
      },500);
    }else{
      headers['Access-Token'] = scope.assetData.access_token;
    }
  }

  this.startLoading = function(needProgressBar=false) {
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
  }

  this.successCallback = function(response, callback = function(){}, notifyEnable=true) {
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
    new PNotify({
      title: 'خطا',
      text: 'عملیات موفقیت آمیز نبود.',
      type: 'error'
    });
    console.log(response);
    if (response.status === 401) {
      $cookieStore.remove('assetData');
      $cookieStore.remove('per');
      setTimeout(function () {
        $window.location.href = "../index.html";
      },500);
    };
    httpService.stopLoading();
    mainAsset.errorFunction(response,response.status);
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

  this.put = function(url, json, scope, callback,progressBar) {
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
      this.errorCallback
    );
  };

  this.uploadFileReq = function(file, type, scope, callback){
    scope.uploading = true;
    Upload.upload({
        url: mainAsset.getUploadUrl(),
        data: {image: file, 'type': type}
    }).then(function (resp) {
        console.log('Success ' + 'uploaded. Response: ' + resp.data);
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
