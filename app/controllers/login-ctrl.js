"use strict";

app.controller('LoginCtrl', function($scope, $location, $routeParams, UserFactory) {

	let createUserObj = (loginObj) => {
		return {
			email: loginObj.user.email,
			name: loginObj.user.displayName,
			uid: loginObj.user.uid,
			photoURL: loginObj.user.photoURL
		};
	};

	let loginObjStorage = [];

	$scope.logInGoogle = () => {
		loginObjStorage.length = 0;
		UserFactory.authWithProvider()
		.then((userObj) => {
			let newUserObj = createUserObj(userObj);
			loginObjStorage.push(newUserObj);
			return newUserObj;
		})
		.then((newUserObj) => {
			let fbEmail = UserFactory.getUserObj(newUserObj.email);
			return fbEmail;
		})
		.then((fbEmail) => {
			let fromFB = Object.keys(fbEmail.data);
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

});