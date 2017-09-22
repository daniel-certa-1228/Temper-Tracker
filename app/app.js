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