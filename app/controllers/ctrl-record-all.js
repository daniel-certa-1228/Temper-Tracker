"use strict";

app.controller('ViewRecordsCtrl', function($scope, UserFactory, RecordFactory, ChildFactory, FilterFactory, FilterFactoryChildren, $window, $timeout) {
	//defines user
	let user = UserFactory.getCurrentUser();
	$scope.title = "View All Records";
	$scope.records = [];
	$scope.childrenData = [];
	$scope.searchText = FilterFactory;
	$scope.kidFilter = FilterFactoryChildren;
	// calls system print fucntion
	$scope.printRecords = () => {
		$timeout($window.print, 0);
	};
	//calls all records and formats them for display
	$scope.showAllRecords = () => {
		//gets all of the user's children data to add child names to records
		ChildFactory.getAllChildren(user)
		.then((data) => {
			$scope.childrenData = data;
		})
		.then(() => {
			RecordFactory.getAllRecords(user)
			.then((data) => {
				$scope.records = data;
				//goes through each record and constructs date and time objects and add's the child's name based on the child ID
				for (let i = 0; i < $scope.records.length; i++) {
					let fixedDate = new Date(data[i].date);
					let fixedTime = new Date(data[i].time);
					$scope.records[i].date = fixedDate;
					$scope.records[i].time = fixedTime;
					for (let j = 0; j < $scope.childrenData.length; j++) {
						if($scope.records[i].childID === $scope.childrenData[j].id) {
							$scope.records[i].child = $scope.childrenData[j].name;
						}
					}
				}
			})
			.then(() => {
				//sorts records by timestamp and sends the newest out first
				$scope.records.sort(function(a, b) {
    			return (a.timestamp) - (b.timestamp);
				});
				$scope.records.reverse();
			});
		})
		.catch((error) => {
			console.log( "error at ViewRecordsCtrl.showAllRecords", error );
		});
	};
	$scope.showAllRecords();
});