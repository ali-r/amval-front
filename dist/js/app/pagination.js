app.service('pagination', function() {
  paginationService = this

  this.initPagination = function(scope, controller) {
    scope.pageSet = function(mode) {
      if (!scope.pagination(mode)) {
        scope.page = paginationService.pageSet(mode, scope.page, scope.meta);
        scope.getUrl = controller.makeUrl();
        controller.getData();
      };
    };

    scope.pagination = function(status) {
      return paginationService.pagination(status, scope.meta);
    };
  }

  this.pagination = function(status, meta) {
    var pageMeta = meta;
    switch (status) {
      case 'old':
        if (pageMeta.next === null) {
          return true;
        } else {
          return false;
        };
        break;
      case 'new':
        if (pageMeta.prev == null) {
          return true;
        } else {
          return false;
        };
        break;
      case 'end':
        if (pageMeta.pages > 1 && pageMeta.page < pageMeta.pages -1 ) {
          return false;
        } else {
          return true;
        };
        break;
      case 'first':
        if (pageMeta.page > 2) {
          return false;
        } else {
          return true;
        };
        break;
    };
  };

  this.pageSet = function(mode, page, meta){
    switch (mode) {
      case 'new':
        page -= 1;
        break;
      case 'old':
        page += 1;
        break;
      case 'first':
        page = 1;
        break;
      case 'end':
        page = meta.pages;
        break;
    }
    return page;
  };

  this.notEmpty = function(string) {
    return (typeof(string) != "undefined") && (string !== "") && (string + "" != 'undefined') && (string + "" != 'NaN');
  }

  this.makeUrl = function(scope, searchObj={}, searchValue={}) {
    var keys = {};
    for (var i = 0; i < searchObj.length; i++) {
      keys[searchObj[i].field + '__contains'] = searchValue[searchObj[i].field];
    }
    keys.sort = searchValue.order + searchValue.type
    var url = scope.apiUrl + "?page=" + scope.page + "&per_page=10";
    for (name in keys) {
      if (this.notEmpty(keys[name]))
        url += "&" + name + "=" + keys[name];
    }
    return url;
  }
});
