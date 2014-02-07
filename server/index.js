
 var HTTP       = require('http');
 var HTTPS      = require('https');
 var URL        = require('url');
 var console    = require('console-plus');

 var Service            = require('./service/service.js');          console.info("Service loaded...");

 console.DublicateToFile(Service.GetSubstring(process.argv.slice(2)[3], '"').replace(/\\/g, '/') + "/logs/" +
     (new Date()).myFormat('yyyy') + "/" +
     (new Date()).myFormat('mm') + "/" +
     (new Date()).myFormat('dd') + "/node.log");

 var POST_Processing 	= require('./service/post_parser.js');      console.info("POST_Processing loaded...");
 var Route              = require('./service/router.js');           console.info("Route loaded...");
 var FileLoader         = require('./service/staticHandler.js');    console.info("FileLoader loaded...");
 var Moment             = require('moment');                        console.info("Moment loaded...");
 var fs                 = require('fs');                            console.info("Service loaded...");
 var DropAllUsers       = require('./service/mcconnect.js').KILL_ALL_CONNECTION; console.info("DropAllUsers loaded...");
 var WebRTC             = require('./service/web_rtc_serv.js');     console.info("WebRTC loaded...");

 console.important("Base modules loaded.\n");

 console.important("Loading \"config.json\"");

 var Configuration = {};

 var HTTPServer;
 var WebRTCServer;
 var STUNServer;
 var watcher;

 var __sockets             = []; // Открытые сокеты HTTP сервера
 var AlternativePorts      = [80, 8080, 8088]; // список альтернативных портов для старта веб-сервера, можно расширять самостоятельно
 var AlternativePortNumber = -1; // интекс альтернативного порта из верхнего блока. -1 порт, указанныйв параметрах запуска ехе, обычно - 80, изменять не рекомендуется
 var trycount              = 2;  // количество попыток запустить веб сервер на текущем порту, рекомендуется не более 5 раз
 var currtry               = 1;  // номер текущей попытки, изменять не рекомендуется

 var CRLF = "\r\n";

 var EventFile = 'events.txt';

 Moment().format("DD:MM:YYYY");

 console.SetLogLevel(console.logLevel.L_Normal);

 function ConfigurateStartParams(params){
     AlternativePorts    = Configuration.AlternativePorts || AlternativePorts;

     MCServer.Port       = (Configuration.UseSSL && Configuration.HTTPSPort) ? Configuration.HTTPSPort : params[0];
     MCServer.PWD        = params[1];
     MCServer.MCPort     = Configuration.MyChatServerPort || params[2];
     MCServer.Host       = Configuration.MyChatServerIP || "127.0.0.1";
     MCServer.ServPass   = Configuration.ServPass || "";

     MCServer.STUN.enable = Configuration.STUNenable || MCServer.STUN.enable;
     MCServer.STUN.addr1  = Configuration.STUNaddr1  || MCServer.STUN.addr1;
     MCServer.STUN.addr2  = Configuration.STUNaddr2  || MCServer.STUN.addr2;
     MCServer.STUN.port1  = Configuration.STUNport1  || MCServer.STUN.port1;
     MCServer.STUN.port2  = Configuration.STUNport2  || MCServer.STUN.port2;

     if (MCServer.STUN.enable)
         MCServer.iceServers = [
             {"url": "stun:" + MCServer.STUN.addr1 + ":" + MCServer.STUN.port1},
             {"url": "stun:" + MCServer.STUN.addr1 + ":" + MCServer.STUN.port2},
             {"url": "stun:" + MCServer.STUN.addr2 + ":" + MCServer.STUN.port1},
             {"url": "stun:" + MCServer.STUN.addr2 + ":" + MCServer.STUN.port2}
         ];
     else {
         MCServer.iceServers = MCServer.externalIceServers;
     }

     MCServer.GZIP       = Configuration.GZIPenable || false;

     MCPathes.Profile    = Configuration.MyChatProfile || Service.GetSubstring(params[3], '"').replace(/\\/g, '/');
     MCPathes.Profile   += (MCPathes.Profile[MCPathes.Profile.length - 1] != '/') ? '/' : '';
     MCPathes.ProfilNode = MCPathes.Profile + "node/";
     MCPathes.Events     = MCPathes.ProfilNode + "events/";

     console.info("MyChat server profile path list:\n" +
                  "Profile   : " + MCPathes.Profile + "\n" +
                  "ProfilNode: " + MCPathes.ProfilNode + "\n" +
                  "Events    : " + MCPathes.Events, console);
 }

 function ParseEventsFile ( txt ){
     var _eventsList = txt.toString().replace(/\\/g, '/').split(CRLF);

     _eventsList.forEach(function(element){
         console.log('Parse "events.txt", srt:' + element, console.logLevel.L_Low);

         if (element != ""){
             element = Service.StringToObj(element);

             if (element.cmd){
                 switch (element.cmd){
                     case "stop":
                         StopHTTPServer(DropAllUsers(StopEventsWatcher));
                     break;

                     case "start":
                         START(AlternativePortNumber);
                     break;

                     case "config":
                         ConfigurateStartParams([
                             element.port,
                             element.pass,
                             element.mcport,
                             element.profile
                         ]);
                     break;
                 };
             };
         };
     });
 }

 function onRequest(request, response) {
     console.DublicateToFile(MCPathes.Profile + "logs/" +
         (new Date()).myFormat('yyyy') + "/" +
         (new Date()).myFormat('mm') + "/" +
         (new Date()).myFormat('dd') + "/node.log");

     if (request.method === 'GET'){
         var pathname = URL.parse(request.url).pathname;

         console.log("Request for " + pathname + " received.", console.logLevel.L_Full);

         Route.GO(FileLoader.handle, pathname, request, response);
     } else
     if (request.method === 'POST'){
         POST_Processing.Parse(request, response);
     };
 }

 function StartHTTPServer(){
     __sockets = [];

     if (Configuration.UseSSL){
         var _key  = fs.readFileSync(Configuration.PathToKeySSL) || fs.readFileSync('./service/ssl/private.pem');
         var _sert = fs.readFileSync(Configuration.PathToSertSSL) || fs.readFileSync('./service/ssl/public.pem');

         var options = {
             key  : _key,
             cert : _sert
         };

         HTTPServer = HTTPS.createServer(options, onRequest);

         var HTTPListener = HTTPServer.listen(MCServer.Port, function(){
             console.important("HTTPS  Server started at port tcp " + MCServer.Port + '\n');

             Route.LoadPathes();
         })
     } else {
         HTTPServer = HTTP.createServer(onRequest);

         var HTTPListener = HTTPServer.listen(MCServer.Port, function(){
             console.important("HTTP   Server started at port tcp " + MCServer.Port + '\n');

             Route.LoadPathes();
         })
     }

     WebRTCServer = WebRTC.StartWebRTCServer(HTTPListener);
     STUNServer   = WebRTC.STUNServer();

     HTTPServer.on('connection', function (socket) {
         socket.remoteHostIp = socket.remoteAddress;

         __sockets.push(socket);

         socket.setTimeout(8000);

         socket.on('close', function () {
             console.log('HTTP socket closed', console.logLevel.L_Extended);

             __sockets.splice(__sockets.indexOf(socket), 1);
         });

         socket.on('error', function (err) {
             console.err('[' + socket.remoteHostIp + '] HTTP socket ERROR! ' + Service.ObjToString(err), console.logLevel.L_Low);
         });
     });
 }

 function StopHTTPServer(callback){
     if (HTTPServer){
         for (var i = 0; i < __sockets.length; i++) {
             console.log('HTTP socket #' + i + ' destroyed', console.logLevel.L_High);

             __sockets[i].destroy();
         }

         WebRTC.KillWebRTCConnections();

         HTTPServer.on('close', function(){
             console.important("HTTP Server stopped.");

             if (callback) callback();
         });

         WebRTCServer.server.on('close', function(){
             console.important("WebRTCServer Server stopped.");
         });

         if (STUNServer) STUNServer.close();

         HTTPServer.close();
     }
 }

 function StartEventsWatcher(){
     fs.stat(MCPathes.Events, function(err){
         if (err){
             console.err("StartEventsWatcher. Path: " + MCPathes.Events + " not found! " + err);
         } else {
             watcher = fs.watch(MCPathes.Events, function(event, filename){
                 console.log('event is: ' + event, console.logLevel.L_Full);
                 if (filename) {
                     console.log('filename provided: ' + filename + " with event: " + event, console.logLevel.L_Low);

                     if ((filename == EventFile) && (event == "rename")){
                         var _data;

                         try {
                             _data = fs.readFileSync(MCPathes.Events + filename);
                         } catch (e){
                             console.err("Can't load Events file: " + MCPathes.Events + filename + "\n" + e);
                         }

                         fs.unlink(MCPathes.Events + filename, function (error) {
                             if (error !== null) {
                                 console.err('exec error: ' + error);
                             }
                         });

                         if (_data){
                             ParseEventsFile(_data);
                         }
                     }
                 } else {
                     console.log('filename not provided', console.logLevel.L_Full);
                 }
             });
         }
     });
 }

 function StopEventsWatcher(){
     if (watcher) {
         watcher.on('close', function(){
             console.log('Watcher stopped');
         });

         watcher.close();
     }
 }

 function GO(){
     if (Service.GO()){
         StartHTTPServer();

         StartEventsWatcher();
     } else {
         console.err('Server not started on GO... :(');
     }
 }

 function START(portNumber){
     if (currtry > trycount){
         portNumber ++;

         if (AlternativePorts[portNumber]){
             MCServer.Port = AlternativePorts[portNumber];

             AlternativePortNumber = portNumber;
         } else{
             console.warn("Can't start server - all primary and alternative ports in busy or not available! Web'o'Chat STOP.");

             return;
         }

         currtry = 1;
     }

     Service.isPortBusy(MCServer.Port, GO, function(){
         if (currtry <= trycount){
             currtry ++;

             setTimeout(function(){
                 START(portNumber);
             }, 2000);
         }
     });
 }

 process.on('uncaughtException', function (err) {
     console.err("FATAL - " + err.message);
     console.err(err.stack);
 });

 Configuration = Service.Read_JSON_File('./config.json', true) || {};

 ConfigurateStartParams(process.argv.slice(2));

 process.chdir(MCPathes.Index);

 START(-1);
