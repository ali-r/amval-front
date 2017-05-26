app.service('requestHelper', function($http) {
  scope = null
  service = this
  headers = {'Content-Type': 'application/json; charset=UTF-8'}

  this.init = function(scope) {
    this.scope = scope
    headers['Access-Token'] = scope.assetData.access_token
  }

  this.showModalLoading = function() {
    NProgress.start();
    this.scope.load = true;
    this.scope.loadModal = true;
  }

  this.hideModalLoading = function() {
    NProgress.done();
    this.scope.load = false;
    this.scope.loadModal = false;
  }

  this.successCallback = function(response, callback) {
    console.log(response.data);
    callback(response)
    new PNotify({
      title: 'موفق',
      text: 'تغییر کلمه عبور با موفقیت انجام شد',
      type: 'success'
    });
    service.hideModalLoading();
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
        service.successCallback(response, callback)
      },
      this.errorCallback
    );
  };

  this.put = function(url, json, scope, callback) {
    this.init(scope);
    this.showModalLoading();

    $http.put(url, json, {headers: headers})
      .then(function(response) {
        service.successCallback(response, callback)
      },
      this.errorCallback
    );
  };

  this.delete = function(url, scope, callback) {
    this.init(scope);
    this.showModalLoading();

    $http.delete(url , {headers: headers})
      .then(function(response) {
        service.successCallback(response, callback)
      },
      this.errorCallback
    );
  };
});
