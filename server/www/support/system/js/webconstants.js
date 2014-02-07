  ;
  var CRLF = "\r\n";
  var BR   = "\v";
  var CR   = "\r";
  var LF   = "\n";

  var AjaxInProgress  			= false;
  
  var WEB_PRIVATELOG				= "1";
  var WEB_CHANNELLOG				= "2";
  var WEB_SYSEVENTSLOG				= "3";
  var WEB_FTPLOG					= "4";
  var WEB_ALL_PRIVATELOGS_BY_PERIOD	= "33"; // OldVersion = "5"
  var WEB_USER_PRIVATELOGS_BY_PERIOD= "34"; // OldVersion = "6"
  var WEB_ALL_CHANNELLOG_BY_PERIOD	= "35"; // OldVersion = "7"
  
 //== Типы периодов в истории ==
  var HType_OneDay	= "1";
  var HType_Week	= "7";
  var HType_Month	= "30";
  var HType_Any		= "0"; 
 //=============================
  
  var CMD_COMMAND_LOGIN           	= "8";// "LOGIN";  
  var CMD_COMMAND_FAILED          	= "9";// "FAILED";
  var CMD_COMMAND_ACCEPT          	= "10";// "ACCEPT";
  var CMD_COMMAND_NOT_OPERATOR		= "11";// 'UNOTOP';
  var CMD_COMMAND_GETCHANNELLIST    = "12";// "GETCHANNELLIST";
  var CMD_COMMAND_GETUSERLIST       = "13";// "GETUSERLIST";
  var CMD_COMMAND_GETUSERINFO		= "14";// "GETUSERINFO";
  var CMD_COMMAND_GETUSERSMALLINFO	= "15";// "GETUSERSMALLINFO";
  var CMD_COMMAND_GETAVAILABLEDAYS  = "16";// "GETAVAILABLEDAYS";
  var CMD_COMMAND_CLEARCASHE        = "17";// "CLEARCASHE";
  var CMD_COMMAND_ACCESSDENIED      = "18";// "ACCESSDENIED";
  var CMD_COMMAND_GENERATELOG       = "19";// "GENERATELOG";
  var CMD_COMMAND_EMPTY           	= "20";// "EMPTY";
  var CMD_COMMAND_REGISTER_USER		= "21";// "REGUSER";
  var CMD_COMMAND_SETSMALLUSERINFO	= "22";// "SETSUI";

  var CMD_COMMAND_SERVERINFO        = "23";// "SERVERINFO";
  var CMD_COMMAND_SERVERCHANNELSINFO= "24";// "SERVERCHANNELSINFO";
  var CMD_COMMAND_GETRULESLIST		= "25";// "GETRULESLIST";
  
  var CMD_COMMAND_PING            	= "26";// "PING";
  var CMD_COMMAND_PONG            	= "27";// "PONG";
  var CMD_COMMAND_SENDMSG         	= "28";// "SENDMSG";
  var CMD_COMMAND_QUIT				= "29";// "QUIT";

  var CMD_COMMAND_HISTORY			= "30";// "HISTORY";
  var CMD_COMMAND_ADMIN				= "31";// "ADMIN";
  var CMD_COMMAND_MINI_CLIENT		= "32";// "MINI_CLIENT";

  //var CMD_COMMAND_CREATEDISTRIB   = "CREATEDISTRIB";
  
  //==================== WEB CONSOLE - SERVER OPTIONS =====================
  
  var CMD_GET_OPTIONS			= "36";// 'GETOPTIONS';
  var CMD_SET_OPTIONS			= "37";// 'SETOPTIONS';
  var CMD_GET_ALLIP				= "38";// 'GETALLIP';
  var CMD_GETJSONUSERLIST		= "39";
  var CMD_JSON_GET_USER_FULL_INFO	= "40";
//====================================================================
//====================================================================

  var CMD_JSON_SEND				= "41";
    var JSON_SIMPLY_SEND	= 1; // Simply Send Function
		var MSG_JSON_OBJ		= 1;
		var MSG_PLAIN_TEXT		= 2;
  
//====================================================================
//====================================================================
  var CMD_JSON_GP_GET_GPLIST			= "42";
  var CMD_JSON_GP_GET_GUESTS			= "43";
  var CMD_JSON_GP_GET_USERS_NO_GUESTS 	= "44";
  var CMD_JSON_GROUP_GET_USERS        	= "45";
  var CMD_JSON_GROUP_GET_ALL_USERS    	= "46";
  var CMD_JSON_GROUP_GET_LIST_WITH_RIGHTS = "47";
  var CMD_JSON_GROUP_ADD_NEW_GROUP		= "48";
  var CMD_JSON_GROUP_DEL_GROUP			= "49";
  var CMD_JSON_GROUP_EDIT_GROUP			= "50";
  var CMD_JSON_GROUP_SET_GROUP_RIGHTS	= "51";
  
  var CMD_JSON_USER_EDIT_DATA			= "52";
  var CMD_JSON_GROUP_MOVE_USERS_TO_GROUP = "53";
//====================================================================
//====================================================================

  var GP_GroupList		= "gp_list";
  var GP_UsersOfGroups	= "gp_users";
  var GP_GroupRights	= "gp_right";
  var GP_EmptyRightsSet = [0,0,0,0,0,0,0,0,0,0,  // 65 правила 
  						   0,0,0,0,0,0,0,0,0,0, 
						   0,0,0,0,0,0,0,0,0,0, 
						   0,0,0,0,0,0,0,0,0,0, 
						   0,0,0,0,0,0,0,0,0,0, 
						   0,0,0,0,0,0,0,0,0,0, 
						   0,0,0,0,0]; 
  
