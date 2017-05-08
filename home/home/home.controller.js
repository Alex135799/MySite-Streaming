(function() {

  angular
    .module('mySite')
    .controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = ["$location", "browserDetector", "mySiteData", "authentication"]
  function homeCtrl ($location, browserDetector, mySiteData, authentication) {
    var vm = this;

    vm.pageHeader = {
      title: "Welcome to Big Al's Site!",
      strapline: 'Where all of my dreams come true...'
    }

    vm.img = "/images/flower_bg.jpg";
    vm.issueimg = "/images/flower_1.png";

    vm.currentPath = $location.path();
    vm.isLoggedIn = authentication.isLoggedIn();
    vm.currentUser = authentication.currentUser();
    vm.logout = function() {
      authentication.logout();
      vm.isLoggedIn = false;
      $location.path('/');
    };

  }

})();
