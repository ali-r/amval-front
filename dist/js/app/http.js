app.service('requestHelper', function($http) {
  scope = null
  service = this
  headers = {'Content-Type': 'application/json; charset=UTF-8'}

  this.init = function(scope) {
    this.scope = scope
    headers['Access-Token'] = scope.assetData.access_token
  }

  this.showModalLoading = function() {
    this.scope.loadModal = true;
  }

  this.hideModalLoading = function() {
    this.scope.loadModal = false;
  }

  this.errorCallback = function(response) {
    this.hideModalLoading();
  }

  this.get = function(url, scope, callback) {
    this.init(scope);
    this.showModalLoading();

    $http.get(url , {headers: headers})
      .then(function(response) {
        callback(response)
        service.hideModalLoading();
      },
      this.errorCallback
    );
  };

  this.delete = function(url, scope, callback) {
    this.init(scope);
    this.showModalLoading();

    $http.delete(url , {headers: headers})
      .then(function(response) {
        callback(response)
        service.hideModalLoading();
      },
      this.errorCallback
    );
  };
});
