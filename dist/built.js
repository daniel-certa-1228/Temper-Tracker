"use strict";
console.log( "app.js" );

const app = angular.module('TemperTracker', ['ngRoute', 'chart.js', 'ngAnimate']);

app.run(($location, FBCreds) => {
	firebase.initializeApp(FBCreds);
});

let isAuth = (UserFactory) => new Promise((resolve, reject) => {
	// console.log( "userFactory is", UserFactory );
	UserFactory.isAuthenticated()
	.then((userExists) => {
		if(userExists) {
			// console.log( "YOU GOOD" );
			resolve();
		}  else  {
			console.log( "YOU ARE NOT AUTHORIZED" );
			reject();
		}
	});
});

app.config((ChartJsProvider) => {
	// Configure all charts
    ChartJsProvider.setOptions({
      colors: ['#97BBCD', '#DCDCDC', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
    });
    // Configure all doughnut charts
    ChartJsProvider.setOptions('doughnut', {
      cutoutPercentage: 60
    });
    ChartJsProvider.setOptions('bubble', {
      tooltips: { enabled: false }
    });
});

app.config(($routeProvider) => {
	$routeProvider
	.when('/', {
		templateUrl: 'partials/login.html',
		controller: 'LoginCtrl'
	})
	.when('/home', {
		templateUrl: 'partials/record-add-edit.html',
		controller: 'AddRecordCtrl',
		resolve: {isAuth}
	})
	.when('/record/:itemId/edit', {
		templateUrl: 'partials/record-add-edit.html',
		controller: 'EditRecordCtrl',
		resolve: {isAuth}
	})
	.when('/record/:itemId/view', {
		templateUrl: 'partials/record-view-single.html',
		controller: 'ViewSingleRecordCtrl',
		resolve: {isAuth}
	})
	.when('/list-records', {
		templateUrl: 'partials/records-all.html',
		controller: 'ViewRecordsCtrl',
		resolve: {isAuth}
	})
	.when('/graphs', {
		templateUrl: 'partials/graphs.html',
		controller: 'GraphCtrl',
		resolve: {isAuth}
	})
	.when('/child/:itemId/graphs', {
		templateUrl: 'partials/graphs-child.html',
		controller: 'GraphChildCtrl',
		resolve: {isAuth}
	})
	.when('/all-children', {
		templateUrl: 'partials/children-all.html',
		controller: 'ViewChildrenCtrl',
		resolve: {isAuth}
	})
	.when('/add-child', {
		templateUrl: 'partials/children-add-edit.html',
		controller: 'AddChildCtrl',
		resolve: {isAuth}
	})
	.when('/child/:itemId/edit', {
		templateUrl: 'partials/children-add-edit.html',
		controller: 'EditChildCtrl',
		resolve: {isAuth}
	})
	.when('/child/:itemId/view', {
		templateUrl: 'partials/children-view-single.html',
		controller: 'ViewSingleChildCtrl',
		resolve: {isAuth}
	})
	.otherwise('/');

});
"use strict";

app.controller('AddChildCtrl', function($scope, $location, $routeParams, UserFactory, ChildFactory, ToggleFactory) {

	//defines user
	let user = UserFactory.getCurrentUser();
	//scope.addKid lets the partial know which views to show or hide
	$scope.addKid = true;
	//$scope.firstUse lets the partial know to hide the alert
	$scope.firstUse = false;
	$scope.title = "Add Child";
	$scope.newUserName = [];

	$scope.child = {
		birthdate: '',
		comments:'',
		name:'',
		uid: user
	};
	//calls function to add record to firebase
	$scope.addChild = () => {
		console.log( "$scope.child", $scope.child );
		ChildFactory.addChild($scope.child)
		.then((data) => {
			// console.log( "data from AddChildCtrl", data );
			//if firstUSe is true, it'ss take the user to the all-children view
			if($scope.firstUse !== true) {
				$location.url('/all-children');
			}  else  {
				//if firstUSe is false, it'ss take the user to the home view and prompt the user to add a record
				$location.url('/home');
			}
		});
	};
	//checks for existing records and sets the firstUse variable
	const checkForRecords = () => {
		ChildFactory.getAllChildren(user)
		.then((data) => {
			// console.log( "data", data );
			if (data.length === 0) {
				// console.log( "NO KIDS" );
				$scope.firstUse = true;
			}  else  {
				// console.log( "KIDS" );
				$scope.firstUse = false;
			}
		})
		.then(() => {
			UserFactory.getUserObjByID(user)
			.then((data) => {
				let email = Object.values(data.data);
				// console.log( "email", email );
				$scope.newUserName.push(email[0].name);
				// console.log( "$scope.newUserName", $scope.newUserName );
			});
		});
	};
	checkForRecords();
	//Functions to check tourmode 1 and 2 and turn them false if they are true
	const resetToggleOne = () => {
		let boolean = ToggleFactory.getTourModeStep_1();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_1();
		}
	};
	resetToggleOne();

	const resetToggleTwo = () => {
		let boolean = ToggleFactory.getTourModeStep_2();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_2();
		}
	};
	resetToggleTwo();
});
"use strict";

