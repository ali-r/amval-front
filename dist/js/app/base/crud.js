app.service('crud', function($localStorage,requestHelper, mainAsset) {
  crudService = this

  this.initModals = function(scope, controller, apiName, variables) {
    scope.meta = {};
    scope.reset = function() {
      scope.load = false;
      scope.loadModal = false;
      scope.loadSearch = false;
      scope.editMode = false;
      scope.uploadPercentage = 0;
      scope.uploading = false;
      scope.stage = 0;
      scope.loadSide = false;

      controller.obj = {};
      controller.tmp = {};
      for (variable in variables)
        variable = "";
    }
    scope.reset();

    scope.openModal = function () {
      mainAsset.openModal('#' + apiName + 'Modal');
    }
  }

  this.init = function(scope, controller, apiName, objConfig, getConfig) {

    scope.uploadUrl = mainAsset.getUploadUrl();
    scope.perPage = '10';

    if ( typeof(objConfig) == 'undefined' ) {
      objConfig = function(obj){return obj;};
    }

    if ( typeof(getConfig) == 'undefined' ) {
      getConfig = function(obj){return obj;};
    }

    controller.notEmpty = function(string) {
      return (typeof(string) != "undefined") && (string !== "") && (string + "" != 'undefined') && (string + "" != 'NaN');
    }

    controller.makeUrl = function(page, config){

      if ( typeof(config) == 'undefined' ) {
        config = {};
      }

      if ( typeof(page) == 'undefined' ) {
        page = 1;
      }

      var addOne = config.addOne,
          keys = {};

      if ( !config.url ) {
          var url = scope.apiUrl + "?page=" + page + "&per_page=" + scope.perPage;

          if(addOne){
            for ( key in addOne.extra) {
              keys[key] = addOne.extra[key];
            }
          }

          if(controller.searchValue){

            for (var i = 0; i < controller.searchObject.length; i++) {
              keys[controller.searchObject[i].field + '__contains'] = controller.searchValue[controller.searchObject[i].field];
            }

            keys.sort = controller.searchValue.order + controller.searchValue.type

          }

        }else{
          var url = config.url + "?page=" + page + "&per_page=10";

          for ( opt in config.searchOpt ) {
            keys[opt] = config.searchOpt[opt]
          }
        }

        

        

        for (name in keys) {
          if (controller.notEmpty(keys[name]))
            url += "&" + name + "=" + keys[name];
        }

        console.log(url)
        return url;
    }

    scope.getUrl = controller.makeUrl(scope.page, controller.paginationConfig);
    scope.assetData = $localStorage.assetData;

    scope.checkWrite = function(param){
      if( $localStorage.assetData.permissions[param] == 'write'){
        return true;
      }else{
        return false;
      }
    }

    controller.getData = function(callback, url) {
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
              controller.note = response.data[apiName + 's'];
            }
        },true);
    };
    controller.getData();

    controller.getFilteredData = function() {
      scope.page = 1;
      scope.getUrl = controller.makeUrl(scope.page,controller.paginationConfig);
      controller.getData();
    };

    controller.selectTarget = function(id, title, titleFiled, variable, targetObj){
      console.log(targetObj)
      if ( typeof(targetObj) == 'undefined' ) {
        targetObj = 'obj';
      }

      controller[targetObj][variable] = {};
      controller[targetObj][variable][titleFiled] = title;
      controller[targetObj][variable].id = id;
      scope.stage = 0;
    };

    controller.getObject = function(id) {
      scope.toEditId = id;
      scope.editMode = true;
      scope.loadModal = true;
      mainAsset.openModal('#' + apiName + 'Modal');

      requestHelper.get(
        scope.apiUrl + "/" + id,  scope,
        function(response) {
          controller.obj = getConfig(response.data);
          console.log(response.data);
          scope.loadModal = false;
          scope.loadSide = false;
        });
    };

    controller.sendOrEdit = function(editMode, obj, url, callback){

      var sendObj = new Object();
      scope.loadModal = true;

      if(obj){
        sendObj = angular.copy(obj);
      }else{
        sendObj = angular.copy(controller.obj);
        delete sendObj['id'];
        sendObj = objConfig(sendObj);
      }

      if(url){
        var sendOrEditUrl = url;
      }else{
        var sendOrEditUrl = scope.apiUrl;
      }

      console.log(sendObj);
      if(editMode) {
        requestHelper.put(sendOrEditUrl + "/" + scope.toEditId , sendObj, scope,
        function(response) {
          if(callback){
            callback(response);
          }else{
            $('#' + apiName + 'Modal').modal('hide');
            controller.getData();
            scope.reset();
          }
        });
      } else {
        requestHelper.post(sendOrEditUrl , sendObj, scope,
        function(response) {
         if(callback){
            callback(response);
          }else{
            $('#' + apiName + 'Modal').modal('hide');
            controller.getData();
            scope.reset();
          }
        });
      }
    };

    controller.deleteObject = function(id) {

      scope.loadModal = true;
      requestHelper.delete(
        scope.apiUrl + "/" + id,  scope,
        function(response) {
          if( controller.note.length == 1 ){
            if(scope.page != 1){scope.page -= 1;}
            scope.getUrl = controller.makeUrl();
          }
          controller.getData();
          $('#deleteModal').modal('hide');
        });
    };

    controller.search = function(cat, field,filter){
      var filterSection = '';
      if(!!filter && !!filter.key && !!filter.value){
        filterSection = '&' + filter.key + '=' + filter.value;
      }
      scope.loadSearch = true;
      var searchUrl = mainAsset.getUrl() + cat;

      if(field.indexOf('?') == -1 && field != ''){
        searchUrl += '?' + field + '__contains=' + controller.tmp.searchQuery + filterSection;
      }else{
        searchUrl += field;
      }
      console.log(searchUrl);
      requestHelper.get(
        searchUrl, scope,
        function(response) {
          controller.tmp.searchResult = response.data[cat + 's'];
          console.log(response.data);
          scope.loadSearch = false;
        });
    };

    controller.selectThings = function(stage, object, field){
      scope.stage = stage;
      controller.tmp.searchQuery = '';
      controller.tmp.searchResult = [];
      controller.search(object, field);
    };

    controller.deleteKey = function(obj, key){
      delete obj[key];
    }

  }
});
