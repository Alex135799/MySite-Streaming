(function () {

  angular.module('mySite', ['ui.bootstrap', 'ui.calendar', 'ngRoute'])
    .value('bowser', bowser);

  function config ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home/home.view.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      })
      .when('/blog/:blogid', {
        templateUrl: '/blog/blog.view.html',
        controller: 'blogCtrl',
        controllerAs: 'vm'
      })
      .when('/login', {
        templateUrl: '/auth/login/login.view.html',
        controller: 'loginCtrl',
        controllerAs: 'vm'
      })
      .when('/register', {
        templateUrl: '/auth/register/register.view.html',
        controller: 'registerCtrl',
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
