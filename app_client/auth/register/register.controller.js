(function () {

  angular
    .module('mySite')
    .controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$location', 'authentication'];
  function registerCtrl($location, authentication) {
    var vm = this;
    vm.pageHeader = { title: 'Create a new account for mySite' };
    vm .credentials = {
      screenname: "",
      username: "",
      email: "",
      password: ""
    };
    vm.returnPage = $location.search().page || '/';
    vm.onSubmit = function() {
      vm.formError = "";
      if (!authentication.isEmail(vm.credentials.email)) {
        vm.formError = "Please enter a valid email address";
        return false;
      }else if (!vm.credentials.screenname || !vm.credentials.username || !vm.credentials.email || !vm.credentials.password) {
        vm.formError = "All fields required, please try again";
        return false;
      } else if (vm.credentials.username.indexOf("@") > -1) {
        vm.formError = "Please do not use the character '@' in your username";
        return false;
      } else {
        vm.doRegister();
      };
    };
    vm.doRegister = function() {
      vm.formError = "";
      authentication
        .register(vm.credentials)
        .error(function(err) {
          vm.formError = err;
        })
        .then(function() {
          $location.search('page', null);
          $location.path(vm.returnPage);
        });
    };
  }
})();
