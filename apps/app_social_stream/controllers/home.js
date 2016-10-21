(function() {

	angular.module('mySite').controller('socialCtrl', socialCtrl);

	socialCtrl.$inject = [ "$routeParams", "mySiteData" ]
	function socialCtrl($routeParams, mySiteData) {
		var vm = this;

		vm.pageHeader = {
			title : "Welcome to Big Al's Social!",
			strapline : 'Where you get to see social media streams!'
		}

	}
})();
