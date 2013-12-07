$(function(){
	$.fn.user_info = function(user,o){
		var options = {

		};
		if(o) $.extends(options,o);
		var self = $(this);
		var _template = '<div class="user_info"><div class="avatar">' +
                        	'<img src="{{details.portrait_url}}" alt="" width="100" height="100">' +
                    	'</div>' +
                    	'<ul class="txt">' +
	                        '<li class="profile">' +
	                            '<a>{{details.nick_name}}</a>' +

	                            '<img src="images/rick/{{details.user_rich}}.png" />' +
	                        '</li>' +
	                        '<li>' +
	                        	'<span>性别：{{sexShow}}</span>' +
	                        '</li>' +
	                        '<li>' +
	                            '<span>收藏（{{details.favorite_video_count}}）</span>' +
	                            '<span>关注（{{details.follow_people_count}}）</span>' +
	                            '<span>粉丝（{{details.followers_count}}）</span>' +
	                        '</li>' +
	                    '</ul></div>';
	    user.details = user.result[0];
	    $(Mustache.render(_template,user)).appendTo(self);
	    return self;

	}
});