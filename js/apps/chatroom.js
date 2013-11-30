$(function(){
	$.fn.chatroom = function(o){
		var options = {
			roomId:'',
			jid:'',
			pass:''
		}
		$.extend(options,o);
		var self = this,
			chat = null,
			roomId = options.roomId;
		_init();
		function _init(){
			self.options = options;
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
										'<div class="send-prop">' +
											'<select class="userSelector"><option value="-1">所有人</option></select>' +
										'</div>' +
										'<div class="send-msg">' +
											'<input class="msgInput" type="text" placeholder="对主播说点啥呢？" />' +
											'<div class="sendBtn">发送</div>' +
										'</div>' +
										
									'</div>' +
								'</div>' +
								'<div class="ct-right">' +
									'<div class="ct-member-panel">' +
										'<div class="ct-tab">' +
											'<ul>' +
												'<li class="ct-tab-member active" data-tab="member">成员（<span></span>）</li>' +
												'<li class="ct-tab-admin" data-tab="admin">管理员（<span></span>）</li>' +
											'</ul>' +
										'</div>' +
										'<div class="ct-member">' +
											'<ul class="ct-member-list"><li>1</li></ul>' +
											'<ul class="ct-admin-list"><li>2</li></ul>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>';
			$(_template).appendTo(self);
			_initChat();
			_bindEvent();
		}
		function _initChat(){
			chat = new Chat({
				jid:options.jid,
				pass:options.pass,
		        onConnected:_onConnected,
		        onMessage:_onMessage,
		        onRoomMessage:_onRoomMessage
		    });
		    self.chat = chat;
		    chat.connect();
		}
		function _bindEvent(){
			self.on('click','.ct-tab-member',_toggleMemberTab);
			self.on('click','.ct-tab-admin',_toggleMemberTab);
			self.on('click','.sendBtn',_sendMsg);
			$('.msgInput',self).inputEnter(_sendMsg);
		}
		function _toggleMemberTab(tab){
			$('.ct-member-panel .active',self).removeClass('active');
			$(this).addClass('active');
			var _tab = $(this).data('tab');
			$('.ct-member ul',self).hide();
			if(_tab == 'member'){
				$('.ct-member-list',self).show();
			}else{
				$('.ct-admin-list',self).show();
			}

		}
		function _sendMsg(){
			var _msgInput = $('.msgInput',self),
				_msg = $.trim(_msgInput.val()),
				_userSelector = $('.userSelector',self),
				_userJid = _userSelector.val();
			if(_msg){
				if(_userJid == -1){
					chat.send(roomId,_msg,'groupchat');
				}
			}else{
				_msgInput.val(_msg);
			}
		}
		function _onConnected(_jid,_sid,_rid){
            self.jid = _jid;
            self.sid = _sid;
            self.rid = _rid;
	        chat.joinRoom(roomId);
	    }
	    var _msgTemplate = {
    		'normal':'<li>{{0}}</li>'
    	}
	    var _privateChat = $('.ct-msg-privatechat',self);
	    function _onMessage(form,msg,type){
	        message((from ? from : '[消息]') + ': ' + msg);
	    }
	    
	    var _groupChat = $('.ct-msg-groupchat',self);
	    function _onRoomMessage(from,msg,type){
	    	try{
	    		var _msg = JSON.parse(msg);
	    		_processMsg(_msg,from);
	    	}catch(e){
	    		_processMsg(msg,from);
	    	}
	        //message((from ? from : '[消息]') + ': ' + msg);
	    }
	    function _processMsg(msg,from){
	    	if(msg){
	    		var _tml = _msgTemplate['normal'].template('群聊：'+ msg + 'from:' + from);
	    		tools.log(_msgTemplate);
	    		$(_tml).appendTo(_groupChat);
	    	}
	    	tools.log('群聊：'+ msg + 'from:' + from);
	    }
	    return self;
	};
});