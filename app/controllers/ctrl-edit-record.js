"use strict";

app.controller('EditRecordCtrl', function($scope, $location, $routeParams, UserFactory, RecordFactory, ChildFactory) {
	//defines user
	let user = UserFactory.getCurrentUser();
	//$scope.firstUse lets the partial know to hide the alert
	$scope.firstUse = false;
	//scope.editrec lets the partial know which views to show or hide
	$scope.editRec = true;
	$scope.title = "Edit Record";

	$scope.record = {
		childID:'',
		date:'',
		time:'',
		duration:'',
		antecedent:'',
		consequence:'',
		comments:'',
		uid: user
	};
	//calls a single record from firebase and formats it for display and edit
	const getSingleRecord = () => {
		RecordFactory.getSingleRecord($routeParams.itemId)
		.then
		((data) => {
			//constructs a new date and time object from the string of data from firebase and adds them to the record
			$scope.record = data;
			let fixedDate = new Date(data.date);
			let fixedTime = new Date(data.time);
			$scope.record.date = fixedDate;
			$scope.record.time = fixedTime;
			//adds uglyID from routeparams to record
			$scope.record.id = $routeParams.itemId;
		});
	};
	$scope.childrenInfo = [];
	//gets the children data for the dropdown
	let getChildDropdownData = () => {
		ChildFactory.getAllChildren(user)
		.then((data) => {
			for (let i = 0; i < data.length; i++) {
				$scope.childrenInfo.push(data[i]);
			}
		})
		.then(() => {
			//after the child data is in place, the record is retrieved
			getSingleRecord();
		});
	};
	getChildDropdownData();
	//calls function to edit a single firebase record
	$scope.editRecord = () => {
		RecordFactory.editRecord($routeParams.itemId, $scope.record)
		.then((data) => {
			console.log( "Edit Successful", data );
			$location.url('/list-records');
		});
	};
	//calls function to delete a single firebase record
	$scope.deleteRecordFromEdit = () => {
		RecordFactory.deleteRecord($routeParams.itemId)
		.then((data) => {
			console.log( "data", data );
		})
		.then(() => {
			$location.url('/list-records');
		});
	};
});