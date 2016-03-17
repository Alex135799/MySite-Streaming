(function() {

  angular
    .module('mySite')
    .controller('homeCtrl', homeCtrl);
  
  homeCtrl.$inject = ["$window", "browserDetector", "videoManip"]
  function homeCtrl ($window, browserDetector, videoManip) {
    var vm = this;

    vm.pauseplayText = "Pause";

    vm.pageHeader = {
      title: "Welcome to Big Al's Site!",
      strapline: 'Where all of my dreams come true...'
    }

    vm.pauseplay = function(){
      var id = 'bgvid';
      if (videoManip.isPlaying(id)){
        videoManip.pause(id);
        vm.pauseplayText = "Play";
      } else {
        videoManip.play(id);
        vm.pauseplayText = "Pause";
      }
    };

    vm.webm = "/videos/deep_blue_sky.webm";
    vm.mp4 = "/videos/deep_blue_sky.mp4";
    vm.img = "/images/welcome_image.jpeg";

    if(browserDetector.isLtIe9()){
      //well then you better head for the door. because none this will work.
    }

  }

})(); 
