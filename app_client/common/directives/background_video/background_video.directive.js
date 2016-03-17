(function () {
  
  angular
   .module('mySite')
   .directive('backgroundVideo', backgroundVideo);

  function backgroundVideo () {
    return {
      restrict: 'EA',
      scope: {
        content : '=content',
      },
      templateUrl: '/common/directives/background_video/background_video.template.html'
    };
  }
  
})();
