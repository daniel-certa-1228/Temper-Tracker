"use strict";

app.controller('AddChildCtrl', function($scope, $location, $routeParams, UserFactory, ChildFactory) {

	//defines user
	let user = UserFactory.getCurrentUser();
	//scope.addKid lets the partial know which views to show or hide
	$scope.addKid = true;
	//$scope.firstUse lets the partial know to hide the alert
	$scope.firstUse = false;
	$scope.title = "Add Child";

	$scope.child = {
		birthdate: '',
		comments:'',
		name:'',
		uid: user
	};
	//calls function to add record to firebase
	$scope.addChild = () => {
		console.log( "$scope.child", $scope.child );
		ChildFactory.addChild($scope.child)
		.then((data) => {
			// console.log( "data from AddChildCtrl", data );
			//if firstUSe is true, it'ss take the user to the all-children view
			if($scope.firstUse !== true) {
				$location.url('/all-children');
			}  else  {
				//if firstUSe is false, it'ss take the user to the home view and prompt the user to add a record
				$location.url('/home');
			}
		});
	};
	//checks for existing records and sets the firstUse variable
	const checkForRecords = () => {
		ChildFactory.getAllChildren(user)
		.then((data) => {
			console.log( "data", data );
			if (data.length === 0) {
				console.log( "NO KIDS" );
				$scope.firstUse = true;
			}  else  {
				console.log( "KIDS" );
				$scope.firstUse = false;
			}
		});
	};
	checkForRecords();
});