app.controller('AddRecordCtrl', function($scope, $location, $routeParams, UserFactory, RecordFactory, ChildFactory, ToggleFactory) {
	//defines user
	let user = UserFactory.getCurrentUser();
	//sets timestamp
	let currentTime = Math.floor(Date.now());
	//scope.addRec lets the partial know which views to show or hide
	$scope.addRec = true;
	//$scope.firstUse lets the partial know to hide the alert
	$scope.firstUse = false;
	$scope.title = "Add Record";

	$scope.record = {
		childID:'',
		date:'',
		time:'',
		duration:'',
		antecedent:'',
		consequence:'',
		comments:'',
		uid: user,
		timestamp: currentTime
	};
	//calls function to add record to firebase
	$scope.addRecord = () => {
		RecordFactory.addRecord($scope.record)
		.then((data) => {
			// console.log( "data from AddRecordCtrl", data );
			$location.url('/list-records');
		});
	};
	//checks for existing records and sets the firstUse variable
	let checkForRecords = () => {
		RecordFactory.getAllRecords(user)
		.then((data) => {
			if (data.length === 0) {
				// console.log( "true" );
				$scope.firstUse = true;
			}  else  {
				// console.log( "false" );
				$scope.firstUse = false;
			}
		});
	};
	checkForRecords();

	$scope.childrenInfo = [];
	//calls firebase for the user's child-records and populates drop-down
	let getChildDropdownData = () => {
		ChildFactory.getAllChildren(user)
		.then((data) => {
			for (let i = 0; i < data.length; i++) {
				$scope.childrenInfo.push(data[i]);
			}
		});
	};
	getChildDropdownData();
	//Functions to check tourmode 1 and 2 and turn them false if they are true
	const resetToggleOne = () => {
		let boolean = ToggleFactory.getTourModeStep_1();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_1();
		}
	};
	resetToggleOne();

	const resetToggleTwo = () => {
		let boolean = ToggleFactory.getTourModeStep_2();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_2();
		}
	};
	resetToggleTwo();
});
"use strict";

app.controller('ViewChildrenCtrl', function($scope, $location, $routeParams, UserFactory, ChildFactory, RecordFactory, FilterFactory, ToggleFactory) {
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
	//Functions to check tourmode 1 and 2 and turn them false if they are true
	const resetToggleOne = () => {
		let boolean = ToggleFactory.getTourModeStep_1();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_1();
		}
	};
	resetToggleOne();

	const resetToggleTwo = () => {
		let boolean = ToggleFactory.getTourModeStep_2();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_2();
		}
	};
	resetToggleTwo();
});
"use strict";

