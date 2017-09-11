"use strict";

app.controller('ViewChildrenCtrl', function($scope, $location, $routeParams, UserFactory, ChildFactory) {

	$scope.title = "View All Children";
	// $scope.records = [];
	$scope.childrenData = [];

	$scope.showAllChildren = () => {
		console.log( "showAllChildren firing");
		ChildFactory.getAllChildren()
		.then((data) => {
			$scope.childrenData = data;
			console.log( "$scope.childrenData", $scope.childrenData );
		})
		.catch((error) => {
			console.log( "error at ViewChildrenCtrl", error );
		});
	};

	$scope.showAllChildren();
});