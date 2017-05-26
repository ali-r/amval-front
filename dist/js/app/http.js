app.service('requestHelper', function($http) {
  scope = null
  httpService = this
  headers = {'Content-Type': 'application/json; charset=UTF-8'}

  this.init = function(scope) {
    this.scope = scope
    headers['Access-Token'] = scope.assetData.access_token
  }

  this.showModalLoading = function() {
    NProgress.start();
    this.scope.load = true;
  }

  this.hideModalLoading = function() {
    NProgress.done();
    this.scope.load = false;
  }

  this.successCallback = function(response, callback, notifyEnable=true) {
    console.log(response.data);
    callback(response)
    if (notifyEnable)
      new PNotify({
        title: 'موفق',
        text: 'تغییر کلمه عبور با موفقیت انجام شد',
        type: 'success'
      });
    httpService.hideModalLoading();
  }

  this.errorCallback = function(response) {
    new PNotify({
      title: 'خطا',
      text: 'عملیات موفقیت آمیز نبود.',
      type: 'error'
    });
    this.hideModalLoading();
  }

  this.get = function(url, scope, callback) {
    this.init(scope);
    this.showModalLoading();

    $http.get(url , {headers: headers})
      .then(function(response) {
        httpService.successCallback(response, callback, false)
      },
      this.errorCallback
    );
  };

  this.put = function(url, json, scope, callback) {
    this.init(scope);
    this.showModalLoading();

    $http.put(url, json, {headers: headers})
      .then(function(response) {
        httpService.successCallback(response, callback)
      },
      this.errorCallback
    );
  };

  this.post = function(url, json, scope, callback) {
    this.init(scope);
    this.showModalLoading();

    $http.post(url, json, {headers: headers})
      .then(function(response) {
        httpService.successCallback(response, callback)
      },
      this.errorCallback
    );
  };

  this.delete = function(url, scope, callback) {
    this.init(scope);
    this.showModalLoading();

    $http.delete(url , {headers: headers})
      .then(function(response) {
        httpService.successCallback(response, callback)
      },
      this.errorCallback
    );
  };
});
