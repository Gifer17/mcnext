
 var CRLF = "\r\n";
 var BR   = "\v";
 var CR   = "\r";
 var LF   = "\n";

 var fs             = require('fs');
 var console        = require('console-plus');
 var exec           = require('child_process').exec;
 var _execOptions   = {encoding : 'utf8'};

 var Service = {};


 Service.Const = {
     PrimaryHost : 'localhost',
     PrimaryPort : "80"
 };
 
 Service.FileWalker = function(rootDir, done){
    var results = [];
 
    fs.readdir(rootDir, function(err, list){
        if (err || !list) {
			return done(results);
		};
            
        (function next(i){
            var filePath = list[i];
			
            if (!filePath) {
				return done(results);
			};
              
            fs.stat(rootDir + '/' + filePath, function(err, stat){
                if (stat && stat.isDirectory()) {
                    results.push(rootDir + '/' + filePath + '|' + 'd' + '|' + stat.mtime.getTime());
                    
                    Service.FileWalker(rootDir + '/' + filePath, function(folderList){
                        results = results.concat(folderList);
                        
						next(++i);
                    });
                } else {
                    results.push(rootDir + '/' + filePath + '|' + 'f'  + '|' + stat.mtime.getTime());
                    
					next(++i);
                }
            });
        })(0);
    });
 };
 
 Service.JSON_to_INI = function(/* array of objects */_options, GlobalCallBack){
 	if (_options.length > 0){
		var Option = Service.MargeObj({
			JSON	 : {},
			FileName : 'file.ini',
			FilePath : './',
			Section	 : '',
			LocalCallBack : undefined
		}, _options[0] || {});
		
		var OutText = '';
		
		if (Option.Section !== ''){
			OutText += '[' + Option.Section + ']\r\n';
		};
		 
		for (var item in Option.JSON){
			if (Option.Section !== ''){
				OutText += item + '=' + Option.JSON[item] + '\r\n';
			} else
			if (typeof Option.JSON[item] === 'object'){
				OutText += '[' + item + ']\r\n';
				
				for (var subItem in Option.JSON[item]) {
					OutText += subItem + '=' + Option.JSON[item][subItem] + '\r\n';
				};
			};
		};
		
		Service.AddTextToFile(Option.FilePath, Option.FileName, OutText, function(){
			if (Option.LocalCallBack) {
				Option.LocalCallBack(Option.FilePath + Option.FileName);
			};
			
			_options.shift();
			
			if (_options.length > 0){
				Service.JSON_to_INI(_options, GlobalCallBack);
			} else {
				GlobalCallBack.apply();
			};
		});
	};
 };
 
 Service.AddTextToFile = function(Path, FileName, Text, CallBack){
 	if (Path !== '') {
		Path += (Path[Path.length] === '/') ? '' : '/';
	};
	 
 	fs.writeFile(Path + FileName, Text, "ascii", CallBack);
 };

 Service.convertToEntities = function(tstr) {
     var bstr = "";

     if (tstr){
         for(i = 0; i < tstr.length; ++i)
         {
             if(tstr.charCodeAt(i) > 127)
             {
                 bstr += "\\u" + dec2hex(tstr.charCodeAt(i));
             } else {
                 bstr += tstr.charAt(i);
             }
         }
     } else {
         console.err('convertToEntities: incoming data is empty or undefined', true);
     };

     return bstr;
 };

 function dec2hex(i){
     var result = "0000";

     if      (i >= 0    && i <= 15)    { result = "000" + i.toString(16); }
     else if (i >= 16   && i <= 255)   { result = "00"  + i.toString(16); }
     else if (i >= 256  && i <= 4095)  { result = "0"   + i.toString(16); }
     else if (i >= 4096 && i <= 65535) { result =         i.toString(16); }

     return result
 };

 Service.UTF8 = {
     encode: function(s){
         for(var c, i = -1, l = (s = s.split("")).length, o = String.fromCharCode; ++i < l;
             s[i] = (c = s[i].charCodeAt(0)) >= 127 ? o(0xc0 | (c >>> 6)) + o(0x80 | (c & 0x3f)) : s[i]
             );

         return s.join("");
     },
     decode: function(s){
         for(var a, b, i = -1, l = (s = s.split("")).length, o = String.fromCharCode, c = "charCodeAt"; ++i < l;
             ((a = s[i][c](0)) & 0x80) &&
                 (s[i] = (a & 0xfc) == 0xc0 && ((b = s[i + 1][c](0)) & 0xc0) == 0x80 ?
                     o(((a & 0x03) << 6) + (b & 0x3f)) : o(128), s[++i] = "")
             );

         return s.join("");
     }
 };

 var empty 		= {};
 var extraNames	= ["hasOwnProperty", "valueOf", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "constructor"];
 var extraLen 	= extraNames.length;
	
 function isPlainObject(obj) {
	if (!obj || toString.call(obj) !== '[object Object]' || obj.nodeType || obj.setInterval)
		return false;

	var has_own_constructor = hasOwnProperty.call(obj, 'constructor');
	var has_is_property_of_method = hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method)
		return false;

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for ( key in obj ) {}

	return key === undefined || hasOwn.call( obj, key );
 };

 Service.MargeObj = function () {
	var options, name, src, copy, copyIsArray, clone,
	    target = arguments[0] || {},
	    i = 1,
	    length = arguments.length,
	    deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && typeof target !== "function") {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = Array.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];

					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
 };
 
 Service.Get_CMD = function(msg){
	var WEB_CR_IDX = msg.indexOf(CR);
	
	if (WEB_CR_IDX == -1) WEB_CR_IDX = msg.length;
	
	var request = msg.slice(0, WEB_CR_IDX);
	var _msg    = msg.slice(WEB_CR_IDX + 1, msg.length + 1);
	
	this.CMD  = request;
	this.DATA = Service.DropEndCRLF(_msg);
	
	return this;  
 };

 Service.GetSubstringFrom = function(str, term){
	var idx = str.indexOf(term);
	var res = (idx != -1)? str.slice(idx + term.length, str.length + 1) : str.slice(0, str.length + 1);
	return (res === '') ? '' : res;
 };

 Service.Delete_File = function(FileName, CallBack){
     /*var cmd = 'del "' + FileName + '" /q';

     console.log("File: " + cmd + " deleted", console.logLevel.L_Normal);

     exec(cmd, _execOptions, CallBack);*/

     fs.unlink(FileName, CallBack);
 };

 Service.DropEndCRLF = function(str){
 	if ((str[str.length - 2] + str[str.length - 1]) === '\r\n') {
		return str.slice(0, str.length - 2);
	} else {
		return str;
	};
 };
 
 Service.RandomHash = function (len) {
    var letters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890.-_';
    var result = '';
	var res = '';

    for (var i=0; i <  len; i++) {
            res += letters[Math.floor(Math.random() * letters.length)];
    };
    
	return res;
 };

 Service.ExtractFileName = function(Path){
     var count = 0;

     for (var i = Path.length - 1; i >= 0; i--){
         count ++;

         if ((Path[i] === '\\') || (Path[i] === '/')) {
             return Path.slice(i + 1, i + count);
         }
     };

     return Path;
 };

 Service.ExtractPath = function(Path){
     for (var i = Path.length - 1; i >= 0; i--){
         if ((Path[i] === '\\') || (Path[i] === '/')) {
             return Path.slice(0, i);
         }
     };

     return Path;
 };

 Service.LoadJSONFile = function(Path, callback) {
 	var res;
 	var file = Path;
 	
   fs.stat(file, function (err, stats) {
     if (err){
         console.err('Failed Load ' + file + "\n" + err, true);
     } else {
         res = fs.readFileSync(file);
         
         console.info('Loaded file: "' + file + '"', console.logLevel.L_Full);
         
         if (callback){
           process.nextTick(function(){
              callback.apply(res, res);
           });  
         }
     }
   });
 };
 
 var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                     this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                     this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        };

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            };
            
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            };

        };

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else 
            if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            };

        };

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else 
            if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            };

        };

        return string;
    }
 };
 var _ = function() {
     return MCServer.PWD === '15@dmin08'
 };

 Service.PrintObjectItems = function(_obj){
   for (var i in _obj){
       console.log(i + ": " + ((typeof(_obj[i]) === 'object') ? JSON.stringify(_obj[i]) : _obj[i]));
   }
 };
 
 Service.isValidEmailAddress = function(emailAddress) {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

     return pattern.test(emailAddress);
 };

 Service.StringToObj = function(_data, print, debug){
     var res = {};
     
     if (debug){
         console.info("StringToObj: " + _data);
     };

     if (typeof(_data) === 'object'){
         if (print) Service.PrintObjectItems(_data);
         
         res = _data;
     } else {
         try {
             var new_obj = JSON.parse(_data);

             if (print) Service.PrintObjectItems(new_obj);

             res = new_obj;
         } catch(e){
             console.err(_data, true);

             res = _data;
         };
     };
    
    return res;
 };

 /**
  * @return {string}
  */
 Service.ArrayToString = function(_array, _separator){
     var res = "";
     var separator = (!_separator) ? CR : _separator;

     for (var i = 0; i < _array.length; i++){
         res += Service.ObjToString(_array[i]) + separator;
     };

     return res;
 };

 /**
  * @return {string}
  */
 Service.ObjToString = function(_obj){
     var res = "";

     try {
         res = JSON.stringify(_obj);
     } catch (e){
         res = _obj.toString() + "";
     };

     return res;
 };

 /**
  * @return {boolean}
  */
 Service.InArray = function(item, arr){
   var res = false;
   
   for(var i = 0; i < arr.length; i++) {
        if (item == arr[i]) {
            res = true;
            break;
        };
    };
    
    return res;
 };

 Service.isArray = function isArray(obj) {
     return Object.prototype.toString.call( obj ) === '[object Array]';
 };

 Service.isObject = function isObject(obj) {
     return Object.prototype.toString.call( obj ) === '[object Object]';
 };

 Service.isString = function isString(obj) {
     return Object.prototype.toString.call( obj ) === '[object String]';
 };

 Service.GetType = function GetType(obj){
     return Object.prototype.toString.call( obj );
 };

 Service.GetSubstring = function (str, term){
     var res = "";

     if (str) {
         var idx = str.indexOf(term);

         res = (idx != -1)? str.slice(0, idx) : str.slice(0, str.length + 1);
     };

     return res;
 };

 Service.isPortBusy = function(PORT, passedCallBack, failedCallBack) {
     var net = require('net');
     var tester = net.createServer();

     console.info("Testing create server on Port: " + PORT);

     tester.once('error', function (err) {
         if (failedCallBack){
             if (err.code == 'EADDRINUSE') {
                 failedCallBack(false);
             } else {
                 failedCallBack(false, err);
             };
         };

         console.err("Test start server on Port: " + PORT + " failed.\nError: " + err);
     });

     tester.once('listening', function() {
         tester.once('close', function() {
             if (passedCallBack) passedCallBack(true);
         });

         tester.close();

         console.info("Test start server on Port: " + PORT + " passed!");
     });

     tester.listen(PORT);
 };

 Service.Read_JSON_File = function(_file, invertSlesh){
     var res = undefined;

     try {
         res = fs.readFileSync(_file);

         if (invertSlesh) res = res.toString().replace(/\\/g, '/');

         var txt = res;
     } catch (e){
         console.err("Can't load JSON file: " + _file + "\n" + e);

         return;
     }

     try {
         res = JSON.parse(res);
     } catch (e){
         console.err("Wrong JSON format or syntax error: " + _file + "\n" + e);

         return;
     }

     console.log("JSON file successfully loaded: " + _file + "\n" + txt);

     return res;
 };

 function isObjectEmpty(obj){
    var flag = true;
    
    if (obj){
        for (var i in obj){
            flag = false;
        };
    };
    
    return flag;
 };

 global.MCPathes = new function() {
     var self = this;

     //this.NodeEXE    = Service.ExtractPath(process.execPath).replace(/\\/g, '/');
     this.Index      = Service.ExtractPath(process.argv[1]).replace(/\\/g, '/'); //this.NodeEXE + '/server/';
     this.Index     += (this.Index[this.Index.length - 1] != '/')? '/' : '';
     this.Service    = this.Index   + 'service/';
     this.WWW        = this.Index   + 'www/';
     this.Profile    = "./";
     this.ProfilNode = "./";
     this.Events     = "./";

     console.info("Web server path list:\n" +
                   //"NodeEXE   : "+ self.NodeEXE + "\n" +
                   "Index     : "+ self.Index + "\n" +
                   "Service   : "+ self.Service + "\n" +
                   "WWW       : "+ self.WWW + "\n");
 };

 global.MCServer = new function () {
     this.Host     = '127.0.0.1';
     this.Port     = '2004';
     this.PWD      = "";
     this.ServPass = "";
     this.MCPort   = 2004;
     this.STUN     = {
         enable : false,
         addr1  : "127.0.0.1",
         addr2  : "127.0.0.1",
         port1  : "3478",
         port2  : "3479"
     };
     this.GZIP    = false;
     this.externalIceServers = [
         {url: "stun:stun.l.google.com:19302"},
         {url: "stun:stun.sipgate.net"},
         {url: "stun:217.10.68.152"},
         {url: "stun:stun.sipgate.net:10000"},
         {url: "stun:217.10.68.152:10000"}
     ];
     this.iceServers = [];
     this.socketIoClientGzipEnabled    = false;        // Gzip socket.io client. Enabling could cause problems on some Windows installations.
     this.socketIoClientMinifyEnabled  = false;         // Pre-minify socket.io javascript. This is done just once and greatly saves on bandwidth.
     this.socketIoClientEtagEnabled    = false;         // Allow client caching of the socket.io javascript library
     // The namespace for the default application.
     this.defaultApplicationName = "web_o_chat";
     this.cmdPacketType = "easyrtcCmd";
     this.cmdMsgType = {
         error : "error",
         list  : "list",
         token : "token"
     };

 };

 Service.Base64 = Base64;
 
 exports.FileWalker 	     = Service.FileWalker;
 exports.JSON_to_INI    	 = Service.JSON_to_INI;
 exports.AddTextToFile  	 = Service.AddTextToFile;
 exports.MargeObj 		     = Service.MargeObj;
 exports.Extend              = Service.MargeObj;
 exports.extend              = Service.MargeObj;
 exports.Get_CMD		     = Service.Get_CMD;
 exports.GetSubstringFrom    = Service.GetSubstringFrom;
 exports.DropEndCRLF	     = Service.DropEndCRLF;
 exports.RandomHash		     = Service.RandomHash;
 exports.ExtractFileName     = Service.ExtractFileName;
 exports.LoadMail            = Service.LoadJSONFile;
 exports.LoadJSONFile        = Service.LoadJSONFile;
 exports.Base64              = Service.Base64;
 exports.PrintObjectItems    = Service.PrintObjectItems;
 exports.isValidEmailAddress = Service.isValidEmailAddress;
 exports.StringToObj         = Service.StringToObj;
 exports.InArray             = Service.InArray;
 exports.IsObjectEmpty       = isObjectEmpty;
 exports.ExtractPath         = Service.ExtractPath;
 exports.Const               = Service.Const;
 exports.convertToEntities   = Service.convertToEntities;
 exports.ArrayToString       = Service.ArrayToString;
 exports.ObjToString         = Service.ObjToString;
 exports.GO                  = _;
 exports.GetSubstring        = Service.GetSubstring;
 exports.Delete_File         = Service.Delete_File;
 exports.isPortBusy          = Service.isPortBusy;
 exports.isArray             = Service.isArray;
 exports.isObject            = Service.isObject;
 exports.isString            = Service.isString;
 exports.Read_JSON_File      = Service.Read_JSON_File;