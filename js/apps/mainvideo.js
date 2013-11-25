$(function(){
    var params = {
        quality: "high",
        bgcolor: "#ffffff",
        allowscriptaccess: "sameDomain",
        allowfullscreen: "true"
    };
    var chat = new Chat({
        onConnected:onConnected,
        onMessage:onMessage,
        onRoomMessage:onRoomMessage
    });
    $('#connect').click(function(){
        var self = $(this);
        if(!self.data('logout')){
            var jid = $('#jid').val(),
            pass = $('#pass').val();
            chat.setOptions({jid:jid,pass:pass});
            chat.connect();
        }else{
            self.val('登录');
            self.data('logout',false);
            chat.disconnect();
        }
    });
    function onConnected(){
        var connectBtn = $('#connect');
        connectBtn.val('注销');
        connectBtn.data('logout',true);
        chat.joinRoom('xx@vv.183.203.16.207');
    }
    function onMessage(form,msg,type){

    }
    function onRoomMessage(from,msg,type){
        message((from ? from : '[消息]') + ': ' + msg);
    }
    $('#connectAnonymous').click(function () {
        $('#jid').val('');
        $('#pass').val('');
        $('#connect').trigger('click');
        $(this).hide();
    });
    $('#pass').keypress(function(event){
        if (event.which == 13) {
            $('#connect').trigger('click');
        }
    });
    
    
    $('#send').bind('click', function () {
        var button = $('#send').get(0);
        var to = $('#to').get(0).value;
        var text = $('#msg').get(0).value;
        
        var reply = $msg({to: to, from: connection.jid, type: 'chat'})
                        .c("body").t(text);
        connection.send(reply.tree());
        $('#msg').get(0).value = '';

        message('我 to ' + to.split('@')[0] + ': ' + text);
    });
    $('#msg').keypress(function(event){
        if (event.which == 13) {
            $('#send').trigger('click');
        }
    });
    $('#btnPublish').click(function(ev){
        ev.preventDefault();
        var uid = $('#UID').val();

        swfobject.embedSWF(
            "flash/Producer.swf", "myCamera", 
            "320", "240", 
            "11.1.0", "flash/playerProductInstall.swf", 
            { host: '183.203.16.207', port: 8108, uid: uid }, params, { id:"Producer", name: "Producer" });
            
        $('#mySetting').hide();
        $('#myView').show();
    });
    
    $('#btnLive').click(function(ev){
        ev.preventDefault();
        var uid = $('#liveUID').val();
        
        var id = 'consumer_' + Math.ceil(Math.random() * 100000);
        
        $('#videoList').append(
            $('<div class="consumer" />').append($('<div />').attr('id', id)));
        
        swfobject.embedSWF(
            "Consumer.swf", id,
            "320", "240", 
            "11.1.0", "flash/playerProductInstall.swf", 
            { host: '183.203.16.207', port: 8108, uid: uid }, params, {id:id, name:'Consumer'});
        
    });
    function message(msg){
        $('<div>'+msg+'</div>').appendTo($('#message'));
    }
});