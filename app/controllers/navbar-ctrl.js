"use strict";

app.controller('NavbarCtrl', function($scope, $location, $routeParams, $window, UserFactory) {

	// $scope.searchText = filterFactory;
  	$scope.isLoggedIn = false;
  	$scope.searchbar = false;


	$scope.logOut = () => {
		console.log( "logout firing" );
		UserFactory.logOut()
		.then(() => {
			// clearUserPhoto();
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

	firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $scope.isLoggedIn = true;
      console.log("currentUser logged in?", user);
      console.log("logged in t-f", $scope.isLoggedIn );
      $scope.$apply();
    } else {
      $scope.isLoggedIn = false;
      console.log("user logged in?", $scope.isLoggedIn);
      $window.location.href = "#!/login";
    }
  });

	const windowCheck = (location) => {
		if ((location === "/list-records") || (location === "/all-children")) {
			$scope.searchbar = true;
		}  else  {
			$scope.searchbar = false;
		}
		console.log( "$scope.searchbar", $scope.searchbar );
	};

	$scope.$watch(() => {
		let path = $location.path();
		windowCheck(path);
    return $location.path();
	});

});