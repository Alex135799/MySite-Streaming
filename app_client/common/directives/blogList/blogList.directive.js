(function () {

  angular
   .module('mySite')
   .directive('blogList', blogList);

  function blogList () {
    return {
      restrict: 'EA',
      scope: {
        content : '=content'
      },
      templateUrl: '/common/directives/blogList/blogList.template.html'
    };
  }

})();
