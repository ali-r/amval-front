angular.module("assetAdminPanel").controller('notificationCtrl',
function($scope, mainAsset, requestHelper, crud, $routeParams) {

var controller = this;
var apiName = 'notification';

$scope.uploadUrl = mainAsset.getUploadUrl();

controller.searchObject = [
];

$scope.page = 1;

$scope.apiUrl = mainAsset.getUrl() + apiName;

crud.initModals($scope, controller, apiName)
crud.init($scope, controller, apiName)

});
