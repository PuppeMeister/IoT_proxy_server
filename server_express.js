//Preparing the application to start'

var express = "";
var bodyParser = "";
//Load Configuration File
var appConfig = "";
var loadingApp = false;

const port = null;
var requestHeader = "";
var diURL = [];
var pgURL = [];
var conURL = [];
var battURL = [];
var warnURL = "";



try{
	appConfig = require('./config/app_config.js');
	express = require('express');
	bodyParser = require('body-parser');
	
	//Getting Value from Config File
	
	//PORT
	port = appConfig.port;

	//requestHeader
	requestHeader = {
			"header" : {
				"Accept" : appConfig.requestHeader.Accept,
				"X-M2M-RI" : appConfig.requestHeader.X-M2M-RI,
				"X-M2M-Origin" : appConfig.requestHeader.X-M2M-Origin	
			}
	}

	//URLs
	//Device Information
	diURL['deviceType'] = appConfig.MobiusURL.deviceInformation.deviceType;
	diURL['deviceName'] = appConfig.MobiusURL.deviceInformation.deviceName;
	dIURL['deviceLocation'] = appConfig.MobiusURL.deviceInformation.deviceLocation;

	//Power Generation
	pgURL['amountPerMinute'] = appConfig.MobiusURL.powerGeneration.amountPerMinute;
	pgURL['co2emissions'] =  appConfig.MobiusURL.powerGeneration.co2emissions;
	pgURL['powerGenerationYesterday'] =  appConfig.MobiusURL.powerGeneration.powerGenerationYesterday;
	pgURL['powerGenerationTotal'] =  appConfig.MobiusURL.powerGeneration.powerGenerationTotal;

	//Consumption
	conURL['amountPerMinute'] = appConfig.MobiusURL.consumption.amountPerMinute;
	conURL['consumptionTotal'] = appConfig.MobiusURL.consumption.consumptionTotal;
	conURL['consumptionYesterday'] = appConfig.MobiusURL.consumption.consumptionYesterday;

	//Battery
	battURL['currentAmount'] = appConfig.MobiusURL.battery.currentAmount;
	battURL['maxAmount'] = appConfig.MobiusURL.battery.maxAmount;

	//Warning
	warnURL = appConfig.MobiusURL.warningAddress;
	
	//Flag for running the application
	loadingApp = true;

}catch(e){
	console.log("Application is failed to start. "+e);
}



