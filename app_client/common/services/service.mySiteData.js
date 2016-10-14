(function() {

  angular
    .module('mySite')
    .service('mySiteData', mySiteData);

  mySiteData.$inject = ['$http'];
  function mySiteData ($http) {
    var blogs = function(){
      return $http.get('/api/blogs');
    };

    var blogById = function (blogid) {
      return $http.get('/api/blog/' + blogid);
    };

    var addReviewById = function (locationid, data) {
      return $http.post('/api/locations/' + locationid + '/reviews', data, {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };

    return {
      blogs : blogs,
      blogById : blogById,
      addReviewById : addReviewById
    };
  };

})();
