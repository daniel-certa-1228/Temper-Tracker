"use strict";

app.controller('AddRecordCtrl', function($scope, $location, $routeParams, UserFactory, RecordFactory, ChildFactory) {

	let user = UserFactory.getCurrentUser();
	let currentTime = Math.floor(Date.now());
	$scope.addRec = true;
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

	$scope.addRecord = () => {
		console.log( "$scope.record", $scope.record );
		RecordFactory.addRecord($scope.record)
		.then((data) => {
			console.log( "data from AddRecordCtrl", data );
			$location.url('/list-records');
		});
	};
	// $scope.childInfo = {};
	$scope.childrenInfo = [];

	let getChildDropdownData = () => {
		ChildFactory.getAllChildren(user)
		.then((data) => {
			console.log( "data", data );
			for (let i = 0; i < data.length; i++) {
				console.log( "data", data[i] );
				$scope.childrenInfo.push(data[i]);
			}
			console.log( "$scope.childrenInfo", $scope.childrenInfo );
		});
	};

	getChildDropdownData();


});