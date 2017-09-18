"use strict";

app.factory('MathFactory', function(){

	const calcPercent = (subtotal, total) => {
		return (Math.round((subtotal/total)*100));
	};

	return{calcPercent};
});