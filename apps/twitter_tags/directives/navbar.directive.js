(function () {

	angular
	  .module('myIssueTracking')
	  .controller('issueCtrlNavbar', issueCtrlNavbar)
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
	  		templateUrl: '/issue_tracking/directives/navbar.template.html',
	  		controller: 'issueCtrlNavbar',
	  		controllerAs: 'vm',
	  		
	  		scope: {
	  			content: '=content',
	  			parameters: '=',
	  		}
	  	}
	  }
	
	issueCtrlNavbar.$inject = [ "authentication", "$rootScope" ]
	function issueCtrlNavbar(authentication, $rootScope) {
		var vm = this;
		
		vm.user = authentication.currentUser() || {};
		
	}

})();