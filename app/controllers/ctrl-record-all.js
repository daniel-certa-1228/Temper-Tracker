"use strict";

app.controller('ViewRecordsCtrl', function($scope, UserFactory, RecordFactory, ChildFactory, FilterFactory) {
	
	let user = UserFactory.getCurrentUser();
	$scope.title = "View All Records";
	$scope.records = [];
	$scope.childrenData = [];
	$scope.searchText = FilterFactory;
	
	
	$scope.showAllRecords = () => {
		console.log( "showAllRecords firing" );
		ChildFactory.getAllChildren(user)
		.then((data) => {
			$scope.childrenData = data;
			console.log( "$scope.childrenData", $scope.childrenData);
		})
		.then(() => {
			RecordFactory.getAllRecords(user)
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

	$scope.deleteRecord = (id) => {
		RecordFactory.deleteRecord(id)
		.then((data) => {
			console.log( "data", data );
		})
		.then(() => {
			$scope.showAllRecords();
		});
	};

	// let getChildDropdownData = () => {
	// 	ChildFactory.getAllChildren(user)
	// 	.then((data) => {
	// 		console.log( "data", data );
	// 		for (let i = 0; i < data.length; i++) {
	// 			console.log( "data", data[i] );
	// 			$scope.childrenInfo.push(data[i]);
	// 		}
	// 		console.log( "$scope.childrenInfo", $scope.childrenInfo );
	// 	});
	// };

	// getChildDropdownData();

});