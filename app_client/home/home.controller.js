(function() {

  angular
    .module('mySite')
    .controller('homeCtrl', homeCtrl);
  
  homeCtrl.$inject = ["$location", "browserDetector", "videoManip", "mySiteData", "authentication"]
  function homeCtrl ($location, browserDetector, videoManip, mySiteData, authentication) {
    var vm = this;
    var pauseCap = "I am getting nausious...";
    var playCap = "Much Better.";

    vm.pauseplayIcon = "pause";
    vm.pauseplayCap = pauseCap;

    vm.pageHeader = {
      title: "Welcome to Big Al's Site!",
      strapline: 'Where all of my dreams come true...'
    }

    vm.pauseplay = function(){
      var id = 'bgvid';
      if (videoManip.isPlaying(id)){
        videoManip.pause(id);
        vm.pauseplayIcon = "play";
        vm.pauseplayCap = playCap;
      } else {
        videoManip.play(id);
        vm.pauseplayIcon = "pause";
        vm.pauseplayCap = pauseCap;
      }
    };
   
    vm.webm = "/videos/deep_blue_sky.webm";
    vm.mp4 = "/videos/deep_blue_sky.mp4";
    vm.img = "/images/welcome_image.jpeg";
    
    var successCall = function (data){
      vm.blogData = data.data;
    };

    var errorCall = function (e){
      console.log(e);
      vm.pageHeader = { title : "error in api" };
    };

    mySiteData.blogs().then(successCall, errorCall);
    
    vm.goTo = function(blogid){
      $location.path("/blog/"+blogid);
    };

    vm.currentPath = $location.path();
    vm.isLoggedIn = authentication.isLoggedIn();
    vm.currentUser = authentication.currentUser();
    vm.logout = function() {
      authentication.logout();
      vm.isLoggedIn = false;
      $location.path('/');
    };
    
    vm.calendarView = 'month';
    vm.calendarDate = new Date(2016,3,17);
    vm.calendarTitle = "Big Al's Title";
    vm.events = [];

    if(browserDetector.isLtIe9()){
      //well then you better head for the door. because none this will work.
    }

  }

})(); 
