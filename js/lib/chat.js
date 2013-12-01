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
    var self = this;
    self.options = options;
    init();
    function init(){
        self.connection = new Strophe.Connection(self.options.bosh_service);
        // Uncomment the following lines to spy on the wire traffic.
        self.connection.rawInput = rawInput;
        self.connection.rawOutput = rawOutput;

        // Uncomment the following line to see all the debug output.
        Strophe.log = log;
        self.connection.muc.init(self.connection);
    }
    function rawInput(data){
        tools.log('Strophe.RECV: ' + data);
    }
    function rawOutput(data){
        tools.log('Strophe.SEND: ' + data);
    }
    function log(level, msg){
        //tools.log('Strophe.LOG: ' + msg);
    }
    function connect(){
        self.connection.connect(self.options.jid ? (self.options.jid + '@' + self.options.host) : self.options.host,
                               self.options.pass ? self.options.pass : null,
                               onConnect);
    }
    function onConnect(status){
        if (status == Strophe.Status.CONNECTING){
            tools.log('connecting.');
        } else if (status == Strophe.Status.CONNFAIL){
            tools.log('failed to connect.');
        } else if (status == Strophe.Status.DISCONNECTING){
            tools.log('disconnecting.');
        } else if (status == Strophe.Status.DISCONNECTED){
            tools.log('disconnected.');
            reconnect();
        } else if (status == Strophe.Status.CONNECTED){
            tools.log('connected.');
            self.options.onConnected.call(self,self.connection.jid,self.connection.sid,self.connection.rid);
            self.connection.addHandler(onMessage, null, 'message', null, null,  null);
            self.connection.send($pres().tree());
        }
    }
    function onMessage(msg){
        var to = msg.getAttribute('to'),
            from = msg.getAttribute('from'),
            type = msg.getAttribute('type'),
            elems = msg.getElementsByTagName('body'),
            _delay = msg.getElementsByTagName('delay'),
            _stamp = new Date(),
            _isDelay = false;
        if(_delay && _delay.length){
            _stamp = new Date(_delay[0].getAttribute('stamp'));
            _isDelay = true;
        }
        if (type == 'chat' && elems.length > 0) {
            var body = elems[0];
            self.options.onMessage.call(self,from,Strophe.getText(body),_stamp,type,_isDelay);
        }

        // we must return true to keep the handler alive.
        // returning false would remove it after it finishes.
        return true;
    }
    function reconnect(){
        var _room = self.connection.muc.rooms[self.roomId];
        _room._message_handlers = {};
        _room._presence_handlers = {};
        _room._roster_handlers = {};
        self.connection = null;
        init();
        connect();
    }
    function disconnect(){
        this.connection.disconnect();
    }
    function send(to,message,type){
        var _t = type || 'chat';
        var _msg = $msg({to: to, from: self.connection.jid, type: _t}).c("body").t(message);
        self.connection.send(_msg.tree());
    }
    function joinRoom(roomId){
        self.roomId = roomId;
        // connect room
        self.connection.muc.join(
            roomId,
            self.connection.jid.split('@')[0], 
            onRoomMessage,onPresence,onRoster);
    }
    function onRoomMessage(stanza, room) {
        var from = stanza.getAttribute('from'),
            type = stanza.getAttribute('type'),
            elems = stanza.getElementsByTagName('body'),
            _delay = stanza.getElementsByTagName('delay'),
            _stamp = new Date();
        if(_delay && _delay.length){
            _stamp = new Date(_delay[0].getAttribute('stamp'));
        }
        self.options.onRoomMessage.call(self,from,Strophe.getText(elems[0]),_stamp,type);
        return true;
    }
    function onPresence(stanza, room) {
        var _jid = stanza.getAttribute('from').split('/')[1],
            _type = stanza.getAttribute('type');
        if(_type == 'unavailable' && _jid == self.options.jid){
            reconnect();
        }
        self.options.onPresence.call(self,stanza,room);
        return true;
    }
    function onRoster(roster, room){
        self.options.onRoster.call(self,roster,room);
        return true;
    }
    function reJoinRoom(){
        self.joinRoom(self.roomId);
    }
    function leaveRoom(roomId,msg){
        self.connection.muc.leave(roomId, self.connection.jid.split('@')[0], self.onLeaveRomm.bind(self), msg);
    }
    function onLeaveRommfunction(){
        alert('leave');
        tools.log(arguments);
    }
    function setOptions(o){
        $.extend(this.options,o);
    }
    self.connect = connect;
    self.send = send;
    self.joinRoom = joinRoom;
    return self;
}