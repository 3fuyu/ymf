var userLogin = {
	vcid:null,
	initialize: function() {
		approveApp.showCover();
//		approveApp.ajax("user/logout",{},function(){
//			approveApp.deleteExtCookie("tenantKey");
//			approveApp.deleteExtCookie("");//这两个方法要注意先后顺序
//		},function(err){
//			approveApp.deleteExtCookie("tenantKey");
//			approveApp.deleteExtCookie("");
//		});
		approveApp.jsConfigStart();
		if(approveApp.isWeixinClient()){
			var wxId = approveApp.getExtCookie("wx");
	    	if(wxId){
	    		userLogin.initUI();
	    		userLogin.initEvent();
	        	approveApp.closeCover();
	    	}else{
	    		var args = jsLoader.getArgs();
	    		var forward= args["forward"];
	    		approveApp.toOauth(forward);
	    	}
		}else{
			userLogin.initUI();
    		userLogin.initEvent();
			approveApp.closeCover();
		}
    },
    initUI:function(){
    	approveApp.wxIsMp(function(isMp){
    		if(!isMp){
    			console.debug('is cp platform,could not reg new company or user');
    			$("div.login-line-div").remove();//如果没有账号
    			$("div.signDivB").remove();//立即注册
    		}
    	});
    	var fromBind = approveApp.getExtCookie("fromBind");
    	var title="";
    	if(fromBind){
    		console.debug('operate is do bind user');
    		$("div.logoBottomdiv").css("display","block");
    		title="绑定用户";
    	}else{
    		title="用户登录";
    		console.debug('operate is do login');
    		$("div.logoBottomdiv").css("display","none");
    	}
    	approveApp.setPageTitle(title);
    },
    initEvent:function(){
    	approveApp.bindEnterEventChain(["#code","#password"],"userLogin.loginSubmit");
    	approveApp.pwdEye();
    	approveApp.bindClickEvent("#submitBtn","userLogin.loginSubmit");
    	
    	$("#code").blur(function(){
    		var code = $.trim($(this).val());
    		if(code){
    			approveApp.ajax("user/needcaptcha",{"code":code},function(data){
    				if(data){
    					userLogin.vcid=data;
    					userLogin.showVerifyCode();
    				}
    			});
    		}
    	});
    	//添加这个校验会导致输入框光标定位到末尾，所以去掉了  2016-09-18 xingjjc
//    	approveApp.forbidEmojiInput("input");
    },
    loginSubmit:function(obj){
    	approveApp.btnClicked(obj);
		var code=$("#code").val();
		if(!code){
			approveApp.showAlert('用户名不能为空.');
			approveApp.btnClickOver("#submitBtn");
			$("#code").focus();
			return;
		}
		var password=$("#password").val();
		if(!password){
			approveApp.showAlert('密码不能为空.');
			approveApp.btnClickOver(obj);
			$("#password").focus();
			return;
		}
		var verifyCode = $("#verifyCode").val();
		if(userLogin.vcid && !verifyCode){
			approveApp.showAlert('验证码不能为空.');
			approveApp.btnClickOver(obj);
			$("#verifyCode").focus();
			return;
		}
		
		approveApp.showCover(true);
		approveApp.showCoverText("登录验证");
    	var fromBind = approveApp.getExtCookie("fromBind");    	
		approveApp.ajax("user/wxLogin",{
			"code":code,
			"password":password,
			"fromBind":(fromBind?"1":"0"),
			"verifyCode":verifyCode
		},function(userCookie){
			approveApp.btnClickOver(obj);
			approveApp.closeCover();
			//更新用户.通过后台更新cookie有时会导致在chrome-Resources-Cookies里查看还是旧的cookie
			approveApp.updateExtCookie("",userCookie);
			window.location.href = '/approve-app/static/index.html#index';
			
			// if(approveApp.isWeixinClient()){
			// 	approveApp.closePage();
			// }else{
			// 	var args = jsLoader.getArgs();
			// 	var forward= args["forward"];
			// 	if(forward){
			// 		approveApp.toUrl(forward,false);
			// 	}else{
			// 		approveApp.toStaticPage("apply-index");
			// 	}
			// }
		},function(err){
			approveApp.btnClickOver(obj);
			approveApp.closeCover();
			if(err && err.length>12 && err.substring(0,12)=="NEED_CAPTCHA"){
				userLogin.vcid = err.substring(13);
				if(verifyCode)
					err="用户名或密码错误";
				else
					err="请输入图片验证码";
			}else if(err=="CAPTCHA_ERROR"){
				err="图片验证码错误";
			}else if(err=="CODE_PWD__ERR"){
				err="用户名或密码错误";
			}
			approveApp.showAlert("登录失败:"+err);
			if(userLogin.vcid){
				userLogin.showVerifyCode();
			}
		});
    },
    showVerifyCode:function(){
    	var div = $("#verifyDiv");
    	if(div.length==0){
        	var htm = '<div class="form-group" id="verifyDiv">'+
    				      	'<label class="control-label" for="verifyCode">验证码</label><span class="label-span">*</span>'+
    				      	'<div class="control-div">'+
    				         	'<input class="form-control" style="width:70%" id="verifyCode" type="text" value="" placeholder="请输入右侧验证码"/>'+
    				         	'<img id="verifyImg" style="width:4rem;height:1.5rem;float:right;"></img>'
    				      	'</div>'+
    				    '</div>';
        	div=$(htm);
        	$("#loginForm").append(div);
        	approveApp.bindClickEvent("#verifyImg", function(obj,evt){
        		var appUrl = approveApp.getAppServerUrl();
            	var src=appUrl+'/user/captcha?r='+Math.random()+"&id="+userLogin.vcid;
            	$(obj).attr("src",src);
            	$("#verifyCode").val("");
				$("#verifyCode").focus();
        	});
    	}
    	$("#verifyImg").click();//触发验证码刷新
    },
};
userLogin.initialize();