var BOSH_SERVICE = '/http-bind/'
var connection = null;

function Chat(o) {
    var options = {
        host:'183.203.16.207',
        port:'',
        bosh_service:'/http-bind/',
        jid:'',
        pass:'',
        onConnected:jQuery.noop,
        onMessage:jQuery.noop,
        onRoomMessage:jQuery.noop,
        onRoster:jQuery.noop,
        onPresence:jQuery.noop
    }
    $.extend(options,o);
    this.options = options;
    this.init();
}
Chat.prototype = {
    init:function(){
        var self = this;
        var connection = self.connection = new Strophe.Connection(self.options.bosh_service);
        // Uncomment the following lines to spy on the wire traffic.
        connection.rawInput = self.rawInput;
        connection.rawOutput = self.rawOutput;

        // Uncomment the following line to see all the debug output.
        Strophe.log = self.log;
    },
    rawInput:function(data){
        tools.log('Strophe.RECV: ' + data);
    },
    rawOutput:function(data){
        tools.log('Strophe.SEND: ' + data);
    },
    log:function(level, msg){
        //tools.log('Strophe.LOG: ' + msg);
    },
    connect:function(){
        var self = this;
        self.connection.connect(self.options.jid ? (self.options.jid + '@' + self.options.host) : self.options.host,
                               self.options.pass ? self.options.pass : null,
                               self.onConnect.bind(self));
    },
    onConnect:function(status){
        var self = this;
        if (status == Strophe.Status.CONNECTING){
            tools.log('connecting.');
        } else if (status == Strophe.Status.CONNFAIL){
            tools.log('failed to connect.');
        } else if (status == Strophe.Status.DISCONNECTING){
            tools.log('disconnecting.');
        } else if (status == Strophe.Status.DISCONNECTED){
            tools.log('disconnected.');
            self.connect();
        } else if (status == Strophe.Status.CONNECTED){
            tools.log('connected.');
            self.options.onConnected.call(self,self.connection.jid,self.connection.sid,self.connection.rid);
            self.connection.addHandler(self.onMessage, null, 'message', null, null,  null);
            self.connection.send($pres().tree());
        }
    },
    disconnect:function(){
        this.connection.disconnect();
    },
    send:function(to,message,type){
        var self = this,
            _t = type || 'chat';
        var _msg = $msg({to: to, from: self.connection.jid, type: _t}).c("body").t(message);
        self.connection.send(_msg.tree());
    },
    onMessage:function(msg){
        var self = this,
            to = msg.getAttribute('to'),
            from = msg.getAttribute('from'),
            type = msg.getAttribute('type'),
            elems = msg.getElementsByTagName('body');
        var _delay = msg.getElementsByTagName('delay'),
            _stamp = new Date();
        if(_delay && _delay.length){
            _stamp = new Date(_delay[0].getAttribute('stamp'));
        }
        if (type == "chat" && elems.length > 0) {
            var body = elems[0];
            self.options.onMessage.call(self,from,Strophe.getText(body),_stamp,type);
        }

        // we must return true to keep the handler alive.
        // returning false would remove it after it finishes.
        return true;

    },
    joinRoom:function(roomId){
        var self = this;
        // connect room
        self.connection.muc.join(
            roomId,
            self.connection.jid.split('@')[0], 
            self.onRoomMessage.bind(self),self.onPresence.bind(self), self.onRoster.bind(self));
    },
    leaveRoom:function(roomId,msg){
        var self = this;
        self.connection.muc.leave(roomId, self.connection.jid.split('@')[0], self.onLeaveRomm.bind(self), msg);
    },
    onRoomMessage:function(stanza, room) {
        var self = this,
            from = stanza.getAttribute('from').split('/')[1],
            type = stanza.getAttribute('type'),
            elems = stanza.getElementsByTagName('body');
        var _delay = stanza.getElementsByTagName('delay'),
            _stamp = new Date();
        if(_delay && _delay.length){
            _stamp = new Date(_delay[0].getAttribute('stamp'));
        }
        self.options.onRoomMessage.call(self,from,Strophe.getText(elems[0]),_stamp,type);
        return true;
    },
    onPresence:function(stanza, room) {
        var self = this;
        self.options.onPresence.call(self,stanza,room);
        return true;
    },
    onRoster:function(roster, room) {
        var self = this;
        self.options.onRoster.call(self,roster,room);
        return true;
    },
    onLeaveRomm:function(){
        alert('leave');
        tools.log(arguments);
    },
    setOptions:function(o){
        $.extend(this.options,o);
    }

};