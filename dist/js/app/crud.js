app.service('crud', function(requestHelper, mainAsset) {
  crudService = this

  this.initModals = function(scope, controller, name, variables) {
    scope.reset = function() {
      scope.load = false;
      scope.loadModal = false;
      scope.editMode = false;
      scope.uploadPercentage = 0;
      scope.uploading = false;

      controller.obj = {}
      for (variable in variables)
        variable = "";
    }
    scope.reset();

    scope.openModal = function () {
      mainAsset.openModal('#' + name + 'Modal');
    }
  }

  this.init = function(scope, controller, name) {
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

    controller.getObject = function(id) {
      scope.toEditId = id;
      scope.editMode = true;
      scope.loadModal = true;
      mainAsset.openModal('#' + name + 'Modal');

      requestHelper.get(
        scope.apiUrl + "/" + id,  scope,
        function(response) {
          controller.obj = response.data
          scope.loadModal = false;
        });
    };

    controller.sendOrEdit = function(editMode){
      var obj = new Object();
      obj = controller.obj;
      delete obj['id'];
      scope.loadModal = true;
      console.log(obj);
      if(editMode) {
        requestHelper.put(scope.apiUrl + "/" + scope.toEditId , obj, scope,
        function(response) {
          $('#' + name + 'Modal').modal('hide');
          controller.getData();
          scope.reset();
        });
      } else {
        requestHelper.post(scope.apiUrl , obj, scope,
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
          controller.getData();
          $('#deleteModal').modal('hide');
        });
    };
  }
});
