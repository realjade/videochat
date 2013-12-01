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
			roomMembers = [],
			_msgTemplate = {
	    		'normal':'<li><span class="msg-time">{{time}}</span>&nbsp;<span class="msg-from" data-jid="{{fromId}}">{{fromNick}}<span class="msg-from-id">({{fromId}})</span></span>说：' +
	    				 '<span class="msg-text">{{msg}}</span></li>'
	    	};
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
												'<li class="ct-tab-member active" data-tab="member">成员（<span class="ct-member-account">0</span>）</li>' +
												'<li class="ct-tab-admin" data-tab="admin">管理员（<span class="ct-admin-account">0</span>）</li>' +
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
			_initLoading();
			_initChat();
			_bindEvent();
		}
		function _initChat(){
			chat = new Chat({
				jid:options.jid,
				pass:options.pass,
		        onConnected:_onConnected,
		        onMessage:_onMessage,
		        onRoomMessage:_onMessage,
		        onPresence:_onPresence,
		        onRoster:_onRoster
		    });
		    self.chat = chat;
		    chat.connect();
		}
		function _initLoading(){
			var _loading = $('<div class="ct-loading"><img src="images/liveshow/loading.gif"></div>');
			self.loading = _loading;
			DOMPanel.append(_loading);
			new Offset(_loading,{top:290});
		}
		function _bindEvent(){
			self.on('click','.ct-tab-member',_toggleMemberTab);
			self.on('click','.ct-tab-admin',_toggleMemberTab);
			self.on('click','.sendBtn',_sendMsg);
			self.on('click','.room-member',_memberClick);
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
		function _memberClick(){
			alert('click');
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
				var _msgobj = {
	    			time:tools.dateformat(new Date(),'min'),
	    			fromNick:'我',
	    			fromId:self.username,
	    			msg:_msg
	    		}
	    		_addMsg(_msgobj,_msgTemplate['normal']);
			}
			_msgInput.val('');
		}
		function _onConnected(_jid,_sid,_rid){
            self.jid = _jid;
            self.username = self.jid.split('@')[0];
            self.sid = _sid;
            self.rid = _rid;
	        chat.joinRoom(roomId);
	    }
	    function _onReconnected(){

	    }
	    
	    var _privateChat = $('.ct-msg-privatechat',self),
	    	_groupChat = $('.ct-msg-groupchat',self);
	    function _onMessage(from,msg,stamp,type,isDelay){
	    	self.loading.fadeOut();
	        try{
	    		var _msg = JSON.parse(msg);
	    		_processMsg(from,_msg,stamp,type,isDelay);
	    	}catch(e){
	    		_processMsg(from,msg,stamp,type,isDelay);
	    	}
	    }
	    
	    function _processMsg(from,msg,stamp,type,isDelay){
	    	if(msg && (from != self.username || !isDelay)){
	    		var _tml = _msgTemplate['normal'],
	    			_now = new Date(),
	    			_time;
	    		if(((_now.getTime() - stamp.getTime())/1000 < 24*60*60)&&_now.getDay() == stamp.getDay()){
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
	    		_addMsg(_msgobj,_tml);
	    	}
	    }
	    function _addMsg(_msg,_tml){
	    	$(Mustache.render(_tml,_msg)).appendTo(_groupChat);
	    }
	    function _onPresence(stanza,room){
	    	tools.log('加入房间:'+stanza);
	    }
		function _onRoster(roster,room){
			tools.log('在线人员:'+roster);
			if(!roster) return false;
			$('.ct-member-list',self).empty();
			$('.ct-member-account',self).text(0);
			for(var _memberId in roster){
				var _member = roster[_memberId];
				_addMember(_member);
			}
		}
		function _addMember(_member){
			var _memberTmpl = '{{#youke}}<li><span class="youke">游客{{nick}}</span></li>{{/youke}}' +
							  '{{#user}}<li class="room-member"><span>{{nick}}</span></li>{{/user}}',
				_data;
			if(_member.role == 'participant'){
				_data = {
					youke:{
						nick:_member.nick,
						jid:_member.jid,
						affiliation:_member.affiliation
					}
				};
				$(Mustache.render(_memberTmpl,_data)).appendTo($('.ct-member-list'),self);
			}
			if(_member.role == 'moderator'){
				_data = {
					user:{
						nick:_member.nick,
						jid:_member.jid,
						affiliation:_member.affiliation
					}
				};
				$(Mustache.render(_memberTmpl,_data)).prependTo($('.ct-member-list'),self);
			}
			var _account = parseInt($('.ct-member-account',self).text(),10);
			$('.ct-member-account',self).text(++_account);
		}
	    return self;
	};
});