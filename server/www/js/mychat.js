
 var LMSG = [];
 var MCConnect = new TMCRequest();
 var MCFunc = {
     Service : {}
 };
 var AudioVideo = {};
 
 var CS_CMD = {
     Login       : 'login',
     Register    : 'register',
     Reminde     : 'reminde',
     OK          : 'OK',
     ERR         : 'err',
     Ping        : 'ping',
     Quit        : 'quit',

     OpenPrivate : 'openPrivate', // запрос на открытие привата с указанным пользователем
     AcceptOpen  : 'accetpOpen',  // разрешение открыть приват
     SendMSGPr   : 'sendmsgPr',   // отправка сообщения в приват
     SendMSGCh   : 'sendmsgCh',   // отправка сообщения в канал
     Typing      : 'typing',      // идентификация о наборе кеста

     CallUser    : 'callUser',    // запрос на звонок
     AcceptCall  : 'acceptCall',  // согласие на звонок
     RejectCall  : 'rejectCall'   // отказ от звонка
 };

 var SC_CMD = {
     sc_drop_connect                : "9999",
     sc_login                       : "8005", // fucking login...
     sc_get_all_rights              : "8004", // список прав клиента на сервисы чата, а также список разрешённых и запрещённых плагинов на данном сервере
     sc_job_positions               : "8006", // * список должностей компании. Нужна доработка
     sc_get_channels_list           : "8008", // список каналов, которые созданы на сервере
     sc_join_txt_channel            : "8013", // вход пользователя в текстовый канал
     sc_ulist_in_txt_ch             : "8016", // список пользователей в текстовом канале
     sc_join_newbie_txt_channel     : "8017", // новый пользователь вошёл в текстовый канал
     sc_user_online                 : "801A", // указанный пользователь подключен к серверу
     sc_get_common_contacts_list    : "801F",  // список общих контактов клиента. Доделать
     sc_grant_private_access        : "8012",
     sc_private                     : "800B",
     sc_error                       : "8001",
     sc_get_contacts_list           : "801E", // список личных контактов клиента. Доделать
     sc_user_online                 : "801A", // указанный пользователь подключен к серверу
     sc_user_offline                : "8043", // пользователь с указанным UIN о тключился от сервера
     sc_offline_private             : "800A", // офлайн приватное сообщение для клиента
     sc_registered                  : "805E", // уведомление пользователя о том, что он успешно зарегистрирован на сервере
     sc_typing_notify               : "8045", // уведомление о том, что нам в привате в данный момент кто-то пишет ответ

     sс_media_call                  : '8070',
     sс_media_call_accept           : '8071',
     sс_media_call_reject           : '8072'
 };

 var MyRightsSet = [];
 /*
 {1}   QLogin,                                           {21}  QOperatorClearChannelText,
 {2}   QBBSPost,                                         {22}  QContactsListChange,
 {3}   QBBSView,                                         {23}  QBroadcasts,
 {4}   QTxtChCreate,                                     {24}  QAllowPersonalMsg,
 {5}   QTxtChSay,                                        {25}  QAllowAlertMsg,
 {6}   QTxtChJoin,                                       {26}  QAllowSysinfoView,
 {7}   QPrivateOpen,                                     {27}  QSendImages,
 {8}   QPrivatesGetMessages,                             {28}  QAllowIgnores,
 {9}   QUserDetailsChange,                               {29}  QAllowInvites,
 {10}  QFilesSend,                                       {30}  QImagesPrivates,
 {11}  QFilesRecieve,                                    {31}  QShowCommonContactsList,
 {12}  QOperatorBan,                                     {32}  QHalt,
 {13}  QOperatorTurnOutFromChannel,                      {33}  QTxtChRename,
 {14}  QKill,                                            {34}  QTxtChDelete,
 {15}  QBlockIP,                                         {35}  QForciblyInvites,
 {16}  QBlockMAC,                                        {36}  QBlockUIN,
 {17}  QOperatorTxtChTopicSet,                           {37}  QAllowPlugins,
 {18}  QFTPPublic,                                       {38}  QAllowOptionsChange,
 {19}  QFTPPersonal,                                     {39}  QAllowMyFavoriteChannels,
 {20}  QRemoteAdm,                                       {40}  QAllowCloseProgram,

 {41}  QAllowContactsListsTotal,                         // разрешить или запретить полностью доступ к панели контактов
 {42}  QAllowAccountsManager,                            // разрешить пользоваться менеджером учётных записей
 {43}  QWEBAllowViewLogsSelfPrivates,                    // просмотр своих разговоров в приватах
 {44}  QWEBAllowViewLogsAllChannels,                     // просмотр всех разговоров в каналах
 {45}  QWEBAllowViewLogsAllPrivates,                     // просмотр всех разговоров в приватах
 {46}  QAllowFindUsersTool,                              // разрешить поиск пользователей
 {47}  QAllowActions,                                    // разрешить вставку в текст Action-ов
 {48}  QAllowClientLogPrivatesAndChannels,               // разрешить или запретить клиенту писать логи локально, у себя на компьютере
 {49}  QMessengerStyle,                                  // Messenger-style отображения майчат клиента
 {50}  QAllowOpenComputer,                               // показывать или нет в меню опцию "Открыть компьютер" по щелчку на имени юзера
 {51}  QExceptionAllowRecievePrivates,                   // Приём приватных сообщений от пользователей, которым запрещена отправка приватных сообщений
 {52}  QAllowViewRemoteUserMACAddress,                   // разрешить смотреть MAC адрес удалённого юзера
 {53}  QAllowViewRemoteUserActiveProcess,                // разрешить смотреть активный процесс удалённого юзера
 {54}  QWEBAllowViewFTPLog,                              // Просмотр FTP протоколов
 {55}  QWEBAllowViewSystemLog,                           // Просмотр системных протоколов
 {56}  QEnableTaskWorkersJobTimeControlSystem,           // контроль рабочего времени
 {57}  QWEBSupportAllowAccess,                           // доступ к WEB-интерфейсу веб-суппорта
 {58}  QWEBAllowAdmin,                                   // администрирование сервере через WEB
 {59}  QAllowProgramBlockTool,                           // Блокирование работающей программы паролем
 {60}  QAllowNetworkStatusChange,                        // Изменение сетевого статуса
 {61}  QEnableAllowedClientsPluginsList,                 // Активировать список разрешённых клиентских плагинов
 {62}  QEnableBlockedCLientsPluginsList,                 // Активировать список запрещённых клиенских плагинов
 {63}  QEnablePluginsManagement,                         // Разрешить управление плагинами на клиенте
 {64}  QAllowImagesInBroadcasts,                         // вставка картинок в оповещениях
 {65}  QEnableFontLayoutsInMessages,                     // использование шрифтовой разметки в отправляемых сообщениях
 {66}  QAllowCreateHiddenChannels,                       // (это ещё не внесено в базу данных) разрешить создавать скрытые каналы
 {67}  QEnableTransferFilesOnlyViaServer,                // передавать файлы только через сервер
 {68}  QEnableImmunityFromBans,                          // иммунитет от банов
 {69}  QEnableAdvertBlock                                // показывать или нет рекламный блок
 */

 var Auth      = '';
 var PWD       = '';
 var BrowserID = '';
 var SessionID = '';
 var LoggedIn  = false;

 var TypingCount = 0;
 var TypingSend  = 10;

 var Constants = {
     idA       : 'c-uin-',
     idUL      : 'UL-UIN-',
     offline   : '-1',
     online    : '0',
     away      : '1',
     dnd       : '2',
     web       : '3',
     myMirror  : 'selfVideo',
     CallerVid : 'callerVideo'
 };

 //var MCStorage = new MCObjectStorage();

 var terminator       = '\u2022';
 var PingTamer        = null;
 var PingInterval     = 1000;
 var mcPara           = "L$";

 var KeyEvents        = new KeyControlMnrg();
 var MyDialog         = null;
 var IItems           = {}; // список визуальных компонентов страницы
 var ProcessCMD       = {}; // список обработчиков команд от сервера

 var isShowed = {
     Contacts : false,
     Chat     : false,
     Talks    : false,
     Options  : false,
     Filters  : false,
     TopMenu  : true
 };

 var gifTypingNotifyStarted = false;

 var UserInfo   = {                   // информация о залогиненом юзере
     "UIN"             : 0,           // UIN пользователя, который залогинен в системе
     "Nick"            : "Anonymous", // ник пользователя, который сообщил ему сервер
     "Sex"             : 1,           // пол пользователя
     "Avatar"          : 0,           // номер аватара пользователя
     "LoginStyle"      : "login",     // тип логина: "login" - обычный логин, "domain" - доменная авторизация
     "AutoAwayTime"    : 15,          // время в минутах, после которого будет считаться, что пользователь неактивен
                                      // за компьютером, если он не нажимал ничего на клавиатуре и не шевелил мышкой
     "ServerSignature" : "",          // специальная сигнатура сервера MyChat, нужна для системы статистики
     "Domain"          : "domain",    // если доменная авторизация, "LoginStyle" = "domain", то в этом параметре
                                      // передаётся ещё и имя домена, с которого проходит аторизация.
                                      // Если доменной авторизации нет - этот параметр не передаётся

     LocalFilterResult  : [],
     ServerFilterResult : [],

     CallStarted       : false,
     MyCallerID        : '',
     CallWithVideo     : true,
     CallerID          : '',
     CallerUIN         : '0',
     EmptyCallInfo     : function(){
         this.MyCallerID    = '';
         this.CallWithVideo = true;
         this.CallerID      = '';
         this.CallerUIN     = '0';
     }
 };

 var MCInfo     = {   // информация о веб-чате в целом
     CurrentPrivate : {},
     OpenPrivates   : {},
     CommonList     : {
         DeptCount   : 0,
         UserCount   : 0,
         Depts       : {},
         Users       : {},
         UsersQueue  : [],
         DeptsQueue  : [],
         TreePreview : {}
     },
     PersonalList   : {
         DeptCount   : 0,
         UserCount   : 0,
         Depts       : {},
         Users       : {}
     },
     AllUsersList   : {
         // uin : info
     },
     UsersByNick    : {
         // nick : uin
     },
     LocalFilterResult  : [],
     ServerFilterResult : [],
     EmptyCommonList   : function(){
         for (var i in this.CommonList){
             delete this.CommonList[i];
         };

         this.CommonList = {
             DeptCount   : 0,
             UserCount   : 0,
             Depts       : {},
             Users       : {},
             UsersQueue  : [],
             DeptsQueue  : [],
             TreePreview : {}
         }
     },
     EmptyPersonalList : function(){
         for (var i in this.PersonalList){
             delete this.PersonalList[i];
         };

         this.PersonalList = {
             DeptCount   : 0,
             UserCount   : 0,
             Depts       : {},
             Users       : {}
         }
     },
     FindParent     : function(id, _target, treeItem){
         var res = undefined;

         if (!treeItem) treeItem = 'Depts';

         if (id == '0'){
             res = _target;
         } else
         if (_target[id]){
             res = _target[id];
         } else
         if (!isObjectEmpty(_target)){
             for (var i in _target){
                 res = this.FindParent(id, _target[i][treeItem], treeItem);

                 if (res) break;
             };
         };

         return res
     },
     AddInAllUsers  : function(uin, obj){
         this.AllUsersList[uin] = obj;
         this.UsersByNick[obj.Nick] = uin;
     }
 };

 var ErrorText  = {};

 var CanDisplayNotificator = false;

 var console = (!console) ? {error: function(){}, log: function(){}, warn: function(){}} : console; // dummy fix

 $.getJSON('errors.json', function(err){
     ErrorText = err;
 });

 // ============================================================================
