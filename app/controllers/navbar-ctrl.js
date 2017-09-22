"use strict";

app.controller('NavbarCtrl', function($scope, $location, $routeParams, $window, UserFactory, FilterFactory, ToggleFactory) {

	$scope.searchText = FilterFactory;
  	$scope.isLoggedIn = false;
  	$scope.tourMode_one = false;
  	$scope.tourMode_two = false;
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

	const tourCheck_1 = () => {
		let boolean = ToggleFactory.getTourModeStep_1();
		console.log( "tourCheck_1", boolean );
		if (boolean) {
			$scope.tourMode_one = true;
			console.log( "$scope.tourMode_one", $scope.tourMode_one );
		}  else  {
			$scope.tourMode_one = false;
			console.log( "$scope.tourMode_one", $scope.tourMode_one );
		}
		return boolean;
	};

	const tourCheck_2 = () => {
		ToggleFactory.getTourModeStep_2()
		.then((boolean) => {
			if (boolean === true) {
				$scope.tourMode_two = true;
			}
			else {
				$scope.tourMode_two = false;
			}
		});
	};
	//watch $scope to check what page we're on; runs windowCheck
	$scope.$watch(() => {
		let path = $location.path();
		windowCheck(path);
		tourCheck_1();
		// console.log( "$scope.searchbar", $scope.searchbar );
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
