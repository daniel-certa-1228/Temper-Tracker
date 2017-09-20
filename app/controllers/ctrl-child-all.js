"use strict";

app.controller('ViewChildrenCtrl', function($scope, $location, $routeParams, UserFactory, ChildFactory, RecordFactory, FilterFactory) {
	//defines user
	let user = UserFactory.getCurrentUser();
	$scope.title = "All Children";
	$scope.childrenData = [];
	$scope.searchText = FilterFactory;
	
	$scope.showAllChildren = () => {
		// //calls all child records and formats them for display
		ChildFactory.getAllChildren(user)
		.then((data) => {
			//goes through each record and constructs date object
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