app.controller('EditChildCtrl', function($scope, $location, $routeParams, UserFactory, ChildFactory, RecordFactory, ToggleFactory) {
	//defines user
	let user = UserFactory.getCurrentUser();
	//$scope.editrec lets the partial know which views to show or hide
	$scope.editKid = true;
	//$scope.firstUse lets the partial know to hide the alert
	$scope.firstUse = false;
	$scope.title = "Edit Child Info";

	$scope.child = {
		birthdate: '',
		comments:'',
		name:'',
		uid: user
	};
	//calls a single child record from firebase and formats it for display and edit
	const getSingleChild = () => {
		ChildFactory.getSingleChild($routeParams.itemId)
		.then((data) => {
			$scope.child = data;
			//constructs a new date object from the string of data from firebase and adds them to the record
			let fixedBirth = new Date(data.birthdate);
			$scope.child.birthdate = fixedBirth;
		});	
	};
	//calls function to edit a single firebase child record
	$scope.editChild = () => {
		ChildFactory.editChild($routeParams.itemId, $scope.child)
		.then((data) => {
			// console.log( "Edit Successful", data );
			$location.url('/all-children');
		});
	};
	//calls function to delete a single firebase record
	$scope.deleteChildFromEdit = () => {
		ChildFactory.deleteChild($routeParams.itemId)
		.then((data)=> {
			console.log( "data", data );
		})
		.then(() => {
			//When a child is deleted, this gets the records for a that child and calls the delete function on each id
			RecordFactory.getRecordsByChildID($routeParams.itemId)
			.then((data) => {
				// console.log( "all child records", data );
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
	//Functions to check tourmode 1 and 2 and turn them false if they are true
	const resetToggleOne = () => {
		let boolean = ToggleFactory.getTourModeStep_1();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_1();
		}
	};
	resetToggleOne();

	const resetToggleTwo = () => {
		let boolean = ToggleFactory.getTourModeStep_2();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_2();
		}
	};
	resetToggleTwo();
});
"use strict";

app.controller('EditRecordCtrl', function($scope, $location, $routeParams, UserFactory, RecordFactory, ChildFactory, ToggleFactory) {
	//defines user
	let user = UserFactory.getCurrentUser();
	//$scope.firstUse lets the partial know to hide the alert
	$scope.firstUse = false;
	//scope.editrec lets the partial know which views to show or hide
	$scope.editRec = true;
	$scope.title = "Edit Record";

	$scope.record = {
		childID:'',
		date:'',
		time:'',
		duration:'',
		antecedent:'',
		consequence:'',
		comments:'',
		uid: user
	};
	//calls a single record from firebase and formats it for display and edit
	const getSingleRecord = () => {
		RecordFactory.getSingleRecord($routeParams.itemId)
		.then
		((data) => {
			//constructs a new date and time object from the string of data from firebase and adds them to the record
			$scope.record = data;
			let fixedDate = new Date(data.date);
			let fixedTime = new Date(data.time);
			$scope.record.date = fixedDate;
			$scope.record.time = fixedTime;
			//adds uglyID from routeparams to record
			$scope.record.id = $routeParams.itemId;
		});
	};
	$scope.childrenInfo = [];
	//gets the children data for the dropdown
	let getChildDropdownData = () => {
		ChildFactory.getAllChildren(user)
		.then((data) => {
			for (let i = 0; i < data.length; i++) {
				$scope.childrenInfo.push(data[i]);
			}
		})
		.then(() => {
			//after the child data is in place, the record is retrieved
			getSingleRecord();
		});
	};
	getChildDropdownData();
	//calls function to edit a single firebase record
	$scope.editRecord = () => {
		RecordFactory.editRecord($routeParams.itemId, $scope.record)
		.then((data) => {
			// console.log( "Edit Successful", data );
			$location.url('/list-records');
		});
	};
	//calls function to delete a single firebase record
	$scope.deleteRecordFromEdit = () => {
		RecordFactory.deleteRecord($routeParams.itemId)
		.then((data) => {
			// console.log( "data", data );
		})
		.then(() => {
			$location.url('/list-records');
		});
	};
	//Functions to check tourmode 1 and 2 and turn them false if they are true
	const resetToggleOne = () => {
		let boolean = ToggleFactory.getTourModeStep_1();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_1();
		}
	};
	resetToggleOne();

	const resetToggleTwo = () => {
		let boolean = ToggleFactory.getTourModeStep_2();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_2();
		}
	};
	resetToggleTwo();
});
"use strict";
// console.log( "graph-ctrl-child.js" );

app.controller('GraphChildCtrl', function($scope, $location, $routeParams, UserFactory, RecordFactory, ChildFactory, FilterFactory, FilterFactoryChildren, $window, $timeout, ToggleFactory){
  //defines user
	let user = UserFactory.getCurrentUser();
	$scope.title = "Graphs";
	$scope.childrenInfo = [];
	$scope.childInfo = [];
  $scope.firstUse = false;
  //gets the user's children info for the dropdown menu
	let getChildrenData = () => {
		ChildFactory.getAllChildren(user)
		.then((data) => {
			for (let i = 0; i < data.length; i++) {
				$scope.childrenInfo.push(data[i]);
        //gets the individual child's info to display their name
				if ($routeParams.itemId === data[i].id ) {
					$scope.childInfo.push(data[i]);
				}
			}
		});
	};
	getChildrenData();

  let checkForRecords = () => {
    RecordFactory.getAllRecords(user)
    .then((data) => {
      //checks if TourMode 2 is TRUE or FALSE
      let boolean = ToggleFactory.getTourModeStep_1();
      //if there is ONE record and TourMode is FALSE
      if (data.length === 1 && !boolean) {
        //$scope.firstUse is set to TRUE to trigger the alert
        $scope.firstUse = true;
        //Tourmode 1 is toggled to TRUE so that the navbar will enter TOurMode as well
        ToggleFactory.toggleTourModeStep_2();
      }  else  {
        $scope.firstUse = false;
      }
    });
  };
  checkForRecords();
  //calls the system print window function
  $scope.printRecords = () => {
    $timeout($window.print, 0);
  };
  //Function to check tourmode 1 and turn it false if it is true
  const resetToggleOne = () => {
    let boolean = ToggleFactory.getTourModeStep_1();
    if (boolean) {
      ToggleFactory.toggleTourModeStep_1();
    }
  };
  resetToggleOne();
});

/////////////////////////////////////////////////////////////
//////////////// ANTECEDENT DONUT GRAPH /////////////////////
/////////////////////////////////////////////////////////////

app.controller('DoughnutChildCtrl', ['$scope', '$timeout', '$routeParams',  'UserFactory', 'RecordFactory', 'MathFactory', function ($scope, $timeout, $routeParams,UserFactory, RecordFactory, MathFactory) {
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
	    	RecordFactory.getRecordsByChildID($routeParams.itemId)
	    	.then((data) => {
	    		// console.log( "data", data );
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

app.controller('DoughnutChildCtrl_2', ['$scope', '$timeout', '$routeParams', 'UserFactory', 'RecordFactory', 'MathFactory', function ($scope, $timeout, $routeParams,UserFactory, RecordFactory, MathFactory) {
    //colors for data display
    $scope.colors = ['#97bbcd', '#dcdcdc', '#f7464a', '#46bfbd', '#fdb45c'];
    //graph labels
    $scope.labels = ['Attention', 'Item Given', 'Item Removed', 'Escape', 'None'];
    //initial value of graph data
    $scope.data = [0, 0, 0, 0, 0];
    //function to populate the graph with data
    $timeout(function () {
	    $scope.consequenceArray = [];
      //arrays to hold values
	    $scope.attentionArray = [];
	    $scope.givenArray = [];
	    $scope.removedArray = [];
	    $scope.escapeArray = [];
	    $scope.noneArray = [];
    //defines user  
		let user = UserFactory.getCurrentUser();
    //get all user's records and push the Consequence properties to consequenceArray
		const getConsequenceData = () => {
			RecordFactory.getRecordsByChildID($routeParams.itemId)
			.then((data) => {
				// console.log( "consequence data", data );
				data.forEach(function(record){
		    			$scope.consequenceArray.push(record.consequence);
		    		});
		    		return $scope.consequenceArray.sort();
			})
      //filter and sort consequences into their appropriate arrays
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

app.controller("RadarChildCtrl", function ($scope, $routeParams, UserFactory, RecordFactory, MathFactory) {
  //graph labels
  $scope.labels =[ "0-4 min", "5-10 min", "11-20 min", "21-30 min", "Over 30 min" ];
  //initial value of graph data
  $scope.data = [
    [0, 0, 0, 0, 0]
  ];
  // defines user
  let user = UserFactory.getCurrentUser();
  $scope.durationArray = [];
  //arrays to hold values
  $scope.ZeroArray = [];
  $scope.FiveArray = [];
  $scope.ElevenArray = [];
  $scope.TwentyOneArray = [];
  $scope.ThirtyArray = [];
  //get all user's records and push the Duration properties to durationArray
  const getDurationData = () => {
  	RecordFactory.getRecordsByChildID($routeParams.itemId)
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

app.controller("LineChildCtrl", function ($scope, $routeParams, UserFactory, RecordFactory, MathFactory) {
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
  	RecordFactory.getRecordsByChildID($routeParams.itemId)
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

app.controller("LineChildCtrl_2", function ($scope, UserFactory, RecordFactory, $routeParams) {
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

  $scope.totalIncidents = [];
  $scope.totalIncidents30 = [];
  //array to hold generated dates from today and last 30 days
  $scope.dateReference = [];
  //get all user's records
  const getALlData = () => {
    RecordFactory.getRecordsByChildID($routeParams.itemId)
    .then((data) => {
      let totals = data.length;
      $scope.totalIncidents.push(totals);
      //loop through all records and grab the user-enter dates and push to dbDates
      data.forEach((record) => {
        let dates = new Date(record.date).toString().slice(4,15);
        dbDates.push(dates);
      });
      return dbDates;
    })
    .then((dbDates) => {
      //loop through our array of reference dates and compare each one to the user dates.
      // console.log( "dbDates", dbDates );
      for (let i = 0; i < $scope.dateReference.length; i++) {
        for (let j = 0; j < dbDates.length; j++) {
          if ($scope.dateReference[i] === dbDates[j]) {
              //if the reference date matches a user date
              $scope.data[0][i]++;
          }
        }
      }
    })
    .then(()=> {
      let total = $scope.data[0].reduce((acc,cur) => acc + cur, 0);
      $scope.totalIncidents30.push(total);
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

"use strict";

app.controller('ViewRecordsCtrl', function($scope, UserFactory, RecordFactory, ChildFactory, FilterFactory, FilterFactoryChildren, $window, $timeout, ToggleFactory) {
	//defines user
	let user = UserFactory.getCurrentUser();
	$scope.title = "View All Records";
	$scope.records = [];
	$scope.childrenData = [];
	$scope.searchText = FilterFactory;
	$scope.kidFilter = FilterFactoryChildren;
	$scope.firstUse = false;
	// calls system print fucntion
	$scope.printRecords = () => {
		$timeout($window.print, 0);
	};
	//calls all records and formats them for display
	$scope.showAllRecords = () => {
		//gets all of the user's children data to add child names to records
		ChildFactory.getAllChildren(user)
		.then((data) => {
			$scope.childrenData = data;
		})
		.then(() => {
			RecordFactory.getAllRecords(user)
			.then((data) => {
				$scope.records = data;
				//goes through each record and constructs date and time objects and add's the child's name based on the child ID
				for (let i = 0; i < $scope.records.length; i++) {
					let fixedDate = new Date(data[i].date);
					let fixedTime = new Date(data[i].time);
					$scope.records[i].date = fixedDate;
					$scope.records[i].time = fixedTime;
					for (let j = 0; j < $scope.childrenData.length; j++) {
						if($scope.records[i].childID === $scope.childrenData[j].id) {
							$scope.records[i].child = $scope.childrenData[j].name;
						}
					}
				}
			})
			.then(() => {
				//sorts records by timestamp and sends the newest out first
				$scope.records.sort(function(a, b) {
    			return (a.timestamp) - (b.timestamp);
				});
				$scope.records.reverse();
			})
			.then(() => {
				//checks if TourMode 1 is TRUE or FALSE
				let boolean = ToggleFactory.getTourModeStep_1();
				//if there is ONE record and TourMode is FALSE
				if ($scope.records.length === 1 && !boolean) {
					//$scope.firstUse is set to TRUE to trigger the alert
					$scope.firstUse = true;
					//Tourmode 1 is toggled to TRUE so that the navbar will enter TOurMode as well
					ToggleFactory.toggleTourModeStep_1();
				}  else  {
					$scope.firstUse = false;
				}
			});
		})
		.catch((error) => {
			console.log( "error at ViewRecordsCtrl.showAllRecords", error );
		});
	};
	$scope.showAllRecords();
	//Function to check tourmode 2 and turn it false if it is true
	const resetToggleTwo = () => {
		let boolean = ToggleFactory.getTourModeStep_2();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_2();
		}
	};
	resetToggleTwo();
});
"use strict";

app.controller('ViewSingleChildCtrl', function($scope, $location, $routeParams,  UserFactory, RecordFactory, ChildFactory, ToggleFactory) {
	//defines user
	let user = UserFactory.getCurrentUser();

	$scope.title = "View Child";

	$scope.child = {
		birthdate: '',
		comments:'',
		name:'',
		uid: user
	};
	//calls a single child record from firebase and formats it for display
	const getSingleChild = () => {
		ChildFactory.getSingleChild($routeParams.itemId)
		.then((data) => {
			$scope.child = data;
			//adds uglyID from routeparams to child record
			$scope.child.id = $routeParams.itemId;
			//constructs a new date object from the string of data from firebase and adds them to the record
			let fixedBirth = new Date(data.birthdate);
			$scope.child.birthdate = fixedBirth;
		});
	};
	getSingleChild();
	//Functions to check tourmode 1 and 2 and turn them false if they are true
	const resetToggleOne = () => {
		let boolean = ToggleFactory.getTourModeStep_1();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_1();
		}
	};
	resetToggleOne();

	const resetToggleTwo = () => {
		let boolean = ToggleFactory.getTourModeStep_2();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_2();
		}
	};
	resetToggleTwo();
});
"use strict";

app.controller('ViewSingleRecordCtrl', function($scope, $location, $routeParams, UserFactory, RecordFactory, ChildFactory, ToggleFactory) {
	//defines user
	let user = UserFactory.getCurrentUser();

	$scope.title = "View Record";

	$scope.record = {
		childID:'',
		child:'',
		date:'',
		time:'',
		duration:'',
		antecedent:'',
		consequence:'',
		comments:'',
		uid: user
	};
	//calls a single record from firebase and formats it for display
	const getSingleRecord = () => {
		RecordFactory.getSingleRecord($routeParams.itemId)
		.then
		((data) => {
			$scope.record = data;
			//adds uglyID from routeparams to record
			$scope.record.id = $routeParams.itemId;
			//constructs a new date and time object from the string of data from firebase and adds them to the record
			let fixedDate = new Date(data.date);
			let fixedTime = new Date(data.time);
			$scope.record.time = fixedTime;
			$scope.record.date = fixedDate;
			return data.childID;
		})
		.then((childID) => {
			ChildFactory.getSingleChild(childID)
			.then((data) => {
				//adds the child's name to the record based on their ID
				$scope.record.child = data.name;
			});
		});
	};
	getSingleRecord();
	//Functions to check tourmode 1 and 2 and turn them false if they are true
	const resetToggleOne = () => {
		let boolean = ToggleFactory.getTourModeStep_1();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_1();
		}
	};
	resetToggleOne();

	const resetToggleTwo = () => {
		let boolean = ToggleFactory.getTourModeStep_2();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_2();
		}
	};
	resetToggleTwo();
});
"use strict";
// console.log( "graph-ctrl.js" );

app.controller('GraphCtrl', function($scope, $location, $routeParams, UserFactory, RecordFactory, ChildFactory, FilterFactory, FilterFactoryChildren, $window, $timeout, ToggleFactory){
  //defines user
	let user = UserFactory.getCurrentUser();
	$scope.title = "Graphs - All Records";
	$scope.childrenInfo = [];
  $scope.firstUse = false;
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
  //checks for a record and turns on TOUR MODE if there is one
  let checkForRecords = () => {
    RecordFactory.getAllRecords(user)
    .then((data) => {
      if (data.length === 1) {
        $scope.firstUse = true;
      }  else  {
        $scope.firstUse = false;
      }
    });
  };
  checkForRecords();
  //calls the system print window function
  $scope.printRecords = () => {
    $timeout($window.print, 0);
  };
  //Functions to check tourmode 1 and 2 and turn them false if they are true
  const resetToggleOne = () => {
    let boolean = ToggleFactory.getTourModeStep_1();
    if (boolean) {
      ToggleFactory.toggleTourModeStep_1();
    }
  };
  resetToggleOne();

  const resetToggleTwo = () => {
    let boolean = ToggleFactory.getTourModeStep_2();
    if (boolean) {
      ToggleFactory.toggleTourModeStep_2();
    }
  };
  resetToggleTwo();
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

  $scope.totalIncidents = [];
  $scope.totalIncidents30 = [];
  //array to hold generated dates from today and last 30 days
  $scope.dateReference = [];
  //get all user's records
  const getALlData = () => {
    RecordFactory.getAllRecords(user)
    .then((data) => {
      let totals = data.length;
      $scope.totalIncidents.push(totals);
      // console.log( "$scope.totalIncidents", $scope.totalIncidents );
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
    })
    .then(()=> {
      let total = $scope.data[0].reduce((acc,cur) => acc + cur, 0);
      $scope.totalIncidents30.push(total);
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
"use strict";

app.controller('LoginCtrl', function($scope, $location, $routeParams, UserFactory, ToggleFactory) {
	//constructs a user object for storage based on what is provided by google login
	let createUserObj = (loginObj) => {
		return {
			email: loginObj.user.email,
			name: loginObj.user.displayName,
			uid: loginObj.user.uid,
			photoURL: loginObj.user.photoURL
		};
	};
	//$scope.userLoggedIn value triggers the animation of the login partial
	$scope.userLoggedIn = false;

	let loginObjStorage = [];
	//Google login
	$scope.logInGoogle = () => {
		//clear the login object array in case there is a previous user
		loginObjStorage.length = 0;
		UserFactory.authWithProvider()
		.then((userObj) => {
			//$scope.userLoggedIn set to true to trigger fade-out
			$scope.userLoggedIn = true;
			//call createUserObj and pass it the google user data
			let newUserObj = createUserObj(userObj);
			loginObjStorage.push(newUserObj);
			return newUserObj;
		})
		.then((newUserObj) => {
			//get the new user's email to pass to the next function
			let fbEmail = UserFactory.getUserObj(newUserObj.email);
			return fbEmail;
		})
		.then((fbEmail) => {
			let fromFB = Object.keys(fbEmail.data);
			//check to see if the user exists in firebase - if not, post a user object and then shunt to first-time-user control-flow
			if(fromFB.length ===0 ) {
				UserFactory.postUserObj(loginObjStorage[0]);
				$location.path('/add-child');
				$scope.$apply();
			}  else  {
				$location.path('/home');
				$scope.$apply();
			}
			console.log( "login successful" );
		})
		.catch((error) => {
			console.log( "login error", error );
		});
	};
	//Functions to check tourmode 1 and 2 and turn them false if they are true
	const resetToggleOne = () => {
		let boolean = ToggleFactory.getTourModeStep_1();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_1();
		}
	};
	resetToggleOne();

	const resetToggleTwo = () => {
		let boolean = ToggleFactory.getTourModeStep_2();
		if (boolean) {
			ToggleFactory.toggleTourModeStep_2();
		}
	};
	resetToggleTwo();
});
"use strict";

app.controller('NavbarCtrl', function($scope, $location, $routeParams, $window, UserFactory, FilterFactory, ToggleFactory) {

	$scope.searchText = FilterFactory;
  	$scope.isLoggedIn = false;
  	$scope.tourMode_one = false;
  	$scope.tourMode_two = false;
  	// handles logout button functions
	$scope.logOut = () => {
		console.log( "logout firing" );
		UserFactory.logOut()
		.then(() => {
			let user = UserFactory.getCurrentUser();
			console.log("logOut successful", user);
		})
		.then(()=> {
			$window.location.href = "#!/";
		})
		.catch((error) => {
			console.log("logout error", error);
		});
	};
	//listens for auth state change; if logged in, sets user photo and changed logged in state to TRUE
	firebase.auth().onAuthStateChanged(function(user) {
	    if (user) {
	      $scope.isLoggedIn = true;
	      console.log("currentUser logged in?", user);
	      console.log("logged in t-f", $scope.isLoggedIn );
	      $scope.userPhoto = user.photoURL;
	      $scope.$apply();
	    } else {
	      $scope.isLoggedIn = false;
	      console.log("user logged in?", $scope.isLoggedIn);
	      $window.location.href = "#!/login";
    	}
  	});
	//disables nav bar if there is nothing to search
	const windowCheck = (location) => {
		if ((location === "/list-records") || (location === "/all-children")) {
			$scope.searchbar = true;
			$scope.searchText = FilterFactory;
		}  else  {
			$scope.searchbar = false;
			$scope.searchText = angular.copy($scope.default);
		}
	};
	//Checks the toggle factory to see if tour mode 1 is active
	//if true, the searchbar and Graphs link will flash
	const tourCheck_1 = (path) => {
		let boolean = ToggleFactory.getTourModeStep_1();
		// console.log( "tourCheck_1", boolean );
		if (boolean &&  (path === "/list-records") ) {
			$scope.tourMode_one = true;
			// console.log( "$scope.tourMode_one", $scope.tourMode_one );
		}  else  {
			$scope.tourMode_one = false;
			// console.log( "$scope.tourMode_one", $scope.tourMode_one );
		}
		return boolean;
	};
	//Checks the toggle factory to see if tour mode 2 is active
	//if true, the LOGO will flash
	const tourCheck_2 = (path) => {
		// console.log( "CHECK", path );
		let boolean = ToggleFactory.getTourModeStep_2();
		// console.log( "tourCheck_2 CHECK", boolean );
		if (boolean &&  (path === `/child/${$routeParams.itemId}/graphs`) ) {
			$scope.tourMode_two = true;
			// console.log( "$scope.tourMode_two", $scope.tourMode_two );
		}  else  {
			$scope.tourMode_two = false;
			// console.log( "$scope.tourMode_two", $scope.tourMode_two );
		}
		return boolean;
	};
	//watching scope for changes to detect location and Tour Mode State
	$scope.$watch(() => {
		let path = $location.path();
		windowCheck(path);
		tourCheck_1(path);
		tourCheck_2(path);
    return $location.path();
	});
	//animation to have hambuger menu close on click
	$(function(){ 
	    let navMain = $(".navbar-collapse");
	    navMain.on("click", "a:not([data-toggle])", null, function () {
	         navMain.collapse('hide');
     	});
 	});
});

"use strict";
// console.log( "factory-child.js" );
app.factory('ChildFactory', function($q, $http, FBCreds) {
	//gets all children data for a user
	const getAllChildren = (user) => {
		let allChildrenArray = [];
		return $q((resolve, reject) => {
			$http.get(`${FBCreds.databaseURL}/children.json?orderBy="uid"&equalTo="${user}"`)
			.then((allChildrenObj) => {
				let allChildren = allChildrenObj.data;
				Object.keys(allChildren)
				.forEach((key) => {
					//adds the firebase ugly id to the child data objects
					allChildren[key].id = key;
					allChildrenArray.push(allChildren[key]);
				});
				resolve(allChildrenArray);
			})
			.catch((error) => {
				console.log( "error at ChildFactory.getAllChildren", error );
			});
		});
	};
	//gets a single child record from firebase
	const getSingleChild = (childID) => {
		return $q((resolve, reject) => {
			$http.get(`${FBCreds.databaseURL}/children/${childID}.json`)
			.then((childObj) => {
				let singleChildObj = childObj.data;
				resolve(singleChildObj);
			})
			.catch((error) => {
				console.log( "error at ChildFactory.getSingleChild", error );
			});
		});
	};
	//adds a single child record to firebase
	const addChild = (obj) => {
		let newChildObj = JSON.stringify(obj);
		return $q((resolve, reject) => {
			$http.post(`${FBCreds.databaseURL}/children.json`, newChildObj)
			.then((data) => {
				console.log( "data from ChildFactory.addChild", data );
				resolve(data);
			})
			.catch((error) => {
				console.log( "error at ChildFactory.addChild", error);
				reject(error);
			});
		});
	};
	//edits a single child record to firebase
	const editChild = (childID, obj) => {
		let editChildObj = JSON.stringify(obj);
		return $q((resolve, reject) => {
			$http.patch(`${FBCreds.databaseURL}/children/${childID}.json`, editChildObj)
			.then((data) => {
				console.log( "data from ChildFactory.editChild", data);
				resolve(data);
			})
			.catch((error) => {
				console.log( "error at ChildFactory.editChild", error );
				reject(error);
			});
		});
	};
	//deletes a single child record from firebase
	const deleteChild = (childID) => {
		return $q((resolve, reject) => {
			$http.delete(`${FBCreds.databaseURL}/children/${childID}.json`)
			.then((data) => {
				console.log( "data from ChildFactory.deleteChild", data );
				resolve(data);
			})
			.catch((error) => {
				console.log( "error at ChildFactory.deleteChild", error );
				reject(error);
			});
		});
	};
	return{getAllChildren, getSingleChild, addChild, editChild, deleteChild};
});
"use strict";

app.factory('FilterFactoryChildren', function(){
	return{ 
		search: "" 
	};
});
"use strict";

app.factory('FilterFactory', function(){
	return{ 
		search: "" 
	};
});
"use strict";

app.factory('MathFactory', function(){
	//calculates a precentage based on two values
	const calcPercent = (subtotal, total) => {
		return (Math.round((subtotal/total)*100));
	};
	return{calcPercent};
});
"use strict";
// console.log( "factory-record.js" );
app.factory('RecordFactory', function($q, $http, FBCreds) {
	//gets all records for a user
	const getAllRecords = (user) => {
		let allRecordsArray = [];
		return $q((resolve,reject) => {
			$http.get(`${FBCreds.databaseURL}/records.json?orderBy="uid"&equalTo="${user}"`)
			.then((allRecordsObj) => {
				let allRecords = allRecordsObj.data;
				// console.log( "allRecords from RecordFactory", allRecords );
				Object.keys(allRecords)
				.forEach((key) => {
					//adds the firebase ugly id to the record data objects
					allRecords[key].id = key;
					allRecordsArray.push(allRecords[key]);
				});		
				resolve(allRecordsArray);
			})
			.catch((error) => {
				console.log( "error at RecordFactory.getAllRecords", error );
				reject(error);
			});
		});
	};
	//gets all records for a particular child
	const getRecordsByChildID = (childID) => {
		let childRecordsArray = [];
		return $q((resolve,reject) => {
			$http.get(`${FBCreds.databaseURL}/records.json?orderBy="childID"&equalTo="${childID}"`)
			.then((recordsByChildObj) => {
				let allByChildRecords = recordsByChildObj.data;
				// console.log( "allByChildRecords from RecordFactory", allByChildRecords );
				Object.keys(allByChildRecords)
				.forEach((key) => {
					//adds the firebase ugly id to the record data objects
					allByChildRecords[key].id = key;
					childRecordsArray.push(allByChildRecords[key]);
				});
				resolve(childRecordsArray);
			})
			.catch((error) => {
				console.log( "error at RecordFactory.getRecordsByChildID", error );
			});
		});
	};
	//gets a single record
	const getSingleRecord = (recordID) => {
		return $q((resolve, reject) => {
			$http.get(`${FBCreds.databaseURL}/records/${recordID}.json`)
			.then((recordObj) => {
				let singleRecordObjObj = recordObj.data;
				resolve(singleRecordObjObj);
			})
			.catch((error) => {
				console.log( "error at ChildFactory.getSingleChild", error );
			});
		});
	};
	//adds a single record to firebase
	const addRecord = (obj) => {
		let newRecordObj = JSON.stringify(obj);
		return $q((resolve, reject) => {
			$http.post(`${FBCreds.databaseURL}/records.json`, newRecordObj)
			.then((data) => {
				// console.log( "add data", data );
				resolve(data);
			})
			.catch((error) => {
				console.log( "error at RecordFactory.addRecord", error );
			});
		});
	};
	//edits a single record to firebase
	const editRecord = (recordID, obj) => {
		return $q((resolve, reject) => {
			let editedRecordObj = JSON.stringify(obj);
			$http.patch(`${FBCreds.databaseURL}/records/${recordID}.json`, editedRecordObj)
			.then((data) => {
				// console.log( "edit data", data );
				resolve(data);
			})
			.catch((error) => {
				console.log( "error at RecordFactory.editRecord", error );
			});
		});
	};
	//deletes a single record from firebase
	const deleteRecord = (recordID, obj) => {
		return $q((resolve, reject) => {
			$http.delete(`${FBCreds.databaseURL}/records/${recordID}.json`)
			.then((data) => {
				// console.log( "delete data", data );
				resolve(data);
			})
			.catch((error) => {
				console.log( "error at RecordFactory.deleteRecord", error );
			});
		});
	};
	return{getAllRecords, getRecordsByChildID, addRecord, editRecord, deleteRecord, getSingleRecord};
});
"use strict";

app.factory('ToggleFactory', function() {
	//ToggleFactory lets the page controllers tell the navbar controller that TOUR MODE is on
	//TourMode 1 and 2 default to false
	let tourModeStep_1 = false;
	let tourModeStep_2 = false;
	//functions for navbar to retrieve the values of tourmode 1 and 2
	const getTourModeStep_1 = () => {
		return tourModeStep_1;
	};

	const getTourModeStep_2 = () => {
		return tourModeStep_2;
	};
	//functions to toggle the value of tourmode 1 and 2
	const toggleTourModeStep_1 = () => {
		if (tourModeStep_1 === false) {
			tourModeStep_1 = true;
		}  else if (tourModeStep_1 === true) {
			tourModeStep_1 = false;
		}
	};

	const toggleTourModeStep_2 = () => {
		if (tourModeStep_2 === false) {
			tourModeStep_2 = true;
		}  else if (tourModeStep_2 === true) {
			tourModeStep_2 = false;
		}
	};
	return{getTourModeStep_1, getTourModeStep_2, toggleTourModeStep_1, toggleTourModeStep_2};
});
"use strict";

app.factory('UserFactory', function($q, $http, FBCreds) {

	let currentUser = null;
	//function to pass current user around the app
	let getCurrentUser = () => {
		return currentUser;
	};

	let userEmailFromFB = {};
	//function to pass the user's email around the app
	let getUserEmailFromFB = () => {
		return userEmailFromFB;
	};
	//checks to see if user is authenticated, resolves true or rejects false
	let isAuthenticated = () => {
		return $q((resolve, reject) => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					currentUser = user.uid;
					resolve(true);
				}  else  {
					reject(false);
				}
			});
		});
	};
	//checks for an existing user by calling for an object by email
	let getUserObj = (userEmail) => {
		return $q((resolve, reject) => {
			$http.get(`${FBCreds.databaseURL}/users.json?orderBy="email"&equalTo="${userEmail}"`)
			.then((data) => {
				// console.log( "data at UserFactory.getUserObj", data );
				resolve(data);
			})
			.catch((error) => {
				console.log( "error at UserFactory.getUserObj ", error );
			});
		});
	};
	// gets the user email by user id
	let getUserObjByID = (id) => {
		return $q((resolve, rejecet) => {
			$http.get(`${FBCreds.databaseURL}/users.json?orderBy="uid"&equalTo="${id}"`)
			.then((data) => {
				resolve(data);
				// console.log( "data", Object.values(data.data) );
			})
			.catch((error) => {
				console.log( "error at UserFactory.getUserObjByID", error );
			});
		});
	};
	//posts a new user upon first-time login
	let postUserObj = (userObj) => {
		return $q((resolve, reject) => {
			let newUserObj = JSON.stringify(userObj);
			$http.post(`${FBCreds.databaseURL}/users.json`, newUserObj)
			.then((data) => {
				// console.log( "data from UserFactory.postUserObj", data );
				resolve(data);
			})
			.catch((error) => {
				console.log( "error at UserFactory.postUserObj", error );
				reject(error);
			});
		});
	};

	let googleProvider = new firebase.auth.GoogleAuthProvider();
	//firebase auth with provider function
	let authWithProvider = () => {
		return firebase.auth().signInWithPopup(googleProvider);
	};
	//firebase logout function
	let logOut = () => {
		// console.log("factoryLogOut firing");
		return firebase.auth().signOut();
	};
	return{getCurrentUser, getUserEmailFromFB, isAuthenticated, getUserObj, postUserObj, authWithProvider, logOut, getUserObjByID};
});
"use strict";
// console.log( "fb-creds.js" );
app.constant("FBCreds", {
    apiKey: "AIzaSyBBXHxxeVaYnaor2VfQjJTvqtnl6rxGE8A",
    authDomain: "temper-tracker.firebaseapp.com",
    databaseURL: "https://temper-tracker.firebaseio.com",
    projectId: "temper-tracker",
    storageBucket: "temper-tracker.appspot.com",
    messagingSenderId: "507582013621"
});