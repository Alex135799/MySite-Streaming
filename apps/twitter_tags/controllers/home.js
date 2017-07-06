(function() {
	
	angular.module('mySite').controller('twitTagsCtrl', twitTagsCtrl);

	twitTagsCtrl.$inject = [ "$routeParams", "mySiteData", "$window", "authentication", "$http" ]
	function twitTagsCtrl($routeParams, mySiteData, $window, authentication, $http) {
		var vm = this;
		var trollingFunc;
		var trollTime = 1000;
		vm.hashtags = [];
		vm.trollHashtags = trollHashtags;
		vm.trolling = false;
		vm.stopHashtags = stopHashtags;
		vm.removeHashtags = removeHashtags;
		
		getHashtags();
		
		function stopHashtags(){
			vm.trolling = false;
		}
		
		function trollHashtags(){
			vm.trolling = true;
			getHashtags();
		}
		
		function getHashtags(){
			var apiGetHashtags = "http://localhost:8080/ProjTrackingService/rest/proj/hashtagTop?topN=10"
			console.log("API: "+apiGetHashtags)
			//make api call
			$http.get(apiGetHashtags)
				.success(function(data){
					vm.hashtags = data;
					if(vm.trolling){
						setTimeout(getHashtags, trollTime);
					}
				})
				.error(function(data, status){
					alert("ERROR: "+JSON.stringify(data)+ " STATUS: "+status)
				});
		}
		
		function removeHashtags(){
			var apiGetHashtags = "http://localhost:8080/ProjTrackingService/rest/proj/hashtags"
			console.log("API: "+apiGetHashtags)
			//make api call
			/*var request = {
				method: 'DELETE',
				url: apiGetHashtags,
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, POST, DELETE, PUT",
				},
			}
			$http(request)*/
			$http.delete(apiGetHashtags)
				.success(function(){
					if(!vm.trolling){
						getHashtags();
					}
				})
				.error(function(data, status){
					alert("ERROR: "+JSON.stringify(data)+ " STATUS: "+status)
				});
		}
		
		vm.pageHeader = {
			title : "Welcome to Big Al's Twitter Tag Tracking!",
			strapline : 'Where you can see all that is trending!'
		}

	}
})();
