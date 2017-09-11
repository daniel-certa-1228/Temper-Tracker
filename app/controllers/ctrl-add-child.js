"use strict";

app.controller('AddChildCtrl', function($scope, $location, $routeParams, UserFactory, ChildFactory) {

	let user = UserFactory.getCurrentUser();

	$scope.title = "Add Child";
	$scope.child = {
		birthdate: '',
		comments:'',
		name:'',
		uid: user
	};

	$scope.addChild = () => {
		console.log( "$scope.child", $scope.child );
		ChildFactory.addChild($scope.child)
		.then((data) => {
			console.log( "data from AddChildCtrl", data );
			$location.url('/all-children');
		});
	};

});