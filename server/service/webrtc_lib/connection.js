var easyrtc     = null;
var console     = require('console-plus');

exports.setEeasyrtc = function(_easyrtc){
    easyrtc = _easyrtc;
};

exports.broadcastList = function(io, applicationName) {
    var listData = {
        serverStartTime: easyrtc.serverStartTime,
        connections: {}
    };

    //
    // needed by the rooms demo. Don't remove.
    //
    if( applicationName === 'default' ) return;
    
    // Form list of current connections
    for (var key in easyrtc.connections) {
        if (easyrtc.connections.hasOwnProperty(key) && easyrtc.connections[key].applicationName == applicationName) {
            listData.connections[key] = easyrtc.connections[key];
        }
    }

    // Broadcast list of current connections
    for (var key in listData.connections) {
        io.sockets.socket(key).json.emit('easyrtcCmd',{
            msgType    : MCServer.cmdMsgType.list,
            msgData    : listData,
            serverTime : Date.now()
        });
    }
};

exports.onSocketConnection = function(io, socket, connectionEasyRtcId) {
    easyrtc.connections[connectionEasyRtcId]={
        easyrtcid         : connectionEasyRtcId,
        applicationName   : MCServer.defaultApplicationName,
        clientConnectTime : Date.now()
    };

    console.log('onSocketConnection: Socket [' + socket.id + '] command sent\n' +
                'ID   : ' + connectionEasyRtcId + '\n' +
                'Data : \"applicationName\" - ' + easyrtc.connections[connectionEasyRtcId].applicationName +
                '       \"iceServers\" - ' + MCServer.iceServers,
                console.logLevel.L_Extended);

    socket.json.emit( MCServer.cmdPacketType, {
        msgType         : MCServer.cmdMsgType.token,
        easyrtcid       : connectionEasyRtcId,
        applicationName : easyrtc.connections[connectionEasyRtcId].applicationName,
        iceConfig       : {"iceServers": MCServer.iceServers},
        serverTime      : Date.now()
    });

    // Send the connection list to current connection, then broadcast to all others
    exports.broadcastList(io,easyrtc.connections[connectionEasyRtcId].applicationName);
};

exports.onSocketMessage = function(io, socket, connectionEasyRtcId, msg) {
    // Messages must have a targetId and a msgType. This section should be hardened.
    if (msg.targetId) {
        consloe.log('easyRTC: Socket [' + msg.targetId+ ']\n' +
                   'Sending message from: ' + connectionEasyRtcId + '\n' +
                   '                  ID: ' + msg.targetId + '\n' +
                   '                Data: ' + msg,
                   console.logLevel.L_Extended);

        io.sockets.socket(msg.targetId).json.send({
            msgType:msg.msgType,
            senderId:connectionEasyRtcId,
            msgData:msg.msgData,
            serverTime: Date.now()
        });
    }
};


exports.onSocketDisconnect = function(io, socket, connectionEasyRtcId) {
    // console.log('easyRTC: Socket disconnected: ' + connectionEasyRtcId);
    var previousApplicationName = easyrtc.connections[connectionEasyRtcId].applicationName;

    // Remove connection from the map
    delete easyrtc.connections[connectionEasyRtcId];

    // Broadcast new list to all others
    exports.broadcastList(io, previousApplicationName);
};


exports.onEasyRtcCmd = function(io, socket, connectionEasyRtcId, msg) {
    // Messages with a targetId get forwarded on. This section should be hardened.
    if (msg.targetId) {
        console.log('easyRTC: Socket [' + msg.targetId + ']\n' +
                        'CMD sent from: ' + socket.id + '\n' +
                        '           ID: ' + msg.targetId + '\n' +
                        '         Data: ' + JSON.stringify({ msgType : msg.msgType,
                                                             senderId: connectionEasyRtcId,
                                                             msgData : msg.msgData}),
                        console.logLevel.L_Extended);

        io.sockets.socket(msg.targetId).json.emit('easyrtcCmd',{
            msgType:msg.msgType,
            senderId:connectionEasyRtcId,
            msgData:msg.msgData,
            serverTime: Date.now()
        });
    }

    // easyrtc server-side user configuration options are set here.
    if (msg.msgType == "setUserCfg") {
        setUserCfg(connectionEasyRtcId, msg.msgData);

        if (msg.msgData.applicationName) {  // Set the application namespace
            easyrtc.connections[connectionEasyRtcId].applicationName = msg.msgData.applicationName;

            console.log('easyRTC: Application Name Change: ' + connectionEasyRtcId + ' : ' + msg.msgData.applicationName, console.logLevel.L_Extended);

            exports.broadcastList(io,easyrtc.connections[connectionEasyRtcId].applicationName);
        }
        
        console.log('easyRTC: Socket [' + connectionEasyRtcId + ']\n' +
                    'Updated user config info:\n' +
                    '  ID: ' + connectionEasyRtcId + '\n' +
                    'Data: ' + JSON.stringify({msgType : 'updatedUserCfg',
                                               msgData : easyrtc.connections[connectionEasyRtcId]}),
                    console.logLevel.L_Extended);

    }
};

function setUserCfg(easyrtcid, userCfg) {
        // TODO: Harden section with better variable checking

        if (userCfg.screenWidth) {      easyrtc.connections[easyrtcid].screenWidth      = userCfg.screenWidth;}
        if (userCfg.screenHeight) {     easyrtc.connections[easyrtcid].screenHeight     = userCfg.screenHeight;}
        if (userCfg.browserUserAgent) { easyrtc.connections[easyrtcid].browserUserAgent = userCfg.browserUserAgent;}
        if (userCfg.sharingAudio) {     easyrtc.connections[easyrtcid].sharingAudio     = userCfg.sharingAudio;}
        if (userCfg.sharingVideo) {     easyrtc.connections[easyrtcid].sharingVideo     = userCfg.sharingVideo;}
        if (userCfg.sharingData) {      easyrtc.connections[easyrtcid].sharingData      = userCfg.sharingData;}
        if (userCfg.userName) {         easyrtc.connections[easyrtcid].userName         = userCfg.userName;}
        if (userCfg.windowWidth) {      easyrtc.connections[easyrtcid].windowWidth      = userCfg.windowWidth;}
        if (userCfg.windowHeight) {     easyrtc.connections[easyrtcid].windowHeight     = userCfg.windowHeight;}
        if (userCfg.cookieEnabled) {    easyrtc.connections[easyrtcid].cookieEnabled    = userCfg.cookieEnabled;}
        if (userCfg.language) {         easyrtc.connections[easyrtcid].language         = userCfg.language;}
        if (userCfg.nativeVideoWidth) { easyrtc.connections[easyrtcid].nativeVideoWidth = userCfg.nativeVideoWidth;}
        if (userCfg.nativeVideoHeight){ easyrtc.connections[easyrtcid].nativeVideoHeight= userCfg.nativeVideoHeight;}
        if (userCfg.connectionList) {
            easyrtc.connections[easyrtcid].connectionList = JSON.parse(JSON.stringify(userCfg.connectionList));
        }
}
