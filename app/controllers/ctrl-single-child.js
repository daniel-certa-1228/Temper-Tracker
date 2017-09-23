"use strict";

app.controller('ViewSingleChildCtrl', function($scope, $location, $routeParams,  UserFactory, RecordFactory, ChildFactory, ToggleFactory) {
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