//Preparing the application to start'

var express = "";
var bodyParser = "";
var cors = "";

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
	cors = require('cors');
	bodyParser = require('body-parser');
	//io = require('socket.io')(19997,{ origins: '*:*'});
	io = require('socket.io')(19997);

	//PORT
	port = appConfig.port;

	/*requestHeader = {
		"header" : {
			"Accept" : "application/json",
			"X-M2M-RI" : "dashboard",
			"X-M2M-Origin" : "admin:admin",
			"Content-Type" : "application/json;ty=28"
		}
	}*/

	requestHeader = {
		
			"Accept" : "application/json",
			"X-M2M-RI" : "dashboard",
			"X-M2M-Origin" : "admin:admin",
			"Content-Type" : "application/json;ty=28"
		
	};

	
	//Flag for running the application
	loadingApp = true;

}catch(e){
	console.log("Application is failed to start. "+e);
	logger.error("Application is failed to start. "+e);
}



if(loadingApp){

		const util = require('util');
		var app = express();
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(bodyParser.json());
		app.use(cors());
	
		

		var solarEntityName = ["current", "voltage","power", "daily", "monthly", "annual", "total"];
		var solarEventName = ["solarCurrent", "solarVoltage","solarPower", "solarDaily", "solarMonthly", "solarAnnual", "solarTotal"];

		var batteryEntityName = ["level", "current","voltage", "power"];
		var batteryEventName = ["battLevel", "battCurrent","battVoltage","battPower"];

		var battChargeEntity = ["charging", "discharging"];
		var battChargeEvent = ["charging", "discharging"];

		var loadEntityName = ["current", "voltage","power", "daily", "monthly", "annual", "total"];
		var loadEventName = ["loadCurrent", "loadVoltage","loadPower", "loadDaily", "loadMonthly", "loadAnnual", "loadTotal"];


		var getRequestedData = {
				doWork : function (req, res, activityName, entityName, eventName)	{
				
				res = setReponseHeader(res);
				res.statusCode = 200 ; 
				res.send("Successful");

				//var sentData = req.body['m2m:sgn']['m2m:nev']['m2m:rep']['m2m:fcnt']['current'];
				
				//io.of(channelName).on('connection', function(socket){
				/*io.on('connection', function(socket){	
					console.log("Send!");
					socket.emit('incomingData', sentData);	
				});*/
				

				for(i=0; i<entityName.length; i++){

					var sentData = req.body['m2m:sgn']['m2m:nev']['m2m:rep']['m2m:fcnt'][entityName[i]];
					io.sockets.emit(eventName[i], sentData);
					console.log(activityName + " retrieved data = "+entityName[i]+" || "+sentData+" || Event Name = "+eventName[i]);
					
					
				}
				
			}
		};

		var pushCommandToServer = {
			doWork : function (sentData)	{
				
				const request = require("request");
				console.log("Push to server, data --> "+sentData);
		
				/*request.put('http://192.168.0.21:8080/~/in-cse/fcnt-548319540', {sentData}, requestHeader
					, (error, res, body) => {
							if (error) {
								console.error(error);
								
							}
							console.log("heree");
							console.log("statusCode: "+res.statusCode);
							console.log(body);
					})*/
					var data = JSON.parse(sentData);
					request({
						method: "PUT",
						uri: 'http://192.168.0.21:8080/~/in-cse/fcnt-548319540',
						headers: requestHeader,
						json: data
					},
					function(error, request, body){
						var status = request.statusCode;
						console.log("Here --> "+error+" || "+status);
						console.log(body);
					 });
			
			}
		};

		app.post('/solar', (req, res) => {

			
			console.log("Incoming Solar Data = "+JSON.stringify(req.body));

				var worker = getRequestedData;
				
				try{
					console.log("Push Solar Data.");
					worker.doWork(req, res, "Solar", solarEntityName, solarEventName);
				
				}catch(e){
					console.log("Failed to Retrieve and to Push Solar Data " +e);
				}
				finally{
					delete worker;
					
				}
				
			
		});
		
		app.post('/battery', (req, res) => {

			
			console.log("Incoming Battery Data = "+JSON.stringify(req.body));
			
			var worker = getRequestedData;
			
			try{
				console.log("Push Battery Data.");
				var sampleCharging = req.body['m2m:sgn']['m2m:nev']['m2m:rep']['m2m:fcnt']['charging'];
				
				if(sampleCharging == undefined){
					worker.doWork(req, res, "Battery", batteryEntityName, batteryEventName);
				}
				else{
					console.log("Push Charging and Discharging Status");
					//worker.doWork(req, res, "Battery", battChargeEntity,  battChargeEvent);
				}
				
			}catch(e){
				console.log("Failed to Retrieve and to Push Battery Data "+e);
			}
			finally{
				delete worker;
				
			}
		
		});

		app.post('/load', (req, res) => {
			
			console.log("Incoming Load Data = "+JSON.stringify(req.body));

			var worker = getRequestedData;
			
			try{
				console.log("Push Load Data.");
				worker.doWork(req, res, "Load", loadEntityName, loadEventName);
			
			}catch(e){
				console.log("Failed to Retrieve and to Push Load Data "+e);
			}
			finally{
				delete worker;
				
			}
	
		});

		app.post('/charging', (req, res) => {
			
			console.log("Charging Command "+ req.body['command']);

			res = setReponseHeader(res);
			res.statusCode = 200 ; 
			res.send("Successful");

			var worker = pushCommandToServer;
			var sentData = '{ "m2m:fcnt" : { "charging" : 1 } }';

			if(req.body['command']== "0"){
				sentData = '{ "m2m:fcnt" : { "charging" : 0 } }';	
			}
			
			try{
				console.log("Push Charging Command to Server.");
				worker.doWork(sentData);
			
			}catch(e){
				console.log("Failed Push Charging Command to Server "+e);
			}
			finally{
				delete worker;
				
			}
	
		});

		app.post('/discharging', (req, res) => {
			
			console.log("Discharging Command "+ req.body['command']);
			
			res = setReponseHeader(res);
			res.statusCode = 200 ; 
			res.send("Successful");

			var worker = pushCommandToServer;
			var sentData = '{ "m2m:fcnt" : { "discharging" : 1 } }';

			if(req.body['command']== "0"){
				sentData = '{ "m2m:fcnt" : { "discharging" : 0 } }';	
			}
			
			try{
				console.log("Push Discharging Command to Server.");
				worker.doWork(sentData);
			
			}catch(e){
				console.log("Failed Push Discharging Command to Server "+e);
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


		app.listen(port, () => console.log('This app is listening on port 19998! and with POST listening and web socket is on port 19997!'));
		
}


