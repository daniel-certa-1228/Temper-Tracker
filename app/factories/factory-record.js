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
				console.log( "delete data", data );
				resolve(data);
			})
			.catch((error) => {
				console.log( "error at RecordFactory.deleteRecord", error );
			});
		});
	};
	return{getAllRecords, getRecordsByChildID, addRecord, editRecord, deleteRecord, getSingleRecord};
});