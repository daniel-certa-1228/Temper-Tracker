"use strict";

app.controller('NavbarCtrl', function($scope, $location, $routeParams, $window, UserFactory, FilterFactory) {

	$scope.searchText = FilterFactory;
  	$scope.isLoggedIn = false;
  	// $scope.glow_one = false;
  	// $scope.glow_two = false;
  	// handles logout button functions
	$scope.logOut = () => {
		console.log( "logout firing" );
		UserFactory.logOut()
		.then(() => {
			let user = UserFactory.getCurrentUser();
			console.log("logOut successful", user);
		})
		.then(()=> {
			$window.location.href = "#!/";
		})
		.catch((error) => {
			console.log("logout error", error);
		});
	};
	//listens for auth state change; if logged in, sets user photo and changed logged in state to TRUE
	firebase.auth().onAuthStateChanged(function(user) {
	    if (user) {
	      $scope.isLoggedIn = true;
	      console.log("currentUser logged in?", user);
	      console.log("logged in t-f", $scope.isLoggedIn );
	      $scope.userPhoto = user.photoURL;
	      $scope.$apply();
	    } else {
	      $scope.isLoggedIn = false;
	      console.log("user logged in?", $scope.isLoggedIn);
	      $window.location.href = "#!/login";
    	}
  	});
	//disables nav bar if there is nothing to search
	const windowCheck = (location) => {
		if ((location === "/list-records") || (location === "/all-children")) {
			$scope.searchbar = true;
			$scope.searchText = FilterFactory;
		}  else  {
			$scope.searchbar = false;
			$scope.searchText = angular.copy($scope.default);
		}
	};
	//watch $scope to check what page we're on; runs windowCheck
	$scope.$watch(() => {
		let path = $location.path();
		windowCheck(path);
		// console.log( "$scope.searchbar", $scope.searchbar );
    return $location.path();
	});

	// $scope.$watch('firstUse', function() {
	// 	if (firstUse === true) {	
	// 		console.log( "firstUse is true" );
	// 	}  else  {
	// 		console.log( "firstUse is false" );

	// 	}
	// });
	
	//animation to have hambuger menu close on click
	$(function(){ 
	    let navMain = $(".navbar-collapse");
	    navMain.on("click", "a:not([data-toggle])", null, function () {
	         navMain.collapse('hide');
     	});
 	});
});
