(function () {
  angular
    .module('mySite')
    .service('authentication', authentication);

  authentication.$inject = ['$window', '$http'];
  function authentication ($window, $http) {
    var saveToken = function(token) {
      $window.localStorage['mySite-token'] = token;
    };
    var getToken = function (){
      return $window.localStorage['mySite-token'];
    };
    var register = function (user) {
      return $http.post('/api/register', user).success(function(data){
        saveToken(data.token);
      });
    };
    var login = function(user) {
      return $http.post('/api/login', user).success(function(data) {
        saveToken(data.token);
      });
    };
    var logout = function() {
      $window.localStorage.removeItem('mySite-token');
    };
    var isLoggedIn = function() {
      var token = getToken();
      if(token){
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };
    var currentUser = function() {
      if(isLoggedIn()){
        var token = getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        //console.log("Payload: "+JSON.stringify(payload));
        return {
          email : payload.email,
          name : payload.name,
          screenname : payload.screenname,
          fbid : payload.fbid,
          fbname : payload.fbname,
          fbemail : payload.fbemail,
          preferences : payload.preferences,
        };
      }
    };
    var isEmail = function(email){
      var domains = [
        /* Default domains included */
        "aol.com", "att.net", "comcast.net", "facebook.com", "gmail.com", "gmx.com", "googlemail.com",
        "google.com", "hotmail.com", "hotmail.co.uk", "mac.com", "me.com", "mail.com", "msn.com",
        "live.com", "sbcglobal.net", "verizon.net", "yahoo.com", "yahoo.co.uk",
      
        /* Other global domains */
        "email.com", "games.com" /* AOL */, "gmx.net", "hush.com", "hushmail.com", "icloud.com", "inbox.com",
        "lavabit.com", "love.com" /* AOL */, "outlook.com", "pobox.com", "rocketmail.com" /* Yahoo */,
        "safe-mail.net", "wow.com" /* AOL */, "ygm.com" /* AOL */, "ymail.com" /* Yahoo */, "zoho.com", "fastmail.fm",
      
        /* United States ISP domains */
        "bellsouth.net", "charter.net", "comcast.net", "cox.net", "earthlink.net", "juno.com",

        /* British ISP domains */
        "btinternet.com", "virginmedia.com", "blueyonder.co.uk", "freeserve.co.uk", "live.co.uk",
        "ntlworld.com", "o2.co.uk", "orange.net", "sky.com", "talktalk.co.uk", "tiscali.co.uk",
        "virgin.net", "wanadoo.co.uk", "bt.com",
      
        /* Domains used in Asia */
        "sina.com", "qq.com", "naver.com", "hanmail.net", "daum.net", "nate.com", "yahoo.co.jp", "yahoo.co.kr", "yahoo.co.id",
        "yahoo.co.in", "yahoo.com.sg", "yahoo.com.ph",

        /* French ISP domains */
        "hotmail.fr", "live.fr", "laposte.net", "yahoo.fr", "wanadoo.fr", "orange.fr", "gmx.fr", "sfr.fr", "neuf.fr", "free.fr",
      
        /* German ISP domains */
        "gmx.de", "hotmail.de", "live.de", "online.de", "t-online.de" /* T-Mobile */, "web.de", "yahoo.de",
      
        /* Russian ISP domains */
        "mail.ru", "rambler.ru", "yandex.ru", "ya.ru", "list.ru",
      
        /* Belgian ISP domains */
        "hotmail.be", "live.be", "skynet.be", "voo.be", "tvcablenet.be", "telenet.be",
      
        /* Argentinian ISP domains */
        "hotmail.com.ar", "live.com.ar", "yahoo.com.ar", "fibertel.com.ar", "speedy.com.ar", "arnet.com.ar",
      
        /* Domains used in Mexico */
        "hotmail.com", "gmail.com", "yahoo.com.mx", "live.com.mx", "yahoo.com", "hotmail.es", "live.com", "hotmail.com.mx",
        "prodigy.net.mx", "msn.com"
      ];
      return ( email.indexOf('@') > 0 && email.indexOf('@') < email.length &&
               email.indexOf('.') > 0 && email.indexOf('.') < email.length &&
               domains.indexOf(email.split('@')[1]) > -1); 
    };
    var addFB = function(user){
      //console.log("ADDING FB: "+JSON.stringify(user))
      return $http.post('/api/addfb', user).success(function(data) {
    	$window.localStorage.removeItem('mySite-token');
        saveToken(data.token);
      });
    }
    var updatePreferences = function(user){
    	return $http.post('/api/updpref', user).success(function(data) {
    		$window.localStorage.removeItem('mySite-token');
    		saveToken(data.token);
    	});
    }
    return {
      saveToken : saveToken,
      getToken : getToken,
      register : register,
      login : login,
      logout : logout,
      isLoggedIn : isLoggedIn,
      currentUser : currentUser,
      isEmail : isEmail,
      addFB : addFB,
      updatePreferences : updatePreferences,
    };
  }
})();
