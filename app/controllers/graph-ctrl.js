"use strict";
console.log( "graph-ctrl.js" );

app.controller('GraphCtrl', function($scope, $location, $routeParams, UserFactory, RecordFactory, ChildFactory, FilterFactory, FilterFactoryChildren){

	let user = UserFactory.getCurrentUser();
	$scope.title = "Graphs";
	$scope.searchText = FilterFactory;
	$scope.kidFilter = FilterFactoryChildren;
});

app.controller('DoughnutCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.labels = ['Diverted Attention', 'Parental Demand', 'Item Removed'];
    $scope.data = [0, 0, 0];

    $scope.object = {
    	labels: $scope.labels,
    	data: $scope.data
    };

    $timeout(function () {
      $scope.data = [4, 12, 2];
    }, 500);
}]);

app.controller('DoughnutCtrl_2', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.labels = ['Attention', 'Item Given', 'Item Removed', 'Escape', 'None'];
    $scope.data = [0, 0, 0, 0, 0];

    $scope.object = {
    	labels: $scope.labels,
    	data: $scope.data
    };

    $timeout(function () {
      $scope.data = [4, 8, 2, 1, 3];
    }, 500);
}]);