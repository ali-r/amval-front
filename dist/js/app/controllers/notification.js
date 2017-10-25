angular.module("assetAdminPanel").controller('notificationCtrl',
function($scope, mainAsset, requestHelper, crud, $routeParams) {

    var controller = this;
    var apiName = 'notification';
    var scope = $scope;
    $scope.page = 1;

    $scope.apiUrl = mainAsset.getUrl() + apiName;
    crud.initModals($scope, controller, apiName);
    crud.init($scope, controller, apiName);
    
    controller.doConvert = function(){
        for(var i =0;i<controller.note.length;i++){
            marked(controller.note[i].message,function(err,content){
                $('#notif-'+i)[0].innerHTML = content ;            
            })
        }
    }
    
    controller.getData = function(url,callback) {
        if(url){
          var crudGetUrl = url;
        }else{
          var crudGetUrl = scope.getUrl;
        }
        requestHelper.get(
          crudGetUrl, scope,
          function(response) {
            if(callback)
              {
                callback(response);
              }else{
                scope.meta = response.data.meta;
                if(response.data.data.total_price) scope.total_price = response.data.data.total_price;
                else delete scope['total_price']
                controller.note = response.data.data[apiName + 's'];
                setTimeout(controller.doConvert,400);
            }
            console.log(response)  
          },true);
      };
    controller.getData($scope.apiUrl);
    
});
