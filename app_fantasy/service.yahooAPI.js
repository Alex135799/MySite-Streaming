//work in progress
(function() {

  angular
    .module('mySite')
    .service('yahooAPI', yahooAPI);

  yahooAPI.$inject = ['$http'];
  function yahooAPI ($http) {
    var ClientID = "dj0yJmk9YUpzYmt2T0psZ2FBJmQ9WVdrOWFqTlZOalJSTjJjbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1kMg--";
    var ClientSecret = "fbd6d75ef69639bebfc846253f491fe9005a869f";

    var getSession = function() {
      return "session";
    };

    return {
      getSession : getSession
    };
  };

})();

