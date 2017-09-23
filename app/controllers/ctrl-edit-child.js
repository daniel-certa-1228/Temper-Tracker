"use strict";

app.controller('EditChildCtrl', function($scope, $location, $routeParams, UserFactory, ChildFactory, RecordFactory, ToggleFactory) {
	//defines user
	let user = UserFactory.getCurrentUser();
	//$scope.editrec lets the partial know which views to show or hide
	$scope.editKid = true;
	//$scope.firstUse lets the partial know to hide the alert
	$scope.firstUse = false;
	$scope.title = "Edit Child Info";

	$scope.child = {
		birthdate: '',
		comments:'',
		name:'',
		uid: user
	};
	//calls a single child record from firebase and formats it for display and edit
	const getSingleChild = () => {
		ChildFactory.getSingleChild($routeParams.itemId)
		.then((data) => {
			$scope.child = data;
			//constructs a new date object from the string of data from firebase and adds them to the record
			let fixedBirth = new Date(data.birthdate);
			$scope.child.birthdate = fixedBirth;
		});	
	};
	//calls function to edit a single firebase child record
	$scope.editChild = () => {
		ChildFactory.editChild($routeParams.itemId, $scope.child)
		.then((data) => {
			console.log( "Edit Successful", data );
			$location.url('/all-children');
		});
	};
	//calls function to delete a single firebase record
	$scope.deleteChildFromEdit = () => {
		ChildFactory.deleteChild($routeParams.itemId)
		.then((data)=> {
			console.log( "data", data );
		})
		.then(() => {
			//When a child is deleted, this gets the records for a that child and calls the delete function on each id
			RecordFactory.getRecordsByChildID($routeParams.itemId)
			.then((data) => {
				console.log( "all child records", data );
				for (let i = 0; i < data.length; i++) {
					RecordFactory.deleteRecord(data[i].id);
				}
			});
		})
		.then(() => {
			$location.url('/all-children');
		});
	};
	getSingleChild();

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