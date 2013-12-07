$(function(){
    if(app && app.visitor){
        var user = app.visitor;
        user.sexShow = user.result[0].sex == -1 ? "保密" : (user.result[0].sex == 0 ? "男" : "女");
        $('.ownerinfo').user_info(user);
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
        //initLiveShow();
        var chatroom = $('.chatroompanel').chatroom({
            //roomId:'xx' + '@' + app.roomUrl,
            roomId:user.result[0].user_account + '@' + app.roomUrl,
            giftUrl:app.giftUrl,
            host:app.xmppUrl,
            user:user
        });

    }
});