"use strict";

app.factory('MathFactory', function(){
	//calculates a precentage based on two values
	const calcPercent = (subtotal, total) => {
		return (Math.round((subtotal/total)*100));
	};
	return{calcPercent};
});