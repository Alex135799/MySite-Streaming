(function() {
	
	angular.module('myIssueTracking',[ 'ui.bootstrap', 'ngRoute' ])
	  .value('bowser', bowser);

	function config($routeProvider, $locationProvider) {
		$routeProvider.when('/issue', {
			templateUrl : '/issue_tracking/views/home.html',
			controller : 'issueCtrl',
			controllerAs : 'vm'
		}).otherwise({
			redirectTo : '/'
		});

		$locationProvider.html5Mode({
			enabled : true,
			requireBase : false
		});
	}

	angular.module('myIssueTracking', [ 'mySite', 'ngTouch', 'FSAngular', 'toggle-switch' ])
	  .config([ '$routeProvider', '$locationProvider', config ]);

})();