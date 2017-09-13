"use strict";
console.log( "factory-filter.js" );

app.factory('FilterFactoryChildren', function(){
	console.log( "FilterFactoryChildren is being called" );
	return{ 
		search: "" 
	};
});