//=====================================================================================
//========== НАЗНАЧЕНИЕ СОБЫТИЙ НА НАЖАТИЕ КЛАВИШ =====================================
//=====================================================================================
 var KeyControlMnrg		= function(_eventList){
	 var _this = this;
	 
	 this.LockAllKeyEvents	= false;
	 this.SkipOneKeydown	= -1;
	 
	 AddKeysListener = function (setOption, _event_name){// МЕНЕДЖЕР КЛАВИАТУРНЫХ СОБЫТИЙ
	 	var DataSet = $.extend({
			KeyEvents 		: {},
			UnBindPrevKeys 	: true,
			BindTarget 		: $(document)
		}, setOption || {});
		
		setOption = DataSet;
		
		if (DataSet.UnBindPrevKeys) 
			if (DataSet.BindTarget) DataSet.BindTarget.off("keydown.KeyControlMnrg_" + _event_name);
		
		$(DataSet.BindTarget).on("keydown.KeyControlMnrg_" + _event_name, function(eventObject){
			if (DataSet.KeyEvents.hasOwnProperty(eventObject.which)){
				if (_this.LockAllKeyEvents == false){
					if (_this.SkipOneKeydown != eventObject.which) {
						var res;
						
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
									};
								};
							break;
							
							case "function":
								res = DataSet.KeyEvents[eventObject.which](eventObject);
							break;
						};
						
						if (res != true) {
							return false;
						};
					} else {
						_this.SkipOneKeydown = -1;
					};
				} else {
					return false;
				};
			};
		});
	 };

	// Empty Task List
		/*
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
		};
		
		_this.EventTaskFuncList[_eventsName].KeyEvents[_eventKeyCode] = _eventHandle;
		
		if (!_notApplyEventNow) AddKeysListener(_this.EventTaskFuncList[_eventsName], _eventsName);
	 };
	 
	 this.AddEventList = function(_options){
	 	var _SetOptions = $.extend({
			Name	: Math.random(9999) + "_knumb",
			List	: {}, 
			Target	: $(document),
			UnBindPrevKeys : true
		}, _options || {});
		
		if (_this.EventTaskFuncList.hasOwnProperty(_SetOptions.Name)){
			_this.DeleteEventList(_SetOptions.Name, _SetOptions.Target);
		};
		
		_this.EventTaskFuncList[_SetOptions.Name] = {};
		_this.EventTaskFuncList[_SetOptions.Name].KeyEvents  = _SetOptions.List;
		_this.EventTaskFuncList[_SetOptions.Name].BindTarget = _SetOptions.Target;
		_this.EventTaskFuncList[_SetOptions.Name].UnBindPrevKeys = _SetOptions.UnBindPrevKeys;
		
		AddKeysListener(_this.EventTaskFuncList[_SetOptions.Name], _SetOptions.Name);
	 };
	 
	 this.Init = function(){
	 	for (var _event_ in _this.EventTaskFuncList){
			AddKeysListener(_this.EventTaskFuncList[_event_], _event_);
		};
	 };
	 
	 this.DeleteEventList = function(_event_name, _target){
		if (_event_name) {
			var _elseTarget = _this.EventTaskFuncList[_event_name].BindTarget;
			var target = (_target) ? _target : ((_elseTarget) ? _elseTarget : $(document));
			
		 	target.off("keydown.KeyControlMnrg_" + _event_name);
			
			delete _this.EventTaskFuncList[_event_name];
		};
	 };
	 
	 this.DeleteAllEvents = function(){
	 	for (var _ev in _this.EventTaskFuncList){
			_this.EventTaskFuncList[_ev].BindTarget.off("keydown.KeyControlMnrg_" + _ev);
			delete _this.EventTaskFuncList[_ev];
		};
	 };
	 
	 this.Init();
 };
 
