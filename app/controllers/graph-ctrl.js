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

	    const getAnteData = () => {
	    	RecordFactory.getAllRecords(user)
	    	.then((data) => {
	    		// console.log( "data", data );
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

app.controller('DoughnutCtrl_2', ['$scope', '$timeout', 'UserFactory', 'RecordFactory', function ($scope, $timeout, UserFactory, RecordFactory) {
    $scope.labels = ['Attention', 'Item Given', 'Item Removed', 'Escape', 'None'];
    $scope.data = [0, 0, 0, 0, 0];

    $scope.consequenceArray = [];

    $scope.attentionArray = [];
    $scope.givenArray = [];
    $scope.removedArray = [];
    $scope.escapeArray = [];
    $scope.noneArray = [];

	let user = UserFactory.getCurrentUser();

	const getConsequenceData = () => {
		RecordFactory.getAllRecords(user)
		.then((data) => {
			console.log( "consequence data", data );
			data.forEach(function(record){
	    			$scope.consequenceArray.push(record.consequence);
	    		});
	    		return $scope.consequenceArray.sort();
		})
		.then((consequences) => {
			console.log( "consequences", consequences );
			$scope.attentionArray = consequences.filter(function(cons){
				return cons.charAt(0) === 'A';
			});
			$scope.givenArray = consequences.filter(function(cons){
				return cons.charAt(5) === 'G';
			});
			$scope.removedArray = consequences.filter(function(cons){
				return cons.charAt(5) === 'R';
			});
			$scope.escapeArray = consequences.filter(function(cons){
				return cons.charAt(0) === 'E';
			});
			$scope.noneArray = consequences.filter(function(cons){
				return cons.charAt(0) === 'N';
			});
			// console.log( "$scope.noneArray", $scope.noneArray );
		})
		.then(() => {
			$scope.data = [$scope.attentionArray.length, $scope.givenArray.length, $scope.removedArray.length, $scope.escapeArray.length, $scope.noneArray.length];
			console.log( "$scope.data", $scope.data );
		})
		.catch((error) => {
	    		console.log( "error", error );
	    });
	};
	getConsequenceData();

    $timeout(function () {
      $scope.data = [4, 8, 2, 1, 3];
    }, 400);
}]);

// app.controller('BarCtrl', ['$scope', function ($scope) {
//     $scope.options = { legend: { display: true } };
//     $scope.labels = ['0-4 min.', '5-10 min.', '11-20 min.', '21-30 min.', 'Over 30 min.'];
//     $scope.series = ['Series A'];
//     $scope.data = [
//       [5, 0, 3, 8, 3]
//     ];
//   }]);