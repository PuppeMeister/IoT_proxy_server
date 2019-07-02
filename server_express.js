var express = require('express');
var bodyParser = require('body-parser');
const util = require('util');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

const port = 19998;

/*var requestHeader = {
			"headers" :{
				"Accept" : "application/json",
				"X-M2M-RI" : "12345",
				"X-M2M-Origin" : "S20170717074825768bp2l"	
			}};*/
			
var requestHeader = { 
				"Accept" : "application/json",
				"X-M2M-RI" : "12345",
				"X-M2M-Origin" : "S20170717074825768bp2l"	
			};			
			
var deviceInformationAddress = [];
deviceInformationAddress[0] = "http://203.250.148.89:7579/Mobius/Device_1_Sample/deviceInformation/deviceType/latest";
deviceInformationAddress[1] = "http://203.250.148.89:7579/Mobius/Device_1_Sample/deviceInformation/deviceName/latest";
deviceInformationAddress[2] = "http://203.250.148.89:7579/Mobius/Device_1_Sample/deviceInformation/deviceLocation/latest";

app.get('/deviceInformation/deviceType', (req, res) => {
	
	console.log("Open Sesame - Device Type");
	// Setting URL and headers for request
    var options = {
        url: deviceInformationAddress[0],
		headers : requestHeader
		
    };
	
	var getData = getMobiusData(options);
	
	res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	   
    getData.then(function(result) {
       
	   //res.statusCode = 200; 
	   //res.setHeader('Content-Type', 'text/event-stream');
	   var sentResult = {"finalResult" : result['m2m:cin']['con']};
	   //res.send("{'result':'"+result['m2m:cin']['con']+"'}");
	   //res.send(result['m2m:cin']['con']);
	   res.send(sentResult);

	   
       //console.log(result['m2m:cin']['con']);
    }, function(err) {
	   
	   res.statusCode = 404; 
	   res.send("{result : Failed Retriving}");
	   console.log(err);
		
    })	
	

	
});

app.get('/deviceInformation/deviceName', (req, res) => {
	
	console.log("Open Sesame - Device Name");
	// Setting URL and headers for request
    var options = {
        url: deviceInformationAddress[1],
		headers : requestHeader
		
    };
	
	var getData = getMobiusData(options);
	
	res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	   
    getData.then(function(result) {
       
	   var sentResult = {"finalResult" : result['m2m:cin']['con']};
	   res.send(sentResult);
    }, function(err) {
	   
	   res.statusCode = 404; 
	   res.send("{result : Failed Retriving}");
	   console.log(err);
		
    })	
	

	
});

app.get('/deviceInformation/deviceLocation', (req, res) => {
	
	console.log("Open Sesame - Device Location");
	// Setting URL and headers for request
    var options = {
        url: deviceInformationAddress[2],
		headers : requestHeader
		
    };
	
	var getData = getMobiusData(options);
	
	res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	   
    getData.then(function(result) {
      
	   var sentResult = {"finalResult" : result['m2m:cin']['con']};
	   res.send(sentResult);

    }, function(err) {
	   
	   res.statusCode = 404; 
	   res.send("{result : Failed Retriving}");
	   console.log(err);
		
    })	
	

	
});


var powerGenerationAddress = [];
powerGenerationAddress[0] = "http://203.250.148.89:7579/Mobius/Device_1_Sample/deviceUpdatedData/powerGeneration/amountPerMinute/latest";
powerGenerationAddress[1] = "http://203.250.148.89:7579/Mobius/Device_1_Sample/deviceUpdatedData/powerGeneration/co2emissions/latest";
powerGenerationAddress[2] = "http://203.250.148.89:7579/Mobius/Device_1_Sample/deviceUpdatedData/powerGeneration/yesterday/latest";
powerGenerationAddress[3] = "http://203.250.148.89:7579/Mobius/Device_1_Sample/deviceUpdatedData/powerGeneration/total/latest";


app.get('/powerGeneration/amountPerMinute', (req, res) => {
	
	console.log("Open Sesame - Power Generation - amountPerMinute");
	// Setting URL and headers for request
    var options = {
        url: powerGenerationAddress[0],
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

app.get('/powerGeneration/co2emissions', (req, res) => {
	
	console.log("Open Sesame - Power Generation - co2emissions");
	// Setting URL and headers for request
    var options = {
        url: powerGenerationAddress[1],
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

app.get('/powerGeneration/yesterday', (req, res) => {
	
	console.log("Open Sesame - Power Generation - Device Location");
	// Setting URL and headers for request
    var options = {
        url: powerGenerationAddress[2],
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

app.get('/powerGeneration/total', (req, res) => {
	
	console.log("Open Sesame - Power Generation - total");
	// Setting URL and headers for request
    var options = {
        url: powerGenerationAddress[3],
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

var consumptionAddress = [];
consumptionAddress[0] = "http://203.250.148.89:7579/Mobius/Device_1_Sample/deviceUpdatedData/consumption/amountPerMinute/latest";
consumptionAddress[1] = "http://203.250.148.89:7579/Mobius/Device_1_Sample/deviceUpdatedData/consumption/total/latest";
consumptionAddress[2] = "http://203.250.148.89:7579/Mobius/Device_1_Sample/deviceUpdatedData/consumption/yesterday/latest";

app.get('/consumption/amountPerMinute', (req, res) => {
	
	console.log("Open Sesame - Consumption - amountPerMinute");
	// Setting URL and headers for request
    var options = {
        url: consumptionAddress[0],
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

app.get('/consumption/total', (req, res) => {
	
	console.log("Open Sesame - Consumption - Total");
	// Setting URL and headers for request
    var options = {
        url: consumptionAddress[1],
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

app.get('/consumption/yesterday', (req, res) => {
	
	console.log("Open Sesame - Consumption - yesterday");
	// Setting URL and headers for request
    var options = {
        url: consumptionAddress[2],
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

var batteryAddress = [];
batteryAddress[0] = "http://203.250.148.89:7579/Mobius/Device_1_Sample/deviceUpdatedData/bateryLevel/currentAmount/latest";
batteryAddress[1] = "http://203.250.148.89:7579/Mobius/Device_1_Sample/deviceUpdatedData/bateryLevel/maxAmount/latest";

app.get('/battery/currentAmount', (req, res) => {
	
	console.log("Open Sesame - Battery - Current Amount");
	// Setting URL and headers for request
    var options = {
        url: batteryAddress[0],
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

app.get('/battery/maxAmount', (req, res) => {
	
	console.log("Open Sesame - Battery - Max Amount");
	// Setting URL and headers for request
    var options = {
        url: batteryAddress[1],
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

var warningAddress = "http://203.250.148.89:7579/Mobius/Device_1_Sample/deviceUpdatedData/warning/latest";
app.get('/warning', (req, res) => {
	
	console.log("Open Sesame - Warning");
	// Setting URL and headers for request
    var options = {
        url: warningAddress,
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

function getResultFromMobius2(destinationUrl){
 
	const axios = require('axios');
	
	return new Promise(function(resolve, reject) {
    	// Do async job
        axios.get(destinationUrl, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
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


app.listen(port, () => console.log('Gator app listening on port 19998! and with POST listening'));