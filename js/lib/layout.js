var app = app || {};
$(function(){
	var header = '<div id="header" class="header">' +
				 	'<div class="topNav">' +
					 	'<div class="userPanel">' +
					 		'<ul><li class="loginbtn"><a>登录</a></li>' +
	    					'<li class="registerbtn"><a>注册</a></li>' +
	    					'<li class="help"><a href="http://v.6.cn/help.php" target="_blank">帮助</a></li></ul>' +
	    				'</div>' +
	    			'</div>' +
	    			'<div class="headmanup">' +
		    			'<div class="headmanu">' +
				            '<div class="logo"><a href="/"><img width="100" height="46" border="0" src="images/logo.png" title="美女视频聊天 – 六间房" alt="美女视频聊天 – 六间房"></a></div>'+
			                '<ul class="navMain">' +
						        '<li class="active"><a href="/">首页</a></li>' +
						        '<li class="navMain-video"><a href="store.html">商城</a></li>' +
						    '</ul>'
						'</div>' +
					'</div>' +
				 '</div>';
	app.initHeader = function(){
		var hdPanel = $(header);
		hdPanel.prependTo($('#page'));
		hdPanel.on('click','.loginbtn',function(){

		});
		hdPanel.on('click','.registerbtn',function(){

		})
	};
	var footer = '<div id="footer" class="footer">' +
					'Copyright&copy;boboxiu.tv. All Rights Reserved.京ICP备13005687号-3' +
				 '</div>';
	app.initFooter = function(){
		$(footer).appendTo($('#page'));
	};
	if($('#page').data('header') != 'no'){
		app.initHeader();
	}
	if($('#page').data('footer') != 'no'){
		app.initFooter();
	}
});