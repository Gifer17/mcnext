
  var AjaxInProgress  			= false;
  
  var GET_withuser			= "withuser";
  var GET_regnewuser		= "regnewuser";

/////////////////////////////////////////////////////////////////////////

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

function BoolToInt(b){
    return (b == true) ? true : "";
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
    return Object.prototype.toString.call( obj ) === '[object Array]';
}

function isString(obj) {
    return Object.prototype.toString.call( obj ) === '[object String]';
}

function isObject(obj) {
    return Object.prototype.toString.call( obj ) === '[object Object]';
}

function NoElasticScroll(e) {
  e.preventDefault();
}

  /**
   * @return {string}
   */
function GetType(obj){
    return Object.prototype.toString.call( obj );
}

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
			return (Date.toString() + "");
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

function addEvent(evnt, elem, func) {
      if (elem.addEventListener)  // W3C DOM
          elem.addEventListener(evnt,func,false);
      else if (elem.attachEvent) { // IE DOM
          elem.attachEvent("on"+evnt, func);
      }
      else { // No much to do
          elem[evnt] = func;
      }
};
// var ObjectStorage = function ObjectStorage( name, duration ) {
function MCObjectStorage( name, duration ) {
    var self = this;
    var ObjectStorage = self;
    var name = name || '_objectStorage';
    var defaultDuration = 60000;

    this.instances = {};

    this._save = function ( type ) {
        var stringified = JSON.stringify( this[ type ] ),

        storage = window[ type + 'Storage' ];

        if ( storage.getItem( this._name ) !== stringified ) {
            storage.setItem( this._name, stringified );
        };
    };

    this._get = function ( type ) {
        this[ type ] = JSON.parse( window[ type + 'Storage' ].getItem( this._name ) ) || {};
    };

    this._init = function () {
        var self = this;
        self._get( 'local' );
        self._get( 'session' );

        ( function callee() {
            self.timeoutId = setTimeout( function () {
                self._save( 'local' );
                callee();
            }, self._duration );
        })();

        addEvent('beforeunload', window, function () {
            self._save( 'local' );
            self._save( 'session' );
        });

        /*window.addEventListener( 'beforeunload', function () {
            self._save( 'local' );
            self._save( 'session' );
        });*/
    };
        // на случай, если нужно удалить таймаут (clearTimeout( storage.timeoutId ))
    this.timeoutId = null;
    this.local     = {};
    this.session   = {};

    // дабы не плодить кучу экземпляров, использующих один и тот же ключ хранилища,
    // просто возвращаем единственный с заданным именем,
    // меняя только duration (если имеется)
    if ( self.instances[ name ] ) {
        self.instances[ name ].duration = duration || self.duration;
    } else {
        self._name = name;
        self.duration = duration || defaultDuration;
        self._init();
        self.instances[ name ] = self;
    };

    return self.instances[ name ];
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
				
				ReqComponents[param] = null;
				ReqComponents[param] = _arr;
			}
		}
	};
};

  function showModal(text, size){
      if ( $('#modalWindow').length == 0) $("body").append('<div id="modalWindow" class="modalWindow"/>');

      $.mobile.loading( 'show', {
          text        : text || LMSG["4"],
          textVisible : true,
          theme       : "e",
          textonly    : false,
          html        : ""
      });

      if (size) {
          $('#modalWindow > h1').css("font-size", size + "pt")
      } else {
          $('#modalWindow > h1').css("font-size", "inherit")
      }
  };

  function hideModal(){
      $(".modalWindow").remove();

      $.mobile.loading( "hide" );
  };

  function isObjectEmpty(obj){
      var flag = true;

      if (obj && (typeof(obj) === 'object')){
          for (var i in obj){
              flag = false;
          };
      };

      return flag;
  };

  function StringToObj (_data, print){
      var res = {};

      if (typeof(_data) === 'object'){
          if (print) Service.PrintObjectItems(_data);

          res = _data;
      } else {
          try {
              var new_obj = JSON.parse(_data);

              if (print) Service.PrintObjectItems(new_obj);

              res = new_obj;
          } catch(e){
              console.log(_data);
          };
      };

      return res;
  };

  // ============================================================================
  // ============================================================================

  function TDialog (_target){
      var Self      = this;
      var Source    = _target;
      var __options;

      if (!_target){
          var div = $('<div/>', {
              "id"                 : "MyPopup",
              "class"              : "ui-content MyPopup",
              "data-role"          : "popup",
              "data-theme"         : "e",
              "data-overlay-theme" : "b",
              "data-close-btn"     : "none",
              "data-position-to"   : "window",
              "data-dialog-role"   : "",
              "data-dismissible"   : "false",
              "data-dialog-value"  : ""
          });

          $('body').append(div);

          Source = $("#MyPopup");
      };

      this.Roles = {
          Error   : 'error',
          Menu    : 'menu',
          Message : 'msg'
      };

      this.GetSource = Source;

      Source.popup();

      this.ShowDialog = function(_opt){
          var Options = $.extend({
              Role    : Self.Roles.Error,
              Variant : 0,
              Title   : "Message",
              FParams : [],
              Text    : "Unknown Dialog Role", // text (Menu title) || JSON (Error text)
              CloseBTN: true,
              MenuList: {
                  itemID : {
                      Desc    : "Текст кнопки",
                      OnClick : function(){
                      }
                  }
              },
              OnClose : undefined
          }, _opt || {});

          __options = Options;

          GenerateDialog(Options);

          Source.popup('open').on( "popupafterclose", function( event, ui ) {
              if (Options.OnClose){
                  Options.OnClose();
              }

              Source.off("popupafterclose");
          });
      };

      this.ClosePopup = function(onClose){
          if (onClose){
              onClose.apply(__options);
          }

          Source.popup("close");
      };

      var GenerateDialog = function(_opt){
          var Roles = Self.Roles;

          switch (_opt.Role){
              case Roles.Error:
                  var res = "";

                  res += '<div data-role="header" align="center"><h3>' + LMSG["13"] + "&nbsp;&nbsp;№" + _opt.Variant + '</h3></div>' +
                      '<div data-role="content" align="center"><p>' + ((_opt.Text[_opt.Variant]) ? _opt.Text[_opt.Variant].replace("%s", _opt.FParams.toString()) : _opt.Text.toString()) + '</p>' + // _opt.Text[_opt.Variant].replace("%s", _opt.FParams.toString())
                      ((_opt.CloseBTN) ? '<a href="#" data-role="button" data-rel="back" data-mini="true" >' + LMSG["12"] + '</a>' : '') + '</div>';

                  Source.html(res);
              break;

              case Roles.Menu:
                  var res  = "";
                  var btns = "";

                  for (var i in _opt.MenuList){
                      btns += '<a href="#" data-role="button" data-mini="true" id="popupMenuBTN-' + i + '">' + _opt.MenuList[i].Desc + '</a>';
                  };

                  res += '<div data-role="header" align="center"><h4>' + (_opt.Title || LMSG["11"]) + '</h4></div>' +
                         '<div data-role="content" align="center">' + btns + '</div>' +
                         '<div data-role="footer">' + ((_opt.CloseBTN) ? '<a href="#" id="closePopupMenu" data-rel="back" data-role="button" data-mini="true" data-theme="b">' + LMSG["12"] + '</a>' : '') + '</div>';

                  Source.html(res);

                  $("#closePopupMenu").button();

                  for (var i in _opt.MenuList){
                      if (_opt.MenuList[i].OnClick) (function(cl){
                          var _popbtn = $("#popupMenuBTN-" + i, Source);
                          var onClick = cl;

                          _popbtn.button().on('vclick', function(e) {
                              onClick.apply(_opt);

                              Self.ClosePopup();

                              e.preventDefault();
                              e.stopImmediatePropagation();
                          });
                      })(_opt.MenuList[i].OnClick)
                  }
              break;

              case Roles.Message:
                  var res = "";

                  res += '<div data-role="header" align="center"><h3>' + _opt.Title + '</h3></div>' +
                      '<div data-role="content" align="center"><p>' + _opt.Text.replace("%s", _opt.FParams.toString()) + '</p>' + // _opt.Text[_opt.Variant].replace("%s", _opt.FParams.toString())
                      ((_opt.CloseBTN) ? '<a href="#" data-role="button" data-rel="back" data-mini="true" >' + LMSG["12"] + '</a>' : '') + '</div>';

                  Source.html(res);
              break;
          };
      };
  };

  var noNotify = false;

  function CreateNotification(opt) {
      var notify = new Notification((opt.title) ? opt.title : "No title", $.extend({
          icon    : './img/75x75.png',
          tag     : "list",
          body    : "Empty"
      }, opt || {}));

      if (!noNotify){
          notify.onerror = function(){
              if (console) console.warn("permission state = default or denied");
              noNotify = true;
          };

          setTimeout(function(){
              notify.close();
          }, 10000);

          if (opt.click){
              notify.onclick = function() {
                  window.focus();

                  opt.click();

                  notify.close();
              }
          }

          if (notify.show) notify.show();
      }
  }

  /**
   * @return {boolean}
   */
  function CheckNotification(rrr){
      var res = false;

      if (window.webkitNotifications || window.Notification) {
          if ((window.webkitNotifications && window.webkitNotifications.checkPermission() == 0) || Notification.permission === "granted") { // 0 is PERMISSION_ALLOWED
              res = true;
              noNotify = false;
          } else {
              (window.Notification)
              ? Notification.requestPermission(function (permission) {

                  // Whatever the user answers, we make sure Chrome stores the information
                  if(!('permission' in Notification)) {
                      Notification.permission = permission;
                  }

                  // If the user is okay, let's create a notification
                  if (permission === "granted") {
                      var notify = nota(opt);
                  }
              })
              : window.webkitNotifications.requestPermission(function(ssss){
                  rrr = ssss == 'granted';
                  noNotify = !rrr;
              });
          }
      } else {
          console.warn("Notifications are not supported for this Browser/OS version yet.");
      }

      return res;
  }

  var mobileDetection = {
      Android:function () {
          return navigator.userAgent.match(/Android/i);
      },
      BlackBerry:function () {
          return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS:function () {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera:function () {
          return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows:function () {
          return navigator.userAgent.match(/IEMobile/i);
      },
      any:function () {
          return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows()) || false;
      }
  };
