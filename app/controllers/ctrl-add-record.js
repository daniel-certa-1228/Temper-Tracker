"use strict";

app.controller('AddRecordCtrl', function($scope, $location, $routeParams, UserFactory, RecordFactory, ChildFactory, ToggleFactory) {
	//defines user
	let user = UserFactory.getCurrentUser();
	//sets timestamp
	let currentTime = Math.floor(Date.now());
	//scope.addRec lets the partial know which views to show or hide
	$scope.addRec = true;
	//$scope.firstUse lets the partial know to hide the alert
	$scope.firstUse = false;
	$scope.title = "Add Record";

	$scope.record = {
		childID:'',
		date:'',
		time:'',
		duration:'',
		antecedent:'',
		consequence:'',
		comments:'',
		uid: user,
		timestamp: currentTime
	};
	//calls function to add record to firebase
	$scope.addRecord = () => {
		RecordFactory.addRecord($scope.record)
		.then((data) => {
			// console.log( "data from AddRecordCtrl", data );
			$location.url('/list-records');
		});
	};
	//checks for existing records and sets the firstUse variable
	let checkForRecords = () => {
		RecordFactory.getAllRecords(user)
		.then((data) => {
			if (data.length === 0) {
				// console.log( "true" );
				$scope.firstUse = true;
			}  else  {
				// console.log( "false" );
				$scope.firstUse = false;
			}
		});
	};
	checkForRecords();

	$scope.childrenInfo = [];
	//calls firebase for the user's child-records and populates drop-down
	let getChildDropdownData = () => {
		ChildFactory.getAllChildren(user)
		.then((data) => {
			for (let i = 0; i < data.length; i++) {
				$scope.childrenInfo.push(data[i]);
			}
		});
	};
	getChildDropdownData();
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