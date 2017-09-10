"use strict";
console.log( "factory-record.js" );

app.factory('RecordFactory', function($q, $http, FBCreds) {
	
	const getAllRecords = () => {
		let allRecordsArray = [];
		return $q((resolve,reject) => {
			$http.get(`${FBCreds.databaseURL}/records.json`)
			.then((allRecordsObj) => {
				let allRecords = allRecordsObj.data;
				console.log( "allRecords from RecordFactory", allRecords );
				Object.keys(allRecords)
				.forEach((key) => {
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

	const getRecordsByChildID = (childID) => {
		let childRecordsArray = [];
		return $q((resolve,reject) => {
			$http.get(`${FBCreds.databaseURL}/pins.json?orderBy="childID"&equalTo="${childID}"`)
			.then((recordsByChildObj) => {
				let allByChildRecords = recordsByChildObj.data;
				console.log( "allByChildRecords from RecordFactory", allByChildRecords );
				Object.keys(allByChildRecords)
				.forEach((key) => {
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

	const addRecord = (obj) => {
		let newRecordObj = JSON.stringify(obj);
		return $q((resolve, reject) => {
			$http.post(`${FBCreds.databaseURL}/records.json`, newRecordObj)
			.then((data) => {
				console.log( "add data", data );
				resolve(data);
			})
			.catch((error) => {
				console.log( "error at RecordFactory.addRecord", error );
			});
		});
	};

	const editRecord = (recordID, obj) => {
		return $q((resolve, reject) => {
			let editedRecordObj = JSON.stringify(obj);
			$http.patch(`${FBCreds.databaseURL}/records/${recordID}.json`, editedRecordObj)
			.then((data) => {
				console.log( "edit data", data );
				resolve(data);
			})
			.catch((error) => {
				console.log( "error at RecordFactory.editRecord", error );
			});
		});
	};

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
	return{getAllRecords, getRecordsByChildID, addRecord, editRecord, deleteRecord};
});