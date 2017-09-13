"use strict";

app.controller('ViewSingleChildCtrl', function($scope, $location, $routeParams,  UserFactory, RecordFactory, ChildFactory) {

	let user = UserFactory.getCurrentUser();

	$scope.title = "View Child";

	$scope.child = {
		birthdate: '',
		comments:'',
		name:'',
		uid: user
	};

	const getSingleChild = () => {
		ChildFactory.getSingleChild($routeParams.itemId)
		.then((data) => {
			$scope.child = data;
			$scope.child.id = $routeParams.itemId;
			let fixedBirth = new Date(data.birthdate);
			console.log( "fixedBirth", fixedBirth );
			$scope.child.birthdate = fixedBirth;
		});
	};

	getSingleChild();

});