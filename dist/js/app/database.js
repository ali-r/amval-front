angular.module("assetAdminPanel").controller('databaseCtrl', function($scope,$http,mainUrl){

  var begir = this ;

  this.download = function(){

    $scope.serverUrl = "https://api.gandom.co/api/api/v1" ;
    $scope.header = {'Access-Token':'User Request-Access token given after login'} ;

    $http.get($scope.serverUrl + "/database" + {headers: $scope.header})
  }

  this.upload = function(){

    $scope.serverUrl = "https://api.gandom.co/api/api/v1" ;
    $scope.header = {'Access-Token':'User Request-Access token given after login'} ;

    $http.post($scope.serverUrl + "/database" + {headers: $scope.header}) ;

  }
});
