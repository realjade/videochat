$(function(){
	$.fn.chatroom = function(o){
		var options = {

		}
		$.extend(options,o);
		var self = this;
		init();
		function init(){
			var _template = '<div class="chatroom">' +
								'<div class="ct-left">' +
									'<div class="ct-msg-panel">' +
										'<div class="ct-tab">' +
											'<ul>' +
												'<li class="active">聊天</li>' +
											'</ul>' +
										'</div>' +
										'<div class="ct-msg">' +
											'<ul class="ct-msg-groupchat"></ul>' +
											'<ul class="ct-msg-privatechat "></ul>' +
										'</div>' +
									'</div>' +
									'<div class="ct-send-panel">' +
										'<select style="width:70px;" class="line_height" id="chat-user-selector"><option value="-1">所有人</option></select>' +
										'<input type="text" placeholder="对主播说点啥呢？" />' +
									'</div>' +
								'</div>' +
								'<div class="ct-right">' +
									'<div class="ct-member-panel">' +
										'<div class="ct-tab">' +
											'<ul>' +
												'<li class="active">成员（<span></span>）</li>' +
												'<li>管理员（<span></span>）</li>' +
											'</ul>' +
										'</div>' +
										'<div class="ct-member">' +
											'<ul class="ct-member-list"></ul>' +
											'<ul class="ct-admin-list"></ul>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>';
			$(_template).appendTo(self);
		}
	};
});