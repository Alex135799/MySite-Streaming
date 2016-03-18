(function () {

  angular
   .module('mySite')
   .directive('blogList', blogList);

  function blogList () {
    return {
      restrict: 'EA',
      scope: {
        data : '=data'
      },
      templateUrl: '/common/directives/blogList/blogList.template.html'
    };
  }

})();