//====================================================================
//====================================================================

  var AjaxInProgress  			= false;
  
  var GET_withuser				= "withuser";
  var GET_regnewuser			= "regnewuser";
  
  var WEB_URL_TYPE_WWW			= 'www.';
  var WEB_URL_TYPE_HTTP			= 'http://';
  var WEB_URL_TYPE_FTP			= 'ftp://';
  var WEB_URL_TYPE_HTTPS		= 'https://';

//====================================================================
//====================================================================

 var ET_AddNewUserGroup	= "AddNewUserGroup";
 var ET_EditUserGour	= "EditUserGour";
 var ET_DelUserGroup	= "DelUserGroup";
 
 var ET_ChangeGroupRights = "ChangeGroupRights";
 
 var ET_AddUserToCurrentGroup = "AddUserToCurrentGroup";
 var ET_RemoveUserFromCurrentGroup = "RemoveUserFromCurrentGroup";
 var ET_AddAllUsersToCurrentGroup = "AddAllUsersToCurrentGroup";
 var ET_RemoveAllUsersFromCurrentGroup = "RemoveAllUsersFromCurrentGroup";
 
 var ET_DelUser = "DelUser";
 var ET_NewUser = "NewUser";
 var ET_EditUser = "ET_EditUser";
 
 var CurrentET = "";

 var keyCodes	= {
		// Alphabet
		a:65, b:66, c:67, d:68, e:69,
		f:70, g:71, h:72, i:73, j:74,
		k:75, l:76, m:77, n:78, o:79,
		p:80, q:81, r:82, s:83, t:84,
		u:85, v:86, w:87, x:88, y:89, z:90,

		// Numbers
		n0:48, n1:49, n2:50, n3:51, n4:52,
		n5:53, n6:54, n7:55, n8:56, n9:57,

		// Controls
		tab:  9, enter:13, shift:16, backspace:8,
		ctrl:17, alt  :18, esc  :27, space    :32,
		menu:93, pause:19, cmd  :91,
		insert  :45, home:36, pageup  :33,
		'delete':46, end :35, pagedown:34,

		// F*
		f1:112, f2:113, f3:114, f4 :115, f5 :116, f6 :117,
		f7:118, f8:119, f9:120, f10:121, f11:122, f12:123,

		// numpad
		np0: 96, np1: 97, np2: 98, np3: 99, np4:100,
		np5:101, np6:102, np7:103, np8:104, np9:105,
		npslash:11,npstar:106,nphyphen:109,npplus:107,npdot:110,

		// Lock
		capslock:20, numlock:144, scrolllock:145,
		
		// Symbols
		equals: 61, hyphen   :109, coma  :188, dot:190,
		gravis:192, backslash:220, sbopen:219, sbclose:221,
		slash :191, semicolon: 59, apostrophe : 222,

		// Arrows
		aleft:37, aup:  38, aright:39, adown:40
	};


function RGBToHex(color) {
 	if (color) {
	    if (color.substr(0, 1) === '#') {
	        return color;
	    };
		
	    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
	    
	    var red = parseInt(digits[2]);
	    var green = parseInt(digits[3]);
	    var blue = parseInt(digits[4]);
	    
	    var rgb = blue | (green << 8) | (red << 16);
	    
		return digits[1] + '#' + rgb.toString(16);
	} else {
		return false;
	};
 };

function IntToBool (Int){
	var flag = false;
	
	if (Int == "-1") {
		flag = true;
	} else 
	if (Int == "0") {
		flag = false;
	};
	
	return flag;
};

function isIE(){
  return '\v'=='v';
};

function isIE6(){
 	var gg = navigator['appVersion'];
	var ggg = gg.indexOf("MSIE");
 	var gggg = gg.slice(ggg + 5, ggg + 6);
	
	return gggg == "6";
};

function LessOfTwo(itm1, itm2){
	var u1, u2;
	
	if (parseInt(itm1) < parseInt(itm2)) {
		u1 = itm1;
		u2 = itm2;
	} else {
		u1 = itm2;
		u2 = itm1;
	};
	
	return {min:u1, more:u2};
};
  
function formatDate(formatDate, formatString){

  var yyyy = formatDate.getFullYear();
  var yy = yyyy.toString().substring(2);
  var m = formatDate.getMonth() + 1;
  var mm = m < 10 ? "0" + m : m;
  var d = formatDate.getDate();
  var dd = d < 10 ? "0" + d : d;

    var  h = formatDate.getHours();
    var  hh = h < 10 ? "0" + h : h;
    var  n = formatDate.getMinutes();
    var  nn = n < 10 ? "0" + n : n;
    var  s = formatDate.getSeconds();
    var  ss = s < 10 ? "0" + s : s;

    formatString = formatString.replace(/yyyy/i, yyyy);
    formatString = formatString.replace(/yy/i, yy);
    formatString = formatString.replace(/mm/i, mm);
    formatString = formatString.replace(/m/i, m);
    formatString = formatString.replace(/dd/i, dd);
    formatString = formatString.replace(/d/i, d);
    formatString = formatString.replace(/hh/i, hh);
    formatString = formatString.replace(/h/i, h);
    formatString = formatString.replace(/nn/i, nn);
    formatString = formatString.replace(/n/i, n);
    formatString = formatString.replace(/ss/i, ss);
    formatString = formatString.replace(/s/i, s);

    return formatString;  
};

