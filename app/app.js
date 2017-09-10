"use strict";
console.log( "app.js" );

const app = angular.module('TemperTracker', ['ngRoute']);

app.run(($location, FBCreds) => {
	firebase.initializeApp(FBCreds);
});