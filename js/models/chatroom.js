$(function(){
	$.fn.chatroom = function(o){
		var options = {
			roomId:'',
			giftUrl:'',
			host:'',
			user:{}
		}
		$.extend(options,o);
		var user = options.user;
		var self = this,
			chat = null,
			roomId = options.roomId,
			roomMembers = {},
			connectTag = false,
			reconnectOnce = false;
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
											'<ul class="ct-msg-groupchat"></ul>' +										'</div>' +
									'</div>' +
									'<div class="ct-send-panel">' +
										'<div class="send-prop">' +
											'<select class="userSelector"><option value="所有人">所有人</option></select>' +
											'<span class="emojiImgBtn"></span>' +
											'<div class="emojiImgPanel"></div>' +
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
											'</ul>' +
										'</div>' +
										'<div class="ct-member">' +
											'<ul class="ct-member-list"></ul>' +
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
				jid:user.result[0].user_account,
				pass:user.result[0].password,
				host:options.host,
				nick:user.result[0].nick_name,
		        onConnected:_onConnected,
		        onReconnected:_onReconnected,
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
			var msgInput = $('.msgInput',self);
			self.on('click','.ct-tab-member',_toggleMemberTab);
			self.on('click','.ct-tab-admin',_toggleMemberTab);
			self.on('click','.sendBtn',_sendMsg);
			self.on('click','.msg-from',function(){
				var _nick = $(this).data('nick'),
					_option = $('<option class="addedOption" selected="selected" value="' + _nick + '">' + _nick + '</option>');
				if(_nick == '我') return;
				var _tag = false;
				$('.userSelector .addedOption',self).each(function(){
					if($(this).val() == _nick){
						_tag = true;
						return false;
					}
				});
				//$('.userSelector .addedOption',self).remove();
				if(!_tag){
					_option.appendTo($('.userSelector',self));
				}
			});
			self.on('click','.emojiImgBtn',function(event){
				$('.emojiImgPanel',self).show();
				$(document).one('click',function(){
					$('.emojiImgPanel',self).hide();
				});
				tools.cancelBubble(event);
			});

			self.on('click','.msg-emoji-btn',function(){
				var _str = $(this).data('emoji');
				msgInput.val(msgInput.val() + _str).focus();
			});
			msgInput.inputEnter(_sendMsg);
			self.on('mouseover','.msg-from',_shwoMemberOpt);
			$(document).on('click','.member-kick-opt',_kickMember);
			$(document).on('click','.member-ban-opt',_banMember);
			// $(window).unload(function(){
		 //    	chat.leaveRoom(roomId);   
		 //    });
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
			if(!connectTag) return false;
			var _msgInput = $('.msgInput',self),
				_body = $.trim(_msgInput.val()),
				_userSelector = $('.userSelector',self),
				_toNick = _userSelector.val();
			if(_body){
				var _msgObj = {
					nick:user.result[0].nick_name,
	    			time:tools.dateformat(new Date(),'min'),
	    			user:{
		    			fromNick:"我",
		    			toNick:_toNick
	    	    	},
	    			body:_body,
	    			bodyShow:_body,
	    			properties:[
	    				{
	    					key:'to',
	    					value:_toNick,
	    					type:'string'
	    				},
	    				{
	    					key:'vip',
	    					value:user.vip,
	    					type:'string'
	    				},
	    				{
	    					key:'accountId',
	    					value:user.result[0].account_id,
	    					type:'string'
	    				},
	    				{
	    					key:'userId',
	    					value:user.result[0].user_id,
	    					type:'string'
	    				},
	    				{
	    					key:'richLevel',
	    					value:user.userRichLevel + '',
	    					type:'integer'
	    				},
	    				{
	    					key:'richIcon',
	    					value:user.userRichLevelAlias + '',
	    					type:'integer'
	    				}
	    			]
	    		}
	    		_msgObj.bodyShow = processEmojiText(_msgObj.bodyShow);
				chat.send(roomId,_msgObj,'groupchat');
	    		_addMsg(_msgObj);
			}
			_msgInput.val('').focus();
		}
		function _onConnected(_jid,_sid,_rid){
			self.loading.fadeOut();
			connectTag = true;
            self.sid = _sid;
            self.rid = _rid;
	        chat.joinRoom(roomId);
	    }
	    function _onReconnected(){
	    	connectTag = false;
	    	reconnectOnce = true;
	    }
	    
	    var _privateChat = $('.ct-msg-privatechat',self),
	    	_groupChat = $('.ct-msg-groupchat',self);
	    function _onMessage(message){
	    	self.loading.fadeOut();
	        if(message){
	        	if(message.isDelay){
	        		_processMsg(message);
	        	}else{
	        		if(message.accountId != user.result[0].account_id){
	        			_processMsg(message);
	        		}
	        	}
	    		
	    	}
	    }
	    function _processMsg(msg){
	    	var _now = new Date(),
	    		_time;
	    	if(((_now.getTime() - msg.time.getTime())/1000 < 24*60*60)&&_now.getDay() == msg.time.getDay()){
    			_time = tools.dateformat(msg.time,'min');
    		}else{
    			_time = tools.dateformat(msg.time,'medium');
    		}
    		msg.richIcon = parseInt(msg.richIcon,10);
    		var _msgObj = {
    			accountId:msg.accountId,
    			nick:msg.from.nick,
    			time:_time,
    			isDelay:msg.isDelay,
    			body:msg.body,
    			bodyShow:msg.body,
    			richIcon:msg.richIcon > 9 ? 10 : (msg.richIcon + 1),
    			richLevel:msg.richLevel,
    			vip:(!msg.vip || parseInt(msg.vip,10) == 0) ? false : parseInt(msg.vip,10) - 5
    		}
    		if(parseInt(msg.richIcon,10) > 1){
    	   		_msgObj.showRich = true;
    	   	}else{
    	   		_msgObj.showRich = false;
    	   	}
    		if(msg.from.nick == user.result[0].nick_name){
    			msg.from.nickShow = "我";
    		}else{
    			msg.from.nickShow = msg.from.nick;
    		}
    	    if(msg.type){
    	    	_msgObj.user = false;
    	    	var _ru = '<span class="msg-from" data-nick="' + msg.from.nickShow + '">' + msg.from.nickShow + '</span>';
    	    	if(_msgObj.vip != 0){
    	    		_ru += '<img class="msg-vip" src="images/liveshow/user_vip' + _msgObj.vip + '.png" />';
    	    	}
    	    	if(_msgObj.showRich){
    	    		_ru += '<img class="msg-rich" src="images/rich/' + _msgObj.richIcon + '.png" /><span class="msg-level">' + _msgObj.richLevel + '</span>';
    	    	}
    	    	_msgObj.bodyShow = _msgObj.bodyShow.replace('&&U&&',_ru)
    	    					.replace('&&H&&','<span class="msg-to">'+ self.roomHostNick +'</span>');
    	    	_msgObj.bodyShow = _msgObj.bodyShow.replace(/<img src=\'(.*)\'\/>/g,
    	    										function($0,$1){
    	    											if($1 == '0'){
    	    												return '<img class="msg-gift-img" src="images/liveshow/x_chat_redpocket.png" />';
    	    											}
    	    											return '<img class="msg-gift-img" src="' + options.giftUrl + $1 + '.png" />';
    	    										});
    	    	// if(msg.type == '101'){
    	    	// 	msg.nick = msg.from.nick;
    	    	// 	_addMember(msg,true);
    	    	// }
    	    }else{
    	    	_msgObj.user = {
	    			fromNick:msg.from.nickShow,
	    			toNick:msg.to == user.result[0].nick_name ? '我' : msg.to
    	    	}
    	    	_msgObj.bodyShow = processEmojiText(_msgObj.bodyShow);
    	    }
    		_addMsg(_msgObj);
	    }
	    function processEmojiText(str){
	    	if(!str) return '';
	    	return str.replace(/\/.{1,2};/g,function($0){
    	    						return getemoji($0);
    	    					});
	    }
	    function _addMsg(_msgObj){
	    	if(_msgObj.isDelay && reconnectOnce){
	    		$('li',_groupChat).first().remove();
	    	}
	    	if(_msgObj.nick && _msgObj.nick == app.adminNick) return false;
	    	var _tmpl = '<li>' +
	    					//'<span class="msg-time">{{time}}</span>&nbsp;' +
	    					'{{#user}}<span class="msg-from" data-nick={{fromNick}}>{{fromNick}}</span>' +
	    					'{{#vip}}<img class="msg-vip" src="images/liveshow/user_vip{{vip}}.png" />{{/vip}}' +
	    					'{{#showRich}}<img class="msg-rich" src="images/rich/{{richIcon}}.png" /><span class="msg-level">{{richLevel}}</span>{{/showRich}}对' +
	    					'<span class="msg-to">{{toNick}}</span>' +
	    					'说：{{/user}}' +
	    					'<span class="msg-text">{{& bodyShow }}</span>' +
	    				'</li>';
	    	$(Mustache.render(_tmpl,_msgObj)).data(_msgObj).appendTo(_groupChat);
	    	_groupChat[0].scrollTop = _groupChat[0].scrollHeight;
	    }
	    
	    function _onPresence(stanza,room){
	    	var _nick = stanza.getAttribute('from').split('/')[1],
	            _type = stanza.getAttribute('type');
	        if(_type == 'unavailable' && _nick != user.result[0].nick_name){
	            _removeMember(_nick);
	            if(_nick.indexOf('游客') == -1){
	            	_addMsg({
	            		time:tools.dateformat(new Date(),'min'),
	            		bodyShow:_nick + '离开了房间'
	            	});
	            }
	        }else{
	        	_addMember({nick:_nick},false);
	        }
	    }
		function _onRoster(roster,room){
			self.roomHostNick = room.nick == user.result[0].nick_name ? "我" : room.nick;
			if(!roster) return false;
			if(!roster[user.result[0].nick_name]) return;
			if($('.ct-member-list li',self).length) return;
			for(var _memberId in roster){
				var _member = roster[_memberId];
				_addMember(_member,false);
			}
		}
		function _addMember(_member,isMsg){
			var _memberTmpl =   '<li class="{{classStr}}">' +
							    	'<span title="{{nick}}">{{nick}}</span>' +
							    '</li>';
				_listPanel = $('.ct-member-list',self),
				_panel = null;
			if(_member.nick == app.adminNick) return false;
			if(roomMembers[_member.nick]){
				if(isMsg){
					roomMembers[_member.nick].data(_member);
				}
				return;
			}
			if(isMsg && _member.isDelay) return;
			if(_member.nick == user.result[0].nick_name){
				_member.classStr = 'member_owner';
				_member.isAdmin = true;
				_panel = $(Mustache.render(_memberTmpl,_member));
				_panel.prependTo(_listPanel);
			}else{
				_member.classStr = 'member_normal';
				_panel = $(Mustache.render(_memberTmpl,_member));
				_panel.appendTo(_listPanel);
			}
			roomMembers[_member.nick] = _panel;
			//roomMembers[_member.nick].data(_member);
			var _account = parseInt($('.ct-member-account',self).text(),10);
			$('.ct-member-account',self).text(++_account);
		}
		function _removeMember(_nick){
			if(roomMembers[_nick]){
				var _account = parseInt($('.ct-member-account',self).text(),10);
				$('.ct-member-account',self).text(--_account);
				roomMembers[_nick].remove();
				delete roomMembers[_nick];
			}
		}
		function _shwoMemberOpt(){
			var _item = $(this).parents('li'),
				_data = _item.data();
			if(_data.nick == user.result[0].nick_name || !roomMembers[_data.nick]) return;
			$('#ct-opt').remove();
			var _str =   '<div id="ct-opt">'+
							'<div class="member-opt"><a class="member-kick-opt">踢人</a>' +
							    '<a class="member-ban-opt">禁言</a>' +
							'</div>' +
						'</div>',
				_panel = $(_str);
			_panel.appendTo(DOMPanel.getPanel()).data(_data);
			var _offset = $(this).offset();
			_panel.css({left:_offset.left,top:_offset.top + 15});
			$(document).one('click',function(){
				$('#ct-opt').remove();
			});
		}
		function _kickMember(){
			var _item = $('#ct-opt'),
				_data = _item.data();
			$('#ct-opt').remove();
			if(confirm('您确定要踢出'+_data.nick+'吗？')){
				if(_data){
					jQuery.ajax({
	                    url: "/weipaike/api",
	                    data:{
	                    	'op':'managerRoomUser',
	                    	'power_source':'Wapp',
	                    	'action_id':1,
	                    	'sponsor_id':user.result[0].account_id,
	                    	'sponsor_status':0,
	                    	'executor_id':_data.accountId,
	                    	'executor_nickname':_data.nick,
	                    	'room_id':user.result[0].user_account,
	                    	'Version':2.1
	                    },
	                    type: "POST",
	                    dataType: 'json',
	                    success: function(resp){
	                        if(!resp || resp.errno != 0){
	                            smallnote('踢人失败');
	                        }else{
	                            smallnote('踢人成功');
	                            _removeMember(_data.nick);
	                        }
	                    }
	                });
				}
			}
		}
		function _banMember(){
			var _item = $('#ct-opt'),
				_data = _item.data();
			$('#ct-opt').remove();
			if(confirm('您确定要禁止'+_data.nick+'发言吗？')){
				if(_data){
					jQuery.ajax({
	                    url: "/weipaike/api",
	                    data:{
	                    	'op':'managerRoomUser',
	                    	'power_source':'Wapp',
	                    	'action_id':2,
	                    	'sponsor_id':user.result[0].account_id,
	                    	'sponsor_status':0,
	                    	'executor_id':_data.accountId,
	                    	'executor_nickname':_data.nick,
	                    	'room_id':user.result[0].user_account,
	                    	'Version':2.1
	                    },
	                    type: "POST",
	                    dataType: 'json',
	                    success: function(resp){
	                        if(!resp || resp.errno){
	                            smallnote('禁言失败');
	                        }else{
	                            smallnote('禁言成功');
	                        }
	                    }
	                });
				}
			}
		}
		var mEmojiResId = [];
		mEmojiResId[0] = 'xiuba_smiley_2';
		mEmojiResId[1] = 'xiuba_smiley_4';
		mEmojiResId[2] = 'xiuba_smiley_5';
		mEmojiResId[3] = 'xiuba_smiley_6';
		mEmojiResId[4] = 'xiuba_smiley_11';
		mEmojiResId[5] = 'xiuba_smiley_12';
		mEmojiResId[6] = 'xiuba_smiley_13';
		mEmojiResId[7] = 'xiuba_smiley_16';
		mEmojiResId[8] = 'xiuba_smiley_18';
		mEmojiResId[9] = 'xiuba_smiley_20';
		mEmojiResId[10] = 'xiuba_smiley_21';
		mEmojiResId[11] = 'xiuba_smiley_26';
		mEmojiResId[12] = 'xiuba_smiley_29';
		mEmojiResId[13] = 'xiuba_smiley_33';
		mEmojiResId[14] = 'xiuba_smiley_41';
		mEmojiResId[15] = 'xiuba_smiley_44';
		mEmojiResId[16] = 'xiuba_smiley_45';
		mEmojiResId[17] = 'xiuba_smiley_46';
		mEmojiResId[18] = 'xiuba_smiley_48';
		mEmojiResId[19] = 'xiuba_smiley_49';
		mEmojiResId[20] = 'xiuba_smiley_51';
		mEmojiResId[21] = 'xiuba_smiley_52';
		mEmojiResId[22] = 'xiuba_smiley_54';
		mEmojiResId[23] = 'xiuba_smiley_65';
		mEmojiResId[24] = 'xiuba_smiley_66';
		mEmojiResId[25] = 'xiuba_smiley_67';
		mEmojiResId[26] = 'xiuba_smiley_79';
		mEmojiResId[27] = 'xiuba_smiley_81';
		mEmojiResId[28] = 'xiuba_smiley_82';
		mEmojiResId[29] = 'xiuba_smiley_83';
		mEmojiResId[30] = 'xiuba_smiley_84';
		mEmojiResId[31] = 'xiuba_smiley_89';
		mEmojiResId[32] = 'xiuba_smiley_90';
		mEmojiResId[33] = 'xiuba_smiley_91';
		mEmojiResId[34] = 'xiuba_smiley_92';
		mEmojiResId[35] = 'xiuba_smiley_93';

		var mEmojiCodeStr = [];
		mEmojiCodeStr[0] = "/色;";
		mEmojiCodeStr[1] = "/得意;";
		mEmojiCodeStr[2] = "/哭;";
		mEmojiCodeStr[3] = "/害羞;";
		mEmojiCodeStr[4] = "/愤怒;";
		mEmojiCodeStr[5] = "/调皮;";
		mEmojiCodeStr[6] = "/开心;";
		mEmojiCodeStr[7] = "/酷;";
		mEmojiCodeStr[8] = "/抓狂;";
		mEmojiCodeStr[9] = "/偷笑;";
		mEmojiCodeStr[10] = "/微笑;";
		mEmojiCodeStr[11] = "/恐惧;";
		mEmojiCodeStr[12] = "/大兵;";
		mEmojiCodeStr[13] = "/嘘;";
		mEmojiCodeStr[14] = "/抠鼻;";
		mEmojiCodeStr[15] = "/傻笑;";
		mEmojiCodeStr[16] = "/左哼;";
		mEmojiCodeStr[17] = "/右哼;";
		mEmojiCodeStr[18] = "/鄙视;";
		mEmojiCodeStr[19] = "/委屈;";
		mEmojiCodeStr[20] = "/淫笑;";
		mEmojiCodeStr[21] = "/亲亲;";
		mEmojiCodeStr[22] = "/可怜;";
		mEmojiCodeStr[23] = "/吻;";
		mEmojiCodeStr[24] = "/心;";
		mEmojiCodeStr[25] = "/心碎;";
		mEmojiCodeStr[26] = "/拇指;";
		mEmojiCodeStr[27] = "/握手;";
		mEmojiCodeStr[28] = "/胜利;";
		mEmojiCodeStr[29] = "/抱拳;";
		mEmojiCodeStr[30] = "/勾手;";
		mEmojiCodeStr[31] = "/同意;";
		mEmojiCodeStr[32] = "/气球;";
		mEmojiCodeStr[33] = "/圣诞;";
		mEmojiCodeStr[34] = "/熊;";
		mEmojiCodeStr[35] = "/皇冠;";
		function getemoji(str){
			if(!str) return '';
			for(var i = 0,len = mEmojiCodeStr.length;i < len; i++){
				if(mEmojiCodeStr[i] == str){
					return '<img class="msg-emoji" src="images/emoji/' + mEmojiResId[i] + '.png' + '" />';
				}
			}
			return str;
		}
		function _initEmoji(){
			var _emojiPanel = $('.emojiImgPanel',self);
			for(var i = 0,len = mEmojiResId.length;i < len;i++){
				$('<img class="msg-emoji-btn" src="images/emoji/' + mEmojiResId[i] + '.png' + '" />').data('emoji',mEmojiCodeStr[i]).appendTo(_emojiPanel);
			}
		}
		_initEmoji();
	    return self;
	};
});