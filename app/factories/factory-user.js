"use strict";

app.factory('UserFactory', function($q, $http, FBCreds) {

	let currentUser = null;
	//function to pass current user around the app
	let getCurrentUser = () => {
		return currentUser;
	};

	let userEmailFromFB = {};
	//function to pass the user's email around the app
	let getUserEmailFromFB = () => {
		return userEmailFromFB;
	};

	let userPhoto = null;

	let getUserPhoto = () => {
		return userPhoto;
	};

	//checks to see if user is authenticated, resolves true or rejects false
	let isAuthenticated = () => {
		return $q((resolve, reject) => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					currentUser = user.uid;
					userPhoto = user.photoURL;
					// console.log( "userPhoto", userPhoto );
					resolve(true);
				}  else  {
					reject(false);
				}
			});
		});
	};

	//checks for an existing user by calling for an object by email
	let getUserObj = (userEmail) => {
		return $q((resolve, reject) => {
			$http.get(`${FBCreds.databaseURL}/users.json?orderBy="email"&equalTo="${userEmail}"`)
			.then((data) => {
				console.log( "data at UserFactory.getUserObj", data );
				resolve(data);
			})
			.catch((error) => {
				console.log( "error at UserFactory.getUserObj ", error );
			});
		});
	};

	let postUserObj = (userObj) => {
		return $q((resolve, reject) => {
			let newUserObj = JSON.stringify(userObj);
			$http.post(`${FBCreds.databaseURL}/users.json`, newUserObj)
			.then((data) => {
				console.log( "data from UserFactory.postUserObj", data );
				resolve(data);
			})
			.catch((error) => {
				console.log( "error at UserFactory.postUserObj", error );
				reject(error);
			});
		});
	};

	let googleProvider = new firebase.auth.GoogleAuthProvider();

	let authWithProvider = () => {
		return firebase.auth().signInWithPopup(googleProvider);
	};

	let logOut = () => {
		console.log("factoryLogOut firing");
		return firebase.auth().signOut();
	};

	return{getCurrentUser, getUserEmailFromFB, isAuthenticated, getUserObj, postUserObj, authWithProvider, logOut, getUserPhoto};

});