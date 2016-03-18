(function() {

  angular
    .module('mySite')
    .controller('blogCtrl', blogCtrl);
  
  blogCtrl.$inject = ["$routeParams", "mySiteData"]
  function blogCtrl ($routeParams, mySiteData) {
    var vm = this;
    var blogID = $routeParams.blogid;

    vm.pageHeader = {
      strapline: 'Getting Blog...'
    };

    var successCallBlogList = function (data){
      vm.blogsData = data.data;
    };
    var successCallBlog = function (data){
      vm.blogData = data.data;
      vm.pageHeader = {
        title: data.data.title,
        strapline: "Writen by: "+data.data.author+"   On: "+data.data.date_updated
      };
    };

    var errorCall = function (e){
      console.log(e);
      vm.pageHeader = { title : "error in api" };
    };
    
    mySiteData.blogs().then(successCallBlogList, errorCall);
    mySiteData.blogById(blogID).then(successCallBlog, errorCall);
  }

})(); 
