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

//Socket.io
var io = "";

try{

	appConfig = require('./config/app_config.js');
	express = require('express');
	bodyParser = require('body-parser');
	io = require('socket.io')(80);

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
		/*diURL['deviceType'] = appConfig.MobiusURL.deviceInformation.deviceType;
		diURL['deviceName'] = appConfig.MobiusURL.deviceInformation.deviceName;
		diURL['deviceLocation'] = appConfig.MobiusURL.devic0eInformation.deviceLocation;*/

		//Power Generation
		/*pgURL['amountPerMinute'] = appConfig.MobiusURL.powerGeneration.amountPerMinute;
		pgURL['co2emissions'] =  appConfig.MobiusURL.powerGeneration.co2emissions;
		pgURL['powerGenerationYesterday'] =  appConfig.MobiusURL.powerGeneration.powerGenerationYesterday;
		pgURL['powerGenerationTotal'] =  appConfig.MobiusURL.powerGeneration.powerGenerationTotal;*/

		//Consumption
		/*conURL['amountPerMinute'] = appConfig.MobiusURL.consumption.amountPerMinute;
		conURL['consumptionTotal'] = appConfig.MobiusURL.consumption.consumptionTotal;
		conURL['consumptionYesterday'] = appConfig.MobiusURL.consumption.consumptionYesterday;*/

		//Battery
		/*battURL['currentAmount'] = appConfig.MobiusURL.battery.currentAmount;
		battURL['maxAmount'] = appConfig.MobiusURL.battery.maxAmount;*/

		//Warning
		//warnURL = appConfig.MobiusURL.warningAddress;

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

		var eventName = ["sendSolarData", "sendBatteryData","sendLoadData"];
		var channelName = ["/solar", "/battery","/load"];

		
	
		/*var deviceLocation = io.of('/deviceLocation').on('connection', function(socket){
			socket.emit('sendDeviceLocation', 'my device location');	
		});

		var deviceType = io.of('/deviceType').on('connection', function(socket){
			socket.emit('sendDeviceType', 'my device type');	
		});*/

		var getRequestedData = {
			doWork : function (req, res, activityName, eventName, channelName){	
				
				res = setReponseHeader(res);
				res.statusCode = 200 ; 
				res.send("Successful");
				
				var data = JSON.parse(req);
				//var data = JSON.stringify(req.body);
				console.log("Data here -->"+ data.body);
				//console.log("Data here too -->"+ data.m2m:sgn);

				//logger.debug("Retrieve "+activityName+ "Data Body = " +req.body.Body);
				//logger.debug("Retrieve "+activityName+ "Data = " +req.bodyParser);

				//console.log("Retrieve "+activityName+ "Data Header = " +req.headers);
				//console.log("Retrieve here here "+activityName+ "Data = "+JSON.stringify(req));
				

				//console.log("---> "+util.inspect(req, false, null));
				//var getData = getMobiusData(options);
				
				
				/*var pusher = io.of(channelName).on('connection', function(socket){
					console.log("Push to Client!");
					socket.emit(eventName, data);	
				});	*/


				

				/*getData.then(function(result) {
				
					var sentResult = {"finalResult" : result['m2m:cin']['con']};
					res.send(sentResult);
			
				}, function(err) {
				
				res.statusCode = 404; 
				res.send("{result : Failed Retriving}");
				
				console.log("Failed to Retrieve "+activityName+" "+err);
				logger.error("Failed to Retrieve "+activityName+" "+err);
				})*/
				
			}
		};

		app.post('/solar', (req, res) => {
			
			console.log("Ini Post toString -> "+req.toString());
			console.log("Ini Post Body -> "+req.body);
			//console.log("JSON? -> "+JSON.parse(req.body));
	
				//url: diURL['deviceType']
				var worker = getRequestedData;
					//getData : getResultFromMobius(diURL['deviceType'], res, "Device Type")
				
				
				try{
					console.log("Push Solar Data.");
					worker.doWork(req, res, "Solar", eventName[0], channelName[0]);
				
				}catch(e){
					console.log("Failed to Retrieve and to Push Solar Data"+e);
				}
				finally{
					delete worker;
					
				}
				
			
		});
		
		app.post('/battery', (req, res) => {
			
			console.log("Ini Post toString -> "+req.toString());
			console.log("Ini Post Body -> "+req.body);
			//console.log("JSON? -> "+JSON.parse(req.body));
			
			var worker = getRequestedData;
			
			try{
				console.log("Push Battery Data.");
				worker.doWork(req, res, "Battery", eventName[1], channelName[1]);
			
			}catch(e){
				console.log("Failed to Retrieve and to Push Battery Data"+e);
			}
			finally{
				delete worker;
				
			}
		
		});

		app.post('/load', (req, res) => {
			
			console.log("Ini Post toString -> "+JSON.stringify(req.body));
			//console.log("JSON? -> "+JSON.parse(req.body));

			var worker = getRequestedData;
			
			try{
				console.log("Push Load Data.");
				worker.doWork(req, res, "Load", eventName[2], channelName[2]);
			
			}catch(e){
				console.log("Failed to Retrieve and to Push Load Data"+e);
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


