(function () {

	angular
	  .module('mySocialStream')
	  .controller('socialCtrlFBModal', socialCtrlFBModal)
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
	  		controller: 'socialCtrlFBModal',
	  		controllerAs: 'vm',
	  		
	  		scope: {
	  			content: '=content',
	  			parameters: '=',
	  		}
	  	}
	  }
	
	socialCtrlFBModal.$inject = [ "facebook" ]
	function socialCtrlFBModal(facebook) {
		var vm = this;
		
		vm.foundGroup = false;
		vm.groupId = 1612692632367704;
		vm.findGroup = findGroup;
		vm.groupErr = "";
		vm.groupName = "";
		vm.groupPic = "";
		vm.groupIdChanged = groupIdChanged;
		
		function groupIdChanged(){
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
	}

})();