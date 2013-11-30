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
			roomId = options.roomId,
			roomMembers = [];
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
		        onRoomMessage:_onRoomMessage,
		        onPresence:_onPresence,
		        onRoster:_onRoster
		    });
		    self.chat = chat;
		    chat.connect();
		}
		function _bindEvent(){
			self.on('click','.ct-tab-member',_toggleMemberTab);
			self.on('click','.ct-tab-admin',_toggleMemberTab);
			self.on('click','.sendBtn',_sendMsg);
			$('.msgInput',self).inputEnter(_sendMsg);
			$(window).unload(function(){
		    	chat.leaveRoom(roomId);   
		    });
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
			}
			_msgInput.val('');
		}
		function _onConnected(_jid,_sid,_rid){
            self.jid = _jid;
            self.sid = _sid;
            self.rid = _rid;
	        chat.joinRoom(roomId);
	    }
	    var _msgTemplate = {
    		'normal':'<li><span class="msg-time">{{time}}</span>&nbsp;<span class="msg-from">{{fromNick}}<span class="msg-from-id">({{fromId}})</span></span>说：' +
    				 '<span class="msg-text">{{msg}}</span></li>'
    	}
    	var index = 0;
	    var _privateChat = $('.ct-msg-privatechat',self);
	    function _onMessage(form,msg,stamp,type){
	    	tools.log('private:' + index++);
	        try{
	    		var _msg = JSON.parse(msg);
	    		_processMsg(_msg,from,stamp,type);
	    	}catch(e){
	    		_processMsg(msg,from,stamp,type);
	    	}
	    }
	    
	    var _groupChat = $('.ct-msg-groupchat',self);
	    function _onRoomMessage(from,msg,stamp,type){
	    	try{
	    		var _msg = JSON.parse(msg);
	    		_processMsg(_msg,from,stamp,type);
	    	}catch(e){
	    		_processMsg(msg,from,stamp,type);
	    	}
	        //message((from ? from : '[消息]') + ': ' + msg);
	    }
	    function _processMsg(msg,from,stamp,type){
	    	if(msg && from != self.sid){
	    		var _tml = _msgTemplate['normal'],
	    			_now = new Date(),
	    			_time;
	    		if((_now.getTime() - stamp.getTime())/1000 < 24*60*60){
	    			_time = tools.dateformat(stamp,'min');
	    		}else{
	    			_time = tools.dateformat(stamp,'medium');
	    		}
	    		var _msgobj = {
	    			time:_time,
	    			fromNick:'游客',
	    			fromId:from,
	    			msg:msg
	    		}
	    		$(Mustache.render(_tml,_msgobj)).appendTo(_groupChat);
	    	}
	    }
	    function _addMsg(msg){

	    }
	    function _onPresence(stanza,room){
	    	tools.log('加入房间:'+stanza);
	    }
		function _onRoster(roster,room){
			tools.log('房间成员:'+roster);
		}
	    return self;
	};
});