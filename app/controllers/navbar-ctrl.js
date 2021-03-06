"use strict";

app.controller('NavbarCtrl', function($scope, $location, $routeParams, $window, UserFactory, FilterFactory, ToggleFactory) {

	$scope.searchText = FilterFactory;
  	$scope.isLoggedIn = false;
  	$scope.tourMode_one = false;
  	$scope.tourMode_two = false;
  	// handles logout button functions
	$scope.logOut = () => {
		// console.log( "logout firing" );
		UserFactory.logOut()
		.then(() => {
			let user = UserFactory.getCurrentUser();
			// console.log("logOut successful", user);
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
	      // console.log("currentUser logged in?", user);
	      // console.log("logged in t-f", $scope.isLoggedIn );
	      $scope.userPhoto = user.photoURL;
	      $scope.$apply();
	    } else {
	      $scope.isLoggedIn = false;
	      // console.log("user logged in?", $scope.isLoggedIn);
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
	//Checks the toggle factory to see if tour mode 1 is active
	//if true, the searchbar and Graphs link will flash
	const tourCheck_1 = (path) => {
		let boolean = ToggleFactory.getTourModeStep_1();
		// console.log( "tourCheck_1", boolean );
		if (boolean &&  (path === "/list-records") ) {
			$scope.tourMode_one = true;
			// console.log( "$scope.tourMode_one", $scope.tourMode_one );
		}  else  {
			$scope.tourMode_one = false;
			// console.log( "$scope.tourMode_one", $scope.tourMode_one );
		}
		return boolean;
	};
	//Checks the toggle factory to see if tour mode 2 is active
	//if true, the LOGO will flash
	const tourCheck_2 = (path) => {
		// console.log( "CHECK", path );
		let boolean = ToggleFactory.getTourModeStep_2();
		// console.log( "tourCheck_2 CHECK", boolean );
		if (boolean &&  (path === `/child/${$routeParams.itemId}/graphs`) ) {
			$scope.tourMode_two = true;
			// console.log( "$scope.tourMode_two", $scope.tourMode_two );
		}  else  {
			$scope.tourMode_two = false;
			// console.log( "$scope.tourMode_two", $scope.tourMode_two );
		}
		return boolean;
	};
	//watching scope for changes to detect location and Tour Mode State
	$scope.$watch(() => {
		let path = $location.path();
		windowCheck(path);
		tourCheck_1(path);
		tourCheck_2(path);
    return $location.path();
	});
	//animation to have hambuger menu close on click
	$(function(){ 
	    let navMain = $(".navbar-collapse");
	    navMain.on("click", "a:not([data-toggle])", null, function () {
	         navMain.collapse('hide');
     	});
 	});
});