Date.prototype.myFormat = function(format){
    return formatDate(this, format);
};
  
function cssSwitch(ClassName, Parameter, Value){
  var ss = document.styleSheets; 

  for (var i=0; i<ss.length; i++) { 
    var rules = ss[i].cssRules || ss[i].rules; 

    for (var j=0; j<rules.length; j++) { 
      if (rules[j].selectorText === ((ClassName.indexOf(".") != 0) ? ("." + ClassName) : ClassName)) { 
        rules[j].style[Parameter] = Value; 
		return true;
      }; 
    }; 
  };    
};
  
function DIV(x1, x2){
	var y1 = (x1 / x2).toString(); 
	var idx = y1.indexOf(".");
	return y1.slice(0, (idx != -1) ? idx : y1.length);
};
  
function CopyArray(arr){
	return arr.slice(0, arr.length);
};
  
function StringToArray(_msg, separator){
  var res =[];
  var idx = -1;
  
  if (_msg){
	  if (isIE() == false) {
	    res = _msg.split(separator);
	  } else {
	    do {
	      idx = _msg.indexOf(separator);
	      if (idx >= 0) {
	        res.push(_msg.slice(0, idx));
	        _msg = _msg.slice(idx + 1, _msg.length + 1);
	      };
	    } while (idx != -1);
	  };
	  
	  if (res[res.length - 1].length == 0) {res.pop()};
  };
  
  return res;
};

function GetSubstring(str, term){
	var idx = str.indexOf(term);
	return (idx != -1)? str.slice(0, idx) : str.slice(0, str.length + 1);
};

function GetSubstringFrom(str, term){
	var idx = str.indexOf(term);
	return (idx != -1)? str.slice(idx + 1, str.length + 1) : str.slice(0, str.length + 1);
};

function DelSubstring(str, term){
	var idx = str.indexOf(term);
	return (idx != -1)? str.slice(idx + 1, str.length + 1) : "";
};

function doGetCaretPosition (ctrl) {
	var CaretPos = 0;	// IE Support

	if (document.selection) {
		var Sel = document.selection.createRange ();

		ctrl.focus ();
		Sel.moveStart ('character', -ctrl.value.length);

		CaretPos = Sel.text.length;
	} else { // Firefox support
		if (ctrl.selectionStart || ctrl.selectionStart == '0'){
			CaretPos = ctrl.selectionStart;
		};
	};
	
	return (CaretPos);
};

function isArray(obj) {
    return obj.constructor == Array;
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

function isValidFIO(fio){
	var pattern = new RegExp(/^([\x27а-яА-Яa-zA-ZїЇіІєЄ]{2,}|[\x27а-яА-Яa-zA-ZїЇіІєЄ]{2,}\-[\x27а-яА-Яa-zA-ZїЇіІєЄ]{2,})\040[\x27а-яА-Яa-zA-ZїЇіІєЄ]{2,}|[\x27а-яА-Яa-zA-ZїЇіІєЄ]{2,}\040[\x27а-яА-Яa-zA-ZїЇіІєЄ]{2,}$/);
	return pattern.test(fio);
};

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
};

function isValidIpAddress(IPvalue) {
	var result		= true;
	var ipPattern	= /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
	var ipArray		= IPvalue.match(ipPattern);
	var thisSegment	= 0;
	
	if (IPvalue == "0.0.0.0") {
		result = false;
	} else 
	if (IPvalue == "255.255.255.255") {
		result = false;
	};

	if (ipArray == null) {
		result = false;
	} else {
		for (i = 0; i < 4; i++) {
			thisSegment = ipArray[i];
			
			if (thisSegment > 255) {
				result = false;
				i = 4;
			};
			
			if ((i == 0) && (thisSegment > 255)) {
				result = false;
				i = 4;
			};
		};
	};

	return result;	
};

function isHasNoRussianSimbol(sText) {
    var pattern = new RegExp(/[a-zA-Z0-9]/i);
    return pattern.test(sText);//(pattern.test(sText) || (sText.search(" ") == -1));
};

function isURL(_url){
	var u = /(((http|https|ftp|ftps)(:\/\/)?|(:\/\/)(www\.)?|(www\.))[a-zа-я0-9-]+\.[a-zа-я0-9-]{2,6})/gi;
	
	return u.test(_url);
};

function trim( str, charlist ){
  charlist = !charlist ? ' \s\xA0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\$1');
  var re = new RegExp('^[' + charlist + ']+|[' + charlist + ']+$', 'g');
  return str.replace(re, '');
};

function ConvertByType(Date, Field){
 	switch (Field[0]){
		case "i":
			return parseInt(Date);
		break;
		
		case "s":
			return (Date + "");
		break;
		
		case "b":
			return ((typeof Date == "string") ? ((Date == "true") ? true : false) : ((typeof Date == "boolean") ? Date : false));
		break;
		
		case "d":
			return Date;
		break;
	};
};

function GetUserOS(){
	var os = "";
	var appV = navigator.appVersion;
	var oscpu = navigator.oscpu;
	
	if (isIE()){
		os = appV.split(";")[2];
	} else {
		if (oscpu != null || oscpu != undefined) {
			os = oscpu;
		} else os = appV.slice(appV.indexOf("(") + 1, ((appV.indexOf(";") != -1) ? appV.indexOf(";") : appV.indexOf(")")) );
	};
	
	return navigator.platform + " " + os;
};

