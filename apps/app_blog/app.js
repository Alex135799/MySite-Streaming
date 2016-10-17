(function () {

  angular.module('myBlog', ['ui.bootstrap', 'ngRoute'])
    .value('bowser', bowser);

  function config ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/blog', {
        templateUrl: '/app_blog/views/home.html',
        controller: 'blogCtrl',
        controllerAs: 'vm'
      })
      .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }
  angular
    .module('myBlog', ['mySite'])
    .config(['$routeProvider', '$locationProvider', config]);

})();
