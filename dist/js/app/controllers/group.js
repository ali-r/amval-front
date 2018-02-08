angular.module("assetAdminPanel").controller('groupCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, crud) {

  var controller = this;
  var apiName = 'group';

  controller.searchObject = [
    {'fname' : 'عنوان', 'field' : 'title'}
  ];

  controller.resetExt = function(){
    
    controller.selectGroupObj = {
      title : { fa : 'پدر', en : 'parent'},
      searchItem : {
        fa : 'گروه',
        en : 'group'
      },
      searchAt : {
        fa : 'عنوان',
        en : 'title'
      },
      table : [
        {fa:'عنوان',en:'title'},
        {fa:'توضیحات',en:'description'}
      ],
      searchFilter:{
        key: 'depth__lt',
        value: '6'
      }
    };
  }

  controller.resetExt();

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');
  controller.obj = {};
  controller.addOne={};
  controller.addOne.extra={};
 
  controller.addOne.extra.depth__lt = '2';
  controller.paginationConfig = {
    'addOne' : controller.addOne
  }

  $scope.apiUrl = mainAsset.getUrl() + apiName;

  controller.getConfig = function(obj){
    controller.selectGroupObj.searchFilter.key = "parent_for"
    controller.selectGroupObj.searchFilter.value = obj.id
    return obj;
  };

  controller.objConfig = function (obj) {
    sendCopyObj = angular.copy(obj);
    if (sendCopyObj.children)
      delete sendCopyObj.children;

    delete sendCopyObj.level;
    delete sendCopyObj.depth;
    delete sendCopyObj.products_name;

    if (sendCopyObj.parent)
      {
        sendCopyObj.parent = sendCopyObj.parent.id;
      }

    sendCopyObj.meta_template = (sendCopyObj.self_meta_template || []);
    delete sendCopyObj.self_meta_template;

    return sendCopyObj;
  };

  controller.deleteParent = function(obj){
    delete obj.parent;
  }

  crud.initModals($scope, controller, apiName, [], controller.resetExt);
  crud.init($scope, controller, apiName, controller.objConfig, controller.getConfig)

  this.deleteMeta = function(index){
    controller.obj.self_meta_template.splice (index, 1);
  };

  this.addMeta = function(type){
    var newMeta = {'key':'', 'type':type}
    if(!controller.obj.self_meta_template)
      controller.obj.self_meta_template=[];
    controller.obj.self_meta_template.push(newMeta);
  }

  this.getFilteredData = function(){
    var editedObj = angular.copy(controller.addOne);
    if(editedObj.extra.depth__lt)
      {
        editedObj.extra.depth__lt = controller.addOne.extra.depth__lt;
      }else {
        editedObj.extra.depth__lt = '2';
      }
    $scope.page = 1;
    $scope.getUrl = controller.makeUrl($scope.page, controller.paginationConfig);
    controller.getData();
  }
});