function GetUserLanguage(){
	return  ((navigator.language != undefined) ? navigator.language : "") + 
			((navigator.systemLanguage != undefined) ? navigator.systemLanguage : "");
};

function GetUserRefLink(){
	return document.referrer;
};

function GetUserAgent(){
	return navigator.userAgent;
};

function GetUserBrouser(){
	var brouser = "";
	
	if (isIE()){
		brouser = "IE";
	} else 
	if (navigator.appName == "Opera"){
		brouser = "Opera"
	} else 
	if (navigator.vendor == "Apple Computer, Inc."){
		brouser = "Safari"
	} else
	if (navigator.vendor == "Google Inc."){
		brouser = "Chrome"
	} else 
	if (navigator.oscpu){
		brouser = "FireFox";
	} else {
		brouser = "Other Brouser";
	};
	
	return brouser;	
};

function pos(FindStr, Src){
	return Src.indexOf(FindStr);
};

function copy(Src, From, Count){
	return Src.slice(From, From + Count);
};

function ReplaseURLs(_source, BreakSymbol){
	var lnk			= "";
	var lnkOriginal	= "";
	var src			= "";
	var res			= "";
	var http		= 0;
	var currentpos	= 0;

	src  = _source.toLowerCase();
	lnk  = '';
	res  = '';
	http = 0;
	currentpos = 0;
	
	if (BreakSymbol == undefined) {BreakSymbol = " "};
	
	while ( http != -1 ) {
		//http = posex(BreakSymbol, src, currentpos);
		http = src.indexOf(BreakSymbol, currentpos);
		
		if ((http - currentpos) >= 8) {
			lnk = copy(src, currentpos, http - currentpos);
			lnkOriginal = copy(_source, currentpos, http - currentpos);
			
			if (pos(WEB_URL_TYPE_WWW, lnk)  == 0) {lnk =' <a href="http://' + lnkOriginal + '" target="_blank">' + lnkOriginal + '</a> '} else
			 if (pos(WEB_URL_TYPE_HTTP, lnk) == 0) {lnk =' <a href="' + lnkOriginal + '" target="_blank">' + lnkOriginal + '</a> '} else
			  if (pos(WEB_URL_TYPE_FTP, lnk)  == 0) {lnk =' <a href="' + lnkOriginal + '" target="_blank">' + lnkOriginal + '</a> '} else
			   if (pos(WEB_URL_TYPE_HTTPS, lnk)== 0) {lnk =' <a href="' + lnkOriginal + '" target="_blank">' + lnkOriginal + '</a> '};
			
			res = res + lnk + ' ';
			currentpos = http + 1;
		} else
		if (http != -1 ) {
			lnk = copy(_source, currentpos, http - currentpos);
			res = res + lnk + ' ';
			currentpos = http + 1;
		} else
		if ((http == -1) && ((src.length - currentpos) >= 8)) {
			lnk = copy(src, currentpos, src.length - currentpos + 1);
			lnkOriginal = copy(_source, currentpos, src.length - currentpos + 1);
			
			if (pos(WEB_URL_TYPE_WWW, lnk)  == 0) {lnk =' <a href="http://' + lnkOriginal + '" target="_blank">' + lnkOriginal + '</a> '} else
			 if (pos(WEB_URL_TYPE_HTTP, lnk) == 0) {lnk =' <a href="' + lnkOriginal + '" target="_blank">' + lnkOriginal + '</a> '} else
			  if (pos(WEB_URL_TYPE_FTP, lnk)  == 0) {lnk =' <a href="' + lnkOriginal + '" target="_blank">' + lnkOriginal + '</a> '} else
			   if (pos(WEB_URL_TYPE_HTTPS, lnk)== 0) {lnk =' <a href="' + lnkOriginal + '" target="_blank">' + lnkOriginal + '</a> '};
			
			res = res + lnk;
			break;
		} else {
			lnk = copy(_source, currentpos, src.length - currentpos + 1);
			res = res + lnk;
			break;
		};
	};
	
	return res;
};

//====================================================================================================
//===========  Тут описаны различные объекты используемые в работе ===================================
//====================================================================================================

function ObjectStorage ( name, duration ) {
	var self;
    var name 			= name || '_objectStorage';
    var defaultDuration = 60000;
	
    this.instances = {};
	this.prototype = {
		// type == local || session
		_save: function ( type ) {
		    var stringified = JSON.stringify( this[ type ] ),
		        storage = window[ type + 'Storage' ];
		    if ( storage.getItem( this._name ) !== stringified ) {
		        storage.setItem( this._name, stringified );
		    }
		},
		
		_get: function ( type ) {
		    this[ type ] = JSON.parse( window[ type + 'Storage' ].getItem( this._name ) ) || {};
		},
		
		_init: function () {
		    var self = this;
		    self._get( 'local' );
		    self._get( 'session' );
		
		    ( function callee() {
		        self.timeoutId = setTimeout( function () {
		            self._save( 'local' );
		            callee();
		        }, self._duration );
		    })();
		
		    window.addEventListener( 'beforeunload', function () {
		        self._save( 'local' );
		        self._save( 'session' );
		    });
		},
		// на случай, если нужно удалить таймаут (clearTimeout( storage.timeoutId ))
		timeoutId: null,
		local: {},
		session: {}
	};
	
        
    // дабы не плодить кучу экземпляров, использующих один и тот же ключ хранилища, 
    // просто возвращаем единственный с заданным именем,
    // меняя только duration (если имеется)
    if ( this.instances[ name ] ) {
        self = this.instances[ name ];
        self.duration = duration || self.duration;
    } else {
        self = this;
        self._name = name;
        self.duration = duration || defaultDuration;
        self._init();
        this.instances[ name ] = self;
    }
    
    return self;
};

