"use strict";

app.controller('NavbarCtrl', function($scope, $location, $routeParams, $window, UserFactory, FilterFactory) {

	$scope.searchText = FilterFactory;
  	$scope.isLoggedIn = false;



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
      $scope.userPhoto = user.photoURL;
      console.log( "$scope.userPhoto", $scope.userPhoto );
      $scope.$apply();
    } else {
      $scope.isLoggedIn = false;
      console.log("user logged in?", $scope.isLoggedIn);
      $window.location.href = "#!/login";
    }
  });

	const windowCheck = (location) => {
		//disables nav bar if there is nothing to search
		if ((location === "/list-records") || (location === "/all-children")) {
			$scope.searchbar = true;
			$scope.searchText = FilterFactory;
		}  else  {
			$scope.searchbar = false;
			$scope.searchText = angular.copy($scope.default);
		}
	};

	//watch $scope to check what page we're on
	$scope.$watch(() => {
		let path = $location.path();
		windowCheck(path);
    return $location.path();
	});

	//animation to have hambuger menu close on click
	 $(function(){ 
     var navMain = $(".navbar-collapse");
     navMain.on("click", "a:not([data-toggle])", null, function () {
         navMain.collapse('hide');
     });
 });

});
	// $scope.$on('$locationChangeStart', function(event) {
	//  	console.log( "CHANGEEEEEE" );
	//  	// $scope.searchText = angular.copy($scope.default);
	//  	// let input = document.getElementById("keywordSearch");

	//  	// input.value = '';

	// });