"use strict";
console.log( "app.js" );

const app = angular.module('TemperTracker', ['ngRoute']);

app.run(($location, FBCreds) => {
	firebase.initializeApp(FBCreds);
});

app.config(($routeProvider) => {
	$routeProvider
	.when('/', {
		templateUrl: 'partials/login.html',
		controller: 'LoginCtrl'
	})
	.when('/home', {
		templateUrl: 'partials/record-add-edit.html',
		controller: 'AddRecordCtrl'
	})
	.when('/list-records', {
		templateUrl: 'partials/records-all.html',
		controller: 'ViewRecordsCtrl'
	})
	.when('/graphs', {
		templateUrl: 'partials/graphs.html'
	}).
	when('/all-children', {
		templateUrl: 'partials/children-all.html',
		controller: 'ViewChildrenCtrl'
	})
	.when('/add-child', {
		templateUrl: 'partials/children-add-edit.html',
		controller: 'AddChildCtrl'
	})
	.otherwise('/');
});