(function($) {
    // Функция запрещает выделять мышкой текст в окне или наоборот разрешает
	// она очень классно подходит для создания кнопок в которых нельзя выделить текст
	if ($.browser.mozilla) {
        $.fn.disableTextSelect = function() {
            return this.each(function() {
                $(this).css({
                    'MozUserSelect' : 'none'
                });
            });
        };
        $.fn.enableTextSelect = function() {
            return this.each(function() {
                $(this).css({
                    'MozUserSelect' : ''
                });
            });
        };
    } else if ($.browser.msie) {
        $.fn.disableTextSelect = function() {
            return this.each(function() {
                $(this).bind('selectstart.disableTextSelect', function() {
                    return false;
                });
            });
        };
        $.fn.enableTextSelect = function() {
            return this.each(function() {
                $(this).unbind('selectstart.disableTextSelect');
            });
        };
    } else {
        $.fn.disableTextSelect = function(SubItem) {
            return this.each(function() {
		if (SubItem){
	                $(this).on('mousedown.disableTextSelect', SubItem, function() {
	                    if ($(this).hasClass("noDisableSelection") == false) return false;
	                });
					
			$(this)[0].disabledItems = SubItem; 
		} else {
	                $(this).on('mousedown.disableTextSelect', function() {
	                    if ($(this).hasClass("noDisableSelection") == false) return false;
	        	});
		};
            });
        };
        $.fn.enableTextSelect = function() {
            return this.each(function() {
			if ($(this)[0].disabledItems){
				$(this).off('mousedown.disableTextSelect', $(this)[0].disabledItems);
			} else {
				$(this).off('mousedown.disableTextSelect');
			};                
            });
        };
    };
//===========disableTextSelect / enableTextSelect==============
	
	$.fn.CheckField = function(){
		return this.each(function(){
			$(this).blur(function(){
				var _text = trim($(this).val());
				if (_text.length < 3){
					$(this).css("border","1px solid red").addClass("incorrect");
				} else {
					$(this).css("border","1px solid green").removeClass("incorrect");
				};
			});
		});
	};
	
	
	// с помощю этой функции перемещаем любой объкт jQuery в точную середину другого объекта
	// если в OuterObj передать объект заполняющий полностью окно - он окажеться в середине окна
	$.fn.TO_WINDOW_CENTER = function(OuterObj){
            return this.each(function() {
				var _this = $(this);
				var w_height = (OuterObj == undefined)? $(window).height() : OuterObj.height();
				var	w_width  = (OuterObj == undefined)? $(window).width() : OuterObj.width();
				var new_left = (w_width / 2) - (_this.width() / 2);
				var new_top  = (w_height / 2) - (_this.height() / 2);
				
				_this.css({
					left: new_left,
					top: new_top
				});
            });
	};//===========TO_WINDOW_CENTER==============
	
	// Тут делаем кнопочки живыми - они загараются, когда мышку подводиш и нажимаются. ВАУ! :)
	$.fn.RefreshBTNEvents = function(){
		 return this.each(function(){
			var _this 	 = $(this);

		 	_this.defl	= parseInt($(this).css("padding-left"));
			_this.deft	= parseInt($(this).css("padding-top"));

			_this.defh	= 0;
			_this.defw	= 0;

		 	function refParam(_this, self){
				var mH = $(_this).outerHeight(); //($(_this).height() >= $(self)[0].offsetHeight) ? $(_this).height() : $(self)[0].offsetHeight;
				var mW = $(_this).outerWidth(); //($(_this).width() >= $(self)[0].offsetWidth) ? $(_this).width() : $(self)[0].offsetWidth;
				  
				if (_this.defh < mH){
					_this.defh	= mH;
				}; 
				
				if (_this.defw < mW){
					_this.defw	= mW;
				};
			};
			
			refParam(_this, _this);
			
		 	$(_this)
				.mousedown (function(event){
					if ($(this).hasClass("disabledbtn") == false){
						refParam(_this, this);
						
						_this.focus();
						
						$(this)
							.removeClass("activebtn")
							.addClass("currentbtn");
						
						if (!$.browser.opera){
							$(this).css({
									"padding-left"	: (_this.defl + 2) + "px",
									"padding-top"	: (_this.deft + 1) + "px"
								});

							$(this).outerHeight(_this.defh + "px");
							$(this).outerWidth(_this.defw + "px");
						};
					};
				})
				.mouseup   (function(){
					if ($(this).hasClass("disabledbtn") == false){
						refParam(_this, this);
						
						$(this)
							.removeClass("currentbtn")
							.addClass("activebtn")
							.css({
								"padding-left"	: _this.defl + "px",
								"padding-top"	: _this.deft + "px"
							});
							
						$(this).outerHeight(_this.defh + "px");
						$(this).outerWidth(_this.defw + "px");
					};
				})
				.mouseout  (function(){
					if ($(this).hasClass("disabledbtn") == false){
						refParam(_this, this);
						
						$(this)
							.removeClass("activebtn")
							.removeClass("currentbtn")
							.css({
								"padding-left"	: _this.defl + "px",
								"padding-top"	: _this.deft + "px"
							});
							
						$(this).outerHeight(_this.defh);
						$(this).outerWidth(_this.defw);
					};
				})
				.mouseover (function(){
					if ($(this).hasClass("disabledbtn") == false) {
						$(this).addClass("activebtn");
					};
				});
		 });
	};//===========RefreshBTNEvents==============	
	
	// Функция предназначена для создания майчат-подобных чекбоксов и рабиобатанов 
	// в _type указывается TCheck или TRadio в зависимости от необходимости
	$.fn.MCCheckBtn =  function (_type){
		return this.each(function(){
	      var _this = $(this);
	      
		  if (_this.html() === '') {
		  	var _input = $('<input/>', {
				'class'	: ((_this.attr('_class')) ? _this.attr('_class') : ''),
				'id'	: ((_this.attr('_id')) ? _this.attr('_id') : _this.attr('name')),
				'type'	: ((_type === 'TRadio') ? 'radio' : 'checkbox'),
				'name'	: ((_this.attr('name')) ? _this.attr('name') : ''),
				'_param' : ((_this.attr('_param')) ? _this.attr('_param') : '')
			});
			
			//var _label = $('<label/>', {
			//	'for'	: ((_this.attr('name')) ? _this.attr('name') : ''),
			//	'html'	: ((_this.attr('msg') ? '<msg n="' + _this.attr('msg') + '"></msg>' : '')) +
			//			  ((_this.attr('caption') ? _this.attr('caption') : ''))
			//});
			
			var _label = '<label for="' + ((_this.attr('name')) ? _this.attr('name') : '') + '">' +  
							((_this.attr('msg') ? '<msg n="' + _this.attr('msg') + '"></msg>' : '')) +
							((_this.attr('caption') ? _this.attr('caption') : '')) + 
						 '</label>';
			
			_this.append(_input).append(_label);
		  };

	      _this
			.off('mouseover.mccheckbtn').off('mousedown.mccheckbtn').off('mouseout.mccheckbtn')
	        .on('mouseover.mccheckbtn', function(){
				if (_this.addClass(_type + "BtnOver").hasClass(_type + "BtnOn")) {
					_this.removeClass(_type + "BtnOn").addClass(_type + "BtnOnOver");
				};
	        })
	        .on('mousedown.mccheckbtn', function(){
	          if (_type == "TRadio") {
	            var _input = $("input", this);
	            var _name = _input.attr("name");
	          
	            $(this).parent().find("[name=" + _name + "]").each(function(){
	              $(this).parent().removeClass(_type + "BtnOn").removeClass(_type + "BtnOver");
	            });
	            
	            _this.addClass(_type + "BtnOnOver");
	              _input[0].checked = true;
	          } else {
	            _this.toggleClass(_type + "BtnOnOver");
	          };
	        })
	        .on('mouseout.mccheckbtn', function(){
				if (_this.removeClass(_type + "BtnOver").hasClass(_type + "BtnOnOver")) {
					if (_this.children()[0].checked == true) {
						_this.removeClass(_type + "BtnOnOver").addClass(_type + "BtnOn");
					}
					else {
						_this.removeClass(_type + "BtnOnOver");
					}
				}
				else {
					if (_this.children()[0].checked == true) {
						_this.addClass(_type + "BtnOn");
					};
				};
			});
		});
 	};//===========MCCheckBtn==============

	// три специальные функции для ручого выбора чекбатона и радиобатона
	$.fn.CheckTChekBtn = function(){
		return this.each(function(){
			var _this = $(this);
				
			_this.parent().addClass("TCheckBtnOn");
			_this[0].checked = true;
			
			_this.triggerHandler("change");
		});
	};//============CheckTChekBtn==========
	
	$.fn.ToggleTChekBtn = function(){
		return this.each(function(){
			var _this = $(this);
			var flag = (_this[0].checked) ? false : true;
			
			_this[0].checked = flag;
			
			if (flag){
				_this.parent().addClass("TCheckBtnOn");
			} else {
				_this.parent().removeClass("TCheckBtnOn").removeClass("TCheckBtnOnOver");
			};

			_this.triggerHandler("change");
		});
	};//============CheckTChekBtn==========
	
	$.fn.UnCheckTChekBtn = function(){
		return this.each(function(){
			var _this = $(this);
				
			_this.parent().removeClass("TCheckBtnOn").removeClass("TCheckBtnOnOver");
			_this[0].checked = false;

			_this.triggerHandler("change");
		});
	};//===========UnCheckTChekBtn=========
	
	$.fn.CheckTRadioBtn = function(){
		var _this = $(this);
			
		_this.parent().find("[name=" + _this[0].name + "]").each(function(){
			this.checked = false;
		});
		
		_this.parent().addClass("TRadioBtnOn");
		_this[0].checked = true;
	};//===========CheckTRadioBtn==========
 
 	// это специозная функция для чисто графических кнопок, 
	//в которох все состояния кнопок описывается картинками
	$.fn.GraphicsCustonBtn = function(){
		return this.each(function(){
			$(this)
			 	.mouseover(function(){
					var _this = $(this);
					var _name = _this.attr("id");
					_this.removeClass(_name + "_DOWN").addClass(_name + "_OVER");
				})	
				.mouseout(function(){
					var _this = $(this);
					var _name = _this.attr("id");
					_this.removeClass(_name + "_OVER").removeClass(_name + "_DOWN");
				})
				.mousedown(function(){
					var _this = $(this);
					var _name = _this.attr("id");
					_this.removeClass(_name + "_OVER").addClass(_name + "_DOWN");
				})
				.mouseup(function(){
					var _this = $(this);
					var _name = _this.attr("id");
					_this.removeClass(_name + "_DOWN").addClass(_name + "_OVER");
				});
		});
	};//===========GraphicsCustonBtn==============

	//эта функция должна ловить изменения элкмента, к которому ее применили
	//замена стандартному событию, которое срабатывает только при потере фокуса

	var PrintSymbols = [32,48,49,50,51,52,53,54,55,56,57,65,
						66,67,68,69,70,71,72,73,74,75,76,
						77,78,79,80,81,82,83,84,85,86,87,
						88,89,90,96,97,98,99,100,101,102,
						103,104,105,106,107,109,110,111,
						186,187,188,189,190,191,192,219,
						220,221,222];
	var EditSymbols  = [8,9,32,46];
	var Digits		 = [8,9,32,46,48,49,50,51,52,53,54,55,56,57,96,
						97,98,99,100,101,102,103,104,105];
	var ControlFunc	 = [33,34,35,36,37,38,39,40,112,
						113,114,115,116,117,118,119,120,
						121,122,123];
	var DigitsForIP	 = Digits.concat([]);
	var ControlsKeys = [36,33,35,34,37,38,39,40];
	var PrintAndEdit = PrintSymbols.concat(EditSymbols);
	
	$.fn.DigitsConstol = function(){
		var _this = $(this);
		
		return this.each(function(){
			_this.keydown(function FNDigitsControl(eventObject){
				var onlyDigits = _this.hasClass("OnlyDigits");
				
				if ($.inArray(eventObject.which, ControlFunc) != -1){
					return this;
				};
				
				if (onlyDigits){
					if ($.inArray(eventObject.which, Digits) != -1) {
						return this;
					} else {
						return false;
					};
				} else {
					if ($.inArray(eventObject.which, PrintAndEdit) != -1) {
						return this;
					};
				};
			});
		});
	};
		
	$.fn.OnChangeEx = function(callback, runAfter){
		function RunCallBack(){
			if (runAfter){
				var self = this;
				
				if (callback){
					setTimeout(function(){
						callback.apply(self, [eventObject]);
					}, 0);
				};
				
				return this;
			} else {
				if (callback){
					return callback.apply(self, [eventObject]);
				} else {
					return this;
				};								
			};
		};
		
		return this.each(function(){
			var _this = $(this);
			
			
			if ((_this.hasClass("TEdit")) || (_this.hasClass("TMemo"))){
				_this.keydown(function OnlyDigitsControl(eventObject){
					var onlyDigits = _this.hasClass("OnlyDigits");
					
					if ($.inArray(eventObject.which, ControlFunc) != -1){
						return this;
					};
					
					if (onlyDigits){
						if ($.inArray(eventObject.which, Digits) != -1) {
							return RunCallBack();
						} else {
							return false;
						};
					} else {
						if ($.inArray(eventObject.which, PrintAndEdit) != -1) {
							return RunCallBack();
						};
					};
				});
			} else
			if (_this.hasClass("TComboBox")){
				_this.change(function(){
					return callback.apply(this);
				});
				
				_this.keydown(function(eventObject){
					if ($.inArray(eventObject.which, ControlsKeys) != -1){
						return callback.apply(this);
					};
				});
			} else
			if (_this.parent().hasClass("TCheckBtn")){
				_this.click(function(){
					return callback.apply(this);
				});
			} else
			if (_this.parent().hasClass("TRadioBtn")){
				_this.click(function(){
					return callback.apply(this);
				});
			};
		});
	};//==== OnChangeEx ====================================================

	// ======== MessageBox управление ================
	$.MessageBox	= function (Options){
		var settings = $.extend({
			MBElement	: "#MessageBox",
			MBBlockLayer: "#MBBlockLayer",
			MBText		: "#MBText",
			MBRB		: "#MBRightBTN",
			MBLB		: "#MBLeftBTN",
			MBMB		: "#MBMiddleBTN",
			
			MBShowBL	: true,
			MBToCenter	: true,
			
			MBMsg		: "",
			MBLeftTXT	: "",
			MBMiddleTXT	: "",
			MBRightTXT	: "",
			
			MBLCallback	: function(){},
			MBRCallback	: function(){},
			MBMCallback : function(){}
		}, Options || {});
		
		var MainForm	= $(settings.MBElement);
		var BlockLayer	= $(settings.MBBlockLayer);
		var LeftBTN		= $(settings.MBLB);
		var RightBTN	= $(settings.MBRB);
		var MiddleBTN	= $(settings.MBMB);
		var ShowText	= $(settings.MBText);
		
		if (MainForm.length != 1){
			$("body").append(	'<div id="MBBlockLayer"></div>'+
								'<div id="MessageBox" class="TGroupBox rounded easyShadeInside doubleBorder"  left="200" top="200">'+
									'<div id="MBText"></div>'+
									'<div class="clr"></div>'+
									'<div align="center">'+
										'<div id="MBLeftBTN"   class="TButton Static"></div>'+
										'<div id="MBMiddleBTN" class="TButton Static"></div>'+
										'<div id="MBRightBTN"  class="TButton Static"></div>'+
									'</div>'+
								'</div>');
			
			MainForm	= $("#MessageBox");
			BlockLayer	= $("#MBBlockLayer");
			LeftBTN		= $("#MBLeftBTN");
			RightBTN	= $("#MBRightBTN");
			MiddleBTN	= $("#MBMiddleBTN");
			ShowText	= $("#MBText");
			
			$(".TButton").RefreshBTNEvents();
		};

		if (settings.MBShowBL) {
			BlockLayer.show();
		};

		if (settings.MBToCenter){
			MainForm.TO_WINDOW_CENTER(BlockLayer);
		};
		
		ShowText.html(settings.MBMsg);
		
		if (settings.MBLeftTXT != "") {
			LeftBTN
				.html(settings.MBLeftTXT)
				.show()
				.one("click", function (){
					BlockLayer.hide();
					MainForm.hide();
					
					return  settings.MBLCallback.apply(this);
				});
		} else {
			LeftBTN.hide();
		};
		
		if (settings.MBRightTXT != "") {
			RightBTN
				.html(settings.MBRightTXT)
				.show()
				.one("click", function (){
					BlockLayer.hide();
					MainForm.hide();
					
					return  settings.MBRCallback.apply(this);
				});
		} else {
			RightBTN.hide();
		};
		
		if (settings.MBMiddleTXT != "") {
			MiddleBTN
				.html(settings.MBMiddleTXT)
				.show()
				.one("click", function (){
					BlockLayer.hide();
					MainForm.hide();
					
					return  settings.MBMCallback.apply(this);
				});
		} else {
			MiddleBTN.hide();
		};
		
		MainForm.show();
	};
	// ===============================================
	
	
	//================= Left =====================
	$.fn.Left = function(x){
		return this.each(function(){
			$(this).css("left", real_param(x.toString()));
		});
	};//================= Left =====================
	
	//================= Top =====================
	$.fn.Top = function(y){
		return this.each(function(){
			$(this).css("top", real_param(y.toString()));
		});
	};//================= Top =====================
	
	//=============== InitMCControls =================
	$.InitMCControls = function(SetOptions){
		var Options = $.extend({
			InitItems	:	" .TRectLabel," +
							" .THorisontalRule," +
							" .TLabel," +
							" .TEdit," +
							" .TMemo," +
							" .TCheckBtn," +
							" .TRadioBtn," +
							" .TComboBox," +
							" .TGroupBox," +
							" .TListBox," +
							" .TButton," +
							" .TGBLabel," +
							" .TImg," + 
							" .TGrid," +
							" .HR_EX," +
							" .StaticEx",
			TargetSource: undefined
		}, SetOptions || {});
		
		$(Options.InitItems, Options.TargetSource).each(function(){
		 	var _this 	 = $(this);
			var _initCSS = {};
			
			var _left	= real_param(_this.attr("left"));
			var _top 	= real_param(_this.attr("top"));
			var _height = real_param(_this.attr("h"));
			var _width 	= real_param(_this.attr("w"));
			var _padT 	= real_param(_this.attr("pT"));
			var _font 	= real_param(_this.attr("f")); 
			var _lh		= real_param(_this.attr("lH"));
			var _color 	= _this.attr("color");

			var _cssProp = {
				top			 : _top,
				left		 : _left,
				height		 : _height,
				width	 	 : _width,
				paddingTop	 : _padT,
				"line-height": _lh, 	//(_lh)    ? (_lh + "px")   : "", 
				fontSize	 : _font, 	//(_font)  ? (_font + "px") : ""
				"color"		 : (_color) ? (_color) : "auto"
			};
			
			for (var i in _cssProp){
				if (_cssProp[i] != "") {
					_initCSS[i] = _cssProp[i]; 
				};
			};
			
			_this.css(_initCSS);
			
			if ((_this.hasClass("TGroupBox") == false) && 
				(_this.hasClass("StaticEx")  == false) &&
				(_this.hasClass("TEdit") 	 == false) &&
				(_this.hasClass("TMemo") 	 == false) && 
				//(_this.hasClass("noDisableSelection") == false) && 
				(_this.hasClass("TComboBox") == false)) {
					_this.disableTextSelect();
			};
				
			if ((_this.hasClass("TCheckBtn")) && (_this.children().prop("checked") == true)) {
				_this.addClass("TCheckBtnOn");
			} else
			if ((_this.hasClass("TRadioBtn")) && (_this.children().prop("checked") == true)) {
				_this.addClass("TRadioBtnOn");
			};
		});
	};//=============== InitMCControls =================
	
	// =================================================
	function real_param(param){
		var res = "";
		
		if (param != undefined) {
			if (param === 'auto') {
				res = 'auto';
			} else
			if (param.indexOf("%") != -1) {
				res = param;
			} else {
				res = param + "px";
			};
		} else {
			res = "";
		};
		
		return res;
	};

	// =================================================
	//$(document).ready(function () {
	$.MCControls_Init = function(onComplete){
	 
		$.InitMCControls();

		setTimeout(function(){
			$(".TButton, .TSimpleBTN").RefreshBTNEvents();
		}, 0);
		
		$(".TCheckBtn").MCCheckBtn("TCheck");
		$(".TRadioBtn").MCCheckBtn("TRadio");
		
		if (typeof onComplete === 'function'){
			onComplete();
		};
	};
})(jQuery);