//==== Object - Web User Detail Information =============
function OWEBUserInfo(){
	this.Nick		= "";
	this.Name		= "";
	this.FName		= "";
	this.MName		= "";
	this.BirthDay	= "";
	this.Gender		= "";
	this.TelNum		= "";
	this.Company	= "";
	this.EMail		= "";
	this.OS			= "";
	this.Language	= "";
	this.RefLink	= "";
	this.Brouser	= "";
	this.Custom1	= "";
	this.Custom2	= "";
	this.Custom3	= "";
		
	this.FillSmallInfo	= function(Nick, EMail, OS, Language, RefLink, Brouser){
		this.Nick		= Nick;
		this.EMail 		= EMail;
		this.OS 		= OS;
		this.Language	= Language;
		this.RefLink 	= RefLink;
		this.Brouser 	= Brouser;
	};
	
	this.FillFullInfo	= function( Nick, FName, Name, MName, BirthDay, Gender, TelNum, 
									Company, EMail, OS, Language, RefLink, 
									Brouser, Custom1, Custom2, Custom3){
		this.Nick		= Nick;
		this.FName		= FName;
		this.Name 		= Name;
		this.MName		= MName;
		this.BirthDay	= BirthDay;
		this.Gender		= Gender;
		this.TelNum		= TelNum;
		this.Company	= Company;
		this.EMail 		= EMail;
		this.OS 		= OS;
		this.Language	= Language;
		this.RefLink 	= RefLink;
		this.Brouser 	= Brouser;
		this.Custom1  	= Custom1;
		this.Custom2  	= Custom2;
		this.Custom3 	= Custom3;
	};
	
	// ник, фамилия, имя, отчество, дата рождения (dd.mm.yyyy), пол, номер телефона, 
	// название компании, email, platform_os, language, referal_link, BrowserInfo, custom1, custom2, custom3
	// в конце должен быть #13
	
	this.GenerateMCUserInfo	= function(){
		return 	this.Nick + CR +
				this.FName + CR +
				this.Name + CR +
				this.MName + CR +
				this.BirthDay + CR +
				this.Gender + CR +
				this.TelNum + CR +
				this.Company + CR +
				this.EMail + CR +
				this.OS + CR +
				this.Language + CR +
				this.RefLink + CR +
				this.Brouser + CR +
				this.Custom1 + CR + 
				this.Custom2 + CR + 
				this.Custom3 + CR; 
	};
};

//===== Object - Parser of User GET Request Parameters And Collect Result ===========
function O_GET_RequestParameters(){
	var _this 			= this;
	var RequestString 	= "";
	var ReqComponents	= {};
	
	//?regnewuser&withuser=3
	
	this.SetRecivedGETRequest = function (req){
		if (typeof req === "string") {
			RequestString = req.slice(1);
			
			var _arr = RequestString.split("&");
			
			for (var i=0; i < _arr.length; i++){
				var _sub = _arr[i].split("=");
				
				if (_sub.length > 1) {
					ReqComponents[_sub[0]] = _sub[1];
				} else {
					ReqComponents[_sub[0]] = "";
				};
			};
			
			return true;
		} else {
			return false;
		};
	};

	this.GetParametr	= function(param){
		if (ReqComponents.hasOwnProperty(param)){
			return ReqComponents[param];
		} else {
			return null;
		};
	};
	
	this.HasParametr	= function(param){
		if (ReqComponents.hasOwnProperty(param)){
			return true;
		} else {
			return false;
		};
	};
	
	this.DivideAllParametersValues	= function(div){
		if (ReqComponents.length > 0){
			var param = null;
			
			for (param in ReqComponents){
				var _arr = ReqComponents[param].split(div);
				
				ReqComponents[param] = _arr;
			};
		};
	};
};

