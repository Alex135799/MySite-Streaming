(function() {
	
	angular.module('myTwitterTags',[ 'ui.bootstrap', 'ngRoute' ])
	  .value('bowser', bowser);

	function config($routeProvider, $locationProvider) {
		$routeProvider.when('/twitter_tags', {
			templateUrl : '/twitter_tags/views/home.html',
			controller : 'twitTagsCtrl',
			controllerAs : 'vm'
		}).otherwise({
			redirectTo : '/'
		});

		$locationProvider.html5Mode({
			enabled : true,
			requireBase : false
		});
	}

	angular.module('myTwitterTags', [ 'mySite', 'ngTouch', 'FSAngular', 'toggle-switch' ])
	  .config([ '$routeProvider', '$locationProvider', config ]);

})();