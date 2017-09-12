"use strict";

app.controller('NavbarCtrl', function($scope, $location, $routeParams, $window, UserFactory) {

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

});