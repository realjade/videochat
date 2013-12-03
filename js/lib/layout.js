var app = app || {};
app.roomUrl = 'vv.183.203.16.207';
app.xmppUrl = '183.203.16.207';
$(function(){
	var page = $('#page');
	var header = '<div id="header" class="header">' +
				 	'<div class="topNav">' +
				 		'<div class="logo"><a href="/"><img width="63" height="29" border="0" src="images/logo.png" title="美女视频聊天 – 波波秀" alt="美女视频聊天 – 六间房"></a></div>'+
					 	'<div class="userPanel">' +
					 		'<ul class="logoutpanel"><li class="loginBtn"><a>登录</a></li>' +
	    					'<!--li class="registerBtn"><a>注册</a></li>' +
	    					'<li class="help"><a href="http://v.6.cn/help.php" target="_blank">帮助</a></li--></ul>' +
                            '<ul class="loginpanel">' +
                                '<li class="userinfo"><img src="images/liveshow/2.png" /><span class="username"></span></li>' +
                                '<!--li class="help"><a href="http://v.6.cn/help.php" target="_blank">帮助</a></li-->' +
                                '<li class="logout"><a>离开</a></li>' +
                            '</ul>' +
	    				'</div>' +
	    			'</div>' +
	    			'<div class="headmanup">' +
		    			'<div class="headmanu">' +
				            '<div class="logo"><a href="/"><img width="100" height="46" border="0" src="images/logo.png" title="美女视频聊天 – 波波秀" alt="美女视频聊天 – 六间房"></a></div>'+
			                '<ul class="navMain">' +
						        '<li class="active"><a href="/">首页</a></li>' +
						        '<li class="navMain-video"><a href="store.html">商城</a></li>' +
						    '</ul>'
						'</div>' +
					'</div>' +
				 '</div>';
	var loginStr = '<div class="login clearfix">' +
                        '<a class="close"></a>' +
				   		'<div class="title">马上登陆<br/><span>就可以与<span style="color: #f82c65;">在线美女</span>实时互动</span></div>' +
                        '<div class="item error"></div>' +
				   		'<div class="item">' +
				   			'<span class="subtitle">用户名：</span>' +
				   			'<div class="input"><div class="input-item"><input value="daijj" name="username" type="text" placeholder="请输入您的用户名"/></div></div>' +
				   		'</div>' +
				   		'<div class="item">' +
				   			'<span class="subtitle">密码：</span>' +
				   			'<div class="input"><div class="input-item"><input value="123456" name="password" type="password" placeholder="请输入您的密码"/></div></div>' +
				   		'</div>' +
				   		'<div class="item">' +
				   			'<label id="remember" class="checkbox"><input class="checkbox" type="checkbox" checked="" value="1">保持我的登录状态</label>' +
                            '<a class="right registerBtn"><span>没有帐号？</span>立即注册</a>'+
				   		'</div>' +
				   		'<div class="item loginBtn btn">立即登录</div>' +
				   '</div>';
	var registerStr = '<div class="login clearfix">' +
                        '<a class="close"></a>' +
				   		'<div class="title">马上注册<br/><span>就可以与<span style="color: #f82c65;">在线美女</span>实时互动</span></div>' +
                        '<div class="item error"></div>' +
				   		'<div class="item">' +
				   			'<div class="subtitle">用户名：</div>' +
				   			'<div class="input"><div class="input-item"><input name="username" type="text" placeholder="请输入您的用户名"/></div></div>' +
				   		'</div>' +
				   		'<div class="item">' +
				   			'<div class="subtitle">密码：</div>' +
				   			'<div class="input"><div class="input-item"><input name="password" type="password" placeholder="请输入您的密码"/></div></div>' +
				   		'</div>' +
                        '<div class="item">' +
                            '<div class="subtitle">确认密码：</div>' +
                            '<div class="input"><div class="input-item"><input name="password" type="password" placeholder="请确认您的密码"/></div></div>' +
                        '</div>' +
                        '<div class="item">' +
                            '<div class="subtitle">验证码：</div>' +
                            '<div class="input clearfix">' +
                                '<div class="input-item left" style="width:120px;"><input name="captcha" type="text" placeholder="验证码" /></div>' +
                                '<img class="captchaImg" src="images/tmp/captcha.gif"/>' +
                            '</div>' +
                        '</div>' +
				   		'<div class="item">' +
                            '<div class="registerBtn btn">立即注册</div>' +
                            '<a class="right loginBtn" style="margin-top:10px;"><span>已有帐号？</span>立即登录</a>'+
				   		'</div>' +
				   '</div>';
	app.initHeader = function(){
		var hdPanel = $(header);
		hdPanel.prependTo(page);
		hdPanel.on('click','.loginBtn',function(){
			var dialog = new CommonDialog({
				width:460,
                titleShow: false,
                message: loginStr,
                isConfirm:false
            });
            var element = dialog.element,
                error = $('.error',element),
                usernameInput = $('input[name="username"]',element),
                pwdInput = $('input[name="password"]',element);
            error.html('');
            usernameInput.inputEnter(loginCommit);
            pwdInput.inputEnter(loginCommit);
            element.on('click','.loginBtn',loginCommit);
            function loginCommit(){
                var username = usernameInput.val(),
                    pwd = pwdInput.val();
                if(!username){
                    error.html("请输入用户名");
                    return false;
                }
                if(!pwd || pwd.length < 6){
                    error.html("密码必须大于6位");
                    return false;
                }
                error.html('');
                // jQuery.ajax({
                //     url: "/weipaike/api",
                //     data:{op:'login',UserAccount:username,Password:pwd,Version:2,AuthType:0},
                //     type: "post",
                //     dataType: 'json',
                //     success: function(resp){
                //         if(!resp || resp.errno){
                //             error.html("登录失败，请重新登录");
                //         }else{
                //             dialog.close();
                //             resp.result[0].password = pwd;
                //             tools.setStore('visitor',JSON.stringify(resp));
                //             window.location.reload();
                //         }
                //     },
                //     error:function(){
                //         smallnote("对不起，取消授权失败");
                //     }
                // });
                // dialog.close();
                // resp.result[0].password = pwd;
                tools.setStore('visitor',JSON.stringify({user_account:username,password:pwd}));
                window.location.reload();
            }
            element.on('click','.registerBtn',function(){
            	$('.registerBtn',hdPanel).trigger('click');
            });
            element.on('click','.close',function(){
                dialog.close();
            });
		});
		hdPanel.on('click','.registerBtn',function(){
			var dialog = new CommonDialog({
				width:460,
                titleShow: false,
                message: registerStr,
                isConfirm:false
            });
            var element = dialog.element;
            element.on('click','.loginBtn',function(){
            	$('.loginBtn',hdPanel).trigger('click');
            });
            element.on('click','.registerBtn',function(){
            	
            });
            element.on('click','.close',function(){
                dialog.close();
            });
		});
        hdPanel.on('click','.logout',function(){
            tools.setStore('visitor','');
            loginHeader();
        });
        function loginHeader(){
            var visitor = app.visitor = null;
            try{
                visitor = app.visitor = JSON.parse(tools.getStore('visitor'));
            }catch(e){

            }
            if(visitor){
                $('.logoutpanel',hdPanel).hide();
                var loginpanel = $('.loginpanel',hdPanel);
                //loginpanel.find('.username').text(visitor.result[0].nick_name);
                loginpanel.show();
            }else{
                $('.logoutpanel',hdPanel).show();
                $('.loginpanel',hdPanel).hide();
            }
        }
        loginHeader();
	};
	var footer = '<div id="footer" class="footer">' +
					'Copyright&copy;boboxiu.tv. All Rights Reserved.京ICP备13005687号-3' +
				 '</div>';
	app.initFooter = function(){
		$(footer).appendTo(page);
	};
	if(page.data('header') != 'no'){
		app.initHeader();
	}
	if(page.data('footer') != 'no'){
		app.initFooter();
	}
	if(page.data('small') == 'yes'){
		$('.headmanup',page).hide();
		$('.topNav .logo',page).show();
	}
    if(page.data('needlogin') == 'yes' && !app.visitor){
        var _loginBtn = $('.loginBtn',page);
        _loginBtn.trigger('click');
        app.needlogin = true;
    }
});