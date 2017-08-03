angular.module("assetAdminPanel").controller('groupCtrl',
  function($scope, $cookieStore, mainAsset, requestHelper, crud) {

  var controller = this;
  var apiName = 'group';

  controller.searchObject = [
    {'fname' : 'عنوان', 'field' : 'title'}
  ];

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
    ]
  };

  $scope.page = 1;
  $scope.assetData = $cookieStore.get('assetData');
  controller.obj = {};
  controller.addOne={};
  controller.addOne.extra={};
  controller.addOne.filter={
    key: 'group_type',
    value: 'group'
  }
  controller.addOne.extra.group_type = 'group';
  controller.paginationConfig = {
    'addOne' : controller.addOne
  }

  $scope.apiUrl = mainAsset.getUrl() + apiName;

  controller.objConfig = function (obj) {
    sendCopyObj = angular.copy(obj);
    if (sendCopyObj.children)
      delete sendCopyObj.children;

    if (!!sendCopyObj.parent)
      sendCopyObj.parent = sendCopyObj.parent.id;
    else delete sendCopyObj.parent;

    sendCopyObj.meta_template = (sendCopyObj.self_meta_template || []);
    delete sendCopyObj.self_meta_template;
    return sendCopyObj;
  };

  

  crud.initModals($scope, controller, apiName);
  crud.init($scope, controller, apiName, controller.objConfig)

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
    if(editedObj.extra.group_type){editedObj.extra.group_type = controller.addOne.extra.group_type;}
    else editedObj.extra.group_type = 'group';
    $scope.page = 1;
    controller.makeUrl($scope.page, controller.paginationConfig);
    controller.getData();
  }

});
