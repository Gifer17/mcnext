/*
Copyright (c) 2013, Priologic Software Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
*/

var console = require('console-plus');
var webrtc_connection_list = {};
var STUNServer = null;

// Starts up the experimental internal stun server
var experimentalStunServer = function() {
    var stunLib   = require('./webrtc_lib/stunserver.js');
    var stunServer = stunLib.createServer();

    stunServer.setAddress0(MCServer.STUN.addr1);
    stunServer.setAddress1(MCServer.STUN.addr2);

    stunServer.setPort0(MCServer.STUN.port1);
    stunServer.setPort1(MCServer.STUN.port2);

    console.info("Start STUN server\n   IPs: [" + MCServer.STUN.addr1 + ", " + MCServer.STUN.addr2 + "]" +
                                  "\n Ports: [" + MCServer.STUN.port1 + ", " + MCServer.STUN.port2 + "]", console.logLevel.L_Normal);

    stunServer.listen();

    return stunServer;
};

exports.experimentalStunServer = experimentalStunServer;

// Local includes
exports.StartWebRTCServer = function (server){
    var connect_list = require('./webrtc_lib/connection');
    var sio          = require('socket.io');

    easyrtc = {
        serverStartTime: Date.now(),
        connections: {}
    };

    connect_list.setEeasyrtc(easyrtc);

    var io = sio.listen(server, {
        'logger': {
            debug: function(message){ console.important('socket.io: ' + message, console.logLevel.L_Extended); },
            info:  function(message){ console.info('socket.io: ' + message, console.logLevel.L_Extended); },
            warn:  function(message){ console.warn('socket.io: ' + message, console.logLevel.L_Normal); },
            error: function(message){ console.err( 'socket.io: ' + message, console.logLevel.L_Low); }
        },
        'browser client minification': MCServer.socketIoClientMinifyEnabled,
        'browser client etag': MCServer.socketIoClientEtagEnabled,
        'browser client gzip': MCServer.socketIoClientGzipEnabled
    });

    console.important('WebRTC Server started');

    if (MCServer.STUN.enable) {
        STUNServer = experimentalStunServer();
    }

    io.webrtc_connection_list = webrtc_connection_list;

    io.sockets.on('connection', function (socket) {
        var connectionEasyRtcId = socket.id;


        webrtc_connection_list[connectionEasyRtcId] = socket;

        console.log('easyRTC: Socket [' + socket.id + '] connected with application: [' + MCServer.defaultApplicationName + ']', console.logLevel.L_Extended);

        connect_list.onSocketConnection(io, socket, connectionEasyRtcId);

        // Incoming messages: Custom message. Allows applications to send socket messages to other connected users.
        socket.on('message', function(msg) {
            console.log('easyRTC: Socket [' + socket.id + '] message received\n' + 'applicationName: ' + easyrtc.connections[connectionEasyRtcId].applicationName + '\ndata: ' +msg, console.logLevel.L_Extended);

            connect_list.onSocketMessage(io, socket, connectionEasyRtcId, msg);
        });

        // Incoming easyRTC commands: Used to forward webRTC negotiation details and manage server settings.
        var easyrtccmdHandler = function(msg) {
            console.log('easyRTC: Socket [' + socket.id + '] command received\n' + 'easyrtcid: ' + connectionEasyRtcId + '\ndata: ' +msg, console.logLevel.L_Extended);

            connect_list.onEasyRtcCmd(io, socket, connectionEasyRtcId, msg);
        };

        socket.on('easyrtcCmd', easyrtccmdHandler);
        socket.on('easyRTCcmd', easyrtccmdHandler);

        // Upon a socket disconnecting (either directed or via time-out)
        socket.on('disconnect', function(data) {
            console.log('easyRTC: Socket [' + socket.id + '] disconnected\n' + 'easyrtcid: ' +connectionEasyRtcId, console.logLevel.L_Extended);

            if (webrtc_connection_list[socket.id]) delete webrtc_connection_list[socket.id];

            connect_list.onSocketDisconnect(io, socket, connectionEasyRtcId);
        });
    });

    return io;
};

exports.KillWebRTCConnections = function(){
    for (var i in webrtc_connection_list){
        webrtc_connection_list[i].disconnect();

        delete webrtc_connection_list[i];
    }

    console.log('webrtc_connection_list killed');
};

exports.STUNServer = function() {
    return STUNServer;
}
