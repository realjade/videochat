var app = app || {};
$(function(){
	var page = $('#page');
	var header = '<div id="header" class="header">' +
				 	'<div class="topNav">' +
				 		'<div class="logo"><a href="/"><img width="63" height="29" border="0" src="images/logo.png" title="美女视频聊天 – 波波秀" alt="美女视频聊天 – 六间房"></a></div>'+
					 	'<div class="userPanel">' +
					 		'<ul><li class="loginBtn"><a>登录</a></li>' +
	    					'<li class="registerBtn"><a>注册</a></li>' +
	    					'<li class="help"><a href="http://v.6.cn/help.php" target="_blank">帮助</a></li></ul>' +
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
	var loginStr = '<div class="login">' +
				   		'<div class="title">立即登录，马上和美女主播互动！</div>' +
				   		'<div class="item">' +
				   			'<div class="subtitle">用户名</div>' +
				   			'<div class="input"><input name="username" type="text" placeholder="请输入您的用户名"/></div>' +
				   		'</div>' +
				   		'<div class="item">' +
				   			'<div class="subtitle">密码</div>' +
				   			'<div class="input"><input name="password" type="password" placeholder="请输入您的密码"/></div>' +
				   		'</div>' +
				   		'<div class="item">' +
				   			'<label id="remember" class="checkbox"><i class="unchecked"></i>保持我的登录状态</label>' +
                            '<a class="right" id="forget" href="forget.html">忘记密码?</a>'+
                            '<a class="right" class="registerBtn">立即注册</a>'+
				   		'</div>' +
				   		'<div class="loginBtn">立即登录</div>'
				   '</div>';
	var registerStr = '<div class="register">' +
				   		'<div class="title">立即注册，马上和美女主播互动！</div>' +
				   		'<div class="item">' +
				   			'<div class="subtitle">用户名</div>' +
				   			'<div class="input"><input name="username" type="text" placeholder="请输入您的用户名"/></div>' +
				   		'</div>' +
				   		'<div class="item">' +
				   			'<div class="subtitle">密码</div>' +
				   			'<div class="input"><input name="password" type="password" placeholder="请输入您的密码"/></div>' +
				   		'</div>' +
				   		'<div class="item">' +
				   			'<label id="remember" class="checkbox"><i class="unchecked"></i>保持我的登录状态</label>' +
                            '<a class="right" id="forget" href="forget.html">忘记密码?</a>'+
                            '<a class="right" class="registerBtn">立即注册</a>'+
				   		'</div>' +
				   		'<div class="loginBtn">立即注册</div>'
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
            var element = dialog.element;
            element.on('click','.loginBtn',function(){
            	var usernameInput = $('input[name="username"]',element),
            		pwdInput = $('input[name="password"]',element),
            		username = usernameInput.val(),
            		pwd = pwdInput.val();

            });
            element.on('click','.registerBtn',function(){
            	$('.registerBtn',hdPanel).trigger('click');
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
		});
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
});