// ==== TMCUserList - универсальный список пользователей =========
function TMCUserList(){
	var _this = this;
	this.length = 0;
	
	// Функция для получения данных на сервере, если данные были получены по команде CMD - 
	// результат заносится в массив, при формировании масива используется разделитель CR
	this.GetInfoFromServer	= function (req){
		var res;
		var ans = GetSubstring(req, CR);

		if (ans.length == req.length){
			ans = undefined;
		};
		
	    $.ajax({
			type	: "POST",
			timeout	: 30000,
			data	: req, 
			async	: false,  
			
			success	: function(html){
				var msg = html;
				
				var WEB_CR_IDX	= msg.indexOf(CR);
				if (WEB_CR_IDX == -1) WEB_CR_IDX = msg.length;
				
				var request 	= msg.slice(0, WEB_CR_IDX);
				var _msg 		= msg.slice(WEB_CR_IDX + 1, msg.length + 1);  
				
				if ((ans != undefined) && (request == ans)) {
					_msg = _msg.split(/[\r]/);
					
					res = _msg;
				} else 
				if (ans == undefined) { 
					res = html;
				} else res = "Unknown";
			}
		});
		
		return res;
	};
	
	// Принудительно запрашивается информация о пользователе на сервере
	this.GetInfoForUserFromServer	= function (Uin, SessionID){
		var flag = false;
		
		if (SessionID != undefined) {
			var res = "";

			res = _this.GetInfoFromServer(CMD_COMMAND_GETUSERSMALLINFO + CR + SessionID + CR + Uin);
			
			if (res != "Unknown") {
				_this.AddUserEx(Uin, res[0], res[1], res[2], res[3]);
				
				flag = true;
			};
			
			return flag;
		} else return flag;
	};
	
	// Добавление пользователя, старый метод, в веб-клиенте не используется
	this.AddUser			= function (info){
		var uin	 = "";
		var name = "";
		uin  = GetSubstring(info, ":");

		if ((uin.length > 0) && (_this.List.hasOwnProperty(uin) == false)) {
			name 	 = info.slice(info.indexOf(":") + 2, info.length + 1);
			_this.List[uin] = {
				"Name" 			: name,
				"Foto" 			: "",
				"Gender" 		: "images/foto/alien.png",
				"Active" 		: false,
				"CheckedItem" 	: false
			};
			
			_this.length++;
			_this.navList.push(uin);
		};
		
	};
	
	// Удаление пользователя
	this.DelUser			= function(uin){
		if (_this.List.hasOwnProperty(uin)){
			delete _this.List[uin];
//			_this.navList.splice(navIdx, 1);
			
			_this.length --;
		};
	};
	
	// Удаление  
	this.ClearEmptyUins		= function(){
		for (var i = 0; i < _this.navList.length; i++){
			if (_this.List.hasOwnProperty(_this.navList[i]) == false) {
				_this.navList.splice(i, 1);
				i --;
			};
		};
	};
	
	this.FilterUsers		= function(filterQuery){
		if ((_this.navList.length != navListBackup.length) && (navListBackup.length != 0)) {
			_this.navList = navListBackup.slice(0, navListBackup.length);
		} else {
			navListBackup = _this.navList.slice(0, _this.navList.length);;
		};
		
		for (var i = 0; i < _this.navList.length; i++){
			if (_this.toPlainString(_this.List[_this.navList[i]]).toLowerCase().indexOf(filterQuery.toLowerCase()) == -1) {
				_this.navList.splice(i, 1);
				i --;
			};
		};
	};
	
	this.AddUserEx			= function (uin, name, foto, sex, active){
		if ((uin.length > 0) && (_this.List.hasOwnProperty(uin) == false) && (name.length > 0)) {
			var GenderFoto = "";
			
			if (sex == "1") {
				GenderFoto = "images/foto/male.png";
			} else
			if (sex == "2") {
				GenderFoto = "images/foto/female.png";
			} else {
				GenderFoto = "images/foto/alien.png";
			};
			
			_this.List[uin] = {
				"Name" 			: name,
				"Foto" 			: foto,
				"Gender" 		: GenderFoto,
				"Active" 		: active,
				"CheckedItem" 	: false
			};
		
			_this.length++;
			_this.navList.push(uin);
		};
	};

	this.GetUserFotoByUin 	= function(Uin, SessionID){
		if (_this.List.hasOwnProperty(Uin) == true) {
			var foto = _this.List[Uin].Foto; 
			
			return (foto == "") ? _this.GetUserGenderFotoByUIN(Uin) : foto;
		} else {
			var flag = _this.GetInfoForUserFromServer(Uin, SessionID);
			var foto = (flag == true)? _this.GetUserFotoByUin(Uin) : "";  
			
			return (foto == "") ? _this.GetUserGenderFotoByUIN(Uin) : foto;
		};
	};

	this.GetUserNameByUin	= function (Uin, SessionID){
		if (_this.List.hasOwnProperty(Uin) == true) {
			return _this.List[Uin].Name;
		} else {
			var flag = _this.GetInfoForUserFromServer(Uin, SessionID); 
			return (flag == true)? _this.GetUserNameByUin(Uin) : "";
		};
	};

	this.GetUserParamByUin	= function (Uin, Param, SessionID){
		if (_this.List.hasOwnProperty(Uin) == true) {
			return _this.List[Uin][Param];
		} else {
			var flag = _this.GetInfoForUserFromServer(Uin, Param, SessionID); 
			return (flag == true)? _this.GetUserParamByUin(Uin, Param) : "";
		};
	};
	
	this.GetUserUinByName	= function (Name){
		return "noname";
	};
	
	this.GetUserGenderFotoByUIN	= function (Uin, SessionID){
		if (_this.List.hasOwnProperty(Uin) == true) {
			return _this.List[Uin].Gender;
		} else {
			var flag = _this.GetInfoForUserFromServer(Uin, SessionID);
			 
			return (flag == true)? _this.GetUserGenderFotoByUIN(Uin) : "images/foto/alien.png";
		};
	};
	
	this.UinIsOnline		= function(Uin, SessionID){
		if (_this.List.hasOwnProperty(Uin) == true) {
			return _this.List[Uin].Active;
		} else {
			var flag = _this.GetInfoForUserFromServer(Uin, SessionID); 
			return (flag == true)? _this.UinIsOnline(Uin) : false;
		};
	};
	
	this.UserIsChecked		= function(Uin){
		if (_this.List.hasOwnProperty(Uin) == true) {
			return _this.List[Uin].CheckedItem;
		} else {
			return false;
		};
	};
	
	this.SetUserChecked		= function(Uin){
		if (_this.List.hasOwnProperty(Uin) == true) {
			_this.List[Uin].CheckedItem = true;
			
			return true;
		} else {
			return false;
		};
	};
	
	this.SetCheckedAllUsers	= function(){
		var i;
		
		for (i in _this.List){
			_this.List[i].CheckedItem = true;
		};
	};
	
	this.RemoveCheckedFromUsers	= function(){
		var i;
		
		for (i in _this.List){
			_this.List[i].CheckedItem = false;
		};
	};
	
	this.InvertUserCheck		= function(Uin){
		if (_this.List.hasOwnProperty(Uin) == true) {
			_this.List[Uin].CheckedItem = !_this.List[Uin].CheckedItem;
			
			return true;
		} else {
			return false;
		};
	};
	
	this.InvertAllUsersCheck	= function(){
		var i;
		
		for (i in _this.List){
			_this.List[i].CheckedItem = !_this.List[i].CheckedItem;
		};
	};
	
	this.SetUinOnlineSate		= function(Uin, State){
		if (_this.List.hasOwnProperty(Uin) == true) {
			 _this.List[Uin].Active = State;
			return true;
		} else {
			return false;
		};
	};
	
	this.GetUserUinFromNavList	= function(Idx){
		var res = -1;
		
		if ((_this.navList.length >= Idx) && (Idx >= 0)) {
			res = _this.navList[Idx];
			
			if (_this.List.hasOwnProperty(res) == false){
				res = -1;
			};
		};
		
		return res;
	};

	this.JSONAddUserList		= function(JSONUList){
		_this.List = JSON.parse(JSONUList);
		
		_this.length = 0;
		_this.navList = [];
		
		for (var i in _this.List){
			_this.length++;
			_this.navList.push(i);
		};
	};
	
	this.SortByParam			= function(Param, desc){
		var arr = [];
		var ObjectForSearch	= [];
		_this.navList = [];
				
		for (var i in _this.List){
			var name = (_this.List[i][Param] == '') ? ' ': _this.List[i][Param];
			
			arr.push(name);

			if (!ObjectForSearch[name]) {ObjectForSearch[name] = []};
			
			ObjectForSearch[name].push(_this.List[i].uin);
		};

		arr.sort(function(a,b){
			if ((!parseInt(a)) || (!parseInt(b))){
				a = a.toString().toLowerCase();
				b = b.toString().toLowerCase();
			} else {
				a = parseInt(a);
				b = parseInt(b);
			};
			
            return (a < b) ? -1 : (a > b) ? 1 : 0;
		});
		
		if (desc){
			for (i = arr.length - 1; i >= 0; i--){
				_this.navList.push(ObjectForSearch[arr[i]].pop());
			};
		} else {
			for (i = 0; i < arr.length; i++){
				_this.navList.push(ObjectForSearch[arr[i]].shift());
			};
		};
	};
	
	this.JSONAddUserInfo		= function(JSONUserInfo){
		var UserInfo = JSON.parse(JSONUserInfo);
		
		if (_this.List.hasOwnProperty(UserInfo.uin)) {
			_this.List[UserInfo.uin] = UserInfo;
		} else {
			_this.List[UserInfo.uin] = UserInfo;
			
			_this.length++;
			_this.navList.push(UserInfo.uin);
		};
		
		return UserInfo;
	};
	
	this.List 				= {};
	this.navList			= [];
	var navListBackup		= [];
	
	this.toPlainString		= function (obj){
		var str = "";
		
		for (var i in obj){
			str += obj[i].toString() + " ";
		};
		
		return str;
	};
};

