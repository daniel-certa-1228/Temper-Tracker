"use strict";

app.controller('ViewSingleRecordCtrl', function($scope, $location, $routeParams, UserFactory, RecordFactory, ChildFactory, ToggleFactory) {
	//defines user
	let user = UserFactory.getCurrentUser();

	$scope.title = "View Record";

	$scope.record = {
		childID:'',
		child:'',
		date:'',
		time:'',
		duration:'',
		antecedent:'',
		consequence:'',
		comments:'',
		uid: user
	};
	//calls a single record from firebase and formats it for display
	const getSingleRecord = () => {
		RecordFactory.getSingleRecord($routeParams.itemId)
		.then
		((data) => {
			$scope.record = data;
			//adds uglyID from routeparams to record
			$scope.record.id = $routeParams.itemId;
			//constructs a new date and time object from the string of data from firebase and adds them to the record
			let fixedDate = new Date(data.date);
			let fixedTime = new Date(data.time);
			$scope.record.time = fixedTime;
			$scope.record.date = fixedDate;
			return data.childID;
		})
		.then((childID) => {
			ChildFactory.getSingleChild(childID)
			.then((data) => {
				//adds the child's name to the record based on their ID
				$scope.record.child = data.name;
			});
		});
	};
	getSingleRecord();

	const resetToggleOne = () => {
		let boolean = ToggleFactory.getTourModeStep_1();
		if (boolean) {
			console.log( "FIXED" );
			ToggleFactory.toggleTourModeStep_1();
		}
	};
	resetToggleOne();

	const resetToggleTwo = () => {
		let boolean = ToggleFactory.getTourModeStep_2();
		if (boolean) {
			console.log( "FIXED" );
			ToggleFactory.toggleTourModeStep_2();
		}
	};
	resetToggleOne();
});