(function() {

	angular.module('mySite').controller('socialCtrl', socialCtrl);

	socialCtrl.$inject = [ "$routeParams", "mySiteData", "facebook", "$scope" ]
	function socialCtrl($routeParams, mySiteData, facebook, $scope) {
		var vm = this;
		
		vm.fbPhotoData = 'Retrieving Data...';
		
		$scope.$on('fb.init', function (event, data){
			console.log("Event: "+JSON.stringify(data));
			var promiseLoginStatus = facebook.loginStatus();
			
			promiseLoginStatus.then(function(data){
				if(data.status === 'connected'){
					var promiseApi = facebook.api('/me/photos');
					
					promiseApi.then(function(data){
						vm.fbPhotoData = JSON.stringify(data);
						var photoID = data.data[0].id;
						var promisePhotoApi = facebook.api('/'+photoID+'?fields=images');
						
						promisePhotoApi.then(function(data){
							vm.fbPic = data.images[0].source;
						}, function(err){
							alert('FAILED: '+ JSON.stringify(err));
						})
					}, function(err){
						alert('FAILED: '+ JSON.stringify(err));
					})
				}else{
					var promiseLogin = facebook.login({scope: 'public_profile,user_friends,email'});
					
					promiseLogin.then(function(data){
						alert('SUCCESS: '+ JSON.stringify(data));
					}, function(err){
						alert('FAILED: '+ JSON.stringify(err));
					})
				}
			}, function(err){
				alert('FAILED: '+ JSON.stringify(err));
			})
			
			/*var promiseLogin = facebook.login();
			
			promiseLogin.then(function(data){
				alert('SUCCESS: '+ JSON.stringify(data));
			}, function(err){
				alert('FAILED: '+ JSON.stringify(err));
			})*/
		})
		
		$scope.$on('fb.auth.login', function(event, data){
			console.log("Event: "+JSON.stringify(data));
			var promiseApi = facebook.api('/me/images');
			
			promiseApi.then(function(data){
				alert('SUCCESS: '+ JSON.stringify(data));
			}, function(err){
				alert('FAILED: '+ JSON.stringify(err));
			})
		})

		vm.pageHeader = {
			title : "Welcome to Big Al's Social!",
			strapline : 'Where you get to see social media streams!'
		}

	}
})();
