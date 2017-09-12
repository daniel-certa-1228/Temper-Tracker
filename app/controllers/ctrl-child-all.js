"use strict";

app.controller('ViewChildrenCtrl', function($scope, $location, $routeParams, UserFactory, ChildFactory, RecordFactory, FilterFactory) {
	
	let user = UserFactory.getCurrentUser();
	$scope.title = "All Children";
	// $scope.records = [];
	$scope.childrenData = [];
	$scope.searchText = FilterFactory;
	

	$scope.showAllChildren = () => {
		console.log( "showAllChildren firing");
		ChildFactory.getAllChildren(user)
		.then((data) => {
			$scope.childrenData = data;
			console.log( "$scope.childrenData", $scope.childrenData );
		})
		.catch((error) => {
			console.log( "error at ViewChildrenCtrl", error );
		});
	};

	$scope.showAllChildren();

	$scope.deleteChild = (id) => {

		console.log( "id", id );
		ChildFactory.deleteChild(id)
		.then((data)=> {
			console.log( "data", data );
		})
		.then(() => {
			RecordFactory.getRecordsByChildID(id)
			.then((data) => {
				console.log( "all child records", data );
				for (let i = 0; i < data.length; i++) {
					RecordFactory.deleteRecord(data[i].id);
				}
			});
		})
		.then(() => {
			$scope.showAllChildren();
		});
	};
});