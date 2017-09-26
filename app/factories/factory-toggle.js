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