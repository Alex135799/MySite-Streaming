(function () {

	angular
	  .module('bnx.module.facebook')
	  .directive('facebookLogin', facebookLogin)

	/**
	 * @ngdoc directive
	 * @name facebookLogin
	 * @restrict E
	 *
	 * @description
	 * Shows facebook login button.
	 *
	 * @param {string} size defines button size, possible values are 'icon', 'small', 'medium',
	 *                 'large', 'xlarge'. default is "medium"
	 * @param {boolean} autoLogout whether to show logout button after user logs into facebook.
	 *                  default is false.
	 * @param {boolean} showFaces shows friends icon whom subscribed into this ad.
	 *                  default is false.
	 * @param {string}  scope comma separated list of required permission that needs to be granted 
	 *                  during login default is basic_info.
	 *
	 * @example
	 *                  <facebook-login size="large" auto-logout="false"></facebook-login>
	 */
	function facebookLogin () {

		return {
			restrict: 'E',
			scope: {
				'content': '=content',
				'autoLogout': '@',
				'size': '@',
				'showFaces': '@',
				'scope': '@'
			},
			templateUrl: '/app_social_stream/directives/facebookLogin.template.html'
		}
	};

})();