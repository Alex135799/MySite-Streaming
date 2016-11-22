(function () {

	angular
	  .module('mySocialStream')
	  .controller('socialCtrlNavbar', socialCtrlNavbar)
	  .directive('navbar', navbar)

	  /**
	   * @ngdoc directive
	   * @name navbar
	   * @restrict EA
	   *
	   * @description
	   * navbar html.
	   *
	   * @example
	   *                  <navbar />
	   */

	  function navbar() {

	  	return {
	  		restrict:'EA',
	  		templateUrl: '/app_social_stream/directives/navbar.template.html',
	  		controller: 'socialCtrlNavbar',
	  		controllerAs: 'vm',
	  		
	  		scope: {
	  			content: '=content',
	  			parameters: '=',
	  		}
	  	}
	  }
	
	socialCtrlNavbar.$inject = [ "facebook", "authentication", "$rootScope" ]
	function socialCtrlNavbar(facebook, authentication, $rootScope) {
		var vm = this;
		
		vm.user = authentication.currentUser();
		vm.foundGroup = false;
		vm.groupId = 1612692632367704;
		vm.findGroup = findGroup;
		vm.addGroup = addGroup;
		vm.groupErr = "";
		vm.groupName = "";
		vm.groupPic = "";
		vm.groupIdChanged = groupIdChanged;
		
		function groupIdChanged(){
			vm.groupErr = "";
			vm.foundGroup = false;
		}
		
		function findGroup(){
			var promiseApi = facebook.api('/'+vm.groupId+'?fields=cover,name');
			promiseApi.then(function(data){
				vm.groupName = data.name;
				if(data.cover){
					vm.groupPic = data.cover.source;
				}else{
					vm.groupPic = "";
				}
				vm.foundGroup = true;
				vm.groupErr = "";
			}, function(err){
				vm.foundGroup = false;
				vm.groupErr = "Group ID not found. Please try again.";
			});
		}
		
		function addGroup(){
			if(vm.user.preferences){
				if(vm.user.preferences.fbGroupIds){
					if(!!(vm.user.preferences.fbGroupIds.indexOf(vm.groupId)+1)){
						vm.groupErr = "You have already added this group.";
						return;
					}else{
						vm.user.preferences.fbGroupIds.push(vm.groupId);
					}
				}else{
					vm.user.preferences.fbGroupIds = [];
					vm.user.preferences.fbGroupIds.push(vm.groupId);
				}
				if(vm.user.preferences.fbGroupNames){
					vm.user.preferences.fbGroupNames.push(vm.groupName);
				}else{
					vm.user.preferences.fbGroupNames = [];
					vm.user.preferences.fbGroupIds.push(vm.groupName);
				}
			}else{
				vm.user.preferences = {fbGroupIds: [], fbGroupNames: []};
				vm.user.preferences.fbGroupIds.push(vm.groupId);
				vm.user.preferences.fbGroupNames.push(vm.groupName);
			}
			var creds = {preferences:vm.user.preferences, email:vm.user.email};
			authentication
			.updatePreferences(creds)
			.error(function(err){
				vm.groupErr = err;
			})
			.then(function(){
				$rootScope.$broadcast("UpdatedPreferences", {});
				console.log("Updated Preferences");
				vm.user = authentication.currentUser();
				$('#FBModal').modal('hide');
				//console.log("New User: "+JSON.stringify(user));
			});
		}
	}

})();