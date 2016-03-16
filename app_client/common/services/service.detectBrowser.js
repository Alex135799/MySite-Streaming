(function(){
  
  angular
    .module('mySite')
    .service('browserDetector', browserDetector);
  
  browserDetector.$inject = ['bowser'];
  function browserDetector(bowser){
    
    var isLtIe9 = function(){
      return bowser.msie && bowser.version < 9;
    };
    var isIe = function(){
      return bowser.msie;
    };
    
    return {
      isLtIe9 : isLtIe9,
      isIe : isIe
    };
  }
})();
