(function() {

	angular.module('mySite').controller('socialCtrl', socialCtrl);

	socialCtrl.$inject = [ "$routeParams", "mySiteData", "facebook", "$scope" ]
	function socialCtrl($routeParams, mySiteData, facebook, $scope) {
		var vm = this;
		
		$scope.$on('fb.init', function (event, data){
			console.log("Event: "+JSON.stringify(data));
			var promise = facebook.api('/me/photos');
			promise.then(function(data){
				alert('SUCCESS: '+ JSON.stringify(data));
			}, function(err){
				alert('FAILED: '+ JSON.stringify(err));
			})
		})

		vm.pageHeader = {
			title : "Welcome to Big Al's Social!",
			strapline : 'Where you get to see social media streams!'
		}

	}
})();
