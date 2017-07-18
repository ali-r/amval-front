app.service('pagination', function() {
  paginationService = this

  this.initPagination = function(scope, controller, meta, page, url, sObject, sValue, addOne) {
    scope.pageSet = function(mode) {
      if (!scope.pagination(mode, meta)) {
        console.log(scope[page]);
        scope[page] = paginationService.pageSet(mode, scope[page], scope[meta]);
        scope[url] = controller.makeUrl(addOne);
        controller.getData();
      };
    };

    scope.pagination = function(status) {
      return paginationService.pagination(status, scope[meta]);
    };

    controller.makeUrl = function() {
      return paginationService.makeUrl(scope, controller[sObject], controller[sValue], addOne);
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

  this.makeUrl = function(scope, searchObj, searchValue, addOne) {

    if ( typeof(searchObj) == 'undefined' ) {
      searchObj = {};
    }

    if ( typeof(searchValue) == 'undefined' ) {
      searchValue = {};
    }

    if ( typeof(addOne) == 'undefined' ) {
      addOne = {};
    }

    if ( typeof(addOne.url) == 'undefined' ) {
      var url = scope.apiUrl + "?page=" + scope.page + "&per_page=10";
    }else{
      var url = addOne.url + "?page=" + addOne.page + "&per_page=10";
    }

    var keys = {};
    for (var i = 0; i < searchObj.length; i++) {
      keys[searchObj[i].field + '__contains'] = searchValue[searchObj[i].field];
    }

    for ( key in addOne.extra) {
      console.log(key);
      keys[key] = addOne.extra[key];
    }
    keys.sort = searchValue.order + searchValue.type
    for (name in keys) {
      if (this.notEmpty(keys[name]))
        url += "&" + name + "=" + keys[name];
    }
    console.log(url)
    return url;
  }
});
