"use strict";

app.controller('EditRecordCtrl', function($scope, $location, $routeParams, UserFactory, RecordFactory, ChildFactory) {

	let user = UserFactory.getCurrentUser();

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

	const getSingleRecord = () => {
		RecordFactory.getSingleRecord($routeParams.itemId)
		.then
		((data) => {
			$scope.record = data;
			let fixedDate = new Date(data.date);
			let fixedTime = new Date(data.time);
			$scope.record.date = fixedDate;
			$scope.record.time = fixedTime;
			$scope.record.id = $routeParams.itemId;
			// console.log( "$scope.record", $scope.record );
		});
	};

	$scope.childrenInfo = [];

	let getChildDropdownData = () => {
		ChildFactory.getAllChildren(user)
		.then((data) => {
			// console.log( "data", data );
			for (let i = 0; i < data.length; i++) {
				// console.log( "data", data[i] );
				$scope.childrenInfo.push(data[i]);
			}
			// console.log( "$scope.childrenInfo", $scope.childrenInfo );
		})
		.then(() => {
			getSingleRecord();
		});
	};

	getChildDropdownData();

	$scope.editRecord = () => {
		RecordFactory.editRecord($routeParams.itemId, $scope.record)
		.then((data) => {
			console.log( "Edit Successful", data );
			$location.url('/list-records');
		});
	};

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