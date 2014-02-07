 
 CService.SoundCreate = function(){
	if (isIE6()){
		SoundNewMSG.play 		= function(){};
	} else {
		soundManager.onready(function() {
			SoundNewMSG 	= soundManager.createSound({id: 'newMSG',   url: 'sound/msg.mp3', volume: 50});
		});
	};
 };

 CService.SoundOff = function(){
	CData.SoundOnOffBTN._soundOff._show_or_hide(SoundIsMute);
	CData.SoundOnOffBTN._soundOn. _show_or_hide(!SoundIsMute);

	setTimeout(SoundNewMSG.mute,100);
	
	CData.TextMemo.focus();
 };
 
 CService.SoundOn = function(){
	CData.SoundOnOffBTN._soundOff._show_or_hide(SoundIsMute);
	CData.SoundOnOffBTN._soundOn. _show_or_hide(!SoundIsMute);

	setTimeout(SoundNewMSG.unmute,100);
	
	CData.TextMemo.focus();
 };

 CService.LockInterface = function(){
	CData.HW.addClass("not_logged ui-widget-overlay");
 };

 CService.UnlockInterface = function(){
	CData.HW.removeClass("not_logged ui-widget-overlay");
 };

 CService.ShowLoginForm = function(){
	CData.LoginForm.LoginUIN.removeAttr("disabled").val("").blur();
	CData.LoginForm.LoginPWD.removeAttr("disabled").val("").blur();
	CData.LoginForm.LoginBTN.toggleClass("disabled");
	CData.LoginForm.LoginIMG._hide();

	CData.LoginForm._show();
	CData.LoginForm.TO_WINDOW_CENTER(CData.HW);
	CData.LoginForm.LoginUIN.focus();
 };
 
 CService.HideLoginForm = function(){
	CData.LoginForm._hide();

	CData.LoginForm.LoginUIN.removeAttr("disabled").val("");
	CData.LoginForm.LoginPWD.removeAttr("disabled").val("");
	CData.LoginForm.LoginBTN.toggleClass("disabled");
	CData.LoginForm.LoginIMG._hide();
 };
 
 function BooleanStateToString(State){
	if (State == true) {
		return LMSG["5"]; //"5":"в сети",
	} else {
		return LMSG["4"]; //"отключен";
	};
 };

 CService.Register_New_WEB_User = function(){
 	MCConnect.SetCallBackFunctionByCMD(CMD_COMMAND_REGISTER_USER, function(){
		var _msg = this;
		var _arr = _msg.split(/[\r]/);
		
		CData.SelfUIN = _arr[0];
		CData.SelfPWD = _arr[1];
		
		CService.TryToLogin(CData.SelfUIN, CData.SelfPWD);
	});
	
	MCConnect.SendDataToServer(CMD_COMMAND_REGISTER_USER);
 };

 CService.BeginLogin = function(){
	var sGET 		= location.search;
	var hasRequests = (sGET.length > 0) ? MCGETReq.SetRecivedGETRequest(sGET) : false;

	//CData.HW.addClass("not_logged");
	CService.LockInterface();
	//CData.LoginForm._show();
	
	if (ConnectFailed == 0) {
		CData.SelfUIN = $.cookie("UIN");
		CData.SelfPWD = $.cookie("PWD");
	}; 
	
	if ((CData.SelfUIN == null) || (CData.SelfPWD == null)) {
		CookiePresent = false;
	} else {
		CookiePresent = true;
	};
	
	if (hasRequests == true) {
		if (CookiePresent == false){
			if (MCGETReq.HasParametr(GET_regnewuser) == true) {
				if (MCGETReq.HasParametr(GET_withuser) == true) {
					CData.ToUserUIN = MCGETReq.GetParametr(GET_withuser);
					
					CService.Register_New_WEB_User();
				} else {
					alert(LMSG["45"]); // "В запросе отсутствует информация об операторе"
				};
			} else {
				if (MCGETReq.HasParametr(GET_withuser)) {
					CData.ToUserUIN = MCGETReq.GetParametr(GET_withuser);
					
					CService.ShowLoginForm();
				};
			};
		} else {
			if (MCGETReq.HasParametr(GET_withuser) == true) {
				CData.ToUserUIN = MCGETReq.GetParametr(GET_withuser);
				
				CService.TryToLogin(CData.SelfUIN, CData.SelfPWD);
			} else {
				alert(LMSG["45"]); //"В запросе отсутствует информация об операторе");
			};
		};
	} else {
		if (CookiePresent == false) {
			CService.ShowLoginForm();
		} else {
			CService.TryToLogin(CData.SelfUIN, CData.SelfPWD);
		};
	};
 };  

 CService.LoginAccept = function(){
 	MCConnect.DelCallBackFunctionByCMD(CMD_COMMAND_FAILED);
	
 	var _msg = this;
	
	CService.HideLoginForm();

	CData.MCSessionID 	= GetSubstring(_msg, CR);
	_msg				= DelSubstring(_msg, CR);
	CData.MCAdditional	= GetSubstring(_msg, CR);
	
	CData.LoginInProgress = false;
	ConnectFailed	= 0;
	
	if (CData.MCAdditional == CMD_COMMAND_NOT_OPERATOR){
		//CData.InfoWindow._show().css("font-size",".7em").TO_WINDOW_CENTER(miniWEBWindow).html("Пользователь, с которым вы хотите связаться, или не существует, или не является оператором WEB поддержки");
		alert(LMSG["54"]);
	} else {
		var UName	= "";
		var UEmail	= "";
		var patt=/^WEB[0-9]{8}\w[0-9]{6}$/g;

		UName = MCUserInfo.GetUserNameByUin(CData.SelfUIN, CData.MCSessionID);

		var TestResult=patt.test(UName);
		
		if ((UName != "") && (TestResult == false)) {
			CData.SelfName = UName;
			
			CService.AfterLogin();
		} else {
			if (($.cookie("NAME") == null) || ($.cookie("EMAIL") == null)) {
				CService.SayHello();
			} else {
				UName	= $.cookie("NAME");
				UEmail	= $.cookie("EMAIL");
				CData.SelfName = UName;
	
				MCSelfInfo.FillSmallInfo(UName,	UEmail,	GetUserOS(), GetUserLanguage(), GetUserRefLink(), GetUserBrouser());
	
				MCConnect.SendDataToServer(CMD_COMMAND_SETSMALLUSERINFO + CR + CData.MCSessionID + CR + MCSelfInfo.GenerateMCUserInfo());

				CService.AfterLogin();
			};
		};
	};
 };

 CService.LoginFailed = function(){
 	MCConnect.DelCallBackFunctionByCMD(CMD_COMMAND_ACCEPT);
	
	ConnectFailed ++ ;
	
	if (ConnectFailed > 2) {
		alert(LMSG["47"]); // "Вход в систему не был произведен!"
		
		CService.ShowLoginForm();
		
		CData.LoginInProgress	= false;
		CData.MCSessionID		= 0;
		ConnectFailed			= 0;

		CData.LoginForm.LoginUIN.focus();
	} else {
		// эта проверка сделата на случай, когда на сервера убили веб-юзера, 
		// а у него есть куки - надо убить куки и попробовать заново создать юзера
		 
	 	$.cookie("UIN", null);
		$.cookie("PWD", null);
		$.cookie("NAME", null);
		$.cookie("EMAIL", null);

		CData.LoginInProgress	= false;
		CData.MCSessionID		= 0;
		CookiePresent			= false;

		setTimeout(function(){
			CService.BeginLogin();
		}, 0);
	};
 };
  
 CService.TryToLogin = function (_login, _pwd) {
	if (CData.LoginInProgress == false) { 	
	  	CData.LoginInProgress = true;
		
	  	CData.LoginForm.LoginUIN.prop("disabled", "true");
		CData.LoginForm.LoginPWD.prop("disabled", "true");
		CData.LoginForm.LoginBTN.toggleClass("disabled");
		CData.LoginForm.LoginIMG.toggleClass("hideelement");
		
		CData.SelfUIN = _login;
		CData.SelfPWD = _pwd;
		
		MCConnect.DelCallBackFunctionByCMD(CMD_COMMAND_FAILED);
		MCConnect.DelCallBackFunctionByCMD(CMD_COMMAND_ACCEPT);
		
		MCConnect.SetCallBackFunctionByCMD(CMD_COMMAND_ACCEPT, CService.LoginAccept);
		MCConnect.SetCallBackFunctionByCMD(CMD_COMMAND_FAILED, CService.LoginFailed);
		
		MCConnect.SendDataToServer(CMD_COMMAND_LOGIN +  CR + _login + CR + _pwd + CR + CMD_COMMAND_MINI_CLIENT + CR + CData.ToUserUIN);
	}; 
 };

 function TryHello(){
	var cookieName	= $.cookie("NAME");
	var cookieMail	= $.cookie("EMAIL");
	var UName 		= (cookieName != null) ? cookieName : trim(CData.RegUserInfoSmall.Name.val());
	var UEmail 		= (cookieMail != null) ? cookieMail : trim(CData.RegUserInfoSmall.EMail.val());
	
	if ((UName.length > 0) && (isValidEmailAddress(UEmail))){
		MCSelfInfo.FillSmallInfo(	UName, 
									UEmail, 
									GetUserOS(), 
									GetUserLanguage(), 
									GetUserRefLink(), 
									GetUserBrouser());
		
		CData.SelfName = UName;

		CData.RegUserInfoSmall._hide();
		
		$.cookie("NAME", UName);
		$.cookie("EMAIL", UEmail);

		MCConnect.SendDataToServer(CMD_COMMAND_SETSMALLUSERINFO + CR + CData.MCSessionID + CR + MCSelfInfo.GenerateMCUserInfo());

		CService.AfterLogin();
	} else {
		alert(LMSG["46"]); //"Введите, пожалуйста, имя и корректный адрес электронной почты");
	};
 };

 CService.SayHello = function(){
	CData.RegUserInfoSmall._show();

	$([CData.RegUserInfoSmall.Name, CData.RegUserInfoSmall.EMail]).keydown(function(eventObject){
		if (eventObject.which === keyCodes.enter) {
			TryHello();
		};
	});

	CData.RegUserInfoSmall.Name.focus();
	
	CData.RegUserInfoSmall.BTNBegin.click(function(){
		TryHello();
	});
 };
 
 CService.SendText = function(){
	function clearEmptyLines(strIn, _separator){
		var _source = strIn.split(((_separator) ? _separator : "\n"));
		
		for (var i = _source.length - 1; i > 0; i--){
			if (trim(_source[i]).length > 0){
				break;
			} else {
				_source.pop();
			};
		};
		
		return _source.join("\vL$");
	};
	
	var enterText = CData.TextMemo.val();
	sendText = clearEmptyLines(CData.TextMemo.val()); //trim(CData.TextMemo.val().replace(/[\n\r]/g, "\vL$"));
	
	if (sendText != "") {
		MCConnect.SetCallBackFunctionByCMD(CMD_COMMAND_SENDMSG, function(){
			var _msg		= this;
			var WEB_CR_IDX	= _msg.indexOf(CR);
			var iResult 	= _msg.slice(0, WEB_CR_IDX);
			
			enterText = sendText.replace(/\vL\$/g, "<br/>");
			
			switch (iResult){
				case "0":
					CService.GetMsg(_msg.slice(WEB_CR_IDX + 1, _msg.length + 1));
					sendText = ReplaseURLs(sendText);
					CData.DisplayText.append("<div><span class='dT'>[" + (new Date()).myFormat("hh:nn:ss") + "]</span> <span class='cL'>" + CData.SelfName + "</span>> " + enterText + "</div>");
				break;
				case "1":
					CData.DisplayText.append("<div><span class='dT'>[" + (new Date()).myFormat("hh:nn:ss") + "]</span> " + LMSG["48"] + "</div>"); // Не определён UIN получателя
				break;
				case "2":
					CData.DisplayText.append("<div><span class='dT'>[" + (new Date()).myFormat("hh:nn:ss") + "]</span> " + LMSG["49"] + "</div>"); // Отправитель не существует
				break;
				case "3":
					CData.DisplayText.append("<div><span class='dT'>[" + (new Date()).myFormat("hh:nn:ss") + "]</span> " + LMSG["50"] + "</div>"); // Получатель не существует
				break;
				case "4":
					CData.DisplayText.append("<div><span class='dT'>[" + (new Date()).myFormat("hh:nn:ss") + "]</span> " + LMSG["51"] + "</div>"); // При отправке сообщения произошла WINSOCK ошибка
				break;
				case "5":
					CData.DisplayText.append("<div><span class='dT'>[" + (new Date()).myFormat("hh:nn:ss") + "]</span> " + LMSG["52"] + "</div>") // Сообщение успешно отправлено в офлайн и будет доставлено получателю, как только он будет доступен.
							   .append("<div><span class='dT'>[" + (new Date()).myFormat("hh:nn:ss") + "]</span> <span class='cL'>" + CData.SelfName + "</span>> " + enterText + "</div>");
				break;
				case "6":
					CData.DisplayText.append("<div><span class='dT'>[" + (new Date()).myFormat("hh:nn:ss") + "]</span> " + LMSG["53"] + "</div>");//CID пользователя-получателя не определён
				break;
			};
			
			CData.ScrollDisplayText.scrollTop(99999);
		});
		
		MCConnect.SendDataToServer(CMD_COMMAND_SENDMSG + CR + CData.MCSessionID +	CR + CData.ToUserUIN + CR + "L$" + sendText);

		CData.TextMemo.val("").focus();
	};
 };
 
 CService.Quit_Form_Chat = function(){
	MCConnect.SendDataToServer(CMD_COMMAND_QUIT + CR + CData.MCSessionID + CR + CData.ToUserUIN);
	
	MCConnect = null;
	
	clearInterval(TalkTimer);
	clearInterval(CData.Ping_Live);
	
	CData.TextMemo.prop("readonly","readonly");
	
	CService.LockInterface();
	//CData.InfoWindow._show().TO_WINDOW_CENTER(miniWEBWindow);

	window.close();
 };

 CService.Print = function(){
	$.cookie("UIN", null);
	$.cookie("PWD", null);
	$.cookie("NAME", null);
	$.cookie("EMAIL", null);
 };
 
 CService.Start_Timer = function(_target){
	return setInterval(function(){
	 	Now++;
		
		var ss = Now % 60;
		var hh = parseInt(Now / 3600);
		var nn = parseInt(Now / 60) - (hh * 60);
		 
	 	_target.text(((hh < 10) ? ("0" + hh) : hh) + ":" + ((nn < 10) ? ("0" + nn) : nn) + ":" + ((ss < 10) ? ("0" + ss) : ss));
	}, 1000);
 };
 
 // CService.GetMsg - функция получает на пинг собравшиеся сообщения на сервере для нашего ВЕБ-пользователя
 CService.GetMsg = function (_msg){
	var msg_arr = [];
	
	if (trim(_msg).length > 0) {
		setTimeout(function(){
			document.title = "mini MyChat WEB Client";
		}, 0);
		
		_msg = _msg.replace(/L\$/g,"").replace(/[\v]/g, "<br>");
		msg_arr = _msg.split(/[\r]/);
		
		var i		= 0;
		var uin 	= "";
		var nik		= "";
		var _txt	= "";
		var typing	= false;

		while (i < (msg_arr.length - 1)){
			switch (msg_arr[i]){
				case "1": // пришло сообщение
					uin  = msg_arr[i+1];
					_txt = ReplaseURLs(msg_arr[i+2]);
					nik  = MCUserInfo.GetUserNameByUin(uin, CData.MCSessionID);
					
					SoundNewMSG.play();
					
					CData.DisplayText.append("<div><span class='dT'>[" + (new Date()).myFormat("hh:nn:ss") + "]</span>" + 
												" <span class='Op'>" + nik + " ></span> " + _txt + "</div>");
					i = i + 3;

					if ((CData.OperatorFoto.hasClass("hideelement")) || (CData.OperatorFoto.attr("src") != ("../" + MCUserInfo.GetUserFotoByUin(uin)))) {
						CData.OperatorFoto._show()
							.attr("src", "../" + MCUserInfo.GetUserFotoByUin(uin))
							.css({
								height: "70px",
								width : "70px"
							});
					};
					
					if ((CData.OperatorName.text() == "") || (CData.OperatorName.text() != nik)) {
						CData.OperatorName.text(nik);
					};
					
					typing = false;
				break;

				case "2": // пришел нотифай (печатает)
					if (_txt == "") {
						typing = true;
					};
					
					i = i + 2;
				break;
			};
		};
		
		if (typing) {
			if (CData.TypingImg.attr("src") == "img/notyping.gif") {
				CData.OperatorTyping.text(LMSG["9"]);

				CData.TypingImg.attr("src", "img/typing.gif");

				TypingTimer = setTimeout(function(){
					CData.OperatorTyping.text(LMSG["8"]);
					CData.TypingImg.attr("src", "img/notyping.gif");
					typing = false;
				}, 3000);
			};
		} else {
			CData.OperatorTyping.text(LMSG["8"]);
			CData.TypingImg.attr("src", "img/notyping.gif");
			typing = false;
			clearInterval(TypingTimer);
		};
	};
 };
 
 CService.PING = function(){
 	MCConnect.SetCallBackFunctionByCMD(CMD_COMMAND_PONG, function(){
		var _msg = this;
		var isUinOnline = GetSubstring(_msg, CR);
		
		_msg = DelSubstring(_msg, CR);
		
		if (isUinOnline != "") {
			MCUserInfo.SetUinOnlineSate(CData.ToUserUIN, IntToBool(isUinOnline));
			CData.isOnline.text(BooleanStateToString(MCUserInfo.UinIsOnline(CData.ToUserUIN)));
		};
		
		CService.GetMsg(_msg);
		
		CData.ScrollDisplayText.scrollTop(99999);
	});
	
 	MCConnect.SendDataToServer(CMD_COMMAND_PING + CR + CData.MCSessionID + CR + CData.ToUserUIN);
 };
 
 CService.Start_Ping_Timer = function(_interval){
 	return setInterval(function(){
		if (MCConnect.ErrorCode != 0){
			clearInterval(CData.Ping_Live);
		} else {
			CService.PING();
		};
	}, _interval);
 };
 
 //==============================================================
 //======================= AFTER LOGIN ==========================
 //==============================================================
 CService.AfterLogin = function(){
	/*
CData.SaveOpReview.click(function(){
		CService.CloseOpReview();
	});
*/
		
	MCUserInfo.GetUserNameByUin(CData.SelfUIN);
	
	if (CookiePresent == false) {
		var expr = 10000;//parseInt($(":selected", CData.LoginForm.Period).attr("period"));
		 
		$.cookie("UIN", CData.SelfUIN, {expires: expr});
		$.cookie("PWD", CData.SelfPWD, {expires: expr});
	};
	
	CData.StartChatTime.text(StartTime.myFormat("hh:nn:ss"));
	
	TalkTimer		= CService.Start_Timer(CData.ChatTime);
	CData.Ping_Live	= CService.Start_Ping_Timer(PingTimer);
	
	CService.PING();
	
	MCUserInfo.GetUserFotoByUin(CData.ToUserUIN, CData.MCSessionID);
			
	setTimeout(function(){
		CData.OperatorFoto.css({
			height: "70px",
			width : "70px"
		}).attr("src", "../" + MCUserInfo.GetUserFotoByUin(CData.ToUserUIN))._show();
		
		CData.OperatorName.text(MCUserInfo.GetUserNameByUin(CData.ToUserUIN));
	}, 0);
	
	CService.UnlockInterface();
	
	CData.TextMemo.focus();
 }; // == AfterLogin ==
 
 CService.ZoneSize = function(){
 	CData.miniWEBWindow.width($(window).width() - 25);
	CData.miniWEBWindow.height($(window).height() - 22);
	
	CData.ScrollDisplayTextWrapper.height(CData.miniWEBWindow.height() - 170);
	CData.ScrollDisplayText.height(CData.ScrollDisplayTextWrapper.height() - 5);
	
	CData.ScrollDisplayTextWrapper.width(CData.Window_Footer.width() - 17);
	CData.WindowHeader.width(CData.Window_Footer.width() - 20);
	
	CData.TextMemo.width(CData.Window_Footer.width() - 20 - 77);
	CData._link_.width(CData.TextMemo.width());
 };

 CService.KeyEvents.OnEnterAtRegNewUser = function(){
 	TryHello();
 };
 
 // ================ INIT ===================
 CService.INIT = function (){

	CService.ZoneSize();
	
	$(window).resize(function(){
		CService.ZoneSize();
	});

	CService.SoundCreate();

	CData.RegUserInfoSmall.TO_WINDOW_CENTER(CData.HW);
	
	CData.PrintBTN			.click(CService.Print);
	CData.OperatorValueBTN	.click(CService.Operator_Rating_Hide_Show);
	CData.CloseBTN			.click(CService.Quit_Form_Chat);
	CData.SendBTN			.click(CService.SendText);
	//CData.ScrollDisplayText	.click(CService.CloseOpReview);
	
	CService.KeyEvents.MNGR = new KeyControlMnrg();

	CService.KeyEvents.MNGR.AddEventList({
		Name : "RegNewUser",
		Target : CData.RegUserInfoSmall,
		List : (function () {
			var _list = {};
			
			_list[keyCodes.enter]	= CService.KeyEvents.OnEnterAtRegNewUser;
			
			return _list;
		})()
	});
	
	CData.LoginForm.LoginBTN.click(function(){
		CService.TryToLogin(CData.LoginForm.LoginUIN.val(), CData.LoginForm.LoginPWD.val())
	});

	CData.SoundOnOffBTN.click(function(){
		if (SoundIsMute) {
			CService.SoundOn();
			SoundIsMute = false;
		} else {
			CService.SoundOff();
			SoundIsMute = true;
		};
	});

	$([CData.LoginForm.LoginUIN, CData.LoginForm.LoginPWD]).each(function(){
		return this.keydown(function(eventObject){
			if (eventObject.which === keyCodes.enter) {
				CService.TryToLogin(CData.LoginForm.LoginUIN.val(), CData.LoginForm.LoginPWD.val())
			};
		})
	});

	CData.TextMemo.keydown(function(eventObject){
		if (eventObject.which === keyCodes.enter) {
			if (eventObject.ctrlKey === false){
				CService.SendText();
				
				return false;
			} else {
				if (trim(CData.TextMemo.val()).length > 0){
					CData.TextMemo.val(CData.TextMemo.val() + CR);
					CData.TextMemo.scrollTop(9999);
				};
				
				return false;
			};
		};
	}).focus().removeAttr("readonly");

	CService.BeginLogin(); 
 }; // END INIT

 // ====
 var end;