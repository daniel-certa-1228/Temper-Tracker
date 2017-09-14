"use strict";
console.log( "graph-ctrl-child.js" );

app.controller('GraphChildCtrl', function($scope, $location, $routeParams, UserFactory, RecordFactory, ChildFactory, FilterFactory, FilterFactoryChildren){

	let user = UserFactory.getCurrentUser();
	$scope.title = "Graphs";
	$scope.childrenInfo = [];
	$scope.childInfo = [];

	let getChildrenData = () => {
		ChildFactory.getAllChildren(user)
		.then((data) => {
			console.log( "data", data );
			for (let i = 0; i < data.length; i++) {
				$scope.childrenInfo.push(data[i]);
				console.log( "data", data[i].id );
				if ($routeParams.itemId === data[i].id ) {
					$scope.childInfo.push(data[i]);
				}
			}
			console.log( "CHILD INFOOOOO", $scope.childrenInfo );
		});
	};
	getChildrenData();

});
// ANTECEDENT DONUT GRAPH
app.controller('DoughnutChildCtrl', ['$scope', '$timeout', '$routeParams',  'UserFactory', 'RecordFactory', function ($scope, $timeout, $routeParams,UserFactory, RecordFactory) {
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
	    	RecordFactory.getRecordsByChildID($routeParams.itemId)
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
// CONSEQUENCE DONUT GRAPH
app.controller('DoughnutChildCtrl_2', ['$scope', '$timeout', '$routeParams', 'UserFactory', 'RecordFactory', function ($scope, $timeout, $routeParams,UserFactory,  RecordFactory) {
    $scope.labels = ['Attention', 'Item Given', 'Item Removed', 'Escape', 'None'];
    $scope.data = [0, 0, 0, 0, 0];

    

    $timeout(function () {
	    // $scope.data = [4, 8, 2, 1, 3];
	    $scope.consequenceArray = [];

	    $scope.attentionArray = [];
	    $scope.givenArray = [];
	    $scope.removedArray = [];
	    $scope.escapeArray = [];
	    $scope.noneArray = [];

		let user = UserFactory.getCurrentUser();

		const getConsequenceData = () => {
			RecordFactory.getRecordsByChildID($routeParams.itemId)
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
	    }, 400);
}]);

app.controller("RadarChildCtrl", function ($scope, $routeParams, UserFactory, RecordFactory) {
  $scope.labels =[ "0-4 min.", "5-10 min.", "11-20 min.", "21-30 min.", "Over 30 min." ];

  $scope.data = [
    [0, 0, 0, 0, 0]
  ];

  let user = UserFactory.getCurrentUser();
  $scope.durationArray = [];

  $scope.ZeroArray = [];
  $scope.FiveArray = [];
  $scope.ElevenArray = [];
  $scope.TwentyOneArray = [];
  $scope.ThirtyArray = [];



  const getDurationData = () => {
  	RecordFactory.getRecordsByChildID($routeParams.itemId)
  	.then((data) => {
  		// console.log( "duration data", data );
  		data.forEach((record) => {
  			$scope.durationArray.push(record.duration);
  		});
  		console.log( "$scope.durationArray.sort()", $scope.durationArray.sort() );
  		return $scope.durationArray.sort();
  	})
  	.then((durations) => {
  		$scope.ZeroArray = durations.filter(function(dur){
  			return dur.charAt(0) === '0';
  		});
  		$scope.FiveArray = durations.filter(function(dur){
  			return dur.charAt(0) === '5';
  		});
  		$scope.ElevenArray = durations.filter(function(dur){
  			return dur.charAt(0) === '1';
  		});
  		$scope.TwentyOneArray = durations.filter(function(dur){
  			return dur.charAt(0) === '2';
  		});
  		$scope.ThirtyArray = durations.filter(function(dur){
  			return dur.charAt(0) === '3';
  		});
  	})
  	.then(() => {
  		// console.log( "durations", $scope.ZeroArray.length, $scope.FiveArray.length, $scope.ElevenArray.length, $scope.TwentyOneArray.length, $scope.ThirtyArray.length );
  		$scope.data = [
    [$scope.ZeroArray.length, $scope.FiveArray.length, $scope.ElevenArray.length, $scope.TwentyOneArray.length, $scope.ThirtyArray.length]];

    	$scope.numbers = $scope.data[0];
  	});
  };
  getDurationData();
});

// app.controller('BarCtrl', ['$scope', function ($scope) {
//     $scope.options = { legend: { display: true } };
//     $scope.labels = ['0-4 min.', '5-10 min.', '11-20 min.', '21-30 min.', 'Over 30 min.'];
//     $scope.series = ['Series A'];
//     $scope.data = [
//       [5, 0, 3, 8, 3]
//     ];
//   }]);