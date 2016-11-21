(function () {

  angular.module('myCalendar', ['ui.bootstrap', 'ui.calendar', 'ngRoute'])
    .value('bowser', bowser);

  function config ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/calendar', {
        templateUrl: '/app_calendar/views/home.html',
        controller: 'calCtrl',
        controllerAs: 'vm'
      })
      .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }
  angular
    .module('myCalendar', ['mySite'])
    .config(['$routeProvider', '$locationProvider', config]);

})();
