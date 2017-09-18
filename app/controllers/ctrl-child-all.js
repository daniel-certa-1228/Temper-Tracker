"use strict";

app.controller('ViewChildrenCtrl', function($scope, $location, $routeParams, UserFactory, ChildFactory, RecordFactory, FilterFactory) {
	
	let user = UserFactory.getCurrentUser();
	$scope.title = "All Children";
	$scope.childrenData = [];
	$scope.searchText = FilterFactory;
	
	$scope.showAllChildren = () => {
		// console.log( "showAllChildren firing");
		ChildFactory.getAllChildren(user)
		.then((data) => {
			$scope.childrenData = data;
			for (let i = 0; i < data.length; i++) {
				let fixedDate = new Date(data[i].birthdate);
				$scope.childrenData[i].birthdate = fixedDate;
			}
		})
		.catch((error) => {
			console.log( "error at ViewChildrenCtrl", error );
		});
	};

	$scope.showAllChildren();
});