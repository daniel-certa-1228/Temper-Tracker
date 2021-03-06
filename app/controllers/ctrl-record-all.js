"use strict";

app.controller('ViewRecordsCtrl', function($scope, UserFactory, RecordFactory, ChildFactory, FilterFactory, FilterFactoryChildren, $window, $timeout, ToggleFactory) {
	//defines user
	let user = UserFactory.getCurrentUser();
	$scope.title = "View All Records";
	$scope.records = [];
	$scope.childrenData = [];
	$scope.searchText = FilterFactory;
	$scope.kidFilter = FilterFactoryChildren;
	$scope.firstUse = false;
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
			})
			.then(() => {
				//checks if TourMode 1 is TRUE or FALSE
				let boolean = ToggleFactory.getTourModeStep_1();
				//if there is ONE record and TourMode is FALSE
				if ($scope.records.length === 1 && !boolean) {
					//$scope.firstUse is set to TRUE to trigger the alert
					$scope.firstUse = true;
					//Tourmode 1 is toggled to TRUE so that the navbar will enter TOurMode as well
					ToggleFactory.toggleTourModeStep_1();
				}  else  {
					$scope.firstUse = false;
				}
			});
		})
		.catch((error) => {
			console.log( "error at ViewRecordsCtrl.showAllRecords", error );
		});
	};
	$scope.showAllRecords();
	//Function to check tourmode 2 and turn it false if it is true
	const resetToggleTwo = () => {
		let boolean = ToggleFactory.getTourModeStep_2();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_2();
		}
	};
	resetToggleTwo();
});