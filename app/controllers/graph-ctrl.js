"use strict";
console.log( "graph-ctrl.js" );

app.controller('GraphCtrl', function($scope, $location, $routeParams, UserFactory, RecordFactory, ChildFactory, FilterFactory, FilterFactoryChildren, $window, $timeout){

	let user = UserFactory.getCurrentUser();
	$scope.title = "Graphs - All Records";
	$scope.childrenInfo = [];

	let getChildDropdownData = () => {
		ChildFactory.getAllChildren(user)
		.then((data) => {
			for (let i = 0; i < data.length; i++) {
				$scope.childrenInfo.push(data[i]);
			}
		});
	};
	getChildDropdownData();

  $scope.printRecords = () => {
    $timeout($window.print, 0);
  };

});

/////////////////////////////////////////////////////////////
//////////////// ANTECEDENT DONUT GRAPH /////////////////////
/////////////////////////////////////////////////////////////

app.controller('DoughnutCtrl', ['$scope', '$timeout', 'UserFactory', 'RecordFactory', function ($scope, $timeout, UserFactory, RecordFactory) {
    $scope.colors = ['#97bbcd', '#dcdcdc', '#f7464a'];
    $scope.labels = ['Diverted Attention', 'Parental Demand', 'Item Removed'];
    $scope.data = [0, 0, 0];


    $timeout(function () {
      $scope.anteArray = [];
      $scope.demand = [];
      $scope.diverted = [];
      $scope.itemRemoved = [];

      let user = UserFactory.getCurrentUser();

	    const getAnteData = () => {
	    	RecordFactory.getAllRecords(user)
	    	.then((data) => {
	    		data.forEach(function(record){
	    			$scope.anteArray.push(record.antecedent);
	    		});
	    		return $scope.anteArray.sort();
	    	})
	    	.then((antecedents) => {
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

///////////////////////////////////////////////////////
//////////////// CONSEQUENCE DONUT GRAPH///////////////
///////////////////////////////////////////////////////

app.controller('DoughnutCtrl_2', ['$scope', '$timeout', 'UserFactory', 'RecordFactory', function ($scope, $timeout, UserFactory, RecordFactory) {
    $scope.colors = ['#97bbcd', '#dcdcdc', '#f7464a', '#46bfbd', '#fdb45c'];
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
			RecordFactory.getAllRecords(user)
			.then((data) => {
				// console.log( "consequence data", data );
				data.forEach(function(record){
		    			$scope.consequenceArray.push(record.consequence);
		    		});
		    		return $scope.consequenceArray.sort();
			})
			.then((consequences) => {
				// console.log( "consequences", consequences );
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
				// console.log( "$scope.data", $scope.data );
			})
			.catch((error) => {
		    		console.log( "error", error );
		    });
		};
		getConsequenceData();
	    }, 400);
}]);

///////////////////////////////////////////////////////
//////////////// DURATION RADAR GRAPH  ////////////////
///////////////////////////////////////////////////////

app.controller("RadarCtrl", function ($scope, UserFactory, RecordFactory) {
  $scope.labels =[ "0-4 min", "5-10 min", "11-20 min", "21-30 min", "Over 30 min" ];

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
  	RecordFactory.getAllRecords(user)
  	.then((data) => {
  		// console.log( "duration data", data );
  		data.forEach((record) => {
  			$scope.durationArray.push(record.duration);
  		});
  		// console.log( "$scope.durationArray.sort()", $scope.durationArray.sort() );
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

///////////////////////////////////////////////////////
//////////////// TIME OF DAY LINE GRAPH  //////////////
///////////////////////////////////////////////////////

app.controller("LineCtrl", function ($scope, UserFactory, RecordFactory) {

  $scope.labels = ["6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm"];
  $scope.series = ['Series A'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 55, 40]
  ];

  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: false,
          position: 'right'
        }
      ]
    }
  };

  let user = UserFactory.getCurrentUser();

  $scope.TimeArray = [];

  $scope.SixAmArray = [];
  $scope.SevenAmArray = [];
  $scope.EightAmArray = [];
  $scope.NineAmArray = [];
  $scope.TenAmArray = [];
  $scope.ElevenAmArray = [];
  $scope.TwelvePmArray = [];
  $scope.OnePmArray = [];
  $scope.TwoPmArray = [];
  $scope.ThreePmArray = [];
  $scope.FourPmArray = [];
  $scope.FivePmArray = [];
  $scope.SixPmArray = [];
  $scope.SevenPmArray = [];
  $scope.EightPmArray = [];
  $scope.NinePmArray = [];

  const getTimeData = () => {
  	RecordFactory.getAllRecords(user)
  	.then((data) => {
  		// console.log( "time data", data );
  		data.forEach((record) => {
  			let fixedTime = new Date(record.time);
  			$scope.TimeArray.push(fixedTime.toString());
  		});
  		return $scope.TimeArray;
  	})
  	.then((times) => {
  		// console.log( "TIMES", times );
  		times.forEach((time) =>{

  			if ( (/([0][6]:)([0-2][0-9]:)/ig).test(time) ) {
  				$scope.SixAmArray.push(time);
  			}

  			if ( /([0][6]:)([3-5][0-9]:)/ig.test(time) || /([0][7]:)([0-2][0-9]:)/ig.test(time) ) {
  				$scope.SevenAmArray.push(time);
  			}
  			if ( /([0][7]:)([3-5][0-9]:)/ig.test(time) || /([0][8]:)([0-2][0-9]:)/ig.test(time) ) {
  				$scope.EightAmArray.push(time);
  			}
  			if ( /([0][8]:)([3-5][0-9]:)/ig.test(time) || /([0][9]:)([0-2][0-9]:)/ig.test(time) ) {
  				$scope.NineAmArray.push(time);
  			}
  			if ( /([0][9]:)([3-5][0-9]:)/ig.test(time) || /([1][0]:)([0-2][0-9]:)/ig.test(time) ) {
  				$scope.TenAmArray.push(time);
  			}
  			if ( /([1][0]:)([3-5][0-9]:)/ig.test(time) || /([1][1]:)([0-2][0-9]:)/ig.test(time) ) {
  				$scope.ElevenAmArray.push(time);
  			}
  			if ( /([1][1]:)([3-5][0-9]:)/ig.test(time) || /([1][2]:)([0-2][0-9]:)/ig.test(time) ) {
  				$scope.TwelvePmArray.push(time);
  			}
  			if ( /([1][2]:)([3-5][0-9]:)/ig.test(time) || /([1][3]:)([0-2][0-9]:)/ig.test(time) ) {
  				$scope.OnePmArray.push(time);
  			}
  			if ( /([1][3]:)([3-5][0-9]:)/ig.test(time) || /([1][4]:)([0-2][0-9]:)/ig.test(time) ) {
  				$scope.TwoPmArray.push(time);
  			}
  			if ( /([1][4]:)([3-5][0-9]:)/ig.test(time) || /([1][5]:)([0-2][0-9]:)/ig.test(time) ) {
  				$scope.ThreePmArray.push(time);
  			}
  			if ( /([1][5]:)([3-5][0-9]:)/ig.test(time) || /([1][6]:)([0-2][0-9]:)/ig.test(time) ) {
  				$scope.FourPmArray.push(time);
  			}
  			if ( /([1][6]:)([3-5][0-9]:)/ig.test(time) || /([1][7]:)([0-2][0-9]:)/ig.test(time) ) {
  				$scope.FivePmArray.push(time);
  			}
  			if ( /([1][7]:)([3-5][0-9]:)/ig.test(time) || /([1][8]:)([0-2][0-9]:)/ig.test(time) ) {
  				$scope.SixPmArray.push(time);
  			}
  			if ( /([1][8]:)([3-5][0-9]:)/ig.test(time) || /([1][9]:)([0-2][0-9]:)/ig.test(time) ) {
  				$scope.SevenPmArray.push(time);
  			}
  			if ( /([1][9]:)([3-5][0-9]:)/ig.test(time) || /([2][0]:)([0-2][0-9]:)/ig.test(time) ) {
  				$scope.EightPmArray.push(time);
  			}
  			if ( /([2][0]:)([3-5][0-9]:)/ig.test(time) || /([2][1]:)([0-5][0-9]:)/ig.test(time) ) {
  				$scope.NinePmArray.push(time);
  			}
  		});
  		 
  	})
  	.then(() => {
  		$scope.data[0] = [$scope.SixAmArray.length, $scope.SevenAmArray.length, $scope.EightAmArray.length, $scope.NineAmArray.length, $scope.TenAmArray.length, $scope.ElevenAmArray.length, $scope.TwelvePmArray.length, $scope.OnePmArray.length, $scope.TwoPmArray.length, $scope.ThreePmArray.length, $scope.FourPmArray.length, $scope.FivePmArray.length, $scope.SixPmArray.length, $scope.SevenPmArray.length, $scope.EightPmArray.length, $scope.NinePmArray.length];
  		$scope.numbers1 = $scope.data[0].slice(0,7);
  		$scope.numbers2 = $scope.data[0].slice(8,15);
  		$scope.labels1 = $scope.labels.slice(0,7);
  		$scope.labels2 = $scope.labels.slice(8,15);
  	});
  };
  getTimeData();
});