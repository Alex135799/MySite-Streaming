(function() {

  angular
    .module('mySite')
    .controller('homeCtrl', homeCtrl);

  function homeCtrl () {
    var vm = this;
    vm.pageHeader = {
      title: "Welcome to Big Al's Site!",
      strapline: 'Where all of your dreams come true...'
    }
  }

})(); 
