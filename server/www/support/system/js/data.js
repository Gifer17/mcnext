
  var CData				= {};
		CData.All_Sizes			= {};
		CData.LoginInProgress  	= false;
		CData.MCSessionID      	= 0;
		CData.MCAdditional		= "";
		CData.Ping_Live			= 0;
		CData.ToUserUIN			= "6";
		CData.SelfUIN			= null;
		CData.SelfPWD			= null;
		CData.SelfName			= "";
		
  var CService			= {};
		CService.KeyEvents = {};
		  
  var MCConnect 		= new TMCRequest();
		MCConnect.NoErrMsg	= true;

  var MCUserInfo		= new TMCUserList();
  var MCGETReq			= new O_GET_RequestParameters();
  var MCSelfInfo		= new OWEBUserInfo();

  var SoundNewMSG 		= {};
  var SoundIsMute		= false;

  var LMSG				= [];
  var sendText			= "";
  var Now				= 0;
  var CookiePresent		= false;
  var ConnectFailed		= 0;

  var StartTime			= new Date();
  var PingTimer			= 3000;
  var TypingTimer		= 0;
  var TalkTimer			= 0;
  
 $(document).ready(function(){

	if (!isIE6()){
		soundManager.url = "system/js/";
	};

  //=============== Локализация ====================
	LMSG = $.MCLocalize({
		LocalizeFile : "ru.json",
		UserDefinedLocalizeZone : "img, a, option, input" 
	});
	
	CData.SelfName = LMSG["44"];
  //================================================
 	
	CData.miniWEBWindow		= $("#miniWEBWindow");
	CData.TextMemo			= $("#TextMemo");
	CData.SendBTN			= $("#SendBTN");
	CData.DisplayText		= $("#DisplayText"); 
	CData.ScrollDisplayTextWrapper	= $("#ScrollDisplayTextWrapper");
	CData.ScrollDisplayText	= $("#ScrollDisplayText");
	CData.WindowHeader		= $("#WindowHeader");
	CData.Window_Footer		= $("#Window_Footer");
	CData._link_			= $("#_link_");
	CData.StartChatTime		= $("#StartChatTime");
	CData.ChatTime			= $("#ChatTime");
	CData.CloseBTN			= $("#CloseBTN");
	CData.PrintBTN			= $("#PrintBTN");
	CData.OperatorFoto		= $("#OperatorFoto");
	CData.OperatorName		= $("#OperatorName");
	CData.OperatorValueBTN	= $("#OperatorValueBTN");
	
	//CData.OperatorReview	= $("#OperatorReview");
	//CData.OpReviewText		= $("#OpReviewText");
	//CData.SaveOpReview		= $("#SaveOpReview");
	
	CData.OpRev				= $(".OpRev");
	CData.OperatorTyping	= $("#OperatorTyping");
	CData.TypingImg			= $("#TypingImg");
	CData.isOnline			= $("#isOnline");
	CData.InfoWindow		= $("#InfoWindow");
	CData.HW				= $("#HW");
	CData.Loading			= $("#Loading");

	CData.SoundOnOffBTN		= $("#SoundOnOffBTN");
		CData.SoundOnOffBTN._soundOff	= $("#_soundOff");
		CData.SoundOnOffBTN._soundOn	= $("#_soundOn");

	CData.RegUserInfoSmall	= $("#RegUserInfoSmall");
		CData.RegUserInfoSmall.Name		= $(".user_name", CData.RegUserInfoSmall);
		CData.RegUserInfoSmall.EMail	= $(".user_email", CData.RegUserInfoSmall);
		CData.RegUserInfoSmall.BTNBegin	= $(".begin_speak", CData.RegUserInfoSmall);
	
	CData.LoginForm 		= $("#LoginForm");
		CData.LoginForm.LoginUIN		= $("#LoginUIN");
		CData.LoginForm.LoginPWD		= $("#LoginPWD");
		CData.LoginForm.LoginBTN		= $("#LoginBTN");
		CData.LoginForm.LoginIMG		= $("#LoginIMG");
	
	CService.INIT();
 });
 