if(loadingApp){

		const util = require('util');
		var app = express();
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(bodyParser.json())
	
		//Getting Device Information - Device Type from Mobius
		app.get('/deviceInformation/deviceType', (req, res) => {
			
			console.log("Open Sesame - Device Type");
			// Setting URL and headers for request
			var options = {
				url: diURL['deviceType'],
				headers : requestHeader
				
			};
			
			var getData = getMobiusData(options);
			
			res = setReponseHeader(res);
			
			getData.then(function(result) {
			
		
			var sentResult = {"finalResult" : result['m2m:cin']['con']};
			res.send(sentResult);
		
			
			//console.log(result['m2m:cin']['con']);
			}, function(err) {
			
			res.statusCode = 404; 
			res.send("{result : Failed Retriving}");
			console.log(err);
				
			})	
			
		
			
		});
		
		//Getting Device Information - Device Name from Mobius
		app.get('/deviceInformation/deviceName', (req, res) => {
			
			console.log("Open Sesame - Device Name");
			// Setting URL and headers for request
			var options = {
				url: diURL['deviceName'],
				headers : requestHeader
				
			};
			
			var getData = getMobiusData(options);
			
			res = setReponseHeader(res);
			
			getData.then(function(result) {
			
			var sentResult = {"finalResult" : result['m2m:cin']['con']};
			res.send(sentResult);
			}, function(err) {
			
			res.statusCode = 404; 
			res.send("{result : Failed Retriving}");
			console.log(err);
				
			})	
			
		
			
		});
		
		//Getting Device Information - Device Location from Mobius
		app.get('/deviceInformation/deviceLocation', (req, res) => {
			
			console.log("Open Sesame - Device Location");
			// Setting URL and headers for request
			var options = {
				url: dIURL['deviceLocation'],
				headers : requestHeader
				
			};
			
			var getData = getMobiusData(options);
			
			res = setReponseHeader(res);
			
			getData.then(function(result) {
			
			var sentResult = {"finalResult" : result['m2m:cin']['con']};
			res.send(sentResult);
		
			}, function(err) {
			
			res.statusCode = 404; 
			res.send("{result : Failed Retriving}");
			console.log(err);
				
			})	
			
		
			
		});
		
		//Getting Power Generation - amount per minute rom Mobius
		app.get('/powerGeneration/amountPerMinute', (req, res) => {
			
			console.log("Open Sesame - Power Generation - amountPerMinute");
			// Setting URL and headers for request
			var options = {
				url: pgURL['amountPerMinute'],
				headers : requestHeader
				
			};
			
			var getData = getMobiusData(options);
			
			res = setReponseHeader(res);
			
			getData.then(function(result) {
			
			var sentResult = {"finalResult" : result['m2m:cin']['con']};
			res.send(sentResult);
		
			}, function(err) {
			
			res.statusCode = 404; 
			res.send("{result : Failed Retriving}");
			console.log(err);
				
			})	
			
		
			
		});
		
		//Getting Power Generation - Co2 Emissions rom Mobius
		app.get('/powerGeneration/co2emissions', (req, res) => {
			
			console.log("Open Sesame - Power Generation - co2emissions");
			// Setting URL and headers for request
			var options = {
				url: pgURL['co2emissions'],
				headers : requestHeader
				
			};
			
			var getData = getMobiusData(options);
			
			res = setReponseHeader(res);
			
			getData.then(function(result) {
			
			var sentResult = {"finalResult" : result['m2m:cin']['con']};
			res.send(sentResult);
		
			}, function(err) {
			
			res.statusCode = 404; 
			res.send("{result : Failed Retriving}");
			console.log(err);
				
			})	
			
		
			
		});
		
		//Getting Power Generation - power Generation Yesterday from Mobius
		app.get('/powerGeneration/yesterday', (req, res) => {
			
			console.log("Open Sesame - Power Generation - Device Location");
			// Setting URL and headers for request
			var options = {
				url: pgURL['powerGenerationYesterday'],
				headers : requestHeader
				
			};
			
			var getData = getMobiusData(options);
			
			res = setReponseHeader(res);
			
			getData.then(function(result) {
			
			var sentResult = {"finalResult" : result['m2m:cin']['con']};
			res.send(sentResult);
		
			}, function(err) {
			
			res.statusCode = 404; 
			res.send("{result : Failed Retriving}");
			console.log(err);
				
			})	
			
		
			
		});
		
		//Getting Power Generation - power Generation Total from Mobius
		app.get('/powerGeneration/total', (req, res) => {
			
			console.log("Open Sesame - Power Generation - total");
			// Setting URL and headers for request
			var options = {
				url: pgURL['powerGenerationTotal'],
				headers : requestHeader
				
			};
			
			var getData = getMobiusData(options);
			
			res = setReponseHeader(res);
			
			getData.then(function(result) {
			
			var sentResult = {"finalResult" : result['m2m:cin']['con']};
			res.send(sentResult);
		
			}, function(err) {
			
			res.statusCode = 404; 
			res.send("{result : Failed Retriving}");
			console.log(err);
				
			})	
			
		
			
		});
		
		//Getting Consumption Amount Per Minute
		app.get('/consumption/amountPerMinute', (req, res) => {
			
			console.log("Open Sesame - Consumption - amountPerMinute");
			// Setting URL and headers for request
			var options = {
				url: conURL['amountPerMinute'],
				headers : requestHeader
				
			};
			
			var getData = getMobiusData(options);
			
			res = setReponseHeader(res);
			
			getData.then(function(result) {
			
			var sentResult = {"finalResult" : result['m2m:cin']['con']};
			res.send(sentResult);
		
			}, function(err) {
			
			res.statusCode = 404; 
			res.send("{result : Failed Retriving}");
			console.log(err);
				
			})	
			
		
			
		});
		
		//Getting Consumption Total
		app.get('/consumption/total', (req, res) => {
			
			console.log("Open Sesame - Consumption - Total");
			// Setting URL and headers for request
			var options = {
				url: conURL['consumptionTotal'],
				headers : requestHeader
				
			};
			
			var getData = getMobiusData(options);
			
			res = setReponseHeader(res);
			
			getData.then(function(result) {
			
			var sentResult = {"finalResult" : result['m2m:cin']['con']};
			res.send(sentResult);
		
			}, function(err) {
			
			res.statusCode = 404; 
			res.send("{result : Failed Retriving}");
			console.log(err);
				
			})	
			
		
			
		});
		
		//Getting Consumption Amount Yesterday
		app.get('/consumption/yesterday', (req, res) => {
			
			console.log("Open Sesame - Consumption - yesterday");
			// Setting URL and headers for request
			var options = {
				url: conURL['consumptionYesterday'],
				headers : requestHeader
				
			};
			
			var getData = getMobiusData(options);
			
			res = setReponseHeader(res);
			
			getData.then(function(result) {
			
			var sentResult = {"finalResult" : result['m2m:cin']['con']};
			res.send(sentResult);
		
			}, function(err) {
			
			res.statusCode = 404; 
			res.send("{result : Failed Retriving}");
			console.log(err);
				
			})	
			
		
			
		});
		
		//Getting battery current amount
		app.get('/battery/currentAmount', (req, res) => {
			
			console.log("Open Sesame - Battery - Current Amount");
			// Setting URL and headers for request
			var options = {
				url: battURL['currentAmount'],
				headers : requestHeader
				
			};
			
			var getData = getMobiusData(options);
			
			res = setReponseHeader(res);
			
			getData.then(function(result) {
			
			var sentResult = {"finalResult" : result['m2m:cin']['con']};
			res.send(sentResult);
		
			}, function(err) {
			
			res.statusCode = 404; 
			res.send("{result : Failed Retriving}");
			console.log(err);
				
			})	
			
		
			
		});
		
		//Getting Battery Max Amount
		app.get('/battery/maxAmount', (req, res) => {
			
			console.log("Open Sesame - Battery - Max Amount");
			// Setting URL and headers for request
			var options = {
				url: battURL['maxAmount'],
				headers : requestHeader
				
			};
			
			var getData = getMobiusData(options);
			
			res = setReponseHeader(res);
			
			getData.then(function(result) {
			
			var sentResult = {"finalResult" : result['m2m:cin']['con']};
			res.send(sentResult);
		
			}, function(err) {
			
			res.statusCode = 404; 
			res.send("{result : Failed Retriving}");
			console.log(err);
				
			})	
			
		
			
		});
		
		//Getting Warning 
		app.get('/warning', (req, res) => {
			
			console.log("Open Sesame - Warning");
			// Setting URL and headers for request
			var options = {
				url: warnURL,
				headers : requestHeader
				
			};
			
			var getData = getMobiusData(options);
			
			res = setReponseHeader(res);
			
			getData.then(function(result) {
			
			var sentResult = {"finalResult" : result['m2m:cin']['con']};
			res.send(sentResult);
		
			}, function(err) {
			
			res.statusCode = 404; 
			res.send("{result : Failed Retriving}");
			console.log(err);
				
			})	
			
		
			
		});
		
		function setReponseHeader(res){
			
			res.setHeader('Content-Type', 'application/json');
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			
			return res;
		}	
		
		
		
		function getResultFromMobius(destinationUrl, res){
		
			const axios = require('axios');
			var resultData = [2];
			resultData[0] = "200";
			
			axios.get(destinationUrl, requestHeader)
			.then(response => {
			
					//console.log(" New! response.data = "+response.data['m2m:cin']['con']);
					//console.log("response.status = "+response.status);
					
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.send('An alligator approaches!Final Result = '+response.data['m2m:cin']['con']);
					
					//return response.data['m2m:cin']['con'];
					//resultData[1] = response.data['m2m:cin']['con'];
					//console.log("Inside resultData = "+resultData[1]);
			})
			.catch(error => {
				console.log("Request to Mobius Server is failed.");
				console.log("Message = "+error);
				//eturn error;
				//resultData[0] = response.status;
			});
			
		}
			
		function getMobiusData(options) {
			const request = require("request");
			// Return new promise 
			return new Promise(function(resolve, reject) {
				// Do async job
				request.get(options, function(err, resp, body) {
					if (err) {
						reject(err);
					} else {
						resolve(JSON.parse(body));
					}
				})
			})
		
		}
		
		//console.log("Get Data From Config -->"+ appConfig.get('Test.Gretting')+" and "+appConfig.get('Test-2.Gretting'));
		
		app.listen(port, () => console.log('Gator app listening on port 19998! and with POST listening'));
}


