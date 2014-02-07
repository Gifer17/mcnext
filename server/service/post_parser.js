
 var Service        = require('./service.js');
 var console        = require('console-plus');
 var moment         = require('moment');

 var WebClient      = require('./web_client_connect.js');

 var CMD            = {};
 var ParseFunctions = {};

 CMD            = Service.extend(CMD,            WebClient.CMD);
 ParseFunctions = Service.extend(ParseFunctions, WebClient.ParseFunctions);

 moment().format("DD:MM:YYYY");

 function Receive_POST_Data (req, res, CommandParser){
 	var postData = '';

	console.log("Receive POST data -=START=-", console.logLevel.L_Full);

	req.addListener("data", function(postDataChunk) {
		postData += postDataChunk;
	});
	
	req.addListener("end", function() {
		console.log(' POST data length: ' + postData.length, console.logLevel.L_Full);
		console.log(' POST data: ' + postData, console.logLevel.L_Full);
		console.log("Receive POST data -=END=-", console.logLevel.L_Full);
		
		CommandParser.apply(req, [postData,  function(_outData){
			console.info("Send to client DATA: " + _outData, console.logLevel.L_Extended);
			
			res.end(_outData);
		}]);
	});
 };

 function CommandParser(_dataIn, onFinish){
	var reqData = Service.Get_CMD(_dataIn);

     if (ParseFunctions[reqData.CMD]) {
         console.err("CommandParser CMD: " + reqData.CMD, console.logLevel.L_Full);

         ParseFunctions[reqData.CMD].apply(this, [reqData.DATA, onFinish]);
     } else {
         console.err("Unknown CMD: " + reqData.CMD, console.logLevel.L_Low);
     };
 };
 
 exports.Parse = function(req, res){
 	Receive_POST_Data(req, res, CommandParser);
 };
