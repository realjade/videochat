$(function(){
    var params = {
        quality: "high",
        bgcolor: "#ffffff",
        allowscriptaccess: "sameDomain",
        allowfullscreen: "true"
    }; 
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
});