"use strict";

app.controller('EditChildCtrl', function($scope, $location, $routeParams, UserFactory, ChildFactory, RecordFactory) {

	let user = UserFactory.getCurrentUser();

	$scope.editKid = true;
	$scope.title = "Edit Child Info";

	$scope.child = {
		birthdate: '',
		comments:'',
		name:'',
		uid: user
	};

	const getSingleChild = () => {
		console.log( "$routeParams.itemId", $routeParams.itemId );
		ChildFactory.getSingleChild($routeParams.itemId)
		.then((data) => {
			$scope.child = data;
			let fixedBirth = new Date(data.birthdate);
			console.log( "fixedBirth", fixedBirth );
			$scope.child.birthdate = fixedBirth;

		});	
	};

	$scope.editChild = () => {
		ChildFactory.editChild($routeParams.itemId, $scope.child)
		.then((data) => {
			console.log( "Edit Successful", data );
			$location.url('/all-children');
		});
	};


	$scope.deleteChildFromEdit = () => {
		ChildFactory.deleteChild($routeParams.itemId)
		.then((data)=> {
			console.log( "data", data );
		})
		.then(() => {
			// console.log( "$routeParams.itemId", $routeParams.itemId );
			RecordFactory.getRecordsByChildID($routeParams.itemId)
			.then((data) => {
				console.log( "all child records", data );
				for (let i = 0; i < data.length; i++) {
					RecordFactory.deleteRecord(data[i].id);
				}
			});
		})
		.then(() => {
			$location.url('/all-children');
		});
	};

	getSingleChild();
});