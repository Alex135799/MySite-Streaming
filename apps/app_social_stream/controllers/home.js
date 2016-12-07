(function() {
	
	angular.module('mySite').controller('socialCtrl', socialCtrl);

	socialCtrl.$inject = [ "$routeParams", "mySiteData", "facebook", "$rootScope", "$window", "Fullscreen", "$q", "authentication" ]
	function socialCtrl($routeParams, mySiteData, facebook, $rootScope, $window, Fullscreen, $q, authentication) {
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
		vm.user = authentication.currentUser() || {};
		var globalPics = [];
		var globalOn = 0;
		var fbPics = [];
		var groupPics = [];
		var onData = [];
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
		
		function updateFeed(feedData, isUpdate, numGroups){
			var data = feedData;
			
			if(!isUpdate){
				while(groupPics.length < numGroups){
					groupPics.push([]);
					onData.push(0);
				}
				var index;
				for(index=0;index<numGroups;index++){
					if(onData[index]==0){
						break;
					}
				}
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
								if(subdata[j].media){
									attachmentURL = subdata[j].media.image.src;
									if(!isUpdate){
										groupPics[index].push({"message":message,"attachment":attachmentURL})
									}else{
										groupPics[index].splice(onData+j+1, 0, {"message":message,"attachment":attachmentURL})
									}
								}else{
									continue;
								}
							}
						}else{
							if(data[i].attachments.data[0].media){
								attachmentURL = data[i].attachments.data[0].media.image.src;
							}else{
								//This makes no media posts not show up!
								continue;
							}
							if(!isUpdate){
								groupPics[index].push({"message":message,"attachment":attachmentURL})
							}else{
								groupPics[index].splice(onData+i+1, 0, {"message":message,"attachment":attachmentURL})
							}
						}
					}
				}
				vm.fbPhotoData = JSON.stringify(groupPics[index]);
				if(isUpdate && !vm.autoPlay){
					vm.fbData = groupPics[index][onData[index]+1];
				}else if(!isUpdate){
					vm.fbData = groupPics[index][onData[index]];
				}
			}

		}
		function trollForGroupsUpdates(){
			//console.log("TROLLING......");
			if(vm.user.preferences && vm.user.preferences.fbGroupIds){
				var numGroups = vm.user.preferences.fbGroupIds.length;
				for(groupInd=0; groupInd<numGroups; groupInd++ ){
					var groupId = vm.user.preferences.fbGroupIds[groupInd];
					console.log("API: "+'/'+groupId+'?fields=feed{created_time,message,story,attachments}')
					var promiseApi = facebook.api('/'+groupId+'?fields=feed{created_time,message,story,attachments}')
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
								updateFeed(updates, true, numGroups);
								latestUpdateTime = latestGroupUpdateTime;
							}else{
								//console.log("No Updates");
							}
						}else{
							var updates = [];
							for(i=data.feed.data.length-1;i>=0;i--){
								updates.push(data.feed.data[i]);
							}
							updateFeed(updates, false, numGroups);
							latestUpdateTime = latestGroupUpdateTime;
						}
						setTimeout(trollForGroupsUpdates, 60000);
					}, function(err){
						alert('FAILED: '+ JSON.stringify(err));
					})
				}
			}else{
				console.log("Please add social media source.")
			}
		}
		
		function findRightSizePic(arrOfPics){
			var i;
			if(document.getElementById('imgDiv')){
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
			return "";
		}
		
		function nextPic(){
			console.log("GolbalON: "+globalOn)
			console.log(JSON.stringify(globalPics))
			if(globalPics.length > globalOn+1){
				vm.fbData = globalPics[globalOn+1]
				globalOn++;
			}else{
				globalPics[globalOn] = vm.fbData;
				globalOn++;
				console.log(JSON.stringify(onData))
				groupInd = Math.floor(Math.random() * (onData.length));
				console.log("RAND: "+groupInd)
				onData[groupInd] = onData[groupInd] + 1;
				if(groupPics[groupInd].length <= onData[groupInd]){
					onData[groupInd] = 0;
				}
				vm.fbData = groupPics[groupInd][onData[groupInd]];
			}
			
		}
		
		function prevPic(){
			console.log("GolbalON: "+globalOn)
			if(globalOn != 0){
				if(globalPics.length > globalOn){
					vm.fbData = globalPics[globalOn-1]
					globalOn--;
				}else{
					globalPics[globalOn] = vm.fbData;
					vm.fbData = globalPics[globalOn-1]
					globalOn--;
				}
			}else{
				vm.err = "cannot go back further";
			}
		}
		
		function populatePic(fbPics){
			var promisePhotoApi = facebook.api('/'+fbPics[onData].id+'?fields=images');
			
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
					
					var user = authentication.currentUser();
		            if(authentication.isLoggedIn() && !user.fbid){
		            	addFBtoLogin(user);
		            }
		            if(vm.user.preferences){
		            	trollForGroupsUpdates();
		            }
					//getPics();
				}else{
					vm.fbLoggedIn = false;
				}
			}, function(err){
				alert('FAILED: '+ JSON.stringify(err));
			})
			
		})
		
		function addFBtoLogin(user){
			var promiseUserApi = facebook.api('/me/?fields=email,name,id');
        	promiseUserApi.then(function(data){
        		var creds = {name:data.name, id:data.id, fbemail:data.email, email:user.email};
        		authentication
        		.addFB(creds)
        		.error(function(err){
        			console.log(err)
        		})
        		.then(function(){
        			console.log("Added FB");
        			vm.user = authentication.currentUser();
                    //console.log("New User: "+JSON.stringify(user));
        		});
        	}, function(err){
        		alert('FAILED: '+ JSON.stringify(err));
        	})
		}
		
		$rootScope.$on('fb.auth.login', function(event, data){
            var user = authentication.currentUser();
            
            if(authentication.isLoggedIn() && !user.fbid){
            	addFBtoLogin(user);
            }
            
			vm.fbLoggedIn = true;
			trollForGroupsUpdates();
		})
		
		$rootScope.$on('UpdatedPreferences', function(event, data){
			if(!vm.user.preferences){
				vm.user = data;
				trollForGroupsUpdates();
			}else{
				vm.user = data;
			}
            //vm.user = authentication.currentUser();
		})

		vm.pageHeader = {
			title : "Welcome to Big Al's Social!",
			strapline : 'Where you get to see social media streams!'
		}

	}
})();
