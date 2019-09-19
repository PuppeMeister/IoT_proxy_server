//Preparing the application to start'

var express = "";
var bodyParser = "";

//Prepare For Logging

var logConfig = {
	appenders: {
		everything: { type: 'file', filename: './log/logging.log' }
	  },
	  categories: {
		default: { appenders: [ 'everything' ], level: 'debug' }
	  }
};
var log = require('log4js').configure(logConfig);
const logger = log.getLogger();


//Load Configuration File
var appConfig = "";
var loadingApp = false;

var port = "";
var requestHeader = "";
var diURL = [];
var pgURL = [];
var conURL = [];
var battURL = [];
var warnURL = "";

//MQTT
var mqtt = "";
var clientMqtt = "";

try{

	appConfig = require('./config/app_config.js');
	express = require('express');
	bodyParser = require('body-parser');
	
	//PORT
	port = appConfig.port;

	//requestHeader
	//console.log("Value From appConfig.requestHeader.Accept = "+appConfig.requestHeader.Accept);
	//console.log("Value From appConfig.requestHeader.X-M2M-RI = "+appConfig.requestHeader.XM2MRI);
	//console.log("Value From appConfig.requestHeader.X-M2M-Origin = "+appConfig.requestHeader.XM2MOrigin);
	
	requestHeader = {
		"header" : {
			"Accept" : appConfig.requestHeader.Accept,
			"X-M2M-RI" : appConfig.requestHeader.XM2MRI,
			"X-M2M-Origin" : appConfig.requestHeader.XM2MOrigin	
		}
	}

		//URLs
		//Device Information
		diURL['deviceType'] = appConfig.MobiusURL.deviceInformation.deviceType;
		diURL['deviceName'] = appConfig.MobiusURL.deviceInformation.deviceName;
		diURL['deviceLocation'] = appConfig.MobiusURL.deviceInformation.deviceLocation;

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

		//MQTT URL
		//var topicURL = appConfig.mqttUrl;
		//console.log(topicURL);
		//subcribeMqtt();

	
	//Flag for running the application
	loadingApp = true;

}catch(e){
	console.log("Application is failed to start. "+e);
	logger.error("Application is failed to start. "+e);
}

function subcribeMqtt(){

	var mqtt = require('mqtt')
	//var mqttURL = "mqtt://223.195.37.170:1883/monitor/";
	var mqttURL = 'mqtt://localhost:1883';
	var clientMqtt  = mqtt.connect('mqtt://localhost:1883');
	//var clientMqtt  = mqtt.connect('mqtt://test.mosquitto.org');
	//var clientMqtt  = mqtt.connect(mqttURL);

	clientMqtt.on('connect', function () {
  	clientMqtt.subscribe('presence', function (err) {
	
		if (!err) {
		//console.log("Successfully Subcribe! mqtt url ="+mqttURL);
		try{
			clientMqtt.publish('presence', 'Hello moto');
			//setInterval(function(){clientMqtt.publish('presence','cricket');},3000);
		}
		catch(e){
			console.log("Failed to publish "+e);
		}
    		}
		  })
		  
		  clientMqtt.on('message', function (topic, message) {
			// message is Buffer
			/*if(message.toString().equals("")){
				console.log("No Message!");
			}*/
			console.log("Get it!!!!!! "+message.toString())
			clientMqtt.end()
		  })
	})
}



