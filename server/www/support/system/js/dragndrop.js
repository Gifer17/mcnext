(function($) {

	var StartCoord			= {x:0, y:0};
	var CurrentCoord		= {x:0, y:0};
	
	var _Dragging 			= false;
	var _startDrag			= false;
	var _startSelect		= false;
	var _Selecting			= false;
	
	var DragEl				= null;
	var DropingPlace 		= $();
	var SelectedZone		= null;
	var DragDrop			= null;
	var DropingPlace 		= null;
	var DropHere			= null;
	var DragAndDropObj		= [];

	// ==========================================================

	function mouseOverItem(e){
		var _item = null;
		
		if (navigator.userAgent.match('MSIE') || navigator.userAgent.match('Gecko')) { // IE || FF
			_item = document.elementFromPoint(e.clientX, e.clientY)
		}
		else {
			_item = document.elementFromPoint(e.pageX, e.pageY)
		};
		return _item;
	 };

	// ==========================================================
 
	function mouseCoords(e){
		var Coords	= {x:0, y:0};
	 	
		if (navigator.userAgent.match('MSIE') || navigator.userAgent.match('Gecko')) { // IE || FF
			Coords.x = e.clientX;
			Coords.y = e.clientY;
		}
		else {
			Coords.x = e.pageX;
			Coords.y = e.pageY;
		};
		return Coords;
	 };

	// ==========================================================
 
	$.fn.CalcSelectZoneSize = function (){
		return this.each(function(){
			$(this).css({
						left: ((StartCoord.x < CurrentCoord.x) ? StartCoord.x : (CurrentCoord.x + 4)) + "px",
						top:  ((StartCoord.y < CurrentCoord.y) ? StartCoord.y : (CurrentCoord.y + 4)) + "px",
						height: (Math.abs(CurrentCoord.y - StartCoord.y) + ((StartCoord.y < CurrentCoord.y)? -4 : 0)) + "px",
						width:  (Math.abs(CurrentCoord.x - StartCoord.x) + ((StartCoord.x < CurrentCoord.x)? -4 : 0)) + "px"
					});
		});
	};

	// ==========================================================
	
	$.fn.MakeMouseSelectItems = function(){
		return this.each(function(){
			if (this.canSelect == undefined){
				$(this)
					.mousedown(function(e){
						if (e.which == 1) {
							var _item = mouseOverItem(e);
	
							if (this.dr_dp && $(_item).hasClass("currentitem")) {
								if ((this.CanStartDragDrop > 0) && (_startDrag == false)) {
									_startDrag = true;
						            StartCoord = mouseCoords(e);
									DragEl = this;
								};
							} else 
							if (($(_item).hasClass(this.itemTeg)) || ($(_item).parents("." + this.itemTeg).length > 0)) {
								if ((_startDrag == false) && (_startSelect == false)){
									_startSelect = true;
						            StartCoord = mouseCoords(e);
									DragEl = this;
								};
							};
						};

						this.canSelect = true;
					})
					.mousemove(function(e){
						if (_startSelect){
							var _item = mouseOverItem(e);

							CurrentCoord = mouseCoords(e);
							
							if (Math.abs(StartCoord.y - CurrentCoord.y) > 2) 
							 if (_Selecting == false) {
								if ($(_item).hasClass(DragEl.itemTeg)){
									if ((Math.abs(CurrentCoord.x - StartCoord.x) >= 4) || 
										(Math.abs(CurrentCoord.y - StartCoord.y) >= 4)) {
										
										_Selecting = true;
										DragEl.SelectingHere = true;
										
										$(DragEl)
											.find("." + DragEl.itemTeg)
											.each(function(){
												$(this).removeClass("currentitem").removeClass("movemarker");
											});
											
										DragEl.CanStartDragDrop = 0;
										
										SelectedZone
											.CalcSelectZoneSize()
											._show();
										
										if ($(_item).hasClass("currentitem") == false) {
											$(_item).addClass("currentitem");

											if (DragEl.dr_dp) {
												DragEl.CanStartDragDrop++;
												$(_item).addClass("movemarker");
											};
										};
									};							
								};
							} else {
								if (this.SelectingHere){
									SelectedZone.CalcSelectZoneSize();
									
									var deltaY = StartCoord.y - CurrentCoord.y;
									var y = StartCoord.y;
									
									if (Math.abs(deltaY) >= 10) {
										$(_item).parents("ul").find(".currentitem").removeClass("currentitem");
										
										while ((deltaY < 0) ? (y < CurrentCoord.y) : (y > CurrentCoord.y)) {
											var _e = {
												clientX : CurrentCoord.x,// + ((StartCoord.x - CurrentCoord.x) % 2),
												clientY : y,
												pageX : CurrentCoord.x,// + ((StartCoord.x - CurrentCoord.x) % 2),
												pageY : y
											};
											
											var item = $(mouseOverItem(_e));
											
											if (item.hasClass(DragEl.itemTeg)){
												item.addClass("currentitem");
											} else
											if (item.parents("." + DragEl.itemTeg).length > 0){
												item.parents("." + DragEl.itemTeg).addClass("currentitem");
											};
											
											(deltaY < 0) ? (y = y + 10) : (y = y - 10);
										};
									};
																		
									if ( $(_item).hasClass(DragEl.itemTeg) && ($(_item).hasClass("currentitem") == false)){
										
										//$(_item).addClass("currentitem");

										if (DragEl.dr_dp) {
											DragEl.CanStartDragDrop++;
											$(_item).addClass("movemarker");
										};
									};
								};
							};
						};
					});
			};
		});
	};
	
	// ==========================================================
	
	$.fn.MakeDragDropItems = function(SetOptions){
		var Options = $.extend({
			Elements : "LItem",
			BlockSelection : true,
			MultipleSelecion : false,
			DragDrop : true,
			ClearSelectionByOneClick : false,
			CommonCallbackFuncOnDBClick : undefined,
			CommonCallbackFuncOnSelect : undefined,
			Container : "no_action"			
		}, SetOptions || {});
		
		if (Options.DragDrop){
			var _elements = [];
			
			this.each(function(){
				_elements.push(this);
			});
			
			DragAndDropObj.push(_elements);
			
			var _idx = DragAndDropObj.length - 1; 
		};
		
		return this.each(function(){
			if (Options.Elements != undefined) {
				this.CanStartDragDrop 	= 0;
				this.dr_dp 				= Options.DragDrop;
				this.itemTeg 			= Options.Elements;
				this.nodeTeg			= Options.Container;
				this._idx				= _idx;
	
				var _this 				= this;
				var _items 				= $(_this).find("." + _this.itemTeg);
	
				if (Options.BlockSelection) $(_this).MakeMouseSelectItems();
				
				$(_this).on("click", "." + _this.itemTeg, function(e){
					if ((Options.MultipleSelecion) && ((Options.ClearSelectionByOneClick == false) || (e.ctrlKey) || (e.ctrlKey))){
						$(this).toggleClass("currentitem");
					} else {
						$(this).parents("ul").find(".currentitem").removeClass("currentitem");
						$(this).addClass("currentitem");
					};
	
					if (_this.dr_dp) {
						if (DragEl == null) {DragEl = _this};
						
						DragEl.CanStartDragDrop = 1;
						$(this).addClass("movemarker");
					};
					
					if (Options.CommonCallbackFuncOnSelect){
						Options.CommonCallbackFuncOnSelect.apply($(this));
					};
				});
				
				if (Options.CommonCallbackFuncOnDBClick != undefined){
					$(_this).on("dblclick", "." + _this.itemTeg, function(){
						Options.CommonCallbackFuncOnDBClick.apply($(this));
					});
				}
			};
		});
	};
	
	// ==========================================================

	$.fn.MakeDDZebra = function(){
		var _items = "";
		var _lastColor = RGBToHex(this.find(".LItem").children(":first").css("background-color"));
		var isOdd = (_lastColor == "#e1f0ff");
							
		return this.find(".LItem").each(function(){
			isOdd = !isOdd;
			//$(this).parent().css("background-color", (isOdd) ? "#e1f0ff" : "#fff");
			if (isOdd) {
				$(this).parent().addClass("isOdd");
			};
		});
	};

	// ==========================================================
	
	$.fn.AddDDItem = function (_html){
		if (isArray(_html)) {
			return this.each(function(){
				var _items = "";
				var _lastColor = RGBToHex($(this).children(":last").css("background-color"));
				var isOdd = (_lastColor == "#e1f0ff");
								
				for (var i = 0; i < _html.length; i++){
					isOdd = !isOdd;
					_items += "<li class='LItem' style='background-color:" + ((isOdd) ? "#e1f0ff;" : "#fff;") + "'>" + _html[i] + "</li>";
				};
				
				$(this).append(_items);
			});
		} else {
			return this.each(function(){
				var _lastColor = RGBToHex($(this).children(":last").css("background-color"));
				
				$(this).append("<li class='LItem' style='background-color:" + ((_lastColor == "#e1f0ff")? "#fff;" : "#e1f0ff;") + "'>" + _html + "</li>");
			});
		};
	};
	
	// ==========================================================
	
	$.fn.DelDDItem = function (_idxs){
		if (_idxs != undefined){
			if (isArray(_idxs)) {
				return this.each(function(){
	
				});
			};
		} else {
			return this.each(function(){
				$(this).children(".currentitem").remove();
			});
		};
	};
	
	// ==========================================================
	
	$.fn.MakeDDSelectItem = function (){
		return this.each(function(){
			$(this).trigger("click");
		});
	};
	
	// ==========================================================
	
	$.fn.MakeDDFirstSelectItem = function (){
		$(this).children(":first").trigger("click");
		
		return this;
	};
	
	// ==========================================================

	$.fn.GlobalEventDragDropAndMultiSelect = function(){
		return this.each(function(){
			$(this)
				.mousemove(function(e){
					if (_startDrag){
						CurrentCoord = mouseCoords(e);
						
						if (_Dragging == false) {
							if ((Math.abs(CurrentCoord.x - StartCoord.x) >= 20) || (Math.abs(CurrentCoord.y - StartCoord.y) >= 20)) {
								_Dragging = true;
								
								DragDrop.find(".currentitem").remove();
								
								DragDrop
									._show()
									.css({
										left: CurrentCoord.x,
										top:  CurrentCoord.y + 20
									})
									.append(
										$(DragEl)
											.find(".currentitem")
											.clone()
											.each(function(){
												return $(this);
											})
									);
								
								$(DragEl)
									.find(".currentitem")
									.each(function(){
										$(this).addClass("Dragging");
									});
								
								DragDrop
									.find(".smallBar")
									.text(DragEl.CanStartDragDrop);
							}
						} else {
							DragDrop.css({
								left: CurrentCoord.x,
								top:  CurrentCoord.y + 20
							});
							
							var _item = mouseOverItem(e);
							
							if (_item != null) {
								// получаем самый верхний элемент дерева ДОМ над которым сейчас мышка
								DropingPlace = $(_item);
								//если это итем на который можно дропнуть содержымио - начинаем колдовать "уличную магию"
								// подчеркиваем наш елемент
								if (DropHere != undefined) {
									DropHere.removeClass("DropHere");
								};
								if (DropingPlace.hasClass(DragEl.itemTeg)) { 
									DropingPlace.parent().addClass("DropHere");
									DropHere = DropingPlace.parent();
								} else 
								if (DropingPlace.hasClass("no_action")){
									DropingPlace.addClass("DropHere");
									DropHere = DropingPlace;
								};
							};
						};
					};
				})
				.mouseup(function(e){
					_startDrag		= false;
					_startSelect	= false;
					
					if (_Selecting) {
						_Selecting 	= false;
						DragEl.SelectingHere = false;
						SelectedZone._hide();
					};				
			
					if (_Dragging) {
						DragDrop._hide();
						$(".DropHere").removeClass("DropHere");

						if (DropingPlace.hasClass("no_action")) {
							DropingPlace
								.parent()
								.children("ul")
								.append($(DragEl).find(".currentitem").parent());
						} else
						if (DropingPlace.hasClass(DragEl.itemTeg) && (DropingPlace.hasClass("Dragging") == false)) {
							DropingPlace
								.parent()
								.after($(DragEl).find(".currentitem").parent());
						} else
						if (DropingPlace.hasClass("TListBox")) {
							DropingPlace
								.append($(DragEl).find(".currentitem").parent());
						};
						
						DragEl.CanStartDragDrop = 0;
						_Dragging = false;
						
						$(DragAndDropObj[DragEl._idx])
							.find(".currentitem, .Dragging")
							.each(function(){
								$(this).removeClass("currentitem").removeClass("movemarker").removeClass("Dragging");
							});
						
						$(DragAndDropObj[DragEl._idx]).MakeSingleItems(DragEl.itemTeg, false, true);
					
					};
				});
		});
	};

	// ==========================================================
	
	$(document).ready(function () {
		$("body")
			.append('<div class="DragDrop hideelement"><div class="smallBar"></div></div>')
			.append('<div class="DropingPlace"></div>')
			.append('<div id="SelectedZone" class="hideelement"></div>')
			.GlobalEventDragDropAndMultiSelect();
		
		DragDrop		= $(".DragDrop");
		DropingPlace 	= $(".DropingPlace");
		SelectedZone	= $("#SelectedZone");
		
		SelectedZone
			.mousemove(function(e){
				var _item = mouseOverItem(e);
			
				CurrentCoord = mouseCoords(e);
			
				if (DragEl.SelectingHere){
					$(this).CalcSelectZoneSize();
					
					if ($(_item).hasClass(DragEl.itemTeg) && ($(_item).hasClass("currentitem") == false)){
						//$(_item).addClass("currentitem");
						if (DragEl.dr_dp) {
							$(_item).addClass("movemarker");
							DragEl.CanStartDragDrop++;
						};
					};
				};
			});
	});	

	//===================================================================

	$.fn.DrawGrid = function(OtherOptions){
		return this.each(function(){
			var DataSet = $.extend({
					NeedTitle	: true,
					Titels	: ["1"],
					Cells	: {
						1 : ["1","2"]
					},
					CellSize : [1],
					TotalSize : function(){
						var res = 0;
						for (var i=0; i < this.CellSize.length; i++){
							res += this.CellSize[i] + 4;
						};
						return res;
					}
				}, OtherOptions || {});
	
			var titleDiv	= "";
			var titleItems	= "";
			var contentDiv	= "";
			var contentItems= "";
			
			$(this) .addClass("_Grid_outer_wrapper noMarginEx")
					.css("overflow:auto");
			
			titleDiv	= $("<div/>",{"class" : "_Title_wrapper"});
			contentDiv	= $("<div/>",{"class" : "_Content_wrapper"});
			
			if (DataSet.NeedTitle){
				for (var i = 0; i < DataSet.Titels.length; i++){
					titleItems += "<div class='" + i + "_gridItem' style='float:left; width:" + DataSet.CellSize[i] + "px;'>" + DataSet.Titels[i] + "</div>";
				};
			};
			
			for (var i in DataSet.Cells){
				var subItems = "";
				
				contentItems += "<div class='" + i + "' style='clear:both; width:" + DataSet.TotalSize() + "'>";
				
				for (var _items = 0; _items < DataSet.Cells[i].length; _items++){
					subItems += "<div class='" + _items + "_gridItem' style='float:left; width:" + DataSet.CellSize[_items] + "px;'>" + DataSet.Cells[i][_items] + "</div>";
				};
				
				contentItems += subItems + "</div>";
			};
			
			contentDiv.html(contentItems).width(DataSet.TotalSize());
			titleDiv.html(titleItems).width(DataSet.TotalSize());
			
			$(this) .html("")
					.append(titleDiv)
					.append(contentDiv);
		});
	};

	//===================================================================

	$.fn._selectNextDDItem = function(callbackOnSelect, noCycle){
		if ((this.children().length > 0) && (this.children(":last")[0].isFocus != true)) {
			this.children()._next(noCycle)._focusEx().MakeDDSelectItem();
			
			callbackOnSelect.apply();
		};
	};
	
	$.fn._selectPrevDDItem = function(callbackOnSelect, noCycle){
		if ((this.children().length > 0) && (this.children(":first")[0].isFocus != true)) {
			this.children()._prev(noCycle)._focusEx("top").MakeDDSelectItem();
				
			callbackOnSelect.apply();
		};
		
		return this;
	};
	
	$.fn._hide	= function(){
		return this.each(function(){
			$(this).addClass("hideelement");
		});
	};
	
	$.fn._show	= function(){
		return this.each(function(){
			$(this).removeClass("hideelement");
		});
	};
	
	$.fn._show_or_hide = function(_option){
		return this.each(function(){
			if (_option){
				if ((_option == true) || (_option == "1") || (_option == 1)) {
					$(this)._show();
				}
				else 
					if ((_option == false) || (_option == "0") || (_option == 0)) {
						$(this)._hide();
					}
			} else {
				$(this).toggleClass("hideelement");
			};
		});
	};
	
	$.fn._focusEx = function(_place){
		var _this = $(this);
		var _parent = $(this).parent("ul")[0];

		if (_place == "top") {
			_this.prepend("<button style='width:0px; height:0px;'></button>");
		} else {
			_this.append("<button style='width:0px; height:0px;'></button>");
		};
		
		$("button", _this).focus().remove();
		
		
		if (_parent.FocusItem != undefined) {
			_parent.FocusItem[0].isFocus = false;
		};

		_this[0].isFocus = true;
		_parent.FocusItem = _this;
		
		return _this;
	};
	
	$.fn._prev	= function(noCycle){
		var _idx = 0;
		
		$(this).each(function(indx){
			if (($(this)[0].isFocus) || (($(this)[0].isFocus == undefined) && (indx == 0))) {
				_idx = indx;
				$(this)[0].isFocus = false;
			};
		});
		
		if ((noCycle == true) && (_idx == 0)) {
			this[0].FocusItem = $(this).eq(0);
		} else {
			this[0].FocusItem = (_idx == 0) ? $(this).eq((this.length - 1)) : $(this).eq(_idx - 1);
		};
		
		this[0].FocusItem[0].isFocus = true;
		
		return this[0].FocusItem;
	};
	
	$.fn._next	= function(noCycle){
		var _idx = 0;
		
		$(this).each(function(indx){
			if (($(this)[0].isFocus) || (($(this)[0].isFocus == undefined) && (indx == 0))) {
				_idx = indx;
				$(this)[0].isFocus = false;
			};
		});
		
		if ((noCycle == true) && (_idx == (this.length - 1))) {
			this[0].FocusItem = $(this).eq(_idx);
		} else {
			this[0].FocusItem = (_idx == (this.length - 1)) ? $(this).eq(0) : $(this).eq(_idx + 1);
		};
		
		this[0].FocusItem[0].isFocus = true;
		
		return this[0].FocusItem;
	};
	
	$.fn._focused = function(_itemInFocus){
		if (!this[0]) return this;
		
		var _fItem = this[0].FocusItem;
		
		if (_itemInFocus){
			if (_fItem){
				_fItem[0].isFocus = false;
			};
			
			_fItem = _itemInFocus;
			_fItem[0].isFocus = true;
			_fItem.focus();
			
			this[0].FocusItem = _fItem;
		} else {
			if (!_fItem) {
				_fItem = $(this).eq(0);
				_fItem[0].isFocus = true;
				if ((_fItem[0].nodeName == "TEXTAREA") || 
					(_fItem[0].nodeName == "INPUT") || 
					(_fItem[0].nodeName == "SELECT") || 
					(_fItem[0].nodeName == "BUTTON")) {
						_fItem.focus();
				};
			};
		};

		return _fItem;
	};
	
	$.fn._get_ID_From_DDItem = function(){
		var _id = this.children(".currentitem").children().attr("_id");
		
		return (_id) ? _id : "-1";
	};
	
	$.fn.Make_TabStop_By_ANY_KEY = function(_SetOptions){
		var SetOptions = $.extend({
			Enabled			: true,
			TabKey			: 9,
			Items			: this,
			OnBeforTabStep	: undefined,
			OnTabStep		: function(){return false},
			OnTabItemFocus	: undefined,
			OnTabItemBlur	: undefined
		}, _SetOptions || {});

		function Do_Tab_Step (e){
			if (e.ctrlKey) {
				SetOptions.Items._prev().focus();
			} else {
				SetOptions.Items._next().focus();
			};
			
			if (SetOptions.Items._focused().hasClass("hideelement")){
				Do_Tab_Step(e);
			};
		};
		
		if ((SetOptions.Items) && (SetOptions.Items.length > 0)){
			SetOptions.Items.each(function(){
				$(this)[0].isFocus = false;
			});
			
			SetOptions.Items
				.focus(function(){
					var _this = $(this);
					
					if (_this[0].isFocus) {
						_this[0].isFocus = false;
					};

					_this[0].isFocus = true;
					
					if (_this[0].nodeName == "INPUT"){
						_this.select();
					};
					
					if (SetOptions.OnTabItemFocus){
						SetOptions.OnTabItemFocus.apply(this);
					};
				})
				.blur(function(){
					$(this)[0].isFocus = false;
					
					if (SetOptions.OnTabItemBlur){
						SetOptions.OnTabItemBlur.apply(this);
					};
				})
				.off("keydown.any_tab_stop")
				.on("keydown.any_tab_stop", function(e){
					var _res = true;
					
					if ((SetOptions.TabKey != 9) && (e.which == 9)) {
						_res = false;
					};

					if ((SetOptions.Enabled) && (SetOptions.TabKey == e.which)){
						if (SetOptions.OnBeforTabStep){
							_res = (SetOptions.OnBeforTabStep.apply(this)) ? true : false;
						};
						
						Do_Tab_Step(e);
						
						if (!SetOptions.OnBeforTabStep) {
							_res = (SetOptions.OnTabStep.apply(this)) ? true : false;
						};
					};
					
					return _res;
				});
		};
		
		return this;
	};
})(jQuery);