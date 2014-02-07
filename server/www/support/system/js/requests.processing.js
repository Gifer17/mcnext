 ;
 
 //== Обработка ответов сервера ==
 MCConnect.RequestSuccess = function(msg){
	var WEB_CR_IDX  = msg.indexOf(CR);
	if (WEB_CR_IDX == -1) WEB_CR_IDX = msg.length;
	
	var request   = msg.slice(0, WEB_CR_IDX);
	var _msg    = msg.slice(WEB_CR_IDX + 1, msg.length + 1);  

	switch (request) {
/*
		case CMD_ERROR:
			if (_msg.length > 0) {
				if (CService.ErrorsList.hasOwnProperty(_msg)) {
					CService.ErrorsList[_msg].apply();
				} else {
					alert("Dispatcher not found. Error NUMB: " + _msg);
					
					CService.UnlockInterface();
				};
			};
		break;
*/
	};  

	this.RunCallBackFunctionByCMD(request, _msg);
 };
 
 MCConnect.SendError = function(){
 	CData.LoadingData._hide();
 };
 
 MCConnect.SendErrorCritical = function(){
 	CData.LoadingData._hide();
 };
 
 function alertEx(text){
 	alert($.trim(text));
	CService.UnlockInterface();
 };
//==========================================================================
//==========================================================================

 CService.ErrorsList = {};
 
