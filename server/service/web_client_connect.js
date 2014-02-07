
var CRLF = "\r\n";
//var BR   = "\v";
var CR   = "\r";
var LF   = "\n";

var Service	        = require('./service.js');
var console	        = require('console-plus');
var MCConnect       = require('./mcconnect.js');
var CliCMD          = MCConnect.CliCMD;

//var ServerIP        = '192.168.1.102'; // '192.168.1.101'; //
//var ServerPort      = 2004;
var inc             = 0;
var ParseFunctions  = {};

/**
 * @return {string}
 */
var SessionID_Generator = function SessionID_Generator(){
    inc ++;

    return ((new Date()).getTime() + inc).toString() + "";
};

function _Auth(_data, cmd, CallBack){
    var id = SessionID_Generator();

    var data = Service.StringToObj(_data);

    MCConnect.MakeClientConnection({
        login      : data.UIN,
        pass       : data.Pass,

        Gender               : data.Gender,
        Email                : data.Email,
        SecretQuestionNumber : data.SecretN,
        SecretAnswer         : data.SecretA,

        host       : MCServer.Host,
        port       : MCServer.MCPort,

        sessionID  : id,
        authType   : cmd
    });

    if (CallBack){
        CallBack(CliCMD.OK + CR + id);
    } else {
        console.err('Not assigned CallBack on CMD:' + cmd);
    }
}

ParseFunctions[CliCMD.Login] = function Login(_data, SendDataToWebClient){
    _Auth(_data, CliCMD.Login, SendDataToWebClient);
};

ParseFunctions[CliCMD.Register] = function Register(_data, SendDataToWebClient){
    _Auth(_data, CliCMD.Register, SendDataToWebClient);
};

ParseFunctions[CliCMD.Reminde] = function Reminde(_data, SendDataToWebClient){

};

ParseFunctions[CliCMD.Ping] = function Ping(_data, SendDataToWebClient){ // sessionID
    var data = _data.split(CR);
    var sID  = data[0];
    //var sID = parseInt(sessionID.slice(1, sessionID.length - 1));

    if (MCConnect.UsersInBuffer.CheckUserInBuf(sID)){
        var out = MCConnect.UsersInBuffer.GetFromInBuf(sID, true);

        SendDataToWebClient(CliCMD.Ping + CR + out);

        MCConnect.SendDataToServer(sID, MCConnect.CMD.cs_ping);
    } else {
        var out = {};
            out[MCConnect.CMD.sc_drop_connect] = {};

        SendDataToWebClient(CliCMD.Ping + CR + JSON.stringify(out));
    }
};

ParseFunctions[CliCMD.OpenPrivate] = function OpenPrivate(_data, SendDataToWebClient){
    var data = _data.split(CR);
    var sID  = data[0];
    var uin  = data[1];

    MCConnect.SendDataToServer(sID, MCConnect.CMD.cs_private_request, [uin, '0']);

    if (SendDataToWebClient) SendDataToWebClient(CliCMD.OK);
};

ParseFunctions[CliCMD.SendMSGPr] = function SendMSGPr(_data, SendDataToWebClient){
    var data = _data.split(CR);
    var sID = data[0];
    var uin = data[1];
    var msg = data[2];

    MCConnect.SendDataFromClient(sID, MCConnect.CMD.cs_private_msg, [uin, msg]);

    if (SendDataToWebClient) SendDataToWebClient();
};

ParseFunctions[CliCMD.Quit] = function Quit(_data, SendDataToWebClient){
    var data = _data.split(CR);
    var sID = data[0];

    MCConnect.SendDataFromClient(sID, MCConnect.CMD.cs_quit);

    if (SendDataToWebClient) SendDataToWebClient(CliCMD.OK);
};

ParseFunctions[CliCMD.Typing] = function Typing(_data, SendDataToWebClient){
    var data = _data.split(CR);
    var sID  = data[0];
    var uin  = data[1];

    MCConnect.SendDataToServer(sID, MCConnect.CMD.cs_typing_notify, [uin]);

    if (SendDataToWebClient) SendDataToWebClient(CliCMD.OK);
};

ParseFunctions[CliCMD.CallUser] = function CallUser(_data, SendDataToWebClient){
    var data   = _data.split(CR);
    var sID    = data[0];
    var uin    = data[1];
    var video  = data[2];
    var callID = data[3];

    MCConnect.SendDataToServer(sID, MCConnect.CMD.cs_media_call, [uin, video, callID]);

    if (SendDataToWebClient) SendDataToWebClient(CliCMD.OK);
};

ParseFunctions[CliCMD.AcceptCall] = function AcceptCall(_data, SendDataToWebClient){
    var data   = _data.split(CR);
    var sID    = data[0];
    var uin    = data[1];
    var video  = data[2];
    var callID = data[3];

    MCConnect.SendDataToServer(sID, MCConnect.CMD.cs_media_call_accept, [uin, video, callID]);

    if (SendDataToWebClient) SendDataToWebClient(CliCMD.OK);
};

ParseFunctions[CliCMD.RejectCall] = function RejectCall(_data, SendDataToWebClient){
    var data   = _data.split(CR);
    var sID    = data[0];
    var uin    = data[1];

    MCConnect.SendDataToServer(sID, MCConnect.CMD.cs_media_call_reject, [uin]);

    if (SendDataToWebClient) SendDataToWebClient(CliCMD.OK);
};

exports.CMD            = CliCMD;
exports.ParseFunctions = ParseFunctions;