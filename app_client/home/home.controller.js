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
    
    vm.clearTimes = function(){
      if(vm.event.allDay){
        vm.event.end = null;
        vm.event.start = null;
      }else{
        vm.eventWarning = "";
      }
    };
    
    var timeFormat = function(dt){
      var dts = [];
      dt = dt+"";
      dts = dt.split(" ");
      tz = dts[5];
      dt = dts[4];
      dts = dt.split(":");
      dts = [dts[0], dts[1]];
      dt = dts.join(":");
      tz = tz.split("GMT")[1].substr(0,3)+":00";
      dt = dt + tz;
      return dt;
    }
   
    vm.eventSubmit = function(){
      var event= {};
      vm.formError="";
      if(!vm.event.title){ vm.formError="Please fill out title."; }
      if(!vm.event.start && !vm.event.end){
        if(!vm.event.allDay){
          vm.formError="Please submit time for event.";
        }
      }
      if(vm.formError){ return false; }
      var date = vm.eventDate;
      event.title = vm.event.title;
      event.start = vm.event.allDay ? date : date + "T" + timeFormat(vm.event.start);
      if(vm.event.end && !vm.event.allDay){ event.end = date + "T" + timeFormat(vm.event.end); }
      event.allDay = vm.event.allDay;
      vm.doAddEvent(event);
    }

    vm.unselect = function() {
      vm.dateSelected = false;
    };

    vm.doAddEvent = function(event){
      vm.events.push(event);
      //vm.pageHeader = { title: JSON.stringify(vm.events) }
      if( $('#lgcalendar').is(':visible') ){
        $('#lgcalendar').fullCalendar('refetchEvents');
      }else{
        $('#smcalendar').fullCalendar('refetchEvents');
      }
      //mySiteData.addEvent(vm.event);
      vm.unselect();
    };
    
    vm.eventTimeWarning = function(){
      if(vm.event.allDay){
        vm.eventWarning = "Warning: if 'All Day' is selected, other times will be ignored."
      }
    }
    
    vm.alertEventOnClick = function(date, jsEvent, view) {
      vm.dateSelected = true;
      vm.eventDate = date.format();
    };
    
    vm.dateSelected = false;
    vm.events = [];
    vm.eventSources = {events: function(start, end, timezone, callback){
      callback(vm.events);
    }};
    vm.uiConfig = {
      bigcalendar:{
        editable: true,
        selectable: true,
        header:{
          left: 'month basicWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: vm.alertEventOnClick,
        eventDrop: vm.alertOnDrop,
        //unselect: vm.unselect,
        eventResize: vm.alertOnResize
      },
      smallcalendar:{
        editable: true,
        selectable: true,
        header:{
          left: 'prev',
          center: 'title',
          right: 'next'
        },
        dayClick: vm.alertEventOnClick,
        eventDrop: vm.alertOnDrop,
        //unselect: vm.unselect,
        eventResize: vm.alertOnResize,
        defaultView: 'basicDay'
      }
    };
    
    if(browserDetector.isLtIe9()){
      //well then you better head for the door. because none this will work.
    }
    
  }

})(); 
