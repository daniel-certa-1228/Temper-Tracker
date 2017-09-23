"use strict";

app.factory('ToggleFactory', function() {

	let tourModeStep_1 = false;
	let tourModeStep_2 = false;

	const getTourModeStep_1 = () => {
		return tourModeStep_1;
	};

	const getTourModeStep_2 = () => {
		return tourModeStep_2;
	};

	const toggleTourModeStep_1 = () => {
		if (tourModeStep_1 === false) {
			tourModeStep_1 = true;
		}  else if (tourModeStep_1 === true) {
			tourModeStep_1 = false;
		}
		console.log( "ToggleFactory tourModeStep_1", tourModeStep_1 );
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