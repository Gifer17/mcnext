
  var CRLF = "\r\n";
  var BR   = "\v";
  var CR   = "\r";
  var LF   = "\n";

//==== TMCRequest - объект реализующий связь с сервером ========
function TMCRequest(_url, RequestTimeout){
  this.NoErrMsg   	  = false;
  this.asyncType	  = true;
  this.NoCMD		  = false;
  this.CallBackNoCMD  = null;
  this.LeaveCallBacks = false;
  
  var AjaxInProgress = false;

  var idError   	= 0;
  var _Timeout  	= (RequestTimeout != undefined) ? RequestTimeout : 200000;
  var _this     	= this;
  var CallBackFunctionPull = {};

  if (console) console.err = console.error;

  //=====================================================================
  function SendData(_data){
    $.ajax({
      type		: "POST",
      url		: (_url == undefined || _url == "") ? "/index.html" : _url,
      timeout	: _Timeout,
      data		: _data + CR + LF,
	  async		: _this.asyncType,  
      success	:  function(html){
	  	var _html = html;
		
		clearTimeout(idError);
		idError = 0;  
		
		setTimeout(function(){
			try {
				if (_this.RequestSuccess){
					_this.RequestSuccess(_html);
				};
			} catch (e){
				if (console){
					console.err(JSON.stringify(e));
				};
			};  
		}, 0);
		
		AjaxInProgress = false;
      },
      error: function(event, XMLHttpRequest, ajaxOptions, thrownError){
        clearTimeout(idError);
        idError = 0;

        _this.SendError(XMLHttpRequest);

        if (console) console.warn("At query time the error occurred:" + XMLHttpRequest);

        AjaxInProgress = false;
      }
    });
  };
  
  //=====================================================================
    /**
     * @return {number}
     */
  function ErrorControl(timeout){
    return setTimeout(function(){
      if (_this.SendErrorCritical() != undefined) {
        _this.SendErrorCritical();
        AjaxInProgress = false;
      } 
    }, timeout);
  };

    //=====================================================================

    this.ImmediatelySendToServer = function(_data, callback){
        $.ajax({
            type		: "POST",
            url		    : (_url == undefined || _url == "") ? "/index.html" : _url,
            timeout	    : _Timeout,
            data		: _data + CR + LF,
            async		: _this.asyncType,
            success	    :  function(html){
                if (callback) callback(html)
            },
            error       : function(){
                console.error('Error occurred at Immediately sending!');
            }
        });
    };

    //=====================================================================
    //noinspection FunctionWithInconsistentReturnsJS
    /**
     * @return {number}
     */
    this.SendDataToServer 	= function(_data){
  	var _sendData = '';

	if ((!_data) || (_data.length === 0)) {
		if (console) console.warn('SendDataToServer: _data is empty or undefined');

		return 1;
	};

	switch (typeof _data){
		case "string":
			_sendData = _data;
		break;

		case "object":
			var ___data = $.extend({
				CMD : '',
				Data : '',
				OnReceive : undefined,
				Terminator : '\r',
                AfterSend : undefined
			}, _data || {});

			if (___data.Data === ''){
				console.error('SendDataToServer: [_data : Object] field "Data" is empty or undefined');

				return 2;
			};

			if (typeof(___data.Data) === "object"){
			    ___data.Data = JSON.stringify(___data.Data);
			};

			_sendData = ((___data.CMD !== '') ? (___data.CMD + ___data.Terminator) : '') + ___data.Data;

			if (___data.CMD != ''){
				if (___data.OnReceive){
					_this.SetCallBackFunctionByCMD(___data.CMD, ___data.OnReceive);
				};
			};
		break;

		case "function":
		break;
	};

    var idSendDataToServer = setInterval(function(){
		if (AjaxInProgress === false) {
			AjaxInProgress = true;

			idError = ErrorControl(_Timeout + 60000); // RequestTimeout + 1 min

			SendData(_sendData);

			if (_this.ExtentedCallBackFunctionAtSandData){
				_this.ExtentedCallBackFunctionAtSandData.apply();
			};

			clearInterval(idSendDataToServer);
		}
    }, 107);
  };

  //=====================================================================
  this.RequestSuccess 		= function(msg){
	var WEB_CR_IDX = msg.indexOf(CR);
	
	if (WEB_CR_IDX == -1) WEB_CR_IDX = msg.length;
	
	var request = msg.slice(0, WEB_CR_IDX);
	var _msg    = msg.slice(WEB_CR_IDX + 1, msg.length + 1);  

	if (_this.NoCMD) {
		_this.CallBackNoCMD.apply(msg);
	} else {
		_this.RunCallBackFunctionByCMD(request, _msg);
	};
  };

  //=====================================================================
  this.SendError 			= function(err){
      CallBackFunctionPull = {};

      clearTimeout(idError);

      if (_this.OnError) _this.OnError(err);
  };

  //=====================================================================
  this.OnError              = undefined;

  //=====================================================================
  this.SendErrorCritical 	= function(){
      if (console) console.err("AHTUNG! Reload page.");
      CallBackFunctionPull = {};
  };

    //=====================================================================
    this.SetCallBackFunctionByCMD	= function(CMD, callback){
        if (!CallBackFunctionPull.hasOwnProperty(CMD)) {
            CallBackFunctionPull[CMD] = [];
        };

        CallBackFunctionPull[CMD].push(callback);
    };

    //=====================================================================
    this.SetCallBackFunctionByCMDOnlyOne = function(CMD, callback){
        CallBackFunctionPull[CMD]    = [];
        CallBackFunctionPull[CMD][0] = callback;
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
	  var _next = (CallBackFunctionPull.hasOwnProperty(CMD)) ? (CallBackFunctionPull[CMD].length > 0) : false;
      var res = false;

      if (console && !_next) console.warn("CMD: \"" + CMD + "\" not have request func");

      while (_next){
          try{
              CallBackFunctionPull[CMD][0].apply(MSG);

              res = true;
		  } catch(e) {
              res = false;

              _this.ErrorCode = 2;

			  if (console){
				  console.err("Error at CMD: " + CMD);
				  console.err(e);
			  }
		  };
		
		if (!_this.LeaveCallBacks){
            CallBackFunctionPull[CMD].shift();

            if (CallBackFunctionPull[CMD].length == 0) {
                delete CallBackFunctionPull[CMD];
            };

            _next = (CallBackFunctionPull.hasOwnProperty(CMD)) ? (CallBackFunctionPull[CMD].length > 0) : false;
        } else {
            _next = false;
        }
	};
  };

  //=====================================================================
  this.ExtentedCallBackFunctionAtSandData = undefined;
}
 