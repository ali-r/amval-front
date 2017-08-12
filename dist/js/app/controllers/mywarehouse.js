angular.module("assetAdminPanel").controller('mywarehouseCtrl',
  function($scope, $localStorage, requestHelper, mainAsset){

    var controller = this;
    $scope.assetData = $localStorage.assetData;



});
