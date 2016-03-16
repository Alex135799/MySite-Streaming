(function() {

  angular
    .module('mySite')
    .controller('homeCtrl', homeCtrl);
  
  homeCtrl.$inject = ["$window", "browserDetector"]
  function homeCtrl ($window, browserDetector) {
    var vm = this;
    vm.pageHeader = {
      title: "Welcome to Big Al's Site!",
      strapline: 'Where all of my dreams come true...'
    }
    if(browserDetector.isLtIe9()){
      //well then you better head for the door. because none this will work.
    }
    vm.pauseVid = function(){
      vm.pageHeader = {
        title: "Welcome to Big Al's Site!",
        strapline: 'Where all of my dreams come true... Pasued!'
      }
    };
  }

})(); 
