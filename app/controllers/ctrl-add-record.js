"use strict";

app.controller('AddRecordCtrl', function($scope, $location, $routeParams, UserFactory, RecordFactory, ChildFactory) {

	let user = UserFactory.getCurrentUser();

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

	$scope.addRecord = () => {
		console.log( "$scope.record", $scope.record );
		RecordFactory.addRecord($scope.record)
		.then((data) => {
			console.log( "data from AddRecordCtrl", data );
			$location.url('/list-records');
		});
	};


});