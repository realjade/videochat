$(function(){
    if(app && app.visitor){
        //var user = app.visitor.result[0];
        var user = app.visitor;
        tools.log(user);
        
        function initLiveShow(){
            var params = {
                quality: "high",
                bgcolor: "#ffffff",
                allowscriptaccess: "sameDomain",
                allowfullscreen: "true",
                wmode:'Opaque'
            };
            // swfobject.embedSWF(
            //     "flash/Consumer.swf", 'liveshowflash',
            //     "450", "340", 
            //     "11.1.0", "flash/playerProductInstall.swf", 
            //     { host: '183.203.16.207', port: 8108, uid: 'user1' }, params, {id:'liveshowflash', name:'Consumer'});

            swfobject.embedSWF(
                "flash/Producer.swf", "liveshowflash", 
                "450", "360", 
                "11.1.0", "flash/playerProductInstall.swf", 
                { host: '183.203.16.207', port: 8108, uid: user.user_account }, params, { id:"liveshowflash", name: "Producer" });
                
            $('#mySetting').hide();
            $('#myView').show();
        }
        initLiveShow();
        var chatroom = $('.chatroompanel').chatroom({
            //roomId:'xx' + '@' + app.roomUrl,
            roomId:user.user_account + '@' + app.roomUrl,
            host:app.xmppUrl,
            jid:user.user_account,
            pass:user.password
        });

    }
});