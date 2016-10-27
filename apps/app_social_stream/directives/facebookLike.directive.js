(function () {

	angular
	  .module('bnx.module.facebook')
	  .directive('facebookLike', facebookLike)
	  
	  /**
	   * @ngdoc directive
	   * @name facebookLike
	   * @restrict E
	   *
	   * @description
	   * Shows facebook like/share/recommend button.
	   *
	   * @param {string} href indicates the page that will be liked. if not provided current
	   *                 absolute URL will be used.
	   * @param {string} colorScheme possible value are light and dark, default is 'light'
	   * @param {string} layout possible values standard, button_count, box_count, 
	   *                 default is 'standard'. see Facebook FAQ for more details: 
	   *                  https://developers.facebook.com/docs/plugins/like-button/#faqlayouts
	   * @param {boolean} showFaces whether to show profile photos below button, default is false
	   * @param {boolean} share includes share button near like button, default is false
	   * @param {string} action value can be 'like' or 'recommend', default is 'like'
	   *
	   * @example
	   *                  <facebook-like show-faces="true" action="recommend"></facebook-like>
	   */

	  facebookLike.$inject = ['$location'];
	  function facebookLike($location) {
	  	/*var template = '<div class="fb-like" ' +
	  	'data-href="{{href || currentPage}}" ' +
	  	'data-colorscheme="{{colorScheme || \'light\'}}" ' +
	  	'data-layout="{{layout || \'standard\'}}" ' +
	  	'data-action="{{ action || \'like\'}}" ' +
	  	'data-show-faces="{{!!showFaces}}" ' +
	  	'data-share="{{!!share}}"' +
	  	'data-action="{{action || \'like\'}}"' +
	  	'data-send="false"></div>';*/

	  	return {
	  		restrict:'E',
	  		scope: {
	  			'content': '=content',
	  			'colorScheme': '@',
	  			'layout':      '@',
	  			'showFaces':   '@',
	  			'href':        '@',
	  			'action':      '@',
	  			'share':       '@',
	  		},
	  		//template: template,
	  		templateUrl: '/app_social_stream/directives/facebook.template.html',
	  		link: function(scope, element, attrs) {
	  			scope.currentPage = $location.absUrl();
	  		},
	  	}
	  };

})();