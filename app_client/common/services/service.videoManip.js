(function(){

  angular
    .module('mySite')
    .service('videoManip', videoManip);

  function videoManip(){

    var pause = function(id){
      var vid = angular.element(document.querySelector('#'+id));
      vid[0].pause();
    };
    var play = function(id){
      var vid = angular.element(document.querySelector('#'+id));
      vid[0].play();
    };
    var isPlaying = function(id){
      var vid = angular.element(document.querySelector('#'+id));
      return !vid[0].paused;
    };

    return {
      pause : pause,
      play : play,
      isPlaying : isPlaying
    };
  }

})();
