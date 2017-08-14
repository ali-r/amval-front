angular.module("assetAdminPanel").controller('homeCtrl',
  function($scope, $localStorage, requestHelper, mainAsset){

    var controller = this;
    $scope.assetData = $localStorage.assetData;
    console.log($scope.assetData)


});
