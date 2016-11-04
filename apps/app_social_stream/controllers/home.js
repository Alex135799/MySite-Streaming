(function() {
	
	angular.module('mySite').controller('socialCtrl', socialCtrl);

	socialCtrl.$inject = [ "$routeParams", "mySiteData", "facebook", "$scope" ]
	function socialCtrl($routeParams, mySiteData, facebook, $scope) {
		var vm = this;
		
		vm.fbLoggedIn = true;
		vm.myInterval = 3000;
		vm.fbPhotoData = 'Retrieving Data...';
		vm.login = login;
		vm.nextPic = nextPic;
		vm.prevPic = prevPic;
		var fbPics = [];
		var onPic = 0;
		
		function nextPic(){
			onPic = onPic + 1;
			if(fbPics.length >= onPic){
				populatePic(fbPics);
			}else{
				onPic = onPic - 1;
				console.log("length: "+fbPics.length+" onPic: "+onPic);
			}
		}
		
		function prevPic(){
			onPic = onPic - 1;
			if(onPic >= 0){
				populatePic(fbPics);
			}else{
				onPic = onPic + 1;
				console.log("onPic: "+onPic);
			}
		}
		
		function populatePic(fbPics){
			var promisePhotoApi = facebook.api('/'+fbPics[onPic].id+'?fields=images');
			
			promisePhotoApi.then(function(data){
				vm.fbPic = data.images[0];
				//fbPics = data.images;
			}, function(err){
				alert('FAILED: '+ JSON.stringify(err));
			})
		}
		
		//calls populatePic ^ or alerts
		function getPics(){
			var promiseApi = facebook.api('/me/photos');
			
			promiseApi.then(function(data){
				vm.fbPhotoData = JSON.stringify(data);
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
		$scope.$on('fb.init', function (event, data){
			console.log("Event: "+JSON.stringify(data));
			var promiseLoginStatus = facebook.loginStatus();
			
			promiseLoginStatus.then(function(data){
				if(data.status === 'connected'){
					vm.fbLoggedIn = true;
					getPics();
				}else{
					vm.fbLoggedIn = false;
					//login();
				}
			}, function(err){
				alert('FAILED: '+ JSON.stringify(err));
			})
			
		})
		
		/*$scope.$on('fb.auth.login', function(event, data){
			console.log("Event: "+JSON.stringify(data));
			var promiseApi = facebook.api('/me/images');
			
			promiseApi.then(function(data){
				alert('SUCCESS: '+ JSON.stringify(data));
			}, function(err){
				alert('FAILED: '+ JSON.stringify(err));
			})
		})*/

		vm.pageHeader = {
			title : "Welcome to Big Al's Social!",
			strapline : 'Where you get to see social media streams!'
		}

	}
})();
