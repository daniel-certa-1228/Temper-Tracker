"use strict";

app.controller('ViewSingleRecordCtrl', function($scope, $location, $routeParams, UserFactory, RecordFactory, ChildFactory) {

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

	const getSingleRecord = () => {
		RecordFactory.getSingleRecord($routeParams.itemId)
		.then
		((data) => {
			$scope.record = data;
			$scope.record.id = $routeParams.itemId;
			let fixedDate = new Date(data.date);
			let fixedTime = new Date(data.time);
			$scope.record.time = fixedTime;
			$scope.record.date = fixedDate;
			return data.childID;
		})
		.then((childID) => {
			// console.log( "childID", childID );
			ChildFactory.getSingleChild(childID)
			.then((data) => {
				$scope.record.child = data.name;
				console.log( "$scope.record", $scope.record );
			});
		});
	};
	getSingleRecord();
});