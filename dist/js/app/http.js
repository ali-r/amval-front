app.service('requestHelper', function($http) {
  scope = null
  httpService = this
  headers = {'Content-Type': 'application/json; charset=UTF-8'}

  this.init = function(scope) {
    this.scope = scope
    headers['Access-Token'] = scope.assetData.access_token
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
  }

  this.successCallback = function(response, callback, notifyEnable=true) {
    console.log(response.data);
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
});
