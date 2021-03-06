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