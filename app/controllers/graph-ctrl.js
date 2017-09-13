"use strict";
console.log( "graph-ctrl.js" );

app.controller('GraphCtrl', function($scope, $location, $routeParams, UserFactory, RecordFactory, ChildFactory, FilterFactory, FilterFactoryChildren){

	let user = UserFactory.getCurrentUser();
	$scope.title = "Graphs";
	$scope.searchText = FilterFactory;
	$scope.kidFilter = FilterFactoryChildren;
});

app.controller('DoughnutCtrl', ['$scope', '$timeout', 'UserFactory', 'RecordFactory', function ($scope, $timeout, UserFactory, RecordFactory) {
    $scope.labels = ['Diverted Attention', 'Parental Demand', 'Item Removed'];
    $scope.data = [0, 0, 0];


    $timeout(function () {
      // $scope.data = [0, 0, 0];

      $scope.anteArray = [];
      $scope.demand = [];
      $scope.diverted = [];
      $scope.itemRemoved = [];


      let user = UserFactory.getCurrentUser();

	    let getAnteData = () => {
	    	RecordFactory.getAllRecords(user)
	    	.then((data) => {
	    		console.log( "data", data );
	    		data.forEach(function(record){
	    			$scope.anteArray.push(record.antecedent);
	    		});
	    		return $scope.anteArray.sort();
	    	})
	    	.then((antecedents) => {
	    		console.log( "antecedents", antecedents );
	    		$scope.demands = antecedents.filter(function(ante){
	    			return ante.charAt(0) === 'P';
	    		});
	    		$scope.diverted = antecedents.filter(function(ante){
	    			return ante.charAt(0) === 'D';
	    		});
	    		$scope.itemRemoved = antecedents.filter(function(ante){
	    			return ante.charAt(0) === 'I';
	    		});
	    	})
	    	.then(() => {
	    		$scope.data = [$scope.demands.length, $scope.diverted.length, $scope.itemRemoved.length];
	    	})
	    	.catch((error) => {
	    		console.log( "error", error );
	    	});
	    };
	    getAnteData();
    }, 400);
}]);

// app.controller('DoughnutCtrl_2', ['$scope', '$timeout', function ($scope, $timeout) {
//     $scope.labels = ['Attention', 'Item Given', 'Item Removed', 'Escape', 'None'];
//     $scope.data = [0, 0, 0, 0, 0];

//     $scope.object = {
//     	labels: $scope.labels,
//     	data: $scope.data
//     };

//     $timeout(function () {
//       $scope.data = [4, 8, 2, 1, 3];
//     }, 500);
// }]);

// app.controller('BarCtrl', ['$scope', function ($scope) {
//     $scope.options = { legend: { display: true } };
//     $scope.labels = ['0-4 min.', '5-10 min.', '11-20 min.', '21-30 min.', 'Over 30 min.'];
//     $scope.series = ['Series A'];
//     $scope.data = [
//       [5, 0, 3, 8, 3]
//     ];
//   }]);