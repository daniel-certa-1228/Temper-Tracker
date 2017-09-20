"use strict";

app.controller('ViewSingleChildCtrl', function($scope, $location, $routeParams,  UserFactory, RecordFactory, ChildFactory) {
	//defines user
	let user = UserFactory.getCurrentUser();

	$scope.title = "View Child";

	$scope.child = {
		birthdate: '',
		comments:'',
		name:'',
		uid: user
	};
	//calls a single child record from firebase and formats it for display
	const getSingleChild = () => {
		ChildFactory.getSingleChild($routeParams.itemId)
		.then((data) => {
			$scope.child = data;
			//adds uglyID from routeparams to child record
			$scope.child.id = $routeParams.itemId;
			//constructs a new date object from the string of data from firebase and adds them to the record
			let fixedBirth = new Date(data.birthdate);
			$scope.child.birthdate = fixedBirth;
		});
	};
	getSingleChild();
});