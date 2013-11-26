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
        onRoomMessage:jQuery.noop
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
        console.log('Strophe.RECV: ' + data);
    },
    rawOutput:function(data){
        console.log('Strophe.SEND: ' + data);
    },
    log:function(level, msg){
        //console.log('Strophe.LOG: ' + msg);
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
            console.log('connecting.');
        } else if (status == Strophe.Status.CONNFAIL){
            console.log('failed to connect.');
        } else if (status == Strophe.Status.DISCONNECTING){
            console.log('disconnecting.');
        } else if (status == Strophe.Status.DISCONNECTED){
            console.log('disconnected.');
            self.connect();
        } else if (status == Strophe.Status.CONNECTED){
            console.log('connected.');
            console.log('JID: ' + self.connection.jid);
            console.log('SID: ' + self.connection.sid);
            console.log('RID: ' + self.connection.rid);
            self.options.onConnected.call(self);
            self.connection.addHandler(self.onMessage, null, 'message', null, null,  null);
            self.connection.send($pres().tree());
        }
    },
    disconnect:function(){
        this.connection.disconnect();
    },
    send:function(){

    },
    onMessage:function(msg) {
        var self = this,
            to = msg.getAttribute('to'),
            from = msg.getAttribute('from'),
            type = msg.getAttribute('type'),
            elems = msg.getElementsByTagName('body');

        if (type == "chat" && elems.length > 0) {
            var body = elems[0];
            self.options.onMessage.call(self,from,Strophe.getText(body),type);
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
    onRoomMessage:function(stanza, room) {
        var self = this,
            from = stanza.getAttribute('from').split('/')[1],
            type = stanza.getAttribute('type'),
            elems = stanza.getElementsByTagName('body');
        self.options.onRoomMessage.call(self,from,Strophe.getText(elems[0]),type);
        return true;
    },
    onPresence:function(stanza, room) {
        console.log('onPresence stanza: ' + stanza);
        console.log('onPresence room  : ' + room);
        return true;
    },
    onRoster:function(roster, room) {
        console.log('onPresence roster: ' + roster);
        console.log('onPresence room  : ' + room);
        
        return true;
    },
    setOptions:function(o){
        $.extend(this.options,o);
        console.log(this.options);
    }

};