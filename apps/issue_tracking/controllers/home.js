(function() {
	
	angular.module('mySite').controller('issueCtrl', issueCtrl);

	issueCtrl.$inject = [ "$routeParams", "mySiteData", "$window", "authentication" ]
	function issueCtrl($routeParams, mySiteData, $window, authentication) {
		var vm = this;
		
		vm.ticketTypes = ["JIRA", "RTC"];
		vm.ticketType = "";
		vm.loading = true;
		vm.loaded = false;
		
		vm.submit = function(){
			if(!vm.loaded){
				//make api call
				vm.loaded = true;
			}
		}
		
		vm.changeTicketType = function(){
			if(vm.ticketType == "JIRA"){
				alert("JIRA");
			}else if(vm.ticketType == "RTC"){
				alert("RTC");
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