// ============================================================================

 ProcessCMD[SC_CMD.sc_login]                    = function sc_login(_data){
     /*{
      "UIN"             : 17,        // UIN пользователя, который залогинен в системе
      "Nick"            : "Chapay",  // ник пользователя, который сообщил ему сервер
      "Sex"             : 1,         // пол пользователя
      "Avatar"          : 54,        // номер аватара пользователя
      "LoginStyle"      : "login",   // тип логина: "login" - обычный логин, "domain" - доменная авторизация
      "AutoAwayTime"    : 15,        // время в минутах, после которого будет считаться, что пользователь неактивен за компьютером, если он не нажимал ничего на клавиатуре и не шевелил мышкой
      "ServerSignature" : "MyChat4/16...." // специальная сигнатура сервера MyChat, нужна для системы статистики

      "Domain"          : "domainname" // если доменная авторизация, "LoginStyle" = "domain", то в этом параметре передаётся ещё и имя домена, с которого проходит аторизация.
      // Если доменной авторизации нет - этот параметр не передаётся
     }*/

     MCFunc.SetNewUserInfo(StringToObj(_data));

     $.mobile.changePage(IItems.ChatPage);

     showModal();

     LoggedIn = true;

     MCFunc.SaveSession(SessionID);

     MCFunc.ShowContacts();
 };

 ProcessCMD[SC_CMD.sc_registered]               = function sc_registered(_data){
   /*{
    "UIN"    : 98,              // присвоенный идентификатор пользователя
    "Nick"   : "Chapay",        // ник
    "Pass"   : "1@56#4sdfKDF",  // пароль учётной записи
    "Avatar" : 53,              // номер аватара
    "Sex"    : 1                // пол пользователя
    }*/

     MCFunc.SetNewUserInfo(StringToObj(_data));

     $.mobile.changePage(IItems.ChatPage);

     LoggedIn = true;

     MCFunc.SaveSession(SessionID);
 };

 ProcessCMD[SC_CMD.sc_get_common_contacts_list] = function sc_get_common_contacts_list(_data){
     var _obj = StringToObj(_data);

     MCInfo.EmptyCommonList();
     MCInfo.CommonList = MCFunc.Service.FillCommonList(_obj, MCInfo.CommonList);

     IItems.CommonContacts.empty();

     MCFunc.DrawCommonContacts();

     IItems.NavInContacts.Common.triggerHandler('vclick');
 };

 ProcessCMD[SC_CMD.sc_get_contacts_list]        = function sc_get_contacts_list(_data){
     var _obj = StringToObj(_data);

     MCInfo.EmptyPersonalList();
     MCInfo.PersonalList = MCFunc.Service.FillPersonalList(_obj, MCInfo.PersonalList);

     IItems.PersonalContacts.empty();

     MCFunc.DrawPersonalContacts();

     IItems.NavInContacts.Personal.triggerHandler('vclick');
 };

 ProcessCMD[SC_CMD.sc_get_all_rights]           = function sc_get_all_rights(_data){
     for (var i = 0; i < _data.length - 1; i++){
         MyRightsSet[i] = (_data[i] != '0');
     }
 };

 ProcessCMD[SC_CMD.sc_grant_private_access]     = function sc_grant_private_access (_data){
     var obj = StringToObj(_data);

     MCFunc.HideContacts();
     MCFunc.UserPrivate(obj, true);
 };

 ProcessCMD[SC_CMD.sc_private]                  = function sc_private(_data){
     var msg  = StringToObj(_data);

     MCFunc.DrawNewPrivateMSG(msg);
 };

 ProcessCMD[SC_CMD.sc_offline_private]          = function sc_offline_private(_data){
     var msg  = StringToObj(_data);

     MCFunc.DrawNewPrivateMSG(msg);
 };

 ProcessCMD[SC_CMD.sc_error]                    = function sc_error(_data){
     var err = StringToObj(_data);
     /*{
          "ErrNum" : 21,        // номер ошибки
          "Params" : [          // параметры ошибки, если есть, параметров может быть любое количество, все - текстовые строки
              "bla-bla-bla",
              "test-test-test"
          ]
      } */

     hideModal();

     MyDialog.ShowDialog({
         Role    : MyDialog.Roles.Error,
         Variant : err.ErrNum,
         FParams : err.Params,
         Text    : ErrorText,
         OnClose : function(){
             IItems.LoginBTN.removeClass("ui-disabled");
             IItems.RegistrBTN.removeClass("ui-disabled");
             IItems.RepireBTN.removeClass("ui-disabled");
         }
     });
 };

 ProcessCMD[SC_CMD.sc_drop_connect]             = function sc_drop_connect(){
     PingTamer.StopPingTimer();

     if (LoggedIn){
         MyDialog.ShowDialog({
             Role    : MyDialog.Roles.Error,
             Variant : 9999,
             Text    : LMSG["14"],
             OnClose : function(){
                 location.href = '/';
             }
         });

         LoggedIn = false;
     }
 };

 ProcessCMD[SC_CMD.sc_user_online]              = function sc_user_online(_data){
     var _obj = StringToObj(_data);

     if (_obj.UIN != UserInfo.UIN) {
         _obj.State = '0';

         MCFunc.ChangUserState(_obj);
         MCFunc.DrawUserInfoInPrivate(_obj);
     }
 };

 ProcessCMD[SC_CMD.sc_user_offline]             = function sc_user_offline(_data){
     var _obj = StringToObj(_data);

     if (_obj.UIN != UserInfo.UIN) {
         _obj.State = '-1';

         MCFunc.ChangUserState(_obj);
         MCFunc.DrawUserInfoInPrivate(_obj);
     }

     if (UserInfo.CallerUIN == _obj.UIN){
         IItems.Sound_Calling.pause();
         IItems.Sound_Ring.pause();

         MyDialog.ClosePopup();

         if (UserInfo.MyCallerID != ''){
             AudioVideo.DropCall(UserInfo.CallerID);
         }
     }
 };

 ProcessCMD[SC_CMD.sс_media_call]               = function sc_media_call(_data){
     // "UIN"     : 17,              // идентификатор того, кто звонит
     // "Video"   : true,            // звонок с видео или без
     // "MediaID" : "ikufy398476eo"  // идентификатор мультимедийного потока того, кто звонит
     var _obj = StringToObj(_data);

     if (UserInfo.CallerUIN == '0'){
         IItems.Sound_Ring.load();
         IItems.Sound_Ring.play();

         if (MCInfo.OpenPrivates[_obj.UIN]){
             MCFunc.CallQuestion(_obj);
         } else {
             AudioVideo.RejectCall(_obj.UIN);
         }
     } else {
         AudioVideo.RejectCall(_obj.UIN);
     }
 };

 ProcessCMD[SC_CMD.sс_media_call_accept]        = function sc_media_call_accept(_data){
     // "UIN"     : 17,              // идентификатор того, кто звонит
     // "Video"   : true,            // звонок с видео или без
     // "MediaID" : "ikufy398476eo"  // идентификатор мультимедийного потока того, кто звонит
     var _obj = StringToObj(_data);

     if (UserInfo.CallerUIN == _obj.UIN){
         MCFunc.SetNewUserInfo({
             CallerID      : _obj.MediaID,
             CallWithVideo : _obj.Video
         });

         MyDialog.ClosePopup();

         easyRTC.enableVideo(UserInfo.CallWithVideo);

         setTimeout(function(){
             AudioVideo.PerformCall(UserInfo.CallerID);
         }, 0)
     }
 };

 ProcessCMD[SC_CMD.sс_media_call_reject]        = function sc_media_call_reject(_data){
     if (UserInfo.CallerUIN == _data.UIN){
         MCFunc.SetNewUserInfo({
             CallerID      : '',
             CallWithVideo : true,
             CallerUIN     : '0'
         });

         IItems.Sound_Ring.pause();

         MyDialog.ClosePopup();

         if (UserInfo.CallerID != "") AudioVideo.DropCall(UserInfo.CallerID);
     }
 };

 ProcessCMD[SC_CMD.sc_typing_notify]            = function sc_typing_notify(_data){
     var _obj = StringToObj(_data);

     MCFunc.TypingNotifyBlock(_obj.UIN);
 };

 // ============================================================================
 // ============================================================================

 MCFunc.SetNewUserInfo       = function SetNewUserInfo(obj){
     UserInfo = $.extend(UserInfo, obj || {});
 };

 MCFunc.ChangUserState       = function ChangUserState(obj){
     var _uin    = obj.UIN;
     var _online = parseInt(obj.State) >= 0;
     var user    = $('.' + Constants.idA + _uin, IItems.AllContacts);
     var img     = $('img', user);
     var elem    = user.closest('li');

     if (_online) {
         user.removeClass("_offline");
         img.attr("src", "img/" + img.attr("alt") + ".png");

         elem.each(function(){
             $(this).prependTo($(this).parent());
         });
     } else {
         user.addClass("_offline");
         img.attr("src", "img/" + img.attr("alt") + "_offline.png");

         elem.each(function(){
             $(this).appendTo($(this).parent());
         });
     }

     if (MCInfo.OpenPrivates[obj.UIN]){
         MCInfo.OpenPrivates[obj.UIN].State = obj.State;
     }
 };

 MCFunc.SendDataToServer     = function SendDataToServer(data, onSend){
     MCConnect.SendDataToServer(data);

     if (onSend) {
         onSend();
     }
 };

 MCFunc.CallQuestion         = function CallQuestion(_obj){
     MCFunc.SetNewUserInfo({
         CallerID      : _obj.MediaID,
         CallWithVideo : _obj.Video,
         CallerUIN     : _obj.UIN
     });

     var _menu = {};

     if (UserInfo.CallWithVideo){
         _menu["_callWithVideo"] = {
             Desc    : LMSG["52"],
             OnClick : function(){
                 AudioVideo.Connect(UserInfo.CallerUIN + "_" + UserInfo.UIN, AudioVideo.SendMediaAccept);

                 MCFunc.UserPrivate(_obj, true);

                 IItems.Sound_Ring.pause();
             }
         }
     };

     _menu["_callOnlyAudio"] = {
         Desc    : (UserInfo.CallWithVideo) ? LMSG["53"] : LMSG["65"],
         OnClick : function(){
             UserInfo.CallWithVideo = false;

             AudioVideo.Connect(UserInfo.CallerUIN + "_" + UserInfo.UIN, AudioVideo.SendMediaAccept);

             MCFunc.UserPrivate(_obj, true);

             IItems.Sound_Ring.pause();
         }
     };

     _menu["_callReject"] = {
         Desc    : LMSG["54"],
         OnClick : function(){
             AudioVideo.RejectCall(UserInfo.CallerUIN);
         }
     };

     MyDialog.ShowDialog({
         Role     : MyDialog.Roles.Menu,
         Title    : (UserInfo.CallWithVideo)
                           ? (LMSG["50"] + MCInfo.OpenPrivates[UserInfo.CallerUIN].Nick + '?')
                           : (LMSG["51"] + MCInfo.OpenPrivates[UserInfo.CallerUIN].Nick + '?'),
         CloseBTN : false,
         MenuList : _menu
     })
 };

 MCFunc.RequestOpenPrivate   = function RequestOpenPrivate(uin){
     var needSend = true;

     if (MCInfo.OpenPrivates[uin]){
         if (MCInfo.CurrentPrivate.UIN != uin){
             MCInfo.CurrentPrivate = MCInfo.OpenPrivates[uin];
         }

         MCFunc.HideAllComponents();
         MCFunc.UserPrivate(MCInfo.CurrentPrivate, true);

         needSend = false;
     }

     if (needSend){
         showModal();

         MCFunc.SendDataToServer({
             CMD : CS_CMD.OpenPrivate,
             Data: SessionID + CR + uin
         });
     }
 };

 MCFunc.SendMSG_ToPivate     = function SendMSG_ToPivate(__text){
     var uin = MCInfo.CurrentPrivate.UIN;
     var msg = mcPara + (isString(__text) ? __text : IItems.PrivateInputText.val().replace(LF, mcPara));

     if (!isString(__text)) IItems.PrivateInputText.val("");

     MCFunc.SendDataToServer({
         CMD  : CS_CMD.SendMSGPr,
         Data : SessionID + CR + uin + CR + msg
     });
 };

 MCFunc.DrawNewPrivateMSG    = function DrawNewPrivateMSG(msg){
     var text  = msg.Msg.split('L$');
     var notI  = msg.UINFrom != UserInfo.UIN;
     var uin   = msg.UINFrom;
     var uinTO = msg.UINTo;
     var nick  = msg.Nick;
     var state = msg.StateFrom;
     var sex   = msg.Sex;
     var dt    = (msg.dt) ? msg.dt.split('.') : "";

     dt = (dt.length == 6) ? dt[0] + "." + dt[1] + "." + dt[2] + "&nbsp;" +dt[3] + ":" + dt[4] + ":" + dt[5] + "&nbsp;" : dt;

     text.shift();
     text = text.join('<br/>');

     if (uin != UserInfo.UIN){
         if (CanDisplayNotificator) {
             CreateNotification({
                 title : nick.slice(0, 30) + ((nick.length > 30) ? '..' : "" ) + ":",
                 body  : text.slice(0, 50) + ((text.length > 50) ? '...' : "" ),
                 click : function onClickOnNotify(){
                     MCFunc.UserPrivate({
                         State : state,
                         Sex   : sex,
                         UIN   : uin,
                         Nick  : nick
                     }, true);
                 }
             });
         }

         if (!MCInfo.OpenPrivates[uin]){
             MCFunc.UserPrivate({
                 State : state,
                 Sex   : sex,
                 UIN   : uin,
                 Nick  : nick
             });
         }
     }

     var _prev_msg    = MCInfo.OpenPrivates[(uin == UserInfo.UIN) ? uinTO : uin].DisplayText.children().last();
     var _tot_je_user = _prev_msg.attr("uin") == uin;

     if (msg.StateTo == Constants.offline && !_tot_je_user){
         MCInfo.OpenPrivates[(uin == UserInfo.UIN) ? uinTO : uin].DisplayText.append("<div class='isOfflineMsg'>" + LMSG["19"] + "</div>");
     }

     if (!_tot_je_user) {
         _prev_msg.append("<div class='clearINmsg'></div>");
     }

     var div  = "<div class='msg_wrapper " + ((notI) ? "msg_wrapper_darker" : "") + "' uin='" + uin + "'>" +
                     (((dt != "") && (!_tot_je_user)) ? "<div class='isOfflineMsg'>" + LMSG["23"] + "</div>" : "") +
                     ((_tot_je_user) ? "" : "<div class='msg_nick'><span class='" + ((notI) ? "msg_notI " : "") + "'>" + nick + // msg_wrapper_darker
                         "</span></div>") +
                     "<div class='msg_time'>" + ((dt == "") ? (new Date()).myFormat('hh:nn:ss') : dt) + "</div>" +
                     "<div class='msg_txt'>" + text + "<br></div>" + //
                     ((dt != "") ? "<div style='clear: both'></div>" : "") +
                 "</div>";

     MCInfo.OpenPrivates[(uin == UserInfo.UIN) ? uinTO : uin].DisplayText.append(div);

     if (MCInfo.CurrentPrivate && MCInfo.CurrentPrivate.UIN == ((uin == UserInfo.UIN) ? uinTO : uin)){
         IItems.DisplayText.scrollTop(99999);
     }
 };

 MCFunc.UserPrivate          = function UserPrivate(obj, _show){
     /*{
          "UIN"      : 456,                 // UIN пользователя
          "Sex"      : 1,                   // пол пользователя
          "State"    : 0,                   // текущий статус
          "Avatar"   : 27,                  // номер аватара пользователя
          "Nick"     : "Chapay",            // ник пользователя
          "Email"    : "chapay@mail.earth", // электронная почта пользователя
          "Task"     : 0,                   // тип запроса, 0 - просто открытие привата, 1 - нужно начать передавать файлы,
                                               2 - вставлять файлы из буфера обмена и начинать передачу
          "HelloMsg" : "Привет, как дела?"  // приветственное сообщение. Может быть пустым
     }*/

     if (!isObjectEmpty(obj)){
         var inner_obj = $.extend(MCInfo.OpenPrivates[obj.UIN] || {
             UIN   : '0',
             Nick  : 'Elisa',
             Sex   : '0',
             State : '0'
         }, obj);

         IItems.NavMyChat.UChat.removeClass('ui-disabled');
         IItems.NavMyChat.Talks.removeClass('ui-disabled');

         if (!MCInfo.OpenPrivates[inner_obj.UIN]){
             MCInfo.OpenPrivates[inner_obj.UIN] = inner_obj;

             MCInfo.OpenPrivates[inner_obj.UIN].DisplayText = $('<div/>', {
                 id    : 'PrivateWith-' + inner_obj.UIN,
                 style : 'background: #fcf1c2; padding-bottom: 5px;'
             });

             MCInfo.OpenPrivates[inner_obj.UIN].DisplayText.hide();

             IItems.DisplayText.append(MCInfo.OpenPrivates[inner_obj.UIN].DisplayText);

             MCFunc.AddPrivateToTalksHistory({
                 UIN   : inner_obj.UIN,
                 Sex   : inner_obj.Sex,
                 State : inner_obj.State,
                 Nick  : inner_obj.Nick
             });
         }

         MCInfo.CurrentPrivate = MCInfo.OpenPrivates[inner_obj.UIN];

         if (_show) {
             IItems.NavMyChat.ActivBTN(IItems.NavMyChat.UChat, null);

             MCFunc.HideAllComponents();
             MCFunc.ChangUserState(inner_obj);
             MCFunc.DrawUserInfoInPrivate(inner_obj);
             MCFunc.ShowCurrentPrivate();

             hideModal();

             setTimeout(function(){
                 IItems.DisplayText.scrollTop(99999);
                 IItems.PrivateInputText.focus();
             }, 0);
         }
     } else {
         console.err('MCFunc.UserPrivate: obj is not defined!');
     }
 };

 MCFunc.DrawUserInfoInPrivate    = function DrawUserInfoInPrivate(obj){
     if (MCInfo.OpenPrivates[obj.UIN]){
         var sex    = (obj.Sex) ? obj.Sex : MCInfo.OpenPrivates[obj.UIN].Sex;
         var gender = (sex == '0') ? "alien" : ((sex == '1') ? 'man' : 'woman');
         var state  = (obj.State == '-1')? '_offline' : '';

         IItems.DisplayUserInfoName.html("<span style='display: inline-block; position: relative; width: 22px; height: 17px;'>" +
             "<img src='img/" + gender + state + ".png' alt='" + gender + "'>" +
             "</span>" + MCInfo.OpenPrivates[obj.UIN].Nick);

         if (obj.State == '-1'){
             MCFunc.CallsDisable();

             IItems.DisplayUserInfoName.addClass(state);
         } else {
             MCFunc.CallsEnable();

             IItems.DisplayUserInfoName.removeClass('_offline');
         }
     }
 };

 MCFunc.AddPrivateToTalksHistory = function AddPrivateToTalksHistory(_obj){
     IItems.THUserList.prepend(MCFunc.Service.AddUserToContactList(_obj));
     IItems.THUserList.listview("refresh");

     $('[class *= ' + Constants.idA + ']', IItems.THUserList).on("vclick", MCFunc.Service.OnUserClickInContacts);

     MCFunc.Service.OnOptionsClickInContacts(IItems.THUserList);

     MCFunc.ChangUserState(_obj);
 };

 MCFunc.SaveSession          = function SaveSession(sID){
     $.cookie('SessionID', sID);

     IItems.PassMC.val('');
     IItems.RegPass.val('');
     IItems.RegPassR.val('');
     IItems.RegAnswer.val('');
     IItems.NavInContacts.show();
     $("#chatHeader").show();

     //MCStorage.local.UserInfo = UserInfo;

     window.onbeforeunload = function(e) {
         if (SessionID != ""){
             return LMSG["46"];
         }
     };

     window.onunload = function(e){
         if (SessionID != ""){
             MCConnect.asyncType = false;
             MCConnect.ImmediatelySendToServer(CS_CMD.Quit + CR + SessionID, function(){});
         }
     }

     setTimeout(function(){
         hideModal();
     }, 1000);
 };

 MCFunc.InitNavBTNs          = function InitNavBTNs(){
     IItems.NavMyChat.Contacts.on('vclick', function(e){
         MCFunc.HideAllComponents();
         MCFunc.ShowContacts();
     });

     IItems.NavMyChat.UChat.on('vclick', function(e){
         MCFunc.HideAllComponents();
         MCFunc.UserPrivate(MCInfo.CurrentPrivate, true);
         AudioVideo.ShowVideo();
     });

     IItems.NavMyChat.Talks.on('vclick', function(e){
         MCFunc.HideAllComponents();
         MCFunc.ShowTalks();
     });

     IItems.NavMyChat.Options.on('vclick', function(e){
         MCFunc.HideAllComponents();
         MCFunc.ShowOptions();
     });

     IItems.NavInContacts.Common.on("vclick", function(e){
         IItems.PersonalContacts.hide();
         IItems.CommonContacts.show();

         IItems.NavInContacts.Personal.removeClass('ui-btn-active');
         IItems.NavInContacts.Common.addClass('ui-btn-active');
     });

     IItems.NavInContacts.Personal.on("vclick", function(e){
         IItems.CommonContacts.hide();
         IItems.PersonalContacts.show();

         IItems.NavInContacts.Common.removeClass('ui-btn-active');
         IItems.NavInContacts.Personal.addClass('ui-btn-active');
     });
 };

 MCFunc.ChangeNavBTN         = function(btn, callback){
     $(".ui-btn-active:first", IItems.NavMyChat).removeClass('ui-btn-active');

     var flag = true;
     var BTN = IItems.NavMyChat[btn];

     if (BTN) {
         BTN.addClass('ui-btn-active');

         if (BTN.hasClass('ui-disabled')){
             BTN.removeClass('ui-disabled');
         }
     } else
     if (btn && btn.addClass){
         btn.addClass('ui-btn-active');

         if (btn.hasClass('ui-disabled')){
             btn.removeClass('ui-disabled');
         }
     } else {
         console.err("Can't switch to BTN: " + btn);

         flag = false;
     };

     if (callback && flag){
         callback();
     };
 };

 MCFunc.getRealContentHeight = function getRealContentHeight() {
     var header  = IItems.chatHeader;
     var footer  = IItems.chatFooter;
     var content = IItems.ChatPage;
     var viewport_height = $(document).height();

     var content_height = viewport_height - header.outerHeight() - footer.outerHeight();

     if((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
         content_height -= (content.outerHeight() - content.height());
     };

     return content_height;
 };

 MCFunc.DrawCommonContacts   = function DrawCommonContacts (){
     MCFunc.InitContacts({
         CList      : MCInfo.CommonList,
         UList      : MCInfo.CommonList.Users,
         Target     : IItems.CommonContacts,
         idDeptPref : "CList-",
         idUserPref : "CUList-"
     });

     $('[id ^= CList-]', IItems.CommonContacts).collapsible({refresh : true});
     $('[id ^= CUList-]', IItems.CommonContacts).listview({refresh : true});

     $('[class *= ' + Constants.idA + ']', IItems.CommonContacts).on("vclick", MCFunc.Service.OnUserClickInContacts);

     MCFunc.Service.OnOptionsClickInContacts(IItems.CommonContacts);

     setTimeout(function(){
         MCFunc.ShowContacts();
     }, 10);
 };

 MCFunc.DrawPersonalContacts = function DrawPersonalContacts(){
     MCFunc.InitContacts({
         CList      : MCInfo.PersonalList,
         UList      : MCInfo.PersonalList.Users,
         Target     : IItems.PersonalContacts,
         idDeptPref : "PList-",
         idUserPref : "PUList-"
     });

     $('[id ^= PList-]', IItems.PersonalContacts).collapsible({refresh : true});
     $('[id ^= PUList-]', IItems.PersonalContacts).listview({refresh : true});

     $('[class *= ' + Constants.idA + ']', IItems.PersonalContacts).on("vclick", MCFunc.Service.OnUserClickInContacts);

     MCFunc.Service.OnOptionsClickInContacts(IItems.PersonalContacts);
 };

 MCFunc.InitContacts         = function InitContacts(_options){//CList, Target
     var Options = $.extend({
         CList      : MCInfo.CommonList,
         UList      : MCInfo.CommonList.Users,
         Target     : IItems.CommonContacts,
         idDeptPref : "CList-",
         idUserPref : "UList-",
         idUL       : Constants.idUL,
         idA        : Constants.idA
     }, _options || {});

     var _layer   = Options.Target; //IItems.CommonContacts;
     var deptList = Options.CList.Depts;
     var userList = Options.UList;

     for (var _dept in deptList){

         if (deptList[_dept].Parent != '0'){
             _layer = $("#" + Options.idDeptPref + deptList[_dept].Parent);
         };

         var _collapsible = $('<div/>', {
             "data-role"           : "collapsible",
             "data-theme"          : "c",
             "data-content-theme"  : "c",
             "data-collapsed-icon" : "arrow-r",
             "data-expanded-icon"  : "arrow-d",
             "data-inset"          : "false",
             "html"                : "<h3>" + deptList[_dept].Name + "</h3>",
             "id"                  : Options.idDeptPref + deptList[_dept].ID
         });

         _layer.append(_collapsible);

         if (userList && userList[_dept]){
             var _users = "";
             var _listview = $("<ul/>", {
                 "data-role"           : "listview",
                 "data-theme"          : "d",
                 //"data-content-theme"  : "e",
                 "data-inset"          : "false",
                 "data-split-icon"     : "gear",
                 "id"                  : Options.idUserPref + deptList[_dept].ID
             });

             for (var i = 0; i < userList[_dept].length; i++){
                 var usr = MCFunc.Service.AddUserToContactList({
                     Sex   : userList[_dept][i].Sex,
                     State : userList[_dept][i].State,
                     UIN   : userList[_dept][i].UIN,
                     Nick  : userList[_dept][i].Nick,
                     idUL  : Options.idUL,
                     idA   : Options.idA
                 });

                 if (userList[_dept][i].State == Constants.offline){ //"0"
                     _users = _users + usr;
                 } else {
                     _users = usr + _users;
                 };
             };

             _collapsible.append(_listview.append(_users));
         };

         if (!isObjectEmpty(deptList[_dept])){
             var _obj = $.extend(Options ,{
                 CList : deptList[_dept]
             });

             MCFunc.InitContacts(_obj);
         };
     };
 };

 MCFunc.TypingNotifyBlock    = function TypingNotifyBlock(uin){
     if (MCInfo.CurrentPrivate && MCInfo.CurrentPrivate.UIN == uin && !gifTypingNotifyStarted){
         gifTypingNotifyStarted = true;

         IItems.TypingNotifyBlock.addClass('noBG');
         IItems.TypingImage.show();

         setTimeout(function(){
             IItems.TypingNotifyBlock.removeClass('noBG');
             IItems.TypingImage.hide();

             gifTypingNotifyStarted = false;
         }, 3000);
     }
 };

 /**
  * @return {string}
  */
 MCFunc.Service.AddUserToContactList     = function AddUserToContactList(user){
     var Options = $.extend({
         Sex   : '0',
         State : '-1',
         UIN   : '0',
         myUIN : UserInfo.UIN,
         Nick  : 'Elisa',
         idUL  : Constants.idUL,
         idA   : Constants.idA
     }, user || {});

     var res = "";
     var gender = (Options.Sex == '0') ? "alien" : ((Options.Sex == '1') ? 'man' : 'woman');
     var state  = (Options.State == Constants.offline)? '_offline' : '';

     if (Options.UIN != Options.myUIN){
         res = "<li class='" + Options.idUL + Options.UIN + "'>" +
             "<a class='contacts-li-user " + Options.idA + Options.UIN + " " + state + "' data-uin='" + Options.UIN + "' href='#'>" +
             "<img src='img/" + gender + state + ".png' alt='" + gender + "'>" +
             "<span style='float: left;'>" +Options.Nick.replace("<", "&lt;") + "</span>" +
             "<span style='float: right;'> UIN: " + Options.UIN + "</span>" +
             "</a>" +
             "<a href='#' class='popupBTNinContacts' data-rel='popup' data-position-to='window' data-transition='pop' data-theme='c' uin=" + Options.UIN + " >Options</a>" +
             "</li>";
     };

     return res;
 };

 MCFunc.Service.OnUserClickInContacts    = function OnUserClickInContacts(e){
     var uin = $(this).attr("data-uin");

     MCFunc.RequestOpenPrivate(uin);

     e.preventDefault();
     e.stopImmediatePropagation();
 };

 MCFunc.Service.OnOptionsClickInContacts = function OnOptionsClickInContacts(target){
     $(".popupBTNinContacts", target).on('vclick', function(e){
         var uin = $(this).attr("uin");

         MyDialog.ShowDialog({
             Role    : MyDialog.Roles.Menu,
             MenuList: {
                 "opnPr" : {
                     Desc    : LMSG["22"],
                     OnClick : function(e){
                         MCFunc.HideAllComponents();

                         MCFunc.UserPrivate(MCInfo.AllUsersList[uin], true);

                         /*e.preventDefault();
                         e.stopImmediatePropagation();

                         MyDialog.ClosePopup();*/
                     }
                 }
             }
         });

         e.preventDefault();
         e.stopImmediatePropagation();
     });
 };

 MCFunc.Service.FillCommonList           = function FillCommonList(_obj, CommonList){
     var body = _obj.Body.split(terminator);

     CommonList.Head      = _obj.Head;
     CommonList.UserCount = body.shift();
     CommonList.DeptCount = body.shift();

     for (var i = 0; i < CommonList.DeptCount; i++){
         var _id          = body.shift();
         var _name        = body.shift();
         var _parent      = body.shift();
         var _parentItem  = MCInfo.FindParent(_parent, CommonList.Depts, 'Depts');

         if (_parent == '0'){
             _parentItem[_id] = {
                 ID    : _id,
                 Parent: _parent,
                 Name  : _name,
                 Depts : {}
             };
         } else
         if (_parentItem){
             _parentItem.Depts[_id] = {
                 ID    : _id,
                 Parent: _parent,
                 Name  : _name,
                 Depts : {}
             };
         } else if (console) console.warn('Parent Item: ' + _parent + ' not found!');
     };

     for (var i = 0; i < CommonList.UserCount; i++){
         var _uin    = body.shift();
         var _parent = body.shift();
         var _sex    = body.shift();
         var _avatar = body.shift();
         var _nick   = body.shift();

         MCInfo.AddInAllUsers(_uin, {
             UIN    : _uin,
             Parent : _parent,
             Sex    : _sex,
             Avatar : _avatar,
             Nick   : _nick,
             State  : parseInt(CommonList.Head[i]) - 1
         });

         if (_uin != UserInfo.UIN){
             if (!CommonList.Users[_parent]) CommonList.Users[_parent] = [];

             CommonList.Users[_parent].push(MCInfo.AllUsersList[_uin]);
         };
     };

     return CommonList;
 };

 MCFunc.Service.FillPersonalList         = function FillPersonalList(_obj, PersonalList){
     var body = _obj.Body.split(terminator);
     var uIDX = 0;

     PersonalList.Head      = _obj.Head;
     PersonalList.UserCount = PersonalList.Head.length;
     PersonalList.DeptCount = body.shift();

     for (var i = 0; i < PersonalList.DeptCount; i++){
         var _id     = i;
         var _parent = 0;
         var _name   = body.shift();
         var _uCount = body.shift();

         PersonalList.Depts[_id] = {
             ID     : _id,
             Parent : _parent,
             Name   : _name,
             Depts  : {}
         };

         for (var u = 0; u < _uCount; u++){
             var _uin = body.shift();
             var _ava = body.shift();
             var _nik = body.shift();
             var _sex = body.shift();

             MCInfo.AddInAllUsers(_uin, {
                 UIN    : _uin,
                 Parent : _id,
                 Sex    : _sex,
                 Avatar : _ava,
                 Nick   : _nik,
                 State  : parseInt(PersonalList.Head[uIDX]) - 1
             });

             if (!PersonalList.Users[_id]) PersonalList.Users[_id] = [];

             PersonalList.Users[_id].push(MCInfo.AllUsersList[_uin]);

             uIDX ++;
         };
     };

     return PersonalList;
 };

 MCFunc.Service.FilterContacts           = function FilterContacts(val){
     if (val.length > 0 ) {
         if (isShowed.Contacts){
             IItems.DisplayContacts.hide();
             IItems.NavInContacts.hide();
         }

         if (isShowed.Talks){
             IItems.TalkHistory.hide();
         }

         MCFunc.ShowFilterResult();

         var list = [];
         var copyOfList = [].concat(MCInfo.LocalFilterResult);

         for (var user in MCInfo.UsersByNick){
             if (user.toLowerCase().indexOf(val.toLowerCase()) != -1){
                 list.push(MCInfo.UsersByNick[user]);
             }
         }

         var item = 0;

         while (item < MCInfo.LocalFilterResult.length){
             var idx = list.indexOf(MCInfo.LocalFilterResult[item]);

             if ((idx == -1) || ((list[idx] != undefined) && (list[idx] != MCInfo.LocalFilterResult[item]))){
                 $(".flr-ul-" + MCInfo.LocalFilterResult[item], IItems.FilterResult).remove();

                 MCInfo.LocalFilterResult.splice(item, 1);
             } else {
                 item ++;
             }
         }

         for (var item = 0; item < list.length; item ++){
             var idx = MCInfo.LocalFilterResult.indexOf(list[item]);

             if (idx == -1){
                 MCInfo.LocalFilterResult.push(list[item]);

                 IItems.FilterResult.append(MCFunc.Service.AddUserToContactList({
                     Sex   : MCInfo.AllUsersList[list[item]].Sex,
                     State : MCInfo.AllUsersList[list[item]].State,
                     Nick  : MCInfo.AllUsersList[list[item]].Nick,
                     UIN   : list[item],
                     myUIN : UserInfo.UIN,
                     idUL  : "flr-ul-",
                     idA   : "ftl-a-"
                 }))
             }
         }

         IItems.FilterResult.listview('refresh');
     } else {
         MCFunc.HideFilterRsult();

         IItems.DisplayContacts.show();
         IItems.NavInContacts.show();

         IItems.FilterResult.empty();

         MCInfo.LocalFilterResult  = [];
         MCInfo.ServerFilterResult = [];
     }
 };

 MCFunc.HideContacts        = function HideContacts(){
     if (isShowed.Contacts){
         IItems.DisplayContacts.hide();
         IItems.NavInContacts.hide();
         IItems.ContactsFilter.hide();
         IItems.ContactsFilter.Val.val('');
         IItems.PageWrapper.removeClass("ContactsWrapper");

         isShowed.Contacts = false;
     }
 };
 MCFunc.HideFilterRsult     = function HideFilterResult(){
     if (isShowed.Filters){
         IItems.PageWrapper.removeClass("HistoryContactsWrapper");
         IItems.FilterResultWrapper.hide();

         isShowed.Filters = false;
     }
 };
 MCFunc.HideTalks           = function HideTalks(){
     if (isShowed.Talks){
         IItems.PageWrapper.removeClass("HistoryContactsWrapper");
         IItems.TalkHistory.hide();
         IItems.ContactsFilter.hide();
         IItems.ContactsFilter.Val.val('');

         isShowed.Talks = false;
     }
 };
 MCFunc.HideCurrentPrivate  = function HideCurrentPrivate(){
     if (isShowed.Chat){
         IItems.DislpayUserInfo.hide();
         IItems.DisplayText.hide();
         IItems.PrivateInputText.hide();

         if (MCInfo.CurrentPrivate.DisplayText) MCInfo.CurrentPrivate.DisplayText.hide();

         IItems.PageWrapper.removeClass("ContentWrapper");
         AudioVideo.ShowVideo();

         isShowed.Chat = false;
     }
 };
 MCFunc.HideOptions         = function HideOptions(){
     if (isShowed.Options){
         IItems.PageWrapper.removeClass("OptionsWrapper");
         IItems.ChatOptions.hide();

         isShowed.Options = false;
     }
 };

 MCFunc.ShowContacts        = function ShowContacts(){
     if (!isShowed.Contacts){
         IItems.DisplayContacts.show();
         IItems.NavInContacts.show();
         IItems.ContactsFilter.show();
         IItems.PageWrapper.scrollTop(0)
         IItems.PageWrapper.addClass("ContactsWrapper");

         isShowed.Contacts = true;
     }
 };
 MCFunc.ShowFilterResult    = function ShowFilterResult (){
     if (!isShowed.Filters){
         IItems.PageWrapper.addClass("HistoryContactsWrapper");
         IItems.FilterResultWrapper.show();

         isShowed.Filters = true;
     }
 };
 MCFunc.ShowCurrentPrivate  = function ShowCurrentPrivate(){
     if (!isShowed.Chat){
         IItems.DislpayUserInfo.show();
         IItems.PrivateInputText.show();

         if (MCInfo.CurrentPrivate.DisplayText) MCInfo.CurrentPrivate.DisplayText.show();

         AudioVideo.ShowVideo();
         IItems.DisplayText.show().scrollTop(99999);
         IItems.PageWrapper.addClass("ContentWrapper");

         isShowed.Chat = true;
     }
 };
 MCFunc.ShowTalks           = function ShowTalks(){
     if (!isShowed.Talks){
         IItems.PageWrapper.addClass("HistoryContactsWrapper");
         IItems.TalkHistory.show();
         IItems.ContactsFilter.show();

         isShowed.Talks = true;
     }
 };
 MCFunc.ShowOptions         = function ShowOptions(){
     if (!isShowed.Options){
         IItems.PageWrapper.addClass("OptionsWrapper");
         IItems.ChatOptions.show();

         isShowed.Options = true;
     }
 };

 MCFunc.HideAllComponents   = function HideAllComponents(){
     MCFunc.HideContacts();
     MCFunc.HideCurrentPrivate();
     MCFunc.HideTalks();
     MCFunc.HideOptions();
     AudioVideo.HideVideo();
     MCFunc.HideFilterRsult();
 };

 MCFunc.CallsDisable        = function CallsDisable(){
     IItems.Voice_Call.addClass('ui-disabled');
     IItems.Video_Call.addClass('ui-disabled');
 };

 MCFunc.CallsEnable         = function CallsEnable(){
     IItems.Voice_Call.removeClass('ui-disabled');
     IItems.Video_Call.removeClass('ui-disabled');
 };

 MCFunc.ShowHideMenu        = function ShowHideMenu(e){
     if (!isObject(e)){
         isShowed.TopMenu = e;
     }

     if (isShowed.TopMenu){
         IItems.NavMyChat.hide();
         IItems.PageWrapper.addClass('NoMenu');

         isShowed.TopMenu = false;

         IItems.MenuInUserInfo.buttonMarkup({ theme: "c", icon: "arrow-d" });
     } else {
         IItems.NavMyChat.show();
         IItems.PageWrapper.removeClass('NoMenu');

         isShowed.TopMenu = true;

         IItems.MenuInUserInfo.buttonMarkup({ theme: "b", icon: "arrow-u" });
     }

     AudioVideo.RecalcVideoSize();

     if (isObject(e)){
         e.preventDefault();
         e.stopImmediatePropagation();

         return false;
     }
 };

 //========================================================================================

 AudioVideo.UserList             = null;

 AudioVideo.InitCallsBTN         = function InitCallsBTN(){
     IItems.Video_Call.on('vclick', function onVideo_Call(e){
         AudioVideo.Call();

         e.preventDefault();
         e.stopImmediatePropagation();
     });

     IItems.Voice_Call.on('vclick', function onVoice_Call(e){
         AudioVideo.Call(false);

         e.preventDefault();
         e.stopImmediatePropagation();
     });

     IItems.Close_Call.on('vclick', function onClose_Call(e){
         AudioVideo.DropCall(UserInfo.CallerID);

         e.preventDefault();
         e.stopImmediatePropagation();
     });
 };

 AudioVideo.Call                 = function AudioVideoCall(video){
     UserInfo.CallerUIN     = MCInfo.CurrentPrivate.UIN;
     UserInfo.CallWithVideo = (video === undefined) ? true : video;

     MCFunc.ShowHideMenu();

     MCFunc.SendMSG_ToPivate(LMSG["55"]);

     AudioVideo.Connect(UserInfo.UIN + "_" + UserInfo.CallerUIN);
 };

 AudioVideo.HideCallBTN          = function HideCallBTN(){
     IItems.Voice_Call.hide();
     IItems.Video_Call.hide();

     IItems.Close_Call.show();
 };

 AudioVideo.ShowCallBTN          = function ShowCallBTN(){
     IItems.Close_Call.hide();

     IItems.Voice_Call.show();
     IItems.Video_Call.show();
 };

 AudioVideo.Connect              = function Connect(SessionName, onConnect, onFail) {
     MyDialog.ShowDialog({
         Role    : MyDialog.Roles.Menu,
         Title   : LMSG["56"] + ((parseInt(MCInfo.CurrentPrivate.Sex) < 2) ? LMSG["57"] : LMSG["58"]),
         CloseBTN: false,
         MenuList: {
             "reject" : {
                 Desc    : LMSG["61"],
                 OnClick : function(){
                     AudioVideo.RejectCall(UserInfo.CallerUIN);
                     AudioVideo.DropCall(UserInfo.CallerID);

                     MyDialog.ClosePopup();
                 }
             }
         }
     });
     //showModal(LMSG["56"] + ((parseInt(MCInfo.CurrentPrivate.Sex) < 2) ? LMSG["57"] : LMSG["58"]), 11);

     AudioVideo.HideCallBTN();

     console.log("Initializing.");

     easyRTC.setVideoDims(640,480);
     easyRTC.enableAudio(true);
     easyRTC.enableVideo(UserInfo.CallWithVideo);

     //easyRTC.enableDebug(true);

     easyRTC.setLoggedInListener(AudioVideo.FindMyCaller);

     //console.log('Status: ' + easyRTC.getConnectStatus(UserInfo.MyCallerID));
     //console.log('Count:  ' + easyRTC.getConnectionCount());

     easyRTC.connect(SessionName, onConnect || AudioVideo.GetMyCallerID, onFail || AudioVideo.loginFailure);
 };

 AudioVideo.GetMyCallerID        = function (RTC_ID){
     UserInfo.MyCallerID = RTC_ID;

     console.log('Get Audio-Video ID: ' + UserInfo.MyCallerID);

     //IItems.Sound_Calling.load();
     IItems.Sound_Calling.play();

     if (UserInfo.CallerUIN != '0'){
         MCFunc.SendDataToServer({
             CMD  : CS_CMD.CallUser,
             Data : SessionID + CR + UserInfo.CallerUIN + CR + BoolToInt(UserInfo.CallWithVideo) + CR + UserInfo.MyCallerID
         })
     } else {
         IItems.Sound_Calling.pause();
     }
 };

 AudioVideo.SendMediaAccept      = function SendMediaAccept(RTC_ID){
     showModal(LMSG["59"] + ((parseInt(MCInfo.CurrentPrivate.Sex) < 2) ? LMSG["63"] : LMSG["64"]) + LMSG["60"], 12);

     UserInfo.MyCallerID = RTC_ID;

     console.log('Get Audio-Video ID: ' + UserInfo.MyCallerID);

     MCFunc.SendDataToServer({
         CMD  : CS_CMD.AcceptCall,
         Data : SessionID + CR + UserInfo.CallerUIN + CR + BoolToInt(UserInfo.CallWithVideo) + CR + UserInfo.MyCallerID
     })
 };

 AudioVideo.DropCall             = function DropCall(caller){
     console.log('AudioVideo.DropCall: ' + caller);

     if (caller === UserInfo.CallerID){
         showModal(LMSG["62"]);

         setTimeout(function(){
             hideModal();

             MCFunc.ShowHideMenu(false);
         }, 1000);

         easyRTC.clearMediaStream(document.getElementById(Constants.CallerVid));

         UserInfo.CallerID = "";

         easyRTC.hangupAll();
         easyRTC.clearMediaStream(document.getElementById(Constants.myMirror));

         UserInfo.EmptyCallInfo();

         IItems.Sound_Calling.pause();
         IItems.Sound_Ring.pause();

         if ( easyRTC.localStream ){
             easyRTC.localStream.stop();
             easyRTC.localStream = null;
         }

         AudioVideo.ShowCallBTN();
         AudioVideo.HideVideo();
     }

     easyRTC.disconnect();

     UserInfo.CallStarted = false;

     IItems.PageWrapper.removeAttr('style');
 };

 AudioVideo.RejectCall           = function RejectCall(uin){
     MCFunc.SetNewUserInfo({
         CallerID      : "",
         CallWithVideo : false,
         CallerUIN     : '0'
     });

     IItems.Sound_Calling.pause();
     IItems.Sound_Ring.pause();

     MCFunc.SendDataToServer({
         CMD  : CS_CMD.RejectCall,
         Data : SessionID + CR + uin
     });

     UserInfo.CallStarted = false;
 };

 AudioVideo.loginFailure         = function loginFailure(message) {
     easyRTC.showError("LOGIN-FAILURE", message);
 };

 AudioVideo.FindMyCaller         = function FindMyCaller(data) {
     AudioVideo.UserList = data;

     console.log('FindMyCaller:\n' + JSON.stringify(AudioVideo.UserList));
 };

 AudioVideo.ShowMirror           = function ShowMirror(){
     if (UserInfo.CallWithVideo) {
         AudioVideo.ShowVideo();

         var selfVideo = document.getElementById(Constants.myMirror);

         easyRTC.setVideoObjectSrc(selfVideo, easyRTC.getLocalStream());

         MCFunc.ShowHideMenu(true);

         UserInfo.CallStarted = true;

         AudioVideo.ShowVideo();
     }

     hideModal();
 };

 AudioVideo.PerformCall          = function performCall(callerID) {
     easyRTC.hangupAll(callerID);

     IItems.Sound_Calling.pause();
     //IItems.Sound_Ring.pause();

     showModal(LMSG["59"] + ((parseInt(MCInfo.CurrentPrivate.Sex) < 2) ? LMSG["63"] : LMSG["64"]) + LMSG["60"], 12);

     var acceptedCB = function(accepted, caller) {
        // showModal(LMSG["60"] + ((parseInt(MCInfo.CurrentPrivate.Sex) < 2) ? LMSG["57"] : LMSG["58"]));

         if( !accepted ) {
             console.log("easyRTC.call no accepted");

             AudioVideo.DropCall(caller);
             //AudioVideo.DropCall(UserInfo.CallerID);
         }
     };

     var successCB = function() {
         setTimeout(function(){
             AudioVideo.ShowMirror();
         }, 150)
     };

     var failureCB = function(){
         console.log("easyRTC.call fail");

         AudioVideo.DropCall(callerID);
     };

     easyRTC.call(callerID, successCB, failureCB, acceptedCB);
 };

 AudioVideo.ShowVideo            = function ShowVideo(){
     if (UserInfo.CallStarted && UserInfo.CallerUIN == MCInfo.CurrentPrivate.UIN){
         IItems.VideoAndAudioCalls.show();
         IItems.DisplayVideo.show();
         AudioVideo.RecalcVideoSize();
     }
 };

 AudioVideo.HideVideo            = function ShowVideo(){
     IItems.VideoAndAudioCalls.hide();
     IItems.DisplayVideo.hide();
     AudioVideo.RecalcVideoSize(true);
 };

 AudioVideo.RecalcVideoSize      = function RecalcVideoSize(hide){
     if (!hide && UserInfo.CallStarted && UserInfo.CallWithVideo && UserInfo.CallerID != ""){
         IItems.DisplayVideo.height(IItems.DisplayVideo.width() / 16 * 9);
         IItems.VideoAndAudioCalls.height(IItems.DisplayVideo.height());

         var h = parseInt(IItems.VideoAndAudioCalls.height() + ((isShowed.TopMenu) ? IItems.NavMyChat.height() : 0) + IItems.DislpayUserInfo.height());

         IItems.PageWrapper.attr('style', "top: " + h + "px !important;");
     } else {
         IItems.PageWrapper.removeAttr('style');
     }
 };

 $(document).on("pageinit", function( event ) { // Init Page
 easyRTC.getConnectStatus        = function(otherUser) {
     if (typeof easyRTC.peerConns[otherUser] === 'undefined') {
         return easyRTC.NOT_CONNECTED;
     }
     var peer = easyRTC.peerConns[otherUser];
     if ((peer.sharingAudio || peer.sharingVideo) && !peer.startedAV) {
         return easyRTC.BECOMING_CONNECTED;
     }
     else if (peer.sharingData && !peer.dataChannelReady) {
         return easyRTC.BECOMING_CONNECTED;
     }
     else {
         return easyRTC.IS_CONNECTED;
     }
 };

 easyRTC.setStreamAcceptor( function(caller, stream) {
     console.log("setStreamAcceptor: " + caller);

     if (caller != UserInfo.MyCallerID){
         var video = document.getElementById(Constants.CallerVid);

         //IItems.Sound_Calling.pause();
         IItems.Sound_Ring.pause();

         showModal(LMSG["59"] + ((parseInt(MCInfo.CurrentPrivate.Sex) < 2) ? LMSG["63"] : LMSG["64"]) + LMSG["60"], 12);

         easyRTC.setVideoObjectSrc(video, stream);

         setTimeout(function(){
             AudioVideo.ShowMirror();
         }, 150);

         console.log("saw video from " + caller);
     }
 });

 easyRTC.setOnStreamClosed( function(caller){
     console.log("setOnStreamClosed: " + caller);

     if (caller == UserInfo.CallerID){
         AudioVideo.DropCall(caller);
     };

     hideModal();
 });

 easyRTC.setOnError       ( function(errorObject){
     console.log("setOnError: " + errorObject.errText);

     alert("Error code: " + errorObject.errCode + ", text: " + errorObject.errText);

     AudioVideo.DropCall(UserInfo.CallerID);

     hideModal();
 });

 easyRTC.setCallCancelled ( function(caller){
     console.log("setCallCancelled: " + caller);

     if( caller == UserInfo.CallerID) {
         AudioVideo.DropCall(caller);
     };

     hideModal();
 });

 easyRTC.setAcceptChecker ( function(caller, callback) {
     console.log("setAcceptChecker: " + caller);

     if (caller == UserInfo.CallerID) {
         easyRTC.hangupAll(UserInfo.CallerID);

         callback(true);
     } else {
         callback(false);
     }
 });
 });

 //========================================================================================

 (function($) {
     $.fn.OnChange = function OnChange (callback){
         return this.each(function(){
             var self = this;

             KeyEvents.AddEventList({
                 Name  : 'FilterContacts',
                 List  : keyCodes.PrintAndEdit(),
                 CommonCallBack : function(){
                     if (callback) setTimeout(function(){
                         callback($(self).val());
                     }, 0);

                     return true;
                 },
                 Target: $(this)
             });
         });
     };
})(jQuery);

 function RunCMD(InBuf) {
     var _inBuf = [].concat(InBuf);
     var _inBufLength = _inBuf.length;

     if (_inBufLength > 0){
         //console.log("RunCMD, inBuf Length:" + _inBufLength);
         //console.log("_inBuf:\n" + _inBuf);

         var CMD_Bloc = _inBuf.shift();

         if (CMD_Bloc && CMD_Bloc.length > 0){
             CMD_Bloc = StringToObj(CMD_Bloc);

             for (var CMD_Numb in CMD_Bloc){
                 console.log("Receive CMD: " + CMD_Numb);

                 if (ProcessCMD[CMD_Numb]){
                     try {
                         ProcessCMD[CMD_Numb](CMD_Bloc[CMD_Numb]);
                     } catch (e){
                         console.err("Error on CMD: " + CMD_Numb + "\ne: " + e);
                     }
                 } else {
                     console.warn("CMD: " + CMD_Numb + " not found!");
                 }
             }

             if (_inBuf.length > 0) {
                 setTimeout(function(){
                     RunCMD(_inBuf);
                 }, 10);
             }
         }
     }
};

 function OnPingTimerTick(sID){
     MCConnect.SendDataToServer({
         CMD  : CS_CMD.Ping,
         Data : sID
     })
};

 function StartPingTimer(_time, sID){
     var self = this;

     MCConnect.LeaveCallBacks = true;

     MCConnect.SetCallBackFunctionByCMDOnlyOne(CS_CMD.Ping, function(){
         var _inBuf = this;

         if ((_inBuf != "{}") && (_inBuf.length > 0)) {
             setTimeout(function(){
                 RunCMD(_inBuf.split(CR));
             }, 10);
         }
     });

     OnPingTimerTick(sID);

     window.idPingTimer = setInterval(function(){
         OnPingTimerTick(sID);
     }, _time);
     
     this.StopPingTimer = function(){
         clearInterval(window.idPingTimer);

         SessionID = "";
     };

     MCConnect.OnError = function(err){
         switch (err){
             case "error":
                 self.StopPingTimer();

                 if (console) console.warn('Ping-Timer has been Stopped');

                 MyDialog.ShowDialog({
                     Role    : MyDialog.Roles.Error,
                     Variant : 9999,
                     Text    : LMSG["14"],
                     OnClose : function(){
                         window.onbeforeunload = null;
                         window.onunload = null;

                         location.href = '/';
                     }
                 });

                 LoggedIn = false;
             break;
         }
     };
 };

 function TryLogin(e){
     Auth = IItems.LoginMC.val();
     PWD  = IItems.PassMC.val();

     CanDisplayNotificator = CheckNotification(CanDisplayNotificator);

     if ((Auth !="") && (PWD != "")){
         IItems.PassMC.blur();

         showModal();

         IItems.LoginBTN.addClass("ui-disabled");
         IItems.RegistrBTN.addClass("ui-disabled");
         IItems.RepireBTN.addClass("ui-disabled");

         BrowserID = ($.cookie("BrowserID")) ? $.cookie("BrowserID") : "";

         MCConnect.SetCallBackFunctionByCMD(CS_CMD.OK, function(){
             SessionID = this + "";

             setTimeout(function(){
                 PingTamer = new StartPingTimer(PingInterval, SessionID);
             }, 10);
         });

         MCConnect.SendDataToServer({
             CMD  : CS_CMD.Login,
             Data : {
                 UIN  : Auth,
                 Pass : PWD,
                 ID   : BrowserID
             }
         });
     };

     e.preventDefault();
     e.stopImmediatePropagation();
 };

 function TryRegister(e){
     /*{
          "Nick"                 : "Chapay",               // ник пользователя
          "Pass"                 : "@$%dshgsj!",           // пароль для подключения
          "Gender"               : 1,                      // пол пользователя, 0 - неизвестен, 1 - мужской, 2 - женский
          "Firstname"            : "Василий",              // имя пользователя
          "Lastname"             : "Чапаев",               // фамилия пользователя
          "Surname"              : "Иванович",             // отчество пользователя
          "Avatar"               : 24,                     // номер аватара
          "Email"                : "v.i.chapayev@mail.su", // адрес электронной почты
          "SecretQuestionNumber" : 0,                      // номер секретного вопроса для восстановления пароля
          "SecretAnswer"         : "совершенно секретно",  // ответ на секретный вопрос
          "State"                : 0                       // текущий статус пользователя (0 - свободен)
     }*/

     var RegName    = IItems.RegName.val();
     var RegPass    = IItems.RegPass.val();
     var RegPassR   = IItems.RegPassR.val();
     var Gender     = (IItems.RegMan[0].checked) ? 1 : (IItems.RegWoman[0].checked) ? 2 : 0;
     var RegEmail   = IItems.RegEmail.val();
     var RegAnswer  = IItems.RegAnswer.val();
     var RegAnswerN = IItems.SecretAnswerSelect.children(":selected").attr("value");
     var WrongField = -1;
     var WrongMSGs = [LMSG["42"], LMSG["43"], LMSG["44"], LMSG["45"]];

     var CanReg = true;

     CanReg = (RegName != "");
     WrongField = (CanReg) ? -1 : 0;

     if (CanReg) {
         CanReg = CanReg &&
             (RegPass != "") && (RegPassR != "") &&
             (RegPass == RegPassR) &&
             (RegPass.indexOf(" ") == -1)  && (RegPassR.indexOf(" ") == -1) &&
             (RegPass.indexOf(CRLF) == -1) && (RegPassR.indexOf(CRLF) == -1);
         WrongField = (CanReg) ? -1 : 1;
     };

     if (CanReg) {
         CanReg = CanReg && isValidEmailAddress(RegEmail);
         WrongField = (CanReg) ? -1 : 2;
     };

     if (CanReg) {
         CanReg = CanReg && RegAnswer != "";
         WrongField = (CanReg) ? -1 : 3;
     };

     CanDisplayNotificator = CheckNotification(CanDisplayNotificator);

     if (CanReg){
         showModal();

         IItems.RegName.blur();
         IItems.RegPass.blur();
         IItems.RegPassR.blur();
         IItems.RegEmail.blur();
         IItems.RegAnswer.blur();

         IItems.TryRegisterBTN.addClass("ui-disabled");
         IItems.BackToLogin.addClass("ui-disabled");

         BrowserID = ($.cookie("BrowserID")) ? $.cookie("BrowserID") : "";

         MCConnect.SetCallBackFunctionByCMD(CS_CMD.OK, function(){
             SessionID = this + "";

             setTimeout(function(){
                 PingTamer = new StartPingTimer(PingInterval, SessionID);
             }, 10);
         });

         MCConnect.SendDataToServer({
             CMD  : CS_CMD.Register,
             Data : {
                 UIN     : RegName,
                 Pass    : RegPass,
                 ID      : BrowserID,

                 Gender  : Gender,
                 Email   : RegEmail,
                 SecretN : RegAnswerN,
                 SecretA : RegAnswer
             }
         });
     } else {
         MyDialog.ShowDialog({
             Role    : MyDialog.Roles.Message,
             Title   : LMSG["40"],
             Text    : LMSG["41"] + "<br>" + WrongMSGs[WrongField],
             OnClose : function(){
                 IItems.RegName.focus();
             }
         });
     };

     e.preventDefault();
     e.stopImmediatePropagation();
 };

 function ShowRegister(){
     IItems.SecretAnswerSelect.selectmenu( "refresh" );
     IItems.RegisterLogin.show();
 };

 function ShowLogin(){
     IItems.ContentLogin.show();
 };

 function HideRegister(){
     IItems.RegisterLogin.hide();
 };

 function HideLogin(){
     IItems.ContentLogin.hide();
 };

 function KeyboardInit(){
     KeyEvents.AddEventList({
         Name : 'TryLogin',
         List : (function () {
             var _list = {};

             _list[keyCodes.enter] = TryLogin;

             return _list;
         })(),
         Target : IItems.PassMC
     });

     KeyEvents.AddEventList({
         Name : 'SendPrivateMSG',
         List : (function(){
             var _list = {};

             _list[keyCodes.enter] = MCFunc.SendMSG_ToPivate;

             return _list
         })(),
         Target: IItems.PrivateInputText
     });

     KeyEvents.AddEventList({
         Name  : 'TypingNotifyInPrivate',
         List  : keyCodes.PrintAndEdit(),
         CommonCallBack : function(){
             if (TypingCount == TypingSend){
                 MCFunc.SendDataToServer({
                     CMD  : CS_CMD.Typing,
                     Data : SessionID + CR + MCInfo.CurrentPrivate.UIN
                 });

                 TypingCount = 0;
             } else {
                 TypingCount ++;
             }

             return true;
         },
         Target: IItems.PrivateInputText
     });

     KeyEvents.AddEventList({
         Name : 'enterOnLogin',
         List : (function(){
             var _list = {};

             _list[keyCodes.enter] = function(){
                 IItems.LoginMC.blur();
             };

             return _list
         })(),
         Target : IItems.LoginMC
     });
 };

 function Click_Functions(){
     IItems.LoginBTN.on('vclick', TryLogin);
     IItems.TryRegisterBTN.on('vclick', TryRegister);

     IItems.RegistrBTN.on('vclick', function(e){
         $('.Web-o-ChatLogo').hide();
         HideLogin();
         ShowRegister();

         IItems.RegName.focus();


         e.preventDefault();
         e.stopImmediatePropagation();
     });
     IItems.BackToLogin.on('vclick', function(e){
         HideRegister();
         $('.Web-o-ChatLogo').show();
         ShowLogin();

         e.preventDefault();
         e.stopImmediatePropagation();
     });

     IItems.MenuInUserInfo.on("vclick", MCFunc.ShowHideMenu);

     $(".ui-icon-delete", IItems.ContactsFilter.parent()).on("vclick", function(){
         MCFunc.Service.FilterContacts('');
     })
 };

 console.log(mobileDetection.any());
 //=============================================================

$(document).on("pageinit", function( event ) { // Init Page
    $.mobile.defaultPageTransition   = 'none';
    $.mobile.defaultDialogTransition = 'none';
    $.mobile.useFastClick            = true;

    MyDialog = new TDialog();

    IItems.MyBody             = $("#MyBody");
    IItems.LoginBTN           = $("#LoginBTN");
    IItems.RegistrBTN         = $("#RegistrBTN");
    IItems.RepireBTN          = $("#RepireBTN");
    IItems.LoginMC            = $("#LoginMC");
    IItems.PassMC             = $("#PassMC");

    IItems.BackToLogin        = $("#BackToLogin");
    IItems.RegName            = $("#RegName");
    IItems.RegPass            = $("#RegPass");
    IItems.RegPassR           = $("#RegPassR");
    IItems.RegMan             = $("#RegMan");
    IItems.RegWoman           = $("#RegWoman");
    IItems.RegEmail           = $("#RegEmail");
    IItems.RegAnswer          = $("#RegAnswer");
    IItems.TryRegisterBTN     = $("#TryRegisterBTN");
    IItems.SecretAnswerSelect = $("#SecretAnswerSelect");

    IItems.ContentLogin       = $(".content-login");
    IItems.RegisterLogin      = $('.register-login');
    IItems.ChatPage           = $("#ChatPage");

    IItems.NavMyChat          = $(".nav-mychat");
    IItems.NavMyChat.Contacts = $(".nav-contacts");
    IItems.NavMyChat.UChat    = $(".nav-user-chat");
    IItems.NavMyChat.Talks    = $(".nav-talks");
    IItems.NavMyChat.Options  = $(".nav-options");
    IItems.NavMyChat.ActivBTN = MCFunc.ChangeNavBTN;

    IItems.ContactsFilter     = $(".ContactsFilter");
    IItems.ContactsFilter.Val = $("#ContactsFilter");
    IItems.FilterResultWrapper= $("#FilterResultWrapper");
    IItems.FilterResult       = $("#FilterResult");
    IItems.FilterResultFromServer  = $("#FilterResultFromServer");

    IItems.MenuInUserInfo     = $("#MenuInUserInfo");

    IItems.NavInContacts      = $(".nav-in-contacts");
    IItems.NavInContacts.Common   = $(".c-nav-common");
    IItems.NavInContacts.Personal = $(".c-nav-personal");

    IItems.PageWrapper        = $("#PageWrapper");
    IItems.DisplayContacts    = $(".DisplayContacts");
    IItems.DisplayText        = $("#DisplayText");

    IItems.Voice_Call         = $(".phoneCall");
    IItems.Video_Call         = $(".videoCall");
    IItems.Close_Call         = $(".closeCall");

    IItems.Sound_Ring         = document.getElementById("Sound_Ring");
    IItems.Sound_Calling      = document.getElementById("Sound_Calling");

    IItems.DisplayVideo       = $("#videos");
    IItems.VideoAndAudioCalls = $(".VideoAndAudioCalls");

    IItems.AllContacts        = $(".__Contacts");

    // ==FOOTER==
    IItems.chatHeader         = $("#chatHeader");
    IItems.PrivateInputText   = $("#PrivateInputText");
    IItems.chatFooter         = $("#chatFooter");
    IItems.PersonalContacts   = $(".PersonalContacts");
    IItems.CommonContacts     = $(".CommonContacts");
    // ==footer==

    IItems.TalkHistory        = $("#TalkHistory");
    IItems.THUserList         = $("#THUserList");

    IItems.ChatOptions        = $("#ChatOptions");

    IItems.DislpayUserInfo    = $("#DislpayUserInfo");
    IItems.DisplayUserInfoName= $("#DisplayUserInfoName");
    IItems.TypingNotifyBlock  = $("#TypingNotifyBlock");
    IItems.TypingImage        = $("#TypingImage");

    IItems.MyPopup = MyDialog.GetSource;

    LMSG = $.MCLocalize({
        LocalizeFile: "ru.json",
        UserDefinedLocalizeZone: "option, input, textarea"
    });

    MCFunc.InitNavBTNs();

    KeyboardInit();

    Click_Functions();

    $(window).resize(function(){
        AudioVideo.RecalcVideoSize();
    });

    $("#login").on('pagebeforeshow', function(event, ui){
        if (event.target.id == 'login' && ui.prevPage.attr('id') && ui.prevPage.attr('id') != 'login'){
            location.reload();
        }
    });

    IItems.ChatPage.on('pageshow', function(){
        if (SessionID == ""){
            location.href = "/";
        };
    });

    IItems.ChatPage.on('pageshow', hideModal);

    setTimeout(function(){
        IItems.LoginMC.focus();
    }, 100);

    AudioVideo.InitCallsBTN();

    IItems.ContactsFilter.Val.OnChange(MCFunc.Service.FilterContacts);

}); // END Init Page
