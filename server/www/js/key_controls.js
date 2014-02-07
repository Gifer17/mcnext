//=====================================================================================
//========== НАЗНАЧЕНИЕ СОБЫТИЙ НА НАЖАТИЕ КЛАВИШ =====================================
//=====================================================================================
 
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
    aleft:37, aup:  38, aright:39, adown:40,

    PrintSymbols : [32, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65,
                    66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76,
                    77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87,
                    88, 89, 90, 96, 97, 98, 99, 100,101,102,103,104,
                    105,106,107,109,110,111,186,187,188,189,190,191,
                    192,219,220,221,222],

    EditSymbols  : [8,  32, 46],

    Digits		 : [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96,
                    97, 98, 99, 100,101,102,103,104,105],

    ControlFunc	 : [33, 34, 35, 36, 37, 38, 39, 40, 112,
                    113,114,115,116,117,118,119,120,
                    121,122,123],

    ControlsKeys : [36, 33, 35, 34, 37, 38, 39, 40],

    PrintAndEdit : function(){
        return this.PrintSymbols.concat(this.EditSymbols);
    }
};

var KeyControlMnrg		= function(_eventList){
	 var _this = this;

	 this.LockAllKeyEvents	= false;
	 this.SkipOneKeydown	= -1;

	 AddKeysListener = function (setOption, _event_name){// МЕНЕДЖЕР КЛАВИАТУРНЫХ СОБЫТИЙ
	 	var DataSet = $.extend({
			KeyEvents 		: {},
            CommonCallBack  : undefined,
			UnBindPrevKeys 	: true,
			BindTarget 		: $(document)
		}, setOption || {});

        if (DataSet.UnBindPrevKeys && DataSet.BindTarget) DataSet.BindTarget.off("keydown.KeyControlMnrg_" + _event_name);

		$(DataSet.BindTarget).on("keydown.KeyControlMnrg_" + _event_name, function __eventOnKeyDown__ (eventObject){
            var res;

            switch (GetType(DataSet.KeyEvents)){
                case '[object Array]':
                    if (DataSet.KeyEvents.indexOf(eventObject.which) && DataSet.CommonCallBack){
                        if (_this.LockAllKeyEvents == false){
                            res = DataSet.CommonCallBack(eventObject);

                            if (res != true) {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }
                break;

                case '[object Object]':
                    if (DataSet.KeyEvents.hasOwnProperty(eventObject.which)){
                        if (_this.LockAllKeyEvents == false){
                            if (_this.SkipOneKeydown != eventObject.which) {
                                switch (typeof DataSet.KeyEvents[eventObject.which]){
                                    case "object":
                                        for (var i in DataSet.KeyEvents[eventObject.which]){
                                            var _event = $.extend({
                                                OneCall		: true,
                                                KeyEvent	: function(){ }
                                            }, DataSet.KeyEvents[eventObject.which][i] || {});

                                            res = _event.KeyEvent(eventObject);

                                            if (_event.OneCall){
                                                delete DataSet.KeyEvents[eventObject.which][i];
                                            }
                                        }
                                        break;

                                    case "function":
                                        res = DataSet.KeyEvents[eventObject.which](eventObject);
                                        break;
                                }

                                if (res != true) {
                                    return false;
                                }
                            } else {
                                _this.SkipOneKeydown = -1;
                            }
                        } else {
                            return false;
                        }
                    }
                break;
            }
		});
	 };

	/* Empty Task List
		"Global" : {
			KeyEvents : {
				13	: function(){},
				27	: function(){}
			}
		}
	*/

	 this.EventTaskFuncList	= _eventList || {};

	 this.AddNewEvent = function(_eventKeyCode, _eventsName, _eventHandle, _notApplyEventNow){
	 	if (_this.EventTaskFuncList.hasOwnProperty(_eventsName) === false){
			_this.EventTaskFuncList[_eventsName] = {
				KeyEvents : {}
			};
		}

		_this.EventTaskFuncList[_eventsName].KeyEvents[_eventKeyCode] = _eventHandle;

		if (!_notApplyEventNow) AddKeysListener(_this.EventTaskFuncList[_eventsName], _eventsName);
	 };

	 this.AddEventList = function(_options){
	 	var _SetOptions = $.extend({
			Name	: ((new Date()).getTime() + Math.random()*9999) + "_knumb",
			List	: {},
			Target	: $(document),
            CommonCallBack : undefined,
			UnBindPrevKeys : true
		}, _options || {});

		if (_this.EventTaskFuncList.hasOwnProperty(_SetOptions.Name)){
			_this.DeleteEventList(_SetOptions.Name, _SetOptions.Target);
		}

		_this.EventTaskFuncList[_SetOptions.Name] = {};
		_this.EventTaskFuncList[_SetOptions.Name].KeyEvents      = _SetOptions.List;
        _this.EventTaskFuncList[_SetOptions.Name].CommonCallBack = _SetOptions.CommonCallBack;
        _this.EventTaskFuncList[_SetOptions.Name].BindTarget     = _SetOptions.Target;
		_this.EventTaskFuncList[_SetOptions.Name].UnBindPrevKeys = _SetOptions.UnBindPrevKeys;

		AddKeysListener(_this.EventTaskFuncList[_SetOptions.Name], _SetOptions.Name);
	 };

	 this.Init = function(){
	 	for (var _event_ in _this.EventTaskFuncList){
			AddKeysListener(_this.EventTaskFuncList[_event_], _event_);
		}
	 };

	 this.DeleteEventList = function(_event_name, _target){
		if (_event_name) {
			var _elseTarget = _this.EventTaskFuncList[_event_name].BindTarget;
			var target = (_target) ? _target : ((_elseTarget) ? _elseTarget : $(document));

		 	target.off("keydown.KeyControlMnrg_" + _event_name);

			delete _this.EventTaskFuncList[_event_name];
		}
	 };

	 this.DeleteAllEvents = function(){
	 	for (var _ev in _this.EventTaskFuncList){
			_this.EventTaskFuncList[_ev].BindTarget.off("keydown.KeyControlMnrg_" + _ev);
			delete _this.EventTaskFuncList[_ev];
		}
	 };

	 this.Init();
 };
 
