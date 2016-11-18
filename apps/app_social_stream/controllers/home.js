(function() {
	
	angular.module('mySite').controller('socialCtrl', socialCtrl);

	socialCtrl.$inject = [ "$routeParams", "mySiteData", "facebook", "$rootScope", "$window", "Fullscreen", "$q" ]
	function socialCtrl($routeParams, mySiteData, facebook, $rootScope, $window, Fullscreen, $q) {
		var vm = this;
		
		vm.fbData;
		vm.fbPic;
		vm.fbLoggedIn = true;
		vm.fbPhotoData = 'Retrieving Data...';
		vm.login = login;
		vm.nextPic = nextPic;
		vm.prevPic = prevPic;
		vm.isFullscreen = false;
		vm.autoPlay = false;
		vm.toggleFullScreen = toggleFullScreen;
		vm.toggleAutoPlay = toggleAutoPlay;
		var fbPics = [];
		var groupPics = [];
		var onData = 0;
		var onPic = 0;
		var latestUpdateTime;
		var theatrePos = angular.element($('#theatre')).prop('offsetTop');
		var windowHeight = $(window).height();
		vm.remainingHeight = windowHeight - theatrePos - 100;
		var canFullscreen = Fullscreen.isSupported();
		
		var promise = function (func) {
			var deferred = $q.defer ();

			func (function (response) {
				if (response && response.error) {
					deferred.reject (response);
				} else {
					deferred.resolve (response);
				}

				//$rootScope.$apply();
			});

			return deferred.promise;
		};
		
		function toggleFullScreen() {
			if(canFullscreen){
				vm.isFullscreen = !vm.isFullscreen;
			}else{
				alert("Your browser does not support this fullscreen, please update your browser.");
			}
		}
		
		function toggleAutoPlay(){
			vm.autoPlay = !vm.autoPlay;
			if(vm.autoPlay){
				doAutoPlay();
			}
		}
		
		function doAutoPlay(){
			var promiseAutoPlay = promise(function(callback) {
				if(vm.autoPlay){
					nextPic();
				}
				callback();
			});
			promiseAutoPlay.then(function(data){
				if(vm.autoPlay){
					setTimeout(doAutoPlay, 3000);
				}
			}, function(err){
				alert('FAILED: '+ JSON.stringify(err));
			})
		}
		
		function updateFeed(feedData, isUpdate){
			var data = feedData;
			var j = 1;
			for(i=0;i<data.length;i++){
				var message = "";
				var post;
				var attachmentURL;
				if(!data[i].message && data[i].story){
					message = data[i].story;
				}else{
					message = data[i].message;
				}
				if(data[i].attachments != null){
					if(data[i].attachments.data[0].subattachments != null){
					//if(data[i].attachments.data[0].subattachments.data[0].media){
						var subdata = data[i].attachments.data[0].subattachments.data
						for(j=0;j<subdata.length;j++){
							attachmentURL = subdata[j].media.image.src;
							if(!isUpdate){
								groupPics.push({"message":message,"attachment":attachmentURL})
							}else{
								groupPics.splice(onData+j+1, 0, {"message":message,"attachment":attachmentURL})
							}
						}
					}else{
						attachmentURL = data[i].attachments.data[0].media.image.src;
						if(!isUpdate){
							groupPics.push({"message":message,"attachment":attachmentURL})
						}else{
							groupPics.splice(onData+i+1, 0, {"message":message,"attachment":attachmentURL})
						}
					}
				}
			}
			vm.fbPhotoData = JSON.stringify(groupPics);
			if(isUpdate && !vm.autoPlay){
				vm.fbData = groupPics[onData+1];
			}else if(!isUpdate){
				onData = 0;
				vm.fbData = groupPics[onData];
			}
			
		}
		
		function trollForGroupUpdates(){
			//console.log("TROLLING......");
			var promiseApi = facebook.api('/1612692632367704?fields=feed{created_time,message,story,attachments}')
			promiseApi.then(function(data){
				latestGroupUpdateTime = moment(data.feed.data[0].created_time);
				if(latestUpdateTime){
					if(latestUpdateTime.diff(latestGroupUpdateTime) < 0){
						var updates = [];
						var ind = 0;
						while(latestUpdateTime.diff(moment(data.feed.data[ind].created_time)) < 0){
							updates.push(data.feed.data[ind]);
							ind = ind + 1;
						}
						updateFeed(updates, true);
						latestUpdateTime = latestGroupUpdateTime;
					}else{
						//console.log("No Updates");
					}
				}else{
					var updates = [];
					for(i=data.feed.data.length-1;i>=0;i--){
						updates.push(data.feed.data[i]);
					}
					updateFeed(updates, false);
					latestUpdateTime = latestGroupUpdateTime;
				}
				setTimeout(trollForGroupUpdates, 60000);
			}, function(err){
				alert('FAILED: '+ JSON.stringify(err));
			})
		}
		
		function findRightSizePic(arrOfPics){
			var i;
			var width = document.getElementById('imgDiv').clientWidth - 40;
			for(i=0;i<arrOfPics.length;i++){
				console.log("width: "+arrOfPics[i].width+" Page W: "+width);
				if(arrOfPics[i].width > width){
					continue;
				}else{
					return arrOfPics[i];
				}
			}
			return arrOfPics[i];
		}
		
		function nextPic(){
			onPic = onPic + 1;
			onData = onData + 1;
			if(groupPics.length <= onData){
				onData = 0;
			}
			vm.fbData = groupPics[onData];
			/*if(fbPics.length >= onPic){
				populatePic(fbPics);
			}else{
				onPic = onPic - 1;
				console.log("length: "+fbPics.length+" onPic: "+onPic);
			}*/
		}
		
		function prevPic(){
			onPic = onPic - 1;
			onData = onData -1;
			if(onData < 0){
				onData = groupPics.length - 1;
			}
			vm.fbData = groupPics[onData];
			/*if(onPic >= 0){
				populatePic(fbPics);
			}else{
				onPic = onPic + 1;
				console.log("onPic: "+onPic);
			}*/
		}
		
		function populatePic(fbPics){
			var promisePhotoApi = facebook.api('/'+fbPics[onPic].id+'?fields=images');
			
			promisePhotoApi.then(function(data){
				vm.fbPic = findRightSizePic(data.images);
			}, function(err){
				alert('FAILED: '+ JSON.stringify(err));
			})
		}
		
		//calls populatePic ^ or alerts
		function getPics(){
			var promiseApi = facebook.api('/me/photos');
			
			promiseApi.then(function(data){
				//vm.fbPhotoData = JSON.stringify(data);
				fbPics = data.data;
				populatePic(fbPics);
			}, function(err){
				alert('FAILED: '+ JSON.stringify(err));
			})
		}
		
		//calls getPics ^ or alerts
		function login(){
			var promiseLogin = facebook.login({scope: 'public_profile,user_friends,email'});
			
			promiseLogin.then(function(data){
				getPics();
			}, function(err){
				alert('FAILED: '+ JSON.stringify(err));
			})
		}
		
		//calls getPics ^^ or login ^
		$rootScope.$on('fb.init', function (event, data){
			console.log("Event: "+JSON.stringify(data));
			var promiseLoginStatus = facebook.loginStatus();
			
			promiseLoginStatus.then(function(data){
				if(data.status === 'connected'){
					vm.fbLoggedIn = true;
					trollForGroupUpdates();
					//getPics();
				}else{
					vm.fbLoggedIn = false;
				}
			}, function(err){
				alert('FAILED: '+ JSON.stringify(err));
			})
			
		})
		
		$rootScope.$on('fb.auth.login', function(event, data){
			vm.fbLoggedIn = true;
			trollForGroupUpdates();
		})

		vm.pageHeader = {
			title : "Welcome to Big Al's Social!",
			strapline : 'Where you get to see social media streams!'
		}

	}
})();
