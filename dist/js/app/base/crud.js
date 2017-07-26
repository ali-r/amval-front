app.service('crud', function($localStorage,requestHelper, mainAsset) {
  crudService = this

  this.initModals = function(scope, controller, name, variables) {
    scope.meta = {};
    scope.reset = function() {
      scope.load = false;
      scope.loadModal = false;
      scope.loadSearch = false;
      scope.editMode = false;
      scope.uploadPercentage = 0;
      scope.uploading = false;
      scope.stage = 0;

      controller.obj = {};
      controller.tmp = {};
      for (variable in variables)
        variable = "";
    }
    scope.reset();

    scope.openModal = function () {
      mainAsset.openModal('#' + name + 'Modal');
    }
  }

  this.init = function(scope, controller, name, objConfig, getConfig) {

    if ( typeof(objConfig) == 'undefined' ) {
      objConfig = function(obj){return obj;};
    }

    if ( typeof(getConfig) == 'undefined' ) {
      getConfig = function(obj){return obj;};
    }

    scope.checkWrite = function(param){
      if( $localStorage.assetData.permissions[param] == 'write'){
        return true;
      }else{
        return false;
      }
    }

    controller.getData = function() {
      requestHelper.get(
        scope.getUrl, scope,
        function(response) {
          scope.meta = response.data.meta;
          controller.note = response.data[name + 's'];
        },true);
    };
    controller.getData();

    controller.getFilteredData = function() {
      scope.page = 1;
      scope.getUrl = controller.makeUrl();
      controller.getData();
    };

    controller.selectTarget = function(id, title, titleFiled, variable){
      controller.obj[variable] = {};
      controller.obj[variable][titleFiled] = title;
      controller.obj[variable].id = id;
      scope.stage = 0;
    };

    controller.getObject = function(id) {
      scope.toEditId = id;
      scope.editMode = true;
      scope.loadModal = true;
      mainAsset.openModal('#' + name + 'Modal');

      requestHelper.get(
        scope.apiUrl + "/" + id,  scope,
        function(response) {
          controller.obj = getConfig(response.data);
          console.log(response.data);
          scope.loadModal = false;
        });
    };

    controller.sendOrEdit = function(editMode){
      var sendObj = new Object();
      sendObj = angular.copy(controller.obj);
      delete sendObj['id'];
      scope.loadModal = true;
      sendObj = objConfig(sendObj);
      console.log(sendObj);
      if(editMode) {
        requestHelper.put(scope.apiUrl + "/" + scope.toEditId , sendObj, scope,
        function(response) {
          $('#' + name + 'Modal').modal('hide');
          controller.getData();
          scope.reset();
        });
      } else {
        requestHelper.post(scope.apiUrl , sendObj, scope,
        function(response) {
          $('#' + name + 'Modal').modal('hide');
          controller.getData();
          scope.reset();
        });
      }
    };

    controller.deleteObject = function(id) {

      requestHelper.delete(
        scope.apiUrl + "/" + id,  scope,
        function(response) {
          if( controller.note.length == 1 ){
            scope.page -= 1;
            scope.getUrl = controller.makeUrl();
          }
          controller.getData();
          $('#deleteModal').modal('hide');
        });
    };

    controller.search = function(cat, field){
      scope.loadSearch = true;
      var searchUrl = mainAsset.getUrl() + cat;

      if(field.indexOf('?') == -1 && field != ''){
        searchUrl += '?' + field + '__contains=' + controller.tmp.searchQuery;
      }else{
        searchUrl += field;
      }
      console.log(searchUrl);
      requestHelper.get(
        searchUrl, scope,
        function(response) {
          controller.tmp.searchResult = response.data[cat + 's'];
          scope.loadSearch = false;
        });
    };

    controller.selectThings = function(stage, object, field){
      scope.stage = stage;
      controller.tmp.searchQuery = '';
      controller.tmp.searchResult = [];
      controller.search(object, field);
    };
  }
});
