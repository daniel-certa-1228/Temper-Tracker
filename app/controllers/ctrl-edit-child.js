"use strict";

app.controller('EditChildCtrl', function($scope, $location, $routeParams, UserFactory, ChildFactory) {

	let user = UserFactory.getCurrentUser();

	$scope.title = "Edit Child Info";

	$scope.child = {
		birthdate: '',
		comments:'',
		name:'',
		uid: user
	};

	const getSingleChild = () => {
		console.log( "$routeParams.itemId", $routeParams.itemId );
		ChildFactory.getSingleChild($routeParams.itemId)
		.then((data) => {
			$scope.child = data;
			let fixedBirth = new Date(data.birthdate);
			console.log( "fixedBirth", fixedBirth );
			$scope.child.birthdate = fixedBirth;

		});	
	};

	$scope.deleteChild = () => {
		ChildFactory.deleteChild($routeParams.itemId)
		.then((data)=> {
			console.log( "data", data );
		})
		.then(() => {
			$location.url('/all-children');
		});
	};

	getSingleChild();
});