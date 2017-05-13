angular.module("assetAdminPanel").controller('userCtrl', function($scope,$http){

  this.notif = function(type) {
    var opts = {
        title: "Over Here",
        text: "Check me out. I'm in a different stack.",
        addclass: "stack-bottomleft",
    };
    switch (type) {
    case 'error':
        opts.title = "Oh No";
        opts.text = "Watch out for that water tower!";
        opts.type = "error";
        break;
    case 'info':
        opts.title = "Breaking News";
        opts.text = "Have you met Ted?";
        opts.type = "info";
        break;
    case 'success':
        opts.title = "Good News Everyone";
        opts.text = "I've invented a device that bites shiny metal asses.";
        opts.type = "success";
        break;
    }
    new PNotify(opts);
  };

  this.notif('info');

});
