"use strict";

app.controller('AddChildCtrl', function($scope, $location, $routeParams, UserFactory, ChildFactory) {

	let user = UserFactory.getCurrentUser();
	$scope.addKid = true;
	$scope.firstUse = false;
	$scope.title = "Add Child";
	$scope.child = {
		birthdate: '',
		comments:'',
		name:'',
		uid: user
	};

	$scope.addChild = () => {
		console.log( "$scope.child", $scope.child );
		ChildFactory.addChild($scope.child)
		.then((data) => {
			console.log( "data from AddChildCtrl", data );
			$location.url('/all-children');
		});
	};

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