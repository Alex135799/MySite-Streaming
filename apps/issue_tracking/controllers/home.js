(function() {
	
	angular.module('mySite').controller('issueCtrl', issueCtrl);

	issueCtrl.$inject = [ "$routeParams", "mySiteData", "$window", "authentication", "$http" ]
	function issueCtrl($routeParams, mySiteData, $window, authentication, $http) {
		var vm = this;
		
		vm.ticketTypes = ["JIRA", "RTC"];
		vm.ticketType = "";
		vm.loading = false;
		vm.loaded = false;
		vm.ticketError = false;
		apiStory = "";
		vm.storyNum = "";
		vm.ticket = {}
		
		vm.submit = function(){
			vm.loading = true;
			vm.loaded = false;
			vm.ticketError = false;
			apiTotalStory = apiStory+vm.storyNum;
			console.log("API: "+apiTotalStory)
			//make api call
			$http.get(apiTotalStory)
				.success(function(data){
					if(data.ownedByName){
						vm.ticket = data;
						vm.ticketError = false;
						vm.loading = false;
						vm.loaded = true;
					}else{
						vm.ticketError = true;
						vm.loading = false;
						vm.loaded = false;
					}
				})
				.error(function(data, status){
					alert("ERROR: "+JSON.stringify(data)+ " STATUS: "+status)
					vm.loading = false;
				});
		}
		
		vm.changeTicketType = function(){
			if(vm.ticketType == "JIRA"){
				apiStory = "http://localhost:8080/ProjTrackingService/rest/proj/flerpaderp";
			}else if(vm.ticketType == "RTC"){
				apiStory = "http://localhost:8080/ProjTrackingService/rest/proj/story?storyNum=";
			}else{
				alert("Unknown Type");
			}
		}
		
		vm.pageHeader = {
			title : "Welcome to Big Al's Issue Tracking!",
			strapline : 'Where you can solve all your problems!'
		}

	}
})();
