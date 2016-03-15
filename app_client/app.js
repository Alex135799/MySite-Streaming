(function () {
  angular.module('mySite', ['ngRoute']);

  function config ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home/home.view.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      })
      .otherwise({redirectTo: '/'});
    
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }
  angular
    .module('mySite')
    .config(['$routeProvider', '$locationProvider', config]);
})();
