app.service('crud', function($localStorage,requestHelper, mainAsset) {
  crudService = this

  this.initModals = function(scope, controller, apiName, variables, extraReset) {
    
    scope.meta = {};

    scope.reset = function() {
      
      if(!extraReset){
        extraReset = function(){return true;}
      }

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
      extraReset();
      for (variable in variables)
        variable = "";
    }

    scope.reset();

    scope.openModal = function () {
      mainAsset.openModal('#' + apiName + 'Modal');
    }

    scope.closeModal = function(){
      mainAsset.closeModal('#' + apiName + 'Modal');
      scope.reset();
    }
    $('#' + apiName + 'Modal').on('hide.bs.modal',function(){
        scope.reset();
    })
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
          if(controller.relateWarehouseId){
            var url = scope.apiUrl + "?related_warehouse=" + controller.relateWarehouseId + "&page=" + page + "&per_page=" + scope.perPage;
          }else{
            var url = scope.apiUrl + "?page=" + page + "&per_page=" + scope.perPage;
          }

          if(addOne){
            for ( key in addOne.extra) {
              keys[key] = addOne.extra[key];
            }
          }

          if(controller.searchValue){

            for (var i = 0; i < controller.searchObject.length; i++) {
              keys[controller.searchObject[i].field + '__icontains'] = controller.searchValue[controller.searchObject[i].field];
            }
            
            if(controller.searchValue.type!='' && controller.searchValue.type!=undefined)
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

        mainAsset.log(url)
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
      scope.preRequest = {
        type: 'get',
        url: crudGetUrl,
        scope: scope, 
        callback: function(response) {
          if(callback)
            {
              callback(response);
            }else{
              scope.meta = response.data.meta;
              if(response.data.data.total_price) scope.total_price = response.data.data.total_price;
              else delete scope['total_price']
              controller.note = response.data.data[apiName + 's'];
            }
          mainAsset.log(response)  
        } ,
        progressBar: true
      }
      requestHelper.get(scope.preRequest.url, scope.preRequest.scope, scope.preRequest.callback, scope.preRequest.progressBar);
    };
            
    if(apiName){
      controller.getData();
    }
    
    controller.getFilteredData = function() {
      scope.page = 1;
      scope.getUrl = controller.makeUrl(scope.page,controller.paginationConfig);
      controller.getData();
    };

    controller.selectTarget = function(_source, _base, _target, _stage, _callback){
      
      _base[_target] = _source;
      
      if( typeof(_stage) != 'undefined'){
        scope.stage = _stage;
      }

      if(_callback)
        eval(_callback);

    };

    controller.getObject = function(id) {
      scope.toEditId = id;
      scope.editMode = true;
      scope.loadModal = true;
      mainAsset.openModal('#' + apiName + 'Modal');
      scope.preRequest = {
        type: 'get',
        url: scope.apiUrl + "/" + id,
        scope: scope, 
        callback: function(response) {
          controller.obj = getConfig(response.data.data);
          mainAsset.log(controller.obj);
          scope.loadModal = false;
          scope.loadSide = false;} ,
        progressBar: false
      }
      requestHelper.get(scope.preRequest.url, scope.preRequest.scope, scope.preRequest.callback, scope.preRequest.progressBar);
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

      mainAsset.log(sendObj);
      if(editMode) {
        scope.preRequest = {
          type: 'put',
          url: sendOrEditUrl + "/" + scope.toEditId,
          json: sendObj,
          scope: scope, 
          callback: function(response) {
            if(callback){
              callback(response);
            }else{
              $('#' + apiName + 'Modal').modal('hide');
              controller.getData();
              scope.reset();
            }},
          progressBar:false
        }
        requestHelper.put(scope.preRequest.url, scope.preRequest.json, scope.preRequest.scope, scope.preRequest.callback, scope.preRequest.progressBar);
        
      } else {
        scope.preRequest = {
          type: 'post',
          url: sendOrEditUrl,
          json: sendObj,
          scope: scope,
          callback:  function(response) {
            if(callback){
               callback(response);
             }else{
               $('#' + apiName + 'Modal').modal('hide');
               controller.getData();
               scope.reset();
             }}, 
          progressBar: false
        }
        requestHelper.post(scope.preRequest.url , scope.preRequest.json, scope.preRequest.scope,
          scope.preRequest.callback, scope.preRequest.progressBar);
      }
    };

    controller.deleteObject = function(id,afterDelete) {

      scope.loadModal = true;
      scope.preRequest = {
        type: 'delete',
        url: scope.apiUrl + "/" + id, 
        scope: scope,
        callback: function(response) {
          if( controller.note.length == 1 ){
            if(scope.page != 1){
              scope.page -= 1;
            }
            scope.getUrl = controller.makeUrl(scope.page,controller.paginationConfig);
          }
          controller.getData();
          $('#deleteModal').modal('hide');
          
          if(typeof(afterDelete)==='function'){
            afterDelete(id);
          }

        }, 
        progressBar: false
      }
      requestHelper.delete(scope.preRequest.url,  scope.preRequest.scope, scope.preRequest.callback);
       
    };

    controller.search = function(cat, field,filter){
      var filterSection = '';
      if(!!filter && !!filter.key && !!filter.value){
        filterSection = '&' + filter.key + '=' + filter.value;
      }
      scope.loadSearch = true;
      var searchUrl = mainAsset.getUrl() + cat;
      if(field){
        if(field.indexOf('?') == -1 && field != ''){
          searchUrl += '?' + field  + filterSection;
        }else{
          searchUrl += field + filterSection;
        }
      }
      else{
        searchUrl += '?' + filterSection;
      }

      if(controller.tmp.searchQuery && controller.tmp.searchQuery!=''){
        searchUrl += '&text_search='+ controller.tmp.searchQuery;        
      }

      if(controller.relateWarehouseId != undefined && controller.relateWarehouseId!=''){
        searchUrl += '&related_warehouse='+ controller.relateWarehouseId;
      }
      
      mainAsset.log(searchUrl);
      scope.preRequest = {
        type: 'get',
        url: searchUrl,
        scope: scope, 
        callback: function(response) {
          controller.tmp.searchResult = response.data.data[cat + 's'];
          scope.loadSearch = false;
        },
        progressBar: false
      }
      requestHelper.get(
        scope.preRequest.url, scope.preRequest.scope,scope.preRequest.callback);
    };

    controller.selectThings = function(stage, object, field){
      scope.stage = stage;
      controller.tmp.searchQuery = '';
      controller.tmp.searchResult = [];
      controller.search(object, field);
    };

    controller.returnBtn = function(){
      scope.stage = 0;
    }

    controller.deleteKey = function(obj, key){
      delete obj[key];
    }

    controller.openSelectionModal = function(stage_, field_, var_){
      mainAsset.openModal('#selectModal');
      controller.selectThings(stage_,field_,var_);
    }
  
    controller.closeSelectionModal = function(){
      mainAsset.closeModal('#selectModal');
      scope.reset();
    }

    scope.doConfirm = function(_reqObj){
      scope.loadModal = true;
      requestHelper.headers['Force-Action'] = true

      _reqObj.editedCallback = function(response){
        if(_reqObj.callback)
          _reqObj.callback(response);
        delete requestHelper.headers['Force-Action'];
      }
  
      if(_reqObj.type == 'get'){
        requestHelper.get(_reqObj.url, _reqObj.scope, _reqObj.editedCallback ,_reqObj.progressBar)
      }
      else if(_reqObj.type == 'put'){
        requestHelper.put(_reqObj.url, _reqObj.json, _reqObj.scope, _reqObj.editedCallback, _reqObj.progressBar)
      }
      else if(_reqObj.type == 'post'){
        requestHelper.post(_reqObj.url, _reqObj.json, _reqObj.scope, _reqObj.editedCallback, _reqObj.progressBar)
      }
      else if(_reqObj.type == 'delete'){
        requestHelper.delete(_reqObj.url, _reqObj.scope, _reqObj.editedCallback, _reqObj.progressBar)
      }
      else{
        mainAsset.log('confirm object with invalid type request');
        scope.loadModal = false
      }
  
    }
  }
});