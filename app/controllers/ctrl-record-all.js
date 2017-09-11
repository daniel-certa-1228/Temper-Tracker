"use strict";

app.controller('ViewRecordsCtrl', function($scope, UserFactory, RecordFactory, ChildFactory) {

	$scope.title = "View All Records";
	$scope.records = [];
	$scope.childrenData = [];

	$scope.showAllRecords = () => {
		console.log( "showAllRecords firing" );
		ChildFactory.getAllChildren()
		.then((data) => {
			$scope.childrenData = data;
			console.log( "$scope.childrenData", $scope.childrenData);
		})
		.then(() => {
			RecordFactory.getAllRecords()
			.then((data) => {
				$scope.records = data;
				console.log( "$scope.records", $scope.records );
				for (let i = 0; i < $scope.records.length; i++) {
					for (let j = 0; j < $scope.childrenData.length; j++) {
						if($scope.records[i].childID === $scope.childrenData[j].id) {
							$scope.records[i].child = $scope.childrenData[j].name;
						}
					}
				}
			});
		})
		.catch((error) => {
			console.log( "error at ViewRecordsCtrl.showAllRecords", error );
		});
	};

	$scope.showAllRecords();

});