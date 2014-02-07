
 var console    = require('console-plus'); 
 var MCServ     = require('net');
 var Service    = require('./service.js');
 var util       = require('util');
 
 var ConnectionsList = {};

 var MagicPacket  = '\u0017\u0006';
 var SendingFlags = '00';

 var CRLF = "\r\n";
 var BR   = "\v";
 var CR   = "\r";
 var LF   = "\n";
 
 var CliCMD = {
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

 var CMD = {
     sc_drop_connect                : '9999',
     // Client CMD ==============================
     cs_hello                       : '0001', // команда-приветствие, отправляется от клиента при подключении к серверу. С этой команды начинается любое подключение к серверу.
     cs_login                       : '0003', // подключение к серверу под заданной учётной записью. Логин может происходить по одному из вариантов: UIN, ник или адрес электронной почты.
     cs_register_new_user           : '0004', // зарегистрировать на сервере нового пользователя.
     cs_domain_login                : '0005', // подключение к серверу с доменной авторизацией в Active Directory.
     cs_restore_account             : '0006', // восстановление своей учётной записи
     cs_work_time_upload_old_data   : '0007', // отправка на сервер данных о рабочем времени клиента, пока тот был в офлайн (нужна доработка)
     cs_restore_connect_to_channels : '0008', // восстановить вход в открытые каналы после отключения от сервера (нужна доработка)
     cs_get_bbs                     : "0009", // получить полный текст доски объявлений
     cs_get_adv_new_data            : "000A", // запрос новых данных на рекламу
     cs_special_ping                : "000B", // пинг сервера, проверка связи
     cs_ping                        : "000B",
     //cs_ping                        : "000C", // пинг от клиента, проверка, есть ли соединение. Если длительное время от клиентов не было пинга или любого другого запроса - соединение считается "мёртвым" и автоматически удаляется с сервера.
     cs_get_channels_list           : "000D", // получить с сервера список созданных каналов
     cs_get_actions_list            : "000E", // получить список ACTIONs, если они есть и к ним есть доступ
     cs_work_time_control_active_caption : "000F", // отправка на сервер данных о рабочем времени, нужна доработка
     cs_get_small_user_info         : "0010", // получить краткую информацию о пользователе
     cs_private_request             : "0011", // запрос на открытие привата с указанным пользователем
     cs_get_hello_msg               : "0012", // запрос содержимого приветствия канала
     cs_pong                        : "0013", // ответ на серверную команду sc_ping
     cs_get_contacts_list           : "0014", // получить список личных персональных контактов.
     cs_get_common_contacts_list    : "0015", // получить список общих контактов (древовидный список контактов, общий для всех пользователей сервера).
     cs_put_msg2txt_channel         : "0016", // отправить сообщение в текстовый канал
     cs_private_msg                 : "0017", // отправить приватное сообшение другому пользователю
     cs_join_txt_channel            : "0018", // подключиться к существующему текстовому каналу
     cs_leave_txt_channel           : "0019", // выйти из текстового канала
     cs_add_new_bbs                 : "001A", // отправить новое сообщение на доску объявлений
     cs_add_personal_contact_group  : "001B", // добавить новую группу в персональную панель контактов
     cs_delete_contact_group        : "001C", // удалить группу контактов из личного списка контактов
     cs_create_txt_channel          : "001D", // создать новый текстовый канал.
     cs_get_uin_info                : "001E", // получить полную информацию об указанном пользователе
     cs_get_uin_foto                : "001F", // получить фотографию пользователя
     cs_get_remote_uin_current_time : "0020", // получить текущее системное время удалённого пользователя
     cs_send_my_current_time        : "0021", // отправить свою текущую дату и время указанному пользователю
     cs_get_user_computer_info      : "0022", // получить IP/MAC адрес и название компьютера удалённого клиента
     cs_get_active_window_caption   : "0023", // получить заголовок активного окна пользователя
     cs_active_window_caption       : "0024", // отправка заголовка активного окна
     cs_get_ignores_list            : "0025", // получить список игноров для указанного пользователя
     cs_update_ignores_list         : "0026", // обновить персональный список игноров (доработать разбор списка)
     cs_get_favorite_channels       : "0027", // получить список "любимых" каналов
     cs_add_favorite_channel        : "0028", // добавить канал с указаненым идентификатором в список "любимых"
     cs_delete_favorite_channel     : "0029", // удалить текстовый канал из списка "любимых"
     cs_get_msgtemplates            : "002A", // получить список персональных "быстрых" сообщений
     cs_update_msgtemplates         : "002B", // сохранить на сервере в своём аккаунте список "быстрых" сообщений
     cs_set_account_password        : "002C", // установить новый пароль для своей учётной записи
     cs_add_new_contact             : "002D", // добавить пользователя в личный список контактов
     cs_delete_contact              : "002E", // удалить контакт из личного списка контактов
     cs_rename_contacts_group       : "002F", // переименовать личную группу контактов
     cs_move_personal_contact       : "0030", // перенести персональный контакт из одной группы в другую
     cs_open_remote_computer_shares : "0031", // окрыть удалённый компьютер по сети Проводником (показать открытые ресурсы (shares))
     cs_forcibly_join_to_text_channel : "0032", // принудительно включить выбранного пользователя в указанный текстовый канал
     cs_change_txtch_topic          : "0033", // изменить тему текстового канала
     cs_get_public_ftp_info         : "0034", // получить информацию с сервера о публичном доступе к общему FTP серверу
     cs_get_channel_history_messages : "0035", // получить историю сообщений в указанном текстовом канале
     cs_rename_text_channel         : "0036", // переименовать существующий текстовый канал
     cs_ignore_get                  : "0037", // добавить в игнор пользователя и / или получить информацию об его игнорировании
     cs_add_ignore                  : "0038", // добавить юзера в игнор-список (либо обновить данные)
     cs_clear_text_channel          : "0039", // очистить выбранный текстовый канал от всех сообщений у всех находящихся в нём пользователей
     cs_personal_message2txtch      : "003A", // персональное/важное сообщение лично другому пользователю в текстовый канал
     cs_block_mac_by_uin            : "003B", // заблокировать MAC адрес пользователя по его UIN
     cs_block_ip_by_uin             : "003C", // заблокировать IP адрес пользователя по его UIN
     cs_kill_user                   : "003D", // отключить пользователя от сервера
     cs_kick_from_txt_channel       : "003E", // выгнать пользователя из текстового канала
     cs_private_beep                : "003F", // отправить пользователю звуковой сигнал
     cs_get_server_uptime           : "0040", // получить аптайм сервера MyChat
     cs_get_server_version          : "0041", // получить версию сервера
     cs_halt_user                   : "0042", // отключить пользователя от сервера и завершить его приложение
     cs_set_state                   : "0043", // установить свой сетевой статус (свободен, занят и т.п.)
     cs_typing_notify               : "0044", // отправить уведомление пользователю о том, что мы ему что-то пишем в привате
     cs_get_user_state              : "0045", // получить статус другого пользователя
     cs_set_uin_foto                : "0046", // установить фотографию для своего профиля
     cs_quit                        : "0047", // пользователь отключается от сервера и посылает ему уведомление об этом
     cs_files_offline_ok            : "0048", // пользователь согласился принять отложенные для него на сервере файлы
     cs_files_offline_late          : "0049", // мы не хотим принимать отложенные для нас файлы прямо сейчас, примем их позже
     cs_files_offline_delete        : "004A", // удалить все файлы, которые были отправлены офлайн указанным пользователем
     cs_get_user_quick_info         : "004B", // получить краткую информацию об указанном пользователе
     cs_raw_data                    : "004C", // отправка произвольного пакета данных для онлайн-клиента
     cs_raw_data_txt_channel        : "004D", // отправка произвольного пакета данных в текстовый канал
     cs_action                      : "004E", // выполнение MyChat Action
     //TODO: добавить недостающие команды здесь!
     cs_send_messages_buffer        : "0079", // отправка буфера сообщений на сервер перед разрывом соединения

     cs_media_call                  : '007A',
     cs_media_call_accept           : '007B',
     cs_media_call_reject           : '007C',

 // Server CMD ==============================
     sc_hello                       : '8000', // ответ на соединение клиента (сигнатура версии которую присылает клиент, например "mc5.0")
     sc_error                       : "8001", // произошла какая-то ошибка
     sc_accept_connection           : "8002", // сервер разрешает соединение
     sc_free_edition                : "8003", // сообщение клиенту, что тот подключен к бесплатному серверу MyChat
     sc_get_all_rights              : "8004", // список прав клиента на сервисы чата, а также список разрешённых и запрещённых плагинов на данном сервере
     sc_login                       : "8005", // fucking login...
     sc_job_positions               : "8006", // * список должностей компании. Нужна доработка
     sc_remote_set_options_file     : "8007", // удалённая отправка списка настроек клиенту (файл). Будет удалено, останется только команда 8022 sc_remote_set_options
     sc_get_channels_list           : "8008", // список каналов, которые созданы на сервере
     sc_bbs_changed                 : "8009", // уведомление клиента о том, что была изменена доска объявлений
     sc_offline_private             : "800A", // офлайн приватное сообщение для клиента
     sc_private                     : "800B", // обычное приватное сообщение для клиента
     sc_get_small_user_info         : "800C", // получить краткую информацию о пользователе (доделать)
     sc_show_advert_block           : "800D", // показать рекламный блок в клиенте
     sc_hide_advert_block           : "800E", // спрятать рекламный блок
     sc_pong                        : "800F", // отправка с сервера команды-реакции на cs_ping, проверка связи
     sc_actions_list                : "8010", // пришёл список команд ACTIONs с сервера, нужна доработка
     sc_files_offline_exists        : "8011", // есть отложенные файлы для клиента
     sc_grant_private_access        : "8012", // разрешение общаться с пользователем в привате, краткая информация о собеседнике
     sc_join_txt_channel            : "8013", // вход пользователя в текстовый канал
     sc_txt_channel_hello_msg       : "8014", // текст приветствия указанного текстового канала
     sc_txt_channel_give_grant      : "8015", // получение прав на текстовый канал
     sc_ulist_in_txt_ch             : "8016", // список пользователей в текстовом канале
     sc_join_newbie_txt_channel     : "8017", // новый пользователь вошёл в текстовый канал
     sc_online_notify               : "8018", // уведомление о том, что пользователь, который нам интересен, появился в онлайн
     sc_broadcast                   : "8019", // текстовое оповещение
     sc_user_online                 : "801A", // указанный пользователь подключен к серверу
     sc_trial                       : "801B", // информация о том, что используемая версия сервера незарегистрирована, и сколько дней осталось до конца работы trial-версии
     sc_remote_set_options          : "801C", // настроить клиент в соответствии с пришедшим набором настроек в JSON формате. Доделать описание
     sc_get_msgtemplates            : "801D", // с сервера пришёл список шаблонов для "быстрых" сообщений. Нужна переделка
     sc_get_contacts_list           : "801E", // список личных контактов клиента. Доделать
     sc_get_common_contacts_list    : "801F", // список общих контактов клиента. Доделать
     sc_ping                        : "2080", // 8020 принудительный пинг с сервера, проверка связи при плохом соединении, нужно при получении ответить командой cs_pong
     sc_ignore                      : "8021", // отправленное сообщение было проигнорировано другим пользователем
     sc_user_state                  : "8022", // текущий статус пользователя
     sc_leave_txt_channel           : "8023", // пользователь вышел из указанного канала, информационное уведомление
     sc_kill_txt_ch                 : "8024", // текстовый канал удалён с сервера
     sc_bbs_body                    : "8025", // содержимое доски объявлений, доработать
     sc_add_personal_contact_group  : "8026", // в персональную панель контактов была успешно добавлена новая группа
     sc_delete_personal_contact_group : "8027", // удалить группу из личного списка контактов
     sc_txt_channel_created         : "8028", // уведомление о том, что на сервере создан новый текстовый канал
     sc_get_uin_info                : "8029", // получение полной информации о пользователе
     sc_get_remote_uin_current_time : "802A", // получить текущее системное время удалённого пользователя (remote user)
     sc_user_current_time           : "802B", // текущие системные дата и время указанного пользователя
     sc_user_foto                   : "802C", // информация о фотографии указанного пользователя
     sc_user_computer_info          : "802D", // информация об IP/MAC адресе пользователя и сетевом имени его компьютера
     sc_get_active_window_caption   : "802E", // запрос сервера у клиента заголовока активного окна
     sc_user_active_window_caption  : "802F", // ответ сервера клиенту с заголовока активного окна
     sc_ignores_list                : "8030", // список игноров для указанного пользователя // доработать разбор строки
     sc_favorite_channels_list      : "8031", // список "любимых" каналов пользователя
     sc_change_password             : "8032", // для пользователя установлен новый пароль к его учётной записи. Команда приходит в ответ на попытку изменения собственного пароля, либо при изменении пароля пользователя принудительно, на сервере, администратором
     sc_add_new_contact             : "8033", // добавить новый контакт в персональный список контактов
     sc_delete_contact              : "8034", // удалён контакт из личного списка контактов
     sc_rename_contacts_group       : "8035", // переименована личная группа контактов
     sc_move_personal_contact       : "8036", // персональный контакт перенесён в новую группу
     sc_open_remote_computer_shares : "8037", // открыть удалённый компьютер по сети Проводником (показать открытые ресурсы (shares))
     sc_txtch_topic_changed         : "8038", // изменена тема текстового канала
     sc_public_ftp_info             : "8039", // информация о публичном доступе к FTP серверу MyChat
     sc_channel_history_messages    : "803A", // получена история сообщений в текстовом канале за временной период
     sc_rename_text_channel         : "803B", // текстовый канал переименован
     sc_user_ignore_info            : "803C", // информация об игнорировании указанного пользователя
     sc_clear_text_channel          : "803D", // очистить выбранный текстовый канал от всех сообщений
     sc_personal_message2txtch      : "803E", // персональное/важное сообщение лично другому пользователю в текстовый канал
     sc_kick_from_txt_channel       : "803F", // пользователя выгнали из текстового канала
     sc_private_beep                : "8040", // отправить пользователю звуковой сигнал
     sc_server_uptime               : "8041", // сколько времени работает сервер MyChat без перезагрузки
     sc_server_version              : "8042", // информация о версии сервера
     sc_user_offline                : "8043", // пользователь с указанным UIN о тключился от сервера
     sc_halt                        : "8044", // немедленно отключиться от сервера и завершить работу приложения в принудительном порядке
     sc_typing_notify               : "8045", // уведомление о том, что нам в привате в данный момент кто-то пишет ответ
     sc_update_user_data            : "8046", // обновить информацию об указанном пользователей
     sc_change_server               : "8047", // изменить параметры подключения к серверу MyChat
     sc_user_quick_info             : "8048", // краткая информация о пользователе
     sc_raw_data                    : "8049", // отправка произвольного пакета данных для онлайн-клиента
     sc_raw_data_txt_channel        : "804A", // отправка произвольного пакета данных в текстовый канал
     sc_files_offline_send_accept   : "804B", // подтверждение на отправку файлов в офлайн (на сервер) для указанного пользователя
     sc_files_request_transfer      : "804C", // запрос на приём файлов от указанного пользователя
     sc_files_transfer_deny         : "804D", // пользователь отказался принимать файлы
     sc_files_transfer_accept       : "804E", // пользователь согласился принимать файлы
     sc_files_transfer_abort        : "804F", // пользователь прервал передачу файлов
     sc_file_internal_send_idx      : "8050", // идёт передача очередного файла
     sc_files_transfer_request_abort : "8051", // пользователь ответил отказом на запрос приёма файлов
     sc_file_internal_sended_ok_idx : "8052", // очередной файл успешно передан
     sc_files_request_timeout       : "8053", // отказ от приёма файлов по тайм-ауту
     sc_registered                  : "805E", // уведомление пользователя о том, что он успешно зарегистрирован на сервере

     sс_media_call                  : '8070',
     sс_media_call_accept           : '8071',
     sс_media_call_reject           : '8072'
//==========================================
 };

 var ClientToServCMD = {};
 var ServToClientCMD = {};

 var ErrorText = {};

 Service.LoadJSONFile(MCPathes.WWW + 'errors.json', function(){
     ErrorText = JSON.parse(this.toString());
 });

 function ServerToClientMultiCMD(cmd, _data) {
    var res      = false;
    var socket   = this;

    var CMD_bloc = [
        CMD.sc_get_all_rights,           CMD.sc_job_positions,
        CMD.sc_get_channels_list,        CMD.sc_join_txt_channel,
        CMD.sc_ulist_in_txt_ch,          CMD.sc_join_newbie_txt_channel,
        CMD.sc_user_online,              CMD.sc_get_msgtemplates,
        CMD.sc_get_common_contacts_list, CMD.sc_grant_private_access,
        CMD.sc_pong,                     CMD.sc_ping,
        CMD.sc_private,                  CMD.sc_get_contacts_list,
        CMD.sc_user_online,              CMD.sc_user_offline,
        CMD.sc_offline_private,          CMD.sc_registered,
        CMD.sc_typing_notify,            CMD.sс_media_call,
        CMD.sс_media_call_accept,        CMD.sс_media_call_reject
    ];

    if (Service.InArray(cmd, CMD_bloc)){
        var out      = {};
            out[cmd] = _data;

       console.log('Received cmd: ' + cmd, console.logLevel.L_Extended);

       UsersInBuffer.AddDataToInBuf(socket.UserInfo.sessionID, out);

       res = true;
    };

    return res;
 };

 // ====================== CLIENT TO SERVER =============================

 ClientToServCMD[CMD.cs_hello] = function(){
    return MagicPacket + CMD.cs_hello + SendingFlags +
           JSON.stringify({
              "ProtocolVer"  : "2.0",               // версия протокола клиента
              "Client"       : "web",               // тип клиента, который подключается к серверу. win32 - Windows-клиент. 
              "Packed"       : false,               // использовать сжатие трафика или нет. По умолчанию - false
              "ServPass"     : MCServer.ServPass,   // пароль для подключения к серверу (если нужно). Если пароля нет - пустая строка
              "MAC"          : "",                  // MAC адрес клиента
              "HardwareID"   : "",                  // timastamp+XY HardwareID клиента
              "NetName"      : "WebChatUser",       // сетевое имя компьютера
              "Ver"          : "5.0",               // версия клиентского приложения
              "OS"           : "Windows 7",         // название и версия операционной системы клиента
              "UTC"          : 2,                   // UTC смещение времени подключающегося клиента
              "Interfaces"   : [                    // список сетевых интерфейсов клиента
                 "1.1.1.1"
              ]
           }) + CRLF; 
 };
 
 ClientToServCMD[CMD.cs_login] = function(userInfo){
     var user = {
         UIN   : "-1",
         Nick  : "",
         Email : "",
         State : 0,
         Pass  : userInfo.pass
     };

     if (Service.isValidEmailAddress(userInfo.login)){
         user.Email = userInfo.login;
     } else
     if ((/^\d+$/).test(userInfo.login)){
         user.UIN = userInfo.login;
     } else {
         user.Nick = userInfo.login;
     };
     
     return MagicPacket + CMD.cs_login + SendingFlags +
            JSON.stringify(user) + CRLF;
 };

 ClientToServCMD[CMD.cs_register_new_user] = function(userInfo){
     var user = {
         Nick                 : userInfo.login,  // ник пользователя
         Pass                 : userInfo.pass,   // пароль для подключения
         Gender               : userInfo.Gender, // пол пользователя, 0 - неизвестен, 1 - мужской, 2 - женский
         Firstname            : "",              // имя пользователя
         Lastname             : "",              // фамилия пользователя
         Surname              : "" ,             // отчество пользователя
         Avatar               : userInfo.Avatar, // номер аватара
         Email                : userInfo.Email,  // адрес электронной почты
         SecretQuestionNumber : userInfo.SecretQuestionNumber, // номер секретного вопроса для восстановления пароля
         SecretAnswer         : userInfo.SecretAnswer,         // ответ на секретный вопрос
         State                : 0                // текущий статус пользователя (0 - свободен)
     };

     return MagicPacket + CMD.cs_register_new_user + SendingFlags +
            JSON.stringify(user) + CRLF;
 };

 ClientToServCMD[CMD.cs_private_request] = function(uin, type){
     return MagicPacket + CMD.cs_private_request + SendingFlags +
            JSON.stringify({
                UIN  : parseInt(uin),
                Task : parseInt(type)
            }) + CRLF;
 };

 ClientToServCMD[CMD.cs_private_msg] = function(uin, msg){
     return MagicPacket + CMD.cs_private_msg + SendingFlags +
            JSON.stringify({
                UIN : uin,
                Msg : msg
            }) + CRLF;
 };

 ClientToServCMD[CMD.cs_ping] = function(){
     return MagicPacket + CMD.cs_ping + SendingFlags + CRLF;
 };

 ClientToServCMD[CMD.cs_quit] = function(){
     return MagicPacket + CMD.cs_quit + SendingFlags + CRLF;
 };

 ClientToServCMD[CMD.cs_send_messages_buffer] = function(msg){
     return MagicPacket + CMD.cs_send_messages_buffer + SendingFlags +
            JSON.stringify(msg) + CRLF;
 };

 ClientToServCMD[CMD.cs_typing_notify] = function(uin){
     return MagicPacket + CMD.cs_typing_notify + SendingFlags +
            JSON.stringify({
                 UIN : uin
            }) + CRLF;
 };

 ClientToServCMD[CMD.cs_media_call] = function(uin, video, cID){
     return MagicPacket + CMD.cs_media_call + SendingFlags +
            JSON.stringify({
                 UIN     : uin,
                 Video   : video,
                 MediaID : cID
            }) + CRLF;
 };

 ClientToServCMD[CMD.cs_media_call_accept] = function(uin, video, cID){
     return MagicPacket + CMD.cs_media_call_accept + SendingFlags +
            JSON.stringify({
                 UIN     : uin,
                 Video   : video,
                 MediaID : cID
            }) + CRLF;
 };

 ClientToServCMD[CMD.cs_media_call_reject] = function(uin){
     return MagicPacket + CMD.cs_media_call_reject + SendingFlags +
            JSON.stringify({
                 UIN     : uin
            }) + CRLF;
 };

 //====================== SEVER TO CLIENT ===============================
      
 ServToClientCMD[CMD.sc_hello] = function(_data){
     var socket = this;

     process.nextTick(function(){
         socket.ServerInfo = _data;

         socket.SendDataToServer(ClientToServCMD[CMD.cs_hello](socket));
     });
 };
 
 ServToClientCMD[CMD.sc_accept_connection] = function(){
     var socket = this;

     process.nextTick(function(){
         console.info("Server is Ready");
         console.log('UserInfo:\n' + JSON.stringify(socket.UserInfo), console.logLevel.L_Full);

         if (socket.UserInfo.authType === CliCMD.Login){
             console.log("Start Login");

             socket.SendDataToServer(ClientToServCMD[CMD.cs_login](socket.UserInfo));
         } else
         if (socket.UserInfo.authType === CliCMD.Register){
             console.log("Start Register");

             socket.SendDataToServer(ClientToServCMD[CMD.cs_register_new_user](socket.UserInfo));
         }
     });
 };

 ServToClientCMD[CMD.sc_login] = function(_data){
     var socket = this;

     process.nextTick(function(){
         console.important("User UIN: " + _data.UIN + " Successfully Logged In!");

         var out = {};
         out[CMD.sc_login] = _data;

         socket.UserInfo.MyUIN = _data.UIN;

         UsersInBuffer.AddDataToInBuf(socket.UserInfo.sessionID, out);
     });
 };

 ServToClientCMD[CMD.sc_halt] = function (){
     var socket = this;

     process.nextTick(function(){
         var buf = UsersInBuffer.GetOfflineMessages(socket.UserInfo.sessionID, socket.UserInfo.UIN);

         socket.SendDataToServer();

         socket.CloseConnection();

         console.important('Server send HALT. Terminate web-client session.');
     });
 };

 ServToClientCMD[CMD.sc_error] = function(_data){
     var socket = this;

     process.nextTick(function(){
         var out               = {};
         out[CMD.sc_error] = _data;

         UsersInBuffer.AddDataToInBuf(socket.UserInfo.sessionID, out);

         console.warn("MCServer ERROR: " + util.format(ErrorText[_data.ErrNum], _data.Params) + "\nFor sID: " + socket.UserInfo.sessionID, console.logLevel.L_Normal);
     });
 };

 //======================================================================
 //======================================================================

 function TInBufData(){
     var Buffers = {
         /*SessionID : []*/
     };

     this.CheckUserInBuf = function(sID){
         var res = true;

         if (!Buffers[sID]){
             console.err('CheckUserInBuf. sID numb: ' + sID + ' is not defined!');

             res = false;
         };

         return res;
     };

     this.CreateInBuf = function(sID){
         if (!Buffers[sID]){
             Buffers[sID] = [];
         } else {
             console.warn('CreateInBuf: Buffer for sID: ' + sID + " now is present");
         };
     };

     this.AddDataToInBuf = function(sID, _data){
         if (!Buffers[sID]){
             Buffers[sID] = [];
         };

         Buffers[sID].push(_data);

         console.info('Added data to InBufer, total length:' + Buffers[sID].length, console.logLevel.L_Full);
     };

     this.ClearInBufData = function(sID){
         if (Buffers[sID]){
             Buffers[sID] = [];

             console.info('Clearing InBufer for SessionID: ' + sID, console.logLevel.L_Full);
         } else {
             console.err('ClearInBufData: Buffers not contain buffer with SessionID: ' + sID, console.logLevel.L_Normal);
         };
     };

     this.DropInBuf = function(sID){
         if (Buffers[sID]){
             delete Buffers[sID];

             console.info('Dropping InBufer for SessionID: ' + sID, console.logLevel.L_Full);
         } else {
             console.err('DropInBuf: Buffers not contain buffer with SessionID: ' + sID, console.logLevel.L_Normal);
         };
     };

     this.GetFromInBuf = function(sID, needClear){
         var res = "";

         if (Buffers[sID]){
             res = Service.ArrayToString(Buffers[sID]);

             if (needClear) this.ClearInBufData(sID);
         } else {
             console.err('GetFromInBuf: Buffers not contain buffer with SessionID: ' + sID, console.logLevel.L_Normal);
         };

         return res;
     };

     /**
      * @return {array}
      */
     this.GetOfflineMessages = function(sID, uin){
         var res = {};

         if (Buffers[sID]){
             var inbuf = Buffers[sID];
             var count = 1;

             for (var i = 0; i < inbuf.length; i++){
                 if (inbuf[i][CMD.sc_private] && inbuf[i][CMD.sc_private].UINFrom != uin) {
                     res[count] = {
                         UINFrom : inbuf[i][CMD.sc_private].UINFrom,
                         UINTo   : inbuf[i][CMD.sc_private].UINTo,
                         Msg     : inbuf[i][CMD.sc_private].Msg,
                         Time    : (new Date()).myFormat("dd.mm.yyyy.hh.nn.ss")
                     };

                     count ++;
                 };
             };
         };

         return res;
     };
 };

 var UsersInBuffer = new TInBufData();

 //======================================================================
 //======================================================================

 function ClientConnect (OptSettings) {
     var Self = this;
     
     var Send_CallBack = undefined;
     var _usr = Service.extend({}, OptSettings);
         _usr.pass = '****';

     console.log('User try auth and send:\n' + JSON.stringify(_usr), console.logLevel.L_Extended); _usr = null;

     var ConnectOpt = Service.extend({
         login                : 0,
         pass                 : "",
         host                 : '192.168.1.102',
         port                 : 2004,

         sessionID            : "11111111111111",
         authType             : CliCMD.Login,

         PingDelay            : 25,
         CurrentPing          : 1,
         
         UIN                  : 0,
         Gender               : 1,                      // пол пользователя, 0 - неизвестен, 1 - мужской, 2 - женский
         Firstname            : "",                     // имя пользователя
         Lastname             : "",                     // фамилия пользователя
         Surname              : "",                     // отчество пользователя
         Avatar               : 0,                      // номер аватара
         Email                : "bugs@nsoft-s.com",     // адрес электронной почты
         SecretQuestionNumber : 0,                      // номер секретного вопроса для восстановления пароля
         SecretAnswer         : "",                     // ответ на секретный вопрос
         State                : 0                       // текущий статус пользователя (0 - свободен)
     }, OptSettings || {});
     
     this.UserInfo = ConnectOpt;

     var __buffer = "";
     
     var __socket = MCServ.connect({
         port: ConnectOpt.port,
         host: ConnectOpt.host 
     }, function() { //'connect' listener
         console.log('Connected to MyChat Server. Sending signature');
         __socket.write('mc5.0');
     });

         __socket.setTimeout(60000);

         __socket.on('data', function(data) {
             __buffer += data.toString();

             ProcessingReceivedData();
         });
         __socket.on('end', function() {
             console.important('\"End\" connections to MyChat server');

             //DropConnection(ConnectOpt.sessionID);
         });
         __socket.on('close', function() {
             console.important('Client disconnected. Close');

             DropConnection(ConnectOpt.sessionID);
         });
         __socket.on('error', function(err) {
             console.err('Error occurred!\n' + JSON.stringify(err));

             Self.CloseConnection();
         });
         __socket.on('timeout', function() {
             console.warn('Timeout occurred!');

             Self.CloseConnection();
         });

     function ProcessingReceivedData(){
         if (__buffer.indexOf(CRLF) != -1) {
             var data = Service.GetSubstring(__buffer, CRLF);

             __buffer = Service.GetSubstringFrom(__buffer, CRLF);

             if (data != ''){
                 var Magic    = data.slice(0, 2) + '';
                 var CMD_numb = data.slice(2, 6) + '';
                 var Flags    = data.slice(6, 8) + '';
                 var DataObj  = data.slice(8, data.length);

                 console.log("Received CMD from server:" + CMD_numb, console.logLevel.L_Full);

                 if (DataObj.length > 0) {
                     DataObj = Service.StringToObj(DataObj);
                 };

                 if (ServToClientCMD[CMD_numb]) {
                     ServToClientCMD[CMD_numb].apply(Self, [DataObj]);
                 } else
                 if (ServerToClientMultiCMD.apply(Self, [CMD_numb, DataObj]) == false){
                     console.err('Server send unknown command: ' + CMD_numb);
                 };

                 if (__buffer.length > 0){
                     process.nextTick(function(){
                         ProcessingReceivedData();
                     });
                 }
             } else {
                 console.warn("ProcessingReceivetData DATA is empty");
             }
         }
     }

     this.SendDataToServer = function (_data, CallBack){
         console.log('Sending Data To Server: ' + _data, console.logLevel.L_High);
         
         __socket.write(Service.convertToEntities(_data));
         
         Send_CallBack = CallBack;
     };
     
     this.CloseConnection = function(drop){
         if (drop){
             __socket.destroy();
         } else {
             __socket.end();
         };

         console.log('Close socket with SessionID: ' + ConnectOpt.sessionID, console.logLevel.L_High);

         DropConnection(ConnectOpt.sessionID);
     };
     
     this.Busy        = false;
     
 };

 function MakeClientConnection (options){
     UsersInBuffer.CreateInBuf(options.sessionID);

     ConnectionsList[options.sessionID] = new ClientConnect(options);
 };

 function DropConnection (sID){
     var res = false;

     if (ConnectionsList[sID]) {
         delete ConnectionsList[sID];

         UsersInBuffer.DropInBuf(sID);

         console.log('Dropped connection from list, sID: ' + sID, console.logLevel.L_Full);

         res = true;
     } else {
         console.err("Can't drop connection sID: " + sID + " because its not found!", console.logLevel.L_Full);
     };

     return res;
 };

 function KILL_ALL_CONNECTION(callback){
     for (var i in ConnectionsList){
         ConnectionsList[i].CloseConnection(true);
     };

     console.important('All connections has been dropped!');

     if (callback) callback();
 };

 function HasConnection (id){
     return ConnectionsList.hasOwnProperty(id);
 };

 function GetConnection(id){
     return ConnectionsList[id];
 };

 function SendDataFromClient (id, CMD_numb, Data){
     if (HasConnection(id)){
         if (ClientToServCMD[CMD_numb]){
             if ((CMD_numb == CMD.cs_special_ping) && (ConnectionsList[id].UserInfo.CurrentPing < ConnectionsList[id].UserInfo.PingDelay)){
                 ConnectionsList[id].UserInfo.CurrentPing ++;

                 console.log('Skip cs_ping', console.logLevel.L_Full);
             } else {
                 if (Service.isString(Data)){
                    Data = Data.split(CR);
                 };

                 if (CMD_numb == CMD.cs_special_ping) ConnectionsList[id].UserInfo.CurrentPing = 1;

                 var _out = ClientToServCMD[CMD_numb].apply(null, Data);

                 if (!Data || Data.length === 0){
                     console.warn('CMD:' + CMD_numb + ' Data is EMPTY!', console.logLevel.L_Full);
                 };

                 if (CMD_numb != CMD.cs_special_ping) {
                     console.log('SendDataFromClient CMD:' + CMD_numb + ' Data: ' + Data, console.logLevel.L_Extended);
                 } else {
                     console.log('SendDataFromClient CMD:' + CMD_numb + ' Data: ' + Data, console.logLevel.L_Full);
                 };

                 ConnectionsList[id].SendDataToServer(_out);
             };
         } else {
             console.err('CMD numb at SendDataFromServer: ' + CMD_numb + ' is not defined!');
         };
     } else {
         console.err('ID numb at SendDataFromServer: ' + id + ' is not defined!');
     };
 };

 // =======================================================
 // =======================================================
 
 exports.MakeClientConnection = MakeClientConnection; 
 exports.Connections          = ConnectionsList;
 exports.CliCMD               = CliCMD;
 exports.HasConnection        = HasConnection;
 exports.GetConnection        = GetConnection;
 exports.SendDataFromClient   = SendDataFromClient;
 exports.SendDataToServer     = SendDataFromClient;
 exports.CMD                  = CMD;
 exports.UsersInBuffer        = UsersInBuffer;
 exports.KILL_ALL_CONNECTION  = KILL_ALL_CONNECTION;

 // =======================================================
 // =======================================================   