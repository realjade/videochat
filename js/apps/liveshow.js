$(function(){
    initLiveShow();
    function initLiveShow(){
        var params = {
            quality: "high",
            bgcolor: "#ffffff",
            allowscriptaccess: "sameDomain",
            allowfullscreen: "true",
            wmode:'Opaque'
        };
        swfobject.embedSWF(
            "flash/Consumer.swf", 'liveshowflash',
            "450", "340", 
            "11.1.0", "flash/playerProductInstall.swf", 
            { host: '183.203.16.207', port: 8108, uid: 'user1' }, params, {id:'liveshowflash', name:'Consumer'});
    }
    var chatroom = $('.chatroompanel').chatroom({
        roomId:'xx@vv.183.203.16.207'
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
    
    
    $('#send').click(function () {
        var to = $('#to').val(),
            msg = $('#msg').val();
        chat.send('xx@vv.183.203.16.207',msg,'groupchat');
        $('#msg').val('');
        message('我 to ' + to.split('@')[0] + ': ' + msg);
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
            "flash/consumer.swf", id,
            "320", "240", 
            "11.1.0", "flash/playerProductInstall.swf", 
            { host: '183.203.16.207', port: 8108, uid: uid }, params, {id:id, name:'Consumer'});
        
    });
    function message(msg){
        $('<div>'+msg+'</div>').appendTo($('#message'));
    }
});