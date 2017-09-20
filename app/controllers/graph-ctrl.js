"use strict";
// console.log( "graph-ctrl.js" );

app.controller('GraphCtrl', function($scope, $location, $routeParams, UserFactory, RecordFactory, ChildFactory, FilterFactory, FilterFactoryChildren, $window, $timeout){
  //defines user
	let user = UserFactory.getCurrentUser();
	$scope.title = "Graphs - All Records";
	$scope.childrenInfo = [];
  //gets the user's children info for the dropdown menu
	let getChildDropdownData = () => {
		ChildFactory.getAllChildren(user)
		.then((data) => {
			for (let i = 0; i < data.length; i++) {
				$scope.childrenInfo.push(data[i]);
			}
		});
	};
	getChildDropdownData();
  //calls the system print window function
  $scope.printRecords = () => {
    $timeout($window.print, 0);
  };
});

/////////////////////////////////////////////////////////////
//////////////// ANTECEDENT DONUT GRAPH /////////////////////
/////////////////////////////////////////////////////////////

app.controller('DoughnutCtrl', ['$scope', '$timeout', 'UserFactory', 'RecordFactory', 'MathFactory', function ($scope, $timeout, UserFactory, RecordFactory, MathFactory) {
    //colors for data display
    $scope.colors = ['#97bbcd', '#dcdcdc', '#f7464a'];
    //graph labels
    $scope.labels = ['Diverted Attention', 'Parental Demand', 'Item Removed'];
    //initial value of graph data
    $scope.data = [0, 0, 0];
    //initial value of percentage data for diplay
    $scope.percentages = [0, 0, 0];

    //function to populate the graph with data
    $timeout(function () {
      //arrays to hold values
      $scope.anteArray = [];
      $scope.demand = [];
      $scope.diverted = [];
      $scope.itemRemoved = [];
      //defines user
      let user = UserFactory.getCurrentUser();
      //get all user's records and push the Antecedent properties to anteArray
	    const getAnteData = () => {
	    	RecordFactory.getAllRecords(user)
	    	.then((data) => {
	    		data.forEach(function(record){
	    			$scope.anteArray.push(record.antecedent);
	    		});
	    		return $scope.anteArray.sort();
	    	})
        //filter and sort antecedents into their appropriate arrays
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
        //set $scope.data integers by calling array.length
	    	.then(() => {
	    		$scope.data = [$scope.demands.length, $scope.diverted.length, $scope.itemRemoved.length];
	    	})
        .then(() => {
          //adds all data together to get total
          let totals = $scope.data.reduce((acc,cur) => acc + cur, 0);
          //sets the percentages by calling Mathfactory.calcPercent
          $scope.percentages = [MathFactory.calcPercent($scope.demands.length, totals), MathFactory.calcPercent($scope.diverted.length, totals), MathFactory.calcPercent($scope.itemRemoved.length, totals)];
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

app.controller('DoughnutCtrl_2', ['$scope', '$timeout', 'UserFactory', 'RecordFactory', 'MathFactory', function ($scope, $timeout, UserFactory, RecordFactory, MathFactory) {
    //colors for data display
    $scope.colors = ['#97bbcd', '#dcdcdc', '#f7464a', '#46bfbd', '#fdb45c'];
    //graph labels
    $scope.labels = ['Attention', 'Item Given', 'Item Removed', 'Escape', 'None'];
    //initial value of graph data
    $scope.data = [0, 0, 0, 0, 0];
    //initial value of percentage data for diplay
    $scope.conPercentages = [0, 0, 0, 0, 0];
    //function to populate the graph with data
    $timeout(function () {
	    //arrays to hold values
	    $scope.consequenceArray = [];
	    $scope.attentionArray = [];
	    $scope.givenArray = [];
	    $scope.removedArray = [];
	    $scope.escapeArray = [];
	    $scope.noneArray = [];
    //defines user  
		let user = UserFactory.getCurrentUser();
    //get all user's records and push the Consequence properties to consequenceArray
		const getConsequenceData = () => {
			RecordFactory.getAllRecords(user)
			.then((data) => {
				data.forEach(function(record){
		    			$scope.consequenceArray.push(record.consequence);
		    		});
		    		return $scope.consequenceArray.sort();
			})
      //filter and sort consequences into their appropriate arrays
			.then((consequences) => {
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
			})
			.then(() => {
        //set $scope.data integers by calling array.length
				$scope.data = [$scope.attentionArray.length, $scope.givenArray.length, $scope.removedArray.length, $scope.escapeArray.length, $scope.noneArray.length];
			})
      .then(() => {
        //adds all data together to get total
        let conTotals = $scope.data.reduce((acc,cur) => acc + cur, 0);
        //sets the percentages by calling Mathfactory.calcPercent
        $scope.conPercentages = [MathFactory.calcPercent($scope.attentionArray.length, conTotals), MathFactory.calcPercent($scope.givenArray.length, conTotals), MathFactory.calcPercent($scope.removedArray.length, conTotals), MathFactory.calcPercent($scope.escapeArray.length, conTotals), MathFactory.calcPercent($scope.noneArray.length, conTotals)];
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

app.controller("RadarCtrl", function ($scope, UserFactory, RecordFactory, MathFactory) {
  //graph labels
  $scope.labels =[ "0-4 min", "5-10 min", "11-20 min", "21-30 min", "Over 30 min" ];
  //initial value of graph data
  $scope.data = [
    [0, 0, 0, 0, 0]
  ];
  // defines user
  let user = UserFactory.getCurrentUser();
  //arrays to hold values
  $scope.durationArray = [];
  $scope.ZeroArray = [];
  $scope.FiveArray = [];
  $scope.ElevenArray = [];
  $scope.TwentyOneArray = [];
  $scope.ThirtyArray = [];
  //get all user's records and push the Duration properties to durationArray
  const getDurationData = () => {
  	RecordFactory.getAllRecords(user)
  	.then((data) => {
  		data.forEach((record) => {
  			$scope.durationArray.push(record.duration);
  		});
  		return $scope.durationArray.sort();
  	})
    //filter and sort durations into their appropriate arrays
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
      //set $scope.data integers by calling array.length
  		$scope.data = [[$scope.ZeroArray.length, $scope.FiveArray.length, $scope.ElevenArray.length, $scope.TwentyOneArray.length, $scope.ThirtyArray.length]];
      //set this for the patial to iterate through
    	$scope.numbers = $scope.data[0];
  	})
    .then(() => {
      //adds all data together to get total
      let durTotals = $scope.data[0].reduce((acc,cur) => acc + cur, 0);
      //sets the percentages by calling Mathfactory.calcPercent
      $scope.durPercentages = [MathFactory.calcPercent($scope.ZeroArray.length, durTotals), MathFactory.calcPercent($scope.FiveArray.length, durTotals), MathFactory.calcPercent($scope.ElevenArray.length, durTotals), MathFactory.calcPercent($scope.TwentyOneArray.length, durTotals), MathFactory.calcPercent($scope.ThirtyArray.length, durTotals)];
    });
  };
  getDurationData();
});

///////////////////////////////////////////////////////
//////////////// TIME OF DAY LINE GRAPH  //////////////
///////////////////////////////////////////////////////

app.controller("LineCtrl", function ($scope, UserFactory, RecordFactory, MathFactory) {
  //graph labels
  $scope.labels = ["6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm"];
  $scope.series = ['Incidents'];
  //initial value of graph data
  $scope.data = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  //graphjs setting for line graph
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
  //define user
  let user = UserFactory.getCurrentUser();
  //arrays to hold values
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
  //get all user's records and push the Time properties to durationArray after being converted to a string
  const getTimeData = () => {
  	RecordFactory.getAllRecords(user)
  	.then((data) => {
  		data.forEach((record) => {
  			let fixedTime = new Date(record.time);
  			$scope.TimeArray.push(fixedTime.toString());
  		});
  		return $scope.TimeArray;
  	})
  	.then((times) => {
  		times.forEach((time) =>{
        //filter and sort durations into their appropriate arrays
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
      //set $scope.data integers by calling array.length
  		$scope.data[0] = [$scope.SixAmArray.length, $scope.SevenAmArray.length, $scope.EightAmArray.length, $scope.NineAmArray.length, $scope.TenAmArray.length, $scope.ElevenAmArray.length, $scope.TwelvePmArray.length, $scope.OnePmArray.length, $scope.TwoPmArray.length, $scope.ThreePmArray.length, $scope.FourPmArray.length, $scope.FivePmArray.length, $scope.SixPmArray.length, $scope.SevenPmArray.length, $scope.EightPmArray.length, $scope.NinePmArray.length];
      //divides up the data to display in multiple rows
  		$scope.numbers1 = $scope.data[0].slice(0,8);
  		$scope.numbers2 = $scope.data[0].slice(8,16);
  		$scope.labels1 = $scope.labels.slice(0,8);
  		$scope.labels2 = $scope.labels.slice(8,16);
  	})
    .then(() => {
      //adds all data together to get total
      let timeTotals = $scope.data[0].reduce((acc,cur) => acc + cur, 0);
      //sets the percentages by calling Mathfactory.calcPercent
      $scope.timePercentages = [MathFactory.calcPercent($scope.SixAmArray.length, timeTotals), MathFactory.calcPercent($scope.SevenAmArray.length, timeTotals), MathFactory.calcPercent($scope.EightAmArray.length, timeTotals), MathFactory.calcPercent($scope.NineAmArray.length, timeTotals), MathFactory.calcPercent($scope.TenAmArray.length, timeTotals), MathFactory.calcPercent($scope.ElevenAmArray.length, timeTotals), MathFactory.calcPercent($scope.TwelvePmArray.length, timeTotals), MathFactory.calcPercent($scope.OnePmArray.length, timeTotals), MathFactory.calcPercent($scope.TwoPmArray.length, timeTotals), MathFactory.calcPercent($scope.ThreePmArray.length, timeTotals), MathFactory.calcPercent($scope.FourPmArray.length, timeTotals), MathFactory.calcPercent($scope.FivePmArray.length, timeTotals), MathFactory.calcPercent($scope.SixPmArray.length, timeTotals), MathFactory.calcPercent($scope.SevenPmArray.length, timeTotals), MathFactory.calcPercent($scope.EightPmArray.length, timeTotals), MathFactory.calcPercent($scope.NinePmArray.length, timeTotals)];
      //divides up the data to display in multiple rows
      $scope.timePercentages1 = $scope.timePercentages.slice(0,8);
      $scope.timePercentages2 = $scope.timePercentages.slice(8,16);
    });
  };
  getTimeData();
});

///////////////////////////////////////////////////////
//////////////// LAST 30 DAYS LINE GRAPH  /////////////
///////////////////////////////////////////////////////

app.controller("LineCtrl_2", function ($scope, UserFactory, RecordFactory) {

  //set data points as integers set to zero
  let thirty = 0;
  let twentyNine = 0;
  let twentyEight = 0;
  let twentySeven = 0;
  let twentySix = 0;
  let twentyFive = 0;
  let twentyFour = 0;
  let twentyThree = 0;
  let twentyTwo = 0;
  let twentyOne = 0;
  let twenty = 0;
  let nineteen = 0;
  let eighteen = 0;
  let seventeen = 0;
  let sixteen = 0;
  let fifteen = 0;
  let fourteen = 0;
  let thirteen = 0;
  let twelve = 0;
  let eleven = 0;
  let ten = 0;
  let nine = 0;
  let eight = 0;
  let seven = 0;
  let six = 0;
  let five = 0;
  let four = 0;
  let three = 0;
  let two = 0;
  let one = 0;
  let zero = 0;
  //defines user
  let user = UserFactory.getCurrentUser();
  //graph labels
  $scope.labels = [];
  $scope.series = ['Incidents'];
  //set graph data to our varables for initial values
  $scope.data = [
    [zero, one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty, twentyOne, twentyTwo, twentyThree, twentyFour, twentyFive, twentySix, twentySeven, twentyEight, twentyNine, thirty ]
  ];
  //graphjs setting for line graph
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
  //array to hold the user dates from firebase
  let dbDates = [];
  //array to hold generated dates from today and last 30 days
  $scope.dateReference = [];
  //get all user's records
  const getALlData = () => {
    RecordFactory.getAllRecords(user)
    .then((data) => {
      //loop through all records and grab the user-enter dates and push to dbDates
      data.forEach((record) => {
        let dates = new Date(record.date).toString().slice(4,15);
        dbDates.push(dates);
      });
      return dbDates;
    })
    .then((dbDates) => {
      //loop through our array of reference dates and compare each one to the user dates.
      for (let i = 0; i < $scope.dateReference.length; i++) {
        for (let j = 0; j < dbDates.length; j++) {
          if ($scope.dateReference[i] === dbDates[j]) {
              //if the reference date matches a user date
              $scope.data[0][i]++;
          }
        }
      }
    });
  };
  getALlData();

  //Create a stable reference of the last 30 days
  const fillDateReference = () => {
    for (let i = 30; i > 0; i--) {
      //create a new date for each of the last 30 days
      let dateRef = new Date(new Date().setDate(new Date().getDate()-[i])).toString().slice(4,15);
      $scope.dateReference.push(dateRef);
    }
    //create and push today's date
    let today = new Date().toString().slice(4,15);
    $scope.dateReference.push(today);
  };
  fillDateReference();
//Dynamically fill the x-axis of the chart
  const fillLabels = () => {
    for (let i = 30; i > 0; i--) {
      //create a new date for each of the last 30 days to the label array
      let dateLabel = new Date(new Date().setDate(new Date().getDate()-[i])).toString().slice(4,10);
      $scope.labels.push(dateLabel);
    }
    //create and push today's date to the label array
    let today = new Date().toString().slice(4,10);
    $scope.labels.push("Today- " + today);
  };
  fillLabels();
});