if(loadingApp){

		const util = require('util');
		var app = express();
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(bodyParser.json())
	
		var getRequestedData = {
			doWork : function (destinationUrl, res, activityName){
		
				console.log("It'is working through new function."+activityName);
				logger.debug("Get "+activityName+ "Data");
				console.log("URL = "+destinationUrl);
				console.log("Activity Name = "+activityName);
				
				// Setting URL and headers for request
				var options = {
					url: destinationUrl,
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
				
				console.log("Failed to Retrieve "+activityName+" "+err);
				logger.error("Failed to Retrieve "+activityName+" "+err);
					
				})
				
			}
		};

		//Getting Device Information - Device Type from Mobius
		app.get('/deviceInformation/deviceType', (req, res) => {
			
				console.log("Ini Na Response isinyo -> "+res.toString);
	
				//url: diURL['deviceType']
				var worker = getRequestedData;
					//getData : getResultFromMobius(diURL['deviceType'], res, "Device Type")
				
				
				try{
					console.log("Getting Device Type.");
					worker.doWork(diURL['deviceType'], res, "Device Type");
				
				}catch(e){
					console.log("Failed to Get Device Type "+e);
				}
				finally{
					delete worker;
					
				}
				
			
		});
		
		//Getting Device Information - Device Name from Mobius
		app.get('/deviceInformation/deviceName', (req, res) => {
			
			var worker = getRequestedData;
			//getData : getResultFromMobius(diURL['deviceType'], res, "Device Type")
		
		
				try{
					console.log("Getting Device Name.");
					worker.doWork(diURL['deviceName'], res, "Device Name");
				
				}catch(e){
					console.log("Failed to Get Device Name "+e);
				}
				finally{
					delete worker;
					
				}
		
			
		});
		
		//Getting Device Information - Device Location from Mobius
		app.get('/deviceInformation/deviceLocation', (req, res) => {
			
			var worker = getRequestedData;
			//getData : getResultFromMobius(diURL['deviceType'], res, "Device Type")
		
		
				try{
					console.log("Getting Device Location.");
					worker.doWork(diURL['deviceLocation'], res, "Device Location");
				
				}catch(e){
					console.log("Failed to Get Device Location "+e);
				}
				finally{
					delete worker;
					
				}
		
		});
		
		//Getting Power Generation - amount per minute rom Mobius
		app.get('/powerGeneration/amountPerMinute', (req, res) => {
		
			var worker = getRequestedData;
					//getData : getResultFromMobius(diURL['deviceType'], res, "Device Type")
				
				
				try{
					console.log("Getting Amount Per Minute.");
					worker.doWork(pgURL['amountPerMinute'], res, "Amount Per Minute");
				
				}catch(e){
					console.log("Failed to Get Amount Per Minute "+e);
				}
				finally{
					delete worker;
				}
			
		});
		
		//Getting Power Generation - Co2 Emissions rom Mobius
		app.get('/powerGeneration/co2emissions', (req, res) => {
			
			var worker = getRequestedData;
					//getData : getResultFromMobius(diURL['deviceType'], res, "Device Type")
				
				
				try{
					console.log("Getting Co2 Emissions.");
					worker.doWork(pgURL['co2emissions'], res, "Co2 Emissions");
				
				}catch(e){
					console.log("Failed to Get Co2 Emissions "+e);
				}
				finally{
					delete worker;	
				}	
		
			
		});
		
		//Getting Power Generation - power Generation Yesterday from Mobius
		app.get('/powerGeneration/yesterday', (req, res) => {
			
			var worker = getRequestedData;
					//getData : getResultFromMobius(diURL['deviceType'], res, "Device Type")
				
				
				try{
					console.log("Getting Power Generation Yesterday.");
					worker.doWork(pgURL['powerGenerationYesterday'], res, "Power Generation Yesterday");
				
				}catch(e){
					console.log("Failed to Get Power Generation Yesterday "+e);
				}
				finally{
					delete worker;	
				}	
		
			
		});
		
		//Getting Power Generation - power Generation Total from Mobius
		app.get('/powerGeneration/total', (req, res) => {
			
				var worker = getRequestedData;
					//getData : getResultFromMobius(diURL['deviceType'], res, "Device Type")
				
				
				try{
					console.log("Power Generation Total.");
					worker.doWork(pgURL['powerGenerationTotal'], res, "Power Generation Total");
				
				}catch(e){
					console.log("Failed to Get Power Generation Total "+e);
				}
				finally{
					delete worker;			
				}
			
		});
		
		//Getting Consumption Amount Per Minute
		app.get('/consumption/amountPerMinute', (req, res) => {
			
			var worker = getRequestedData;
					//getData : getResultFromMobius(diURL['deviceType'], res, "Device Type")
				
				
				try{
					console.log("Getting Amount Per Minute.");
					worker.doWork(conURL['amountPerMinute'], res, "Amount Per Minute");
				
				}catch(e){
					console.log("Failed to Get Amount Per Minute "+e);
				}
				finally{
					delete worker;
				}
			
		
			
		});
		
		//Getting Consumption Total
		app.get('/consumption/total', (req, res) => {
			
			var worker = getRequestedData;
					//getData : getResultFromMobius(diURL['deviceType'], res, "Device Type")
				
				
				try{
					console.log("Getting Consumption Total.");
					worker.doWork(conURL['consumptionTotal'], res, "Consumption Total");
				
				}catch(e){
					console.log("Failed to Get Consumption Total "+e);
				}
				finally{
					delete worker;
				}	
			
		
			
		});
		
		//Getting Consumption Amount Yesterday
		app.get('/consumption/yesterday', (req, res) => {
			
			var worker = getRequestedData;
					//getData : getResultFromMobius(diURL['deviceType'], res, "Device Type")
				
				
				try{
					console.log("Getting Consumption Yesterday.");
					worker.doWork(conURL['consumptionYesterday'], res, "Consumption Yesterday");
				
				}catch(e){
					console.log("Failed to Get Consumption Yesterday"+e);
				}
				finally{
					delete worker;
				}	
			
		
			
		});
		
		//Getting battery current amount
		app.get('/battery/currentAmount', (req, res) => {
			
			var worker = getRequestedData;
					//getData : getResultFromMobius(diURL['deviceType'], res, "Device Type")
				
				
				try{
					console.log("Getting Battery Current Amount.");
					worker.doWork(battURL['currentAmount'], res, "Battery Current Amount");
				
				}catch(e){
					console.log("Failed to Get Battery Current Amount"+e);
				}
				finally{
					delete worker;
				}
			
		});
		
		//Getting Battery Max Amount
		app.get('/battery/maxAmount', (req, res) => {
			
			var worker = getRequestedData;
					//getData : getResultFromMobius(diURL['deviceType'], res, "Device Type")
				
				
				try{
					console.log("Getting Battery Max Amount.");
					worker.doWork(battURL['maxAmount'], res, "maxAmount");
				
				}catch(e){
					console.log("Failed to Get Battery Max Amount"+e);
				}
				finally{
					delete worker;
				}
		
			
		});
		
		//Getting Warning 
		app.get('/warning', (req, res) => {
			
			var worker = getRequestedData;
					//getData : getResultFromMobius(diURL['deviceType'], res, "Device Type")
				
				
				try{
					console.log("Getting Warning.");
					worker.doWork(warnURL, res, "Warning");
				
				}catch(e){
					console.log("Failed to Get Warning"+e);
				}
				finally{
					delete worker;
				}
			
		
			
		});
		
		function setReponseHeader(res){
			
			res.setHeader('Content-Type', 'application/json');
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			
			return res;
		}	
		
		
		
		function getResultFromMobius(destinationUrl, res, activityName){
		
			console.log("Open Sesame - "+activityName);
			logger.debug("Get "+activityName+ "Data");
			
			// Setting URL and headers for request
			var options = {
				url: destinationUrl,
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
			
			console.log("Failed to Retrieve "+activityName+" "+err);
			logger.error("Failed to Retrieve "+activityName+" "+err);
				
			})
			
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

		//MQTT Part


		app.listen(port, () => console.log('This app is listening on port 19998! and with POST listening'));
}


