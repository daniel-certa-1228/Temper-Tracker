"use strict";

app.controller('LoginCtrl', function($scope, $location, $routeParams, UserFactory, ToggleFactory) {
	//constructs a user object for storage based on what is provided by google login
	let createUserObj = (loginObj) => {
		return {
			email: loginObj.user.email,
			name: loginObj.user.displayName,
			uid: loginObj.user.uid,
			photoURL: loginObj.user.photoURL
		};
	};
	//$scope.userLoggedIn value triggers the animation of the login partial
	$scope.userLoggedIn = false;

	let loginObjStorage = [];
	//Google login
	$scope.logInGoogle = () => {
		//clear the login object array in case there is a previous user
		loginObjStorage.length = 0;
		UserFactory.authWithProvider()
		.then((userObj) => {
			//$scope.userLoggedIn set to true to trigger fade-out
			$scope.userLoggedIn = true;
			//call createUserObj and pass it the google user data
			let newUserObj = createUserObj(userObj);
			loginObjStorage.push(newUserObj);
			return newUserObj;
		})
		.then((newUserObj) => {
			//get the new user's email to pass to the next function
			let fbEmail = UserFactory.getUserObj(newUserObj.email);
			return fbEmail;
		})
		.then((fbEmail) => {
			let fromFB = Object.keys(fbEmail.data);
			//check to see if the user exists in firebase - if not, post a user object and then shunt to first-time-user control-flow
			if(fromFB.length ===0 ) {
				UserFactory.postUserObj(loginObjStorage[0]);
				$location.path('/add-child');
				$scope.$apply();
			}  else  {
				$location.path('/home');
				$scope.$apply();
			}
			console.log( "login successful" );
		})
		.catch((error) => {
			console.log( "login error", error );
		});
	};
	//Functions to check tourmode 1 and 2 and turn them false if they are true
	const resetToggleOne = () => {
		let boolean = ToggleFactory.getTourModeStep_1();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_1();
		}
	};
	resetToggleOne();

	const resetToggleTwo = () => {
		let boolean = ToggleFactory.getTourModeStep_2();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_2();
		}
	};
	resetToggleTwo();
});