// ===== OMSGOfDays - объект содержащий в себе весь текст открытых дней системного лога ===
function OMSGOfDays(){
	var Limit 	= 12;
	var Length 	= 0;
	
	this.GetLimit		= function(){
		return Limit;	
	};
	
	this.GetLength		= function(){
		return Length;	
	};
	
	this.AddDay			= function(iDayIDX, sDayText, sFilter, isActive){
		if (Length < Limit) {
			Length++;
	
			this.AllDays[iDayIDX] = {
				"sDayText"	: sDayText,
				"isActive"	: isActive,
				"sFilter"	: sFilter,
				"isInvert"	: false
			};
			
			return true;
		} else {
			return false;
		};
	};
	
	this.DelDay			= function(iDayIDX){
		if (this.AllDays.hasOwnProperty(iDayIDX) == true) {
			delete this.AllDays[iDayIDX];
			
			Length--;
			
			return true;
		} else {
			return false;
		};
	};
	
	this.GetDayText		= function(iDayIDX){
		if (this.AllDays.hasOwnProperty(iDayIDX) == true) {
			return this.AllDays[iDayIDX].sDayText;
		} else {
			return [];
		};
	};
	
	this.GetDayInvetr	= function(iDayIDX){
		if (this.AllDays.hasOwnProperty(iDayIDX) == true) {
			return this.AllDays[iDayIDX].isInvert;
		} else {
			return undefined;
		};
	};
	
	this.SetDayInvert	= function(iDayIDX, InvertStatus){
		if (this.AllDays.hasOwnProperty(iDayIDX) == true) {
			 this.AllDays[iDayIDX].isInvert = InvertStatus;
			return true;
		} else {
			return false;
		};
	};
	
	this.GetDayFilter	= function(iDayIDX){
		if (this.AllDays.hasOwnProperty(iDayIDX) == true) {
			return this.AllDays[iDayIDX].sFilter;
		} else {
			return undefined;
		};
	};
	
	this.SetDayFilter	= function(iDayIDX, new_sFilter){
		if (this.AllDays.hasOwnProperty(iDayIDX) == true) {
			 this.AllDays[iDayIDX].sFilter = new_sFilter;
			return true;
		} else {
			return false;
		};
	};
	
	this.GetDayActive	= function(iDayIDX){
		if (this.AllDays.hasOwnProperty(iDayIDX) == true) {
			return this.AllDays[iDayIDX].isActive;
		} else {
			return undefined;
		};
	};
	
	this.SetDayActive	= function(iDayIDX, State){
		if (this.AllDays.hasOwnProperty(iDayIDX) == true) {
			this.AllDays[iDayIDX].isActive = State;
			return true;
		} else {
			return false;
		};
	};
	
	this.ClearDays		= function(){
		var day = "";
		
		for (day in this.AllDays){
			delete this.AllDays[day];
		};
	};
	
	this.AllDays 		= {};
};

//==== TMCRequest - объект реализующий связь с сервером ========
function TMCRequest(_url, RequestTimeout){
  this.NoErrMsg   	= false;
  this.asyncType	= true;
  this.ErrorCode	= 0;

  var idError   	= 0;
  var _Timeout  	= (RequestTimeout != undefined) ? RequestTimeout : 100000;
  var _this     	= this;
  var CallBackFunctionPull = {};

  //=====================================================================
  function SendData(_data){
    $.ajax({
      type		: "POST",
      url		: (_url == undefined || _url == "") ? "/index.html" : _url,
      timeout	: _Timeout,
      data		: _data + CR + LF,
	  async		: _this.asyncType,  
      success	: function(html){
		clearTimeout(idError);
		idError = 0;  
		
		setTimeout(function(){
			try {
				if (_this.RequestSuccess){
					_this.RequestSuccess(html);
					var res = true;
				};
			} catch (e){
				res = false;
			};  
			
			if (!res){
				alert("Error at reqest processing! (send data:" + _data + ")");
				_this.ErrorCode = 1;
			};
		}, 0);
		
		AjaxInProgress = false;
      },
      error: function(event, XMLHttpRequest, ajaxOptions, thrownError){
        clearTimeout(idError);
        idError = 0;  
        
        if (_this.NoErrMsg == false) {
          var err1 = ((XMLHttpRequest != undefined) || (XMLHttpRequest != "")) ? "\n" + XMLHttpRequest : "";
          var err2 = ((ajaxOptions != undefined) || (ajaxOptions != "")) ? "\n" + ajaxOptions : "";
          alert("At query time the error occurred:" + err1 + err2 + "\nRecommended reload the page");
        };
        
        try {
          _this.SendError();
        } catch (e) {};
        
        AjaxInProgress = false;
      }
    });
  };
  
  //=====================================================================
  function ErrorControl(timeout){
    return setTimeout(function(){
      if (_this.SendErrorCritical() != undefined) {
        _this.SendErrorCritical();
        AjaxInProgress = false;
      } 
    }, timeout);
  };

  //=====================================================================
  this.SendDataToServer 	= function(_data){
  	switch (typeof _data){
		case "string":
		    var idSendDataToServer = setInterval(function(){
				if (AjaxInProgress == false) {
					AjaxInProgress = true;
			
					idError = ErrorControl(_Timeout + 60000); // RequestTimeout + 1 min

					SendData(_data);
					
					if (_this.ExtentedCallBackFunctionAtSandData){
						_this.ExtentedCallBackFunctionAtSandData.apply();
					};
				
					clearInterval(idSendDataToServer);
				}
		    }, 107);
		break;
		
		case "object":
		break;
		
		case "function":
		break;
	}
  };

  //=====================================================================
  this.RequestSuccess 		= undefined;

  //=====================================================================
  this.SendError 			= null;  

  //=====================================================================
  this.SendErrorCritical 	= null;
  
  //=====================================================================
  this.SetCallBackFunctionByCMD	= function(CMD, callback){
  	if (!CallBackFunctionPull.hasOwnProperty(CMD)) {
		CallBackFunctionPull[CMD] = [];
	};

	CallBackFunctionPull[CMD].push(callback);
  };

  //=====================================================================
  this.DelCallBackFunctionByCMD	= function(CMD){
  	if (CallBackFunctionPull.hasOwnProperty(CMD)) {
		delete CallBackFunctionPull[CMD];
	};
  };

  //=====================================================================
  this.ClearAllCallBackFunctionByCMD	= function(){
  	for (var i in CallBackFunctionPull){
		delete CallBackFunctionPull[i];
	};
  };

  //=====================================================================
  this.RunCallBackFunctionByCMD	= function(CMD, MSG){
	while ((CallBackFunctionPull.hasOwnProperty(CMD)) ? (CallBackFunctionPull[CMD].length > 0) : false){
		try{
			CallBackFunctionPull[CMD][0].apply(MSG);
			var res = true;
		} catch(e) {
			res = false;
		};
		
		if (!res){
			alert("At CMD:''" + CMD + "'' run error occurred!");
			_this.ErrorCode = 2
		};
		
		CallBackFunctionPull[CMD].shift();
		
		if (CallBackFunctionPull[CMD].length == 0) {
			delete CallBackFunctionPull[CMD];
		};
	};
  };

  //=====================================================================
  this.ExtentedCallBackFunctionAtSandData = undefined;
}
