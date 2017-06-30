//window.onerror=function(err){
//	alert(err);
//	return true;//阻止浏览器的默认错误处理行为即忽略这个错误
//};

(function (){
//创建空console对象，避免JS报错
if(!window.console)  
    window.console = {};  
var console = window.console;
var funcs = ['debug', 'error','info', 'log','trace', 'warn'];  
for(var i=0,l=funcs.length;i<l;i++) {
	var func = funcs[i];  
    if(!console[func]){
    	console[func] = function(){};
    }
}
if(!console.memory)
    console.memory = {};
})();
var browser={
	    versions:function(){
	        var u = navigator.userAgent;
	        return {
	            trident: u.indexOf('Trident') > -1, //IE内核
	            presto: u.indexOf('Presto') > -1, //opera内核
	            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
	            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
	            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
	            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
	            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
	            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
	            iPad: u.indexOf('iPad') > -1, //是否iPad
	            windows: u.indexOf('Windows') > -1, //是否windows
	            weixin: u.indexOf('MicroMessenger') > -1, //是否微信
	            dingtalk_app: u.indexOf('DingTalk') >-1 && u.indexOf('AliApp')>-1, //AliApp(DingTalk/2.7.9) com.alibaba.android.rimet/0 Channel/700159
	            dingtalk_pc:u.indexOf('DingTalk') >-1 && u.indexOf('AliApp')==-1,
	            qyzone: u.indexOf('QYZone') > -1,
	            qq: u.match(/\sQQ/i) == " qq" //是否QQ
	        };
	    }()
};
Date.prototype.format = function(format){
   var date = {
          "M+": this.getMonth() + 1,
          "d+": this.getDate(),
          "h+": this.getHours(),
          "m+": this.getMinutes(),
          "s+": this.getSeconds(),
          "q+": Math.floor((this.getMonth() + 3) / 3),
          "S+": this.getMilliseconds()
   };
   if (/(y+)/i.test(format)) {
          format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
   }
   for (var k in date) {
          if (new RegExp("(" + k + ")").test(format)) {
                 format = format.replace(RegExp.$1, RegExp.$1.length == 1? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
          }
   }
   return format;
};
var approveApp = window.approveApp || {
	_checkUserSuccFuncNames:null,
	_jsSdkCorpId:null,
	_jsSdkAgentId:null,
	loadingHtml:'<div id="mask" class="loading-bg z-index-bg opacity"></div>'+
				'<div class="z-index-bg loading-div">'+
					 '<div class="loading-img-div z-index-bg">'+
					 	 '<div class="loading-txt-div z-index-bg font-size-5"></div>'+
						 '<svg viewBox="0 0 120 120" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'+
						 '	 <g id="circle" class="g-circles g-circles--v1">'+
						 '        <circle id="12" transform="translate(35, 16.698730) rotate(-30) translate(-35, -16.698730) " cx="35" cy="16.6987298" r="10"></circle>'+
						 '        <circle id="11" transform="translate(16.698730, 35) rotate(-60) translate(-16.698730, -35) " cx="16.6987298" cy="35" r="10"></circle>'+
						 '        <circle id="10" transform="translate(10, 60) rotate(-90) translate(-10, -60) " cx="10" cy="60" r="10"></circle>'+
						 '        <circle id="9" transform="translate(16.698730, 85) rotate(-120) translate(-16.698730, -85) " cx="16.6987298" cy="85" r="10"></circle>'+
						 '        <circle id="8" transform="translate(35, 103.301270) rotate(-150) translate(-35, -103.301270) " cx="35" cy="103.30127" r="10"></circle>'+
						 '        <circle id="7" cx="60" cy="110" r="10"></circle>'+
						 '        <circle id="6" transform="translate(85, 103.301270) rotate(-30) translate(-85, -103.301270) " cx="85" cy="103.30127" r="10"></circle>'+
						 '        <circle id="5" transform="translate(103.301270, 85) rotate(-60) translate(-103.301270, -85) " cx="103.30127" cy="85" r="10"></circle>'+
						 '        <circle id="4" transform="translate(110, 60) rotate(-90) translate(-110, -60) " cx="110" cy="60" r="10"></circle>'+
						 '        <circle id="3" transform="translate(103.301270, 35) rotate(-120) translate(-103.301270, -35) " cx="103.30127" cy="35" r="10"></circle>'+
						 '        <circle id="2" transform="translate(85, 16.698730) rotate(-150) translate(-85, -16.698730) " cx="85" cy="16.6987298" r="10"></circle>'+
						 '        <circle id="1" cx="60" cy="10" r="10"></circle>'+
						 '   </g>'+
						 '</svg>'+
				     '</div>'+
				'</div>',
	getDaysDiffer:function(t1,t2){
		var floatDays=(t2.getTime()-t1.getTime())/(1000*3600*24);
		return floatDays.toFixed(1);//4舍5入1位小数
	},
	toDate:function(dateTime){
		if(dateTime instanceof Date){
			return dateTime;
		}else{
			if(isNaN(dateTime)){//字符串类型时间
				dateTime = Date.parse(dateTime);//返回Number
			}
			var date = new Date();
			date.setTime(dateTime);//数字类型时间
			return date;
		}
	},
	formatDate:function(dateTime,fmt){//针对传入的
		var d = approveApp.toDate(dateTime);
		return d.format(fmt);
	},
	getDayDate:function(timeMilleis){//获得时间对应的月份日期信息,如果是昨天和今天则替换成汉字
		var ymd= approveApp.formatDate(timeMilleis,'yyyy年M月d日');
		if(approveApp.isToday(ymd)){
			return "今天";
		}else if(approveApp.isYesterday(ymd)){
			return "昨天";
		}
		var year = new Date().getFullYear();
		var monDay = null;
		if(ymd.indexOf(year)==0){
			monDay = ymd.substring(5);//去掉前面的年份
		}else{
			monDay = ymd;
		}
//		if(monDay.indexOf(0)=="0")//月份0开头则去掉0
//			monDay = monDay.substring(1);
		return monDay;
	},
	getDateTime:function(timeMilleis){//获得时间对应的年月日小时分钟信息(如果年月日是昨天,今天则替换成汉字)
		return approveApp.getDayDate(timeMilleis)+" "+approveApp.formatDate(timeMilleis,'hh:mm');
	},
	isToday:function(dateStr){//判断时间字符串是否是今天
		var todayStr= new Date().format('yyyy年MM月dd日');
		return todayStr==dateStr;
	},
	isYesterday:function(dateStr){//判断时间字符串是否是昨天
		var yesterday=new Date();
		yesterday.setDate(yesterday.getDate()-1);
		var yesterdayStr=yesterday.format('yyyy年MM月dd日');
		return yesterdayStr==dateStr;
	},
	formatNumber:function(numVal,precision){//格式化数字
		if( !$.isNumeric(numVal)){
			return "";
		}
		var result = numVal;
		//说明是小数
		if($.isNumeric(precision)) {
			var val = parseFloat(numVal);
			// 解决toFixed四舍五入问题，如1.345 
			result = (Math.round(val* Math.pow(10, precision)) / Math.pow(10, precision)).toFixed(precision);
			if (result == "NaN")
				return "";
		}
		return result;
	},
	replaceEmoji:function(txt){
		if(txt==null || txt=="") return txt;
		var retTxt="";
		for(var i=0;i<txt.length;i++){
			var charCode = txt.charCodeAt(i);
			if(charCode<50000 || charCode>65000){//百度输入法输入的表情长度为2,sogou输入法的表情长度为1.baidu可能的范围55296-56319,搜狗范围>56319.中文标点符号大概在652xx-655xx范围内
				retTxt+=txt.charAt(i);
			}
		}
		return retTxt;
	},
	forbidEmojiInput:function(selector){
		$(selector).unbind("keyup");
		var selectorObjs= $(selector);
		selectorObjs.css("ime-mode","disabled");
		$.each(selectorObjs,function(idx,obj){
			$(obj).on("keyup",function(){
				var val = $(obj).val();
				var newVal=approveApp.replaceEmoji(val);
				$(obj).val(newVal);
			});
		});
	},
	toStaticPage:function(pageName,extParmUrl){
		var url = jsLoader.getAppUrl()+"/static/html/"+pageName+".html?ver="+jsLoader.getVer()+(extParmUrl||"&dd_nav_bgcolor=FF5E97F6");
//		approveApp.toUrl(url,false);
		approveApp.toUrl(url,true);
	},
	openStaticPage:function(pageName,extParmUrl){
		var url = jsLoader.getAppUrl()+"/static/html/"+pageName+".html?ver="+jsLoader.getVer()+(extParmUrl||"");
		approveApp.openUrl(url);
	},
	openUrl:function(url){
		if(approveApp.isDingTalkApp()){//只有dd手机端才新开页面，否则都是当前页面打开
			approveApp.ddOpenLink(url);
		}			
		else
			approveApp.toUrl(url,true);
	},
	toUrl:function(url,keepHistory){
		approveApp.showCover(true);
		approveApp.showCoverText("载入页面");
		if(keepHistory)
			location.href=url;
		else
			location.replace(url);//这种方法能避免history
		approveApp.closeCover();//pc端下载文件不会关闭当前页面
	},
	/////////////////////////////
    getAppServerUrl:function(){
    	var appUrl = jsLoader.getAppUrl();
    	if(appUrl.toLowerCase().indexOf("file://")==0){
    		//如果当前页面是本地资源则serverUrl需要替换成服务器端的
    		return "//ys.yyuap.com/weixin-mp-prod";//先写死成这个
    	}
    	return appUrl;
    },
    getAppName:function(){
    	var appUrlOrig = approveApp.getAppServerUrl();
    	var protocalIdx = appUrlOrig.toLowerCase().indexOf("://");
    	var firstIdx = appUrlOrig.toLowerCase().indexOf("/",protocalIdx+3);
    	var appName= firstIdx==-1?"":appUrlOrig.substring(firstIdx+1);
    	console.debug("appName="+appName);
    	return appName;
    },
    ////////////////////////////////
    getCookieValue:function(name){//获得某个cookie的值
    	var strCookie=document.cookie;
    	var arrCookie=strCookie.split("; "); 
    	for(var i=0;i<arrCookie.length;i++){
    		var arr=arrCookie[i].split("="); 
    		if(arr[0]==name) return arr[1]; 
    	}
    	return "";
    },
    updateCookieValue:function(cname,cvalue,expireDays){
    	var d = new Date();
        d.setTime(d.getTime() + (expireDays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        console.info('updateCookieValue.name='+cname+",value="+cvalue+",expireDays="+expireDays+"."+expires);
        document.cookie = cname + "=" + cvalue + "; " + expires+"; path=/;"+approveApp.getAppName();
        document.cookie = cname + "=" + cvalue + "; " + expires+"; path=/;domain=http://121.42.30.191:8880;"+approveApp.getAppName();

	},
    getCookieBasicName:function(){//获得应用对应的cookie名称与app名称一致
    	var appName = approveApp.getAppName();
    	return appName?appName:"approve-weixin-cookie";
    },
    getCookieConfigId:function(){
    	var ckName = approveApp.getCookieBasicName();
    	var configId = approveApp.getCookieValue(ckName+"_wxNoId");
    	return configId;
    },
    getCookieMultipleName:function(){//支持多个微信公众号
    	var configId = approveApp.getCookieConfigId();
    	console.info('configId='+configId);
    	if(configId==""){
    		console.error('js判断 configId 是空！！！！');
    	}
    	var ckName = approveApp.getCookieBasicName();
    	return ckName+"_"+configId;
    },
    getExtCookie:function(extKey){
    	var ckName = approveApp.getCookieMultipleName();
    	var extVal = approveApp.getCookieValue(ckName+(extKey.length==0?"":"_"+extKey));
    	return extVal;
    },
    updateExtCookie:function(extKey,newVal){
    	var ckName = approveApp.getCookieMultipleName();
    	approveApp.updateCookieValue(ckName+(extKey.length==0?"":"_"+extKey),newVal,30);
    },
    deleteExtCookie:function(extKey){
    	var ckName = approveApp.getCookieMultipleName();
		approveApp.updateCookieValue(ckName+(extKey.length==0?"":"_"+extKey),"",-1);
    },
    ///////////////////////////////////////
	ajax:function(postUrl,postData,callback,failCallback,contentType){
		var debugPostUrl = postUrl.substring(postUrl.indexOf("/")+1);
		console.debug('ajax post:'+approveApp.getAppServerUrl()+"/"+postUrl);
		approveApp.ddut('ajax');
		$.ajax({
			url:"http://121.42.30.191:8880/approve-app/"+postUrl,
			dataType:"json",
			type:'POST',
			contentType: contentType ? contentType : "application/x-www-form-urlencoded; charset=utf-8",
			data:postData,
			error:function(xhr,textStatus,err){
//				var reqCostTime = new Date().getTime()-ajaxStartTime;
//				approveApp.addTimer("请求等待_"+debugPostUrl,reqCostTime);
				console.error("ajax error.post="+debugPostUrl+",readyState="+xhr.readyState+",status="+xhr.status+",textStatus="+textStatus+",err="+err);
				
				if(failCallback){
					//"timeout", "error", "notmodified" 和 "parsererror"
					if("parseerror"==textStatus){
						//说明出现了别的错误反馈的不是json导致无法解析
						jsLoader.doCallback(failCallback,"请求反馈异常");
					}else if("timeout"==textStatus){
						jsLoader.doCallback(failCallback,"请求超时");
					}else if("error"==textStatus){
						//ajax请求过程中关闭页面或者服务器会导致ajax error事件触发
						//jsLoader.doCallback(failCallback,"");
						approveApp.closeCover();
					}else{
						jsLoader.doCallback(failCallback,textStatus);
					}
				}else{
					approveApp.closeCover();
				}
			},
			success:function(resp,textStatus,xhr){
				if(resp.success){
					if(callback){
						var respData =resp.data;
//						console.debug('ajax success with callback.respData='+respData);
						if($.isArray(respData)){//返回数据是个数组
							jsLoader.doCallback(callback,[respData]);//为什么加[]?
						}else{
							jsLoader.doCallback(callback,respData==null?[]:respData);
						}
					}
				}else{
					console.log("ajax post ("+postUrl+") fail:"+JSON.stringify(resp));
					if("USER_INVALID"==resp.msg){
						//用户cookie丢失或者无效
						var userCookie=approveApp.getExtCookie("");
						console.debug("当前用户cookie无效需重新登录.但是客户端得到的userCookie="+userCookie);
						approveApp.showAlert("您的登录信息失效或者您的帐号在别处登录导致此处下线，请重新登录.");
						approveApp.toOauth();
					}else{
						if(failCallback){
							jsLoader.doCallback(failCallback,resp.msg);
						}
					}
				}
			}
		});
	},
	//////////////////////////////////
	isWeixinClient:function(){
		return browser.versions.weixin;
	},
	isMobileClient:function(){
		return browser.versions.mobile;
	},
	isDingTalkClient:function(){//是个钉钉客户端
		return browser.versions.dingtalk_app || browser.versions.dingtalk_pc;
	},
	isDingTalkApp:function(){//是个钉钉客户端
		return browser.versions.dingtalk_app;
	},
	isDingTalkPc:function(){//是个钉钉客户端
		return browser.versions.dingtalk_pc;
	},
	getDingTalkVar:function(){
		return approveApp.isDingTalkPc()?DingTalkPC:dd;
	},
	isQYZone: function(){//是否企业空间客户端
		return browser.versions.qyzone;
	},
	////////////////////////////////////////////////////////////
	//coverTimes:approveApp.coverTimes==undefined>0?approveApp.coverTimes:0,//遮罩是否第1次
    coverTimes:0,
	coverCloseTimes:0,
    showCoverText:function(txt){
    	$(".loading-txt-div").text(txt);
    },
    showCover:function(){
        //debugger;
        console.debug(approveApp.coverTimes);
    	if(approveApp.coverTimes==0){
    		console.info('页面载入,使所有元素都隐藏');
    		$("body").children().hide();
    	}
    	
    	approveApp.coverTimes++;
        console.debug(approveApp.coverTimes);
    	//显示遮罩
    	if($("#mask").length == 0){
	    	$("body").append(approveApp.loadingHtml);
    	}
    	//使遮罩层可见
    	$("body").show();
    	$("#mask").css("height",$(document).height()).css("width",$(document).width()).show();
        $(".loading-img-div").show();
        approveApp.showCoverText('载入中');
    },
    closeCover:function(){
    	console.debug("关闭遮罩层:"+approveApp.coverTimes);
    	if(approveApp.coverCloseTimes==0){
    		//第1次关闭遮罩则把body下的元素都显示出来
    		console.info('初次关闭遮罩，使所有元素可见');
    		$("body").children().show();
    	}
    	approveApp.coverCloseTimes++;
    	
    	$("#mask").hide();
        $(".loading-img-div").hide();
        $(".loading-txt-div").text("");
    },
    showAlert:function(msg,title){
    	if(approveApp.isDingTalkClient()){
    		approveApp.getDingTalkVar().device.notification.alert({
    			message: msg,
    			title: title,//可传空
    			buttonName: "好的",
    			onSuccess : function() {
    			},
    			onFail : function(err) {
    				alert(msg);
    			}
    		});
    	}else{
    		alert(msg);
    	}
    },
    
    setPageTitle:function(title){
    	//设置title
        document.title = title;
        try {
    		//hack 在ios微信等webview中无法修改document.title的情况
        	//貌似微信是通过document.head.innerHTML的方法修改title@todo实测
    		var $iframe = $('<iframe src="../favicon.png"></iframe>');
    		$iframe.on('load', function() {
    			setTimeout(function() {
    				$iframe.off('load').remove();
    			}, 0);
    		}).appendTo($('body'));
    	} catch (e) {}
    	if(approveApp.isDingTalkClient()){
    		approveApp.getDingTalkVar().biz.navigation.setTitle({
    		    title : title,//控制标题文本，空字符串表示显示默认文本
    		    onSuccess : function(result) {
    		    	console.debug('dd setTitle success:'+JSON.stringify(result));
    		    },
    		    onFail : function(err) {
    		    	console.debug('dd setTitle error:'+JSON.stringify(err));
    		    }
    		});
    	}
    },
    //////////////////////////////////////////////////
    isLogin:function(){
    	var userCookie = approveApp.getExtCookie("");
		if(userCookie==null || userCookie.length==0 || userCookie=="\"\""){//tomcat会生成双引号
			return false;
		}
		return true;
    },
	checkLogin:function(successFunctions){
		var login = approveApp.isLogin();
		if(login){
			console.debug("检查用户登录状态.存在userCookie则进入具体页面处理.userCookie="+approveApp.getExtCookie(""));
			if(approveApp.isDingTalkClient()){
				console.debug('用户已登录，载入dingding配置');
				approveApp.ddConfigStart(successFunctions);//如果是钉钉且已登录直接载入js
			}else{
				console.debug('用户已登录，执行后续函数');
				if(successFunctions && successFunctions.length>0){
					console.debug('successFunctions='+successFunctions);
					$.each(successFunctions,function(idx,func){
						jsLoader.doCallback(func,[]);
					});
				}else{
					approveApp.closeCover();
				}
			}
		}else{
			console.debug("检查用户登录状态.userCookie为空则进入oauth");
			approveApp.toOauth(null,successFunctions);
		}
    },
	toOauth:function(forwardUrl,successFunctions){//页面cookie丢失或错误的情况下需要通过oauth找到我是谁
		console.debug('toOauth start.successFunctions='+successFunctions);
		approveApp.showCover(true);
		approveApp.showCoverText('授权初始化');	
		approveApp.deleteExtCookie("");//userCookie
		
		if(approveApp.isDingTalkClient()){
			console.debug('toOauth is dd client.successFunctions='+successFunctions);
			approveApp.ddConfigStart(successFunctions);
		}else if(approveApp.isWeixinClient()){
			console.debug('isWxClient');
			var wxId = approveApp.getExtCookie("wx");
			if(wxId){
				console.debug('wxId='+wxId);
				approveApp.showCoverText('请登录');
				approveApp.toStaticPage("user-login");
			}else{
				var hrf= forwardUrl?forwardUrl:location.href;
				hrf=escape(hrf);
				console.debug('wxId null,to wxOauth,hrf='+hrf);
				approveApp.wxOauth(hrf);//进入微信网页回调
			}
		}else{
			console.debug('is pc Client');
			approveApp.showCoverText('请登录');
			approveApp.toStaticPage("user-login");
		}
	},
	//////////////////////////////////////////////////////////
    jsConfigOnReady:function(exeFuncNames){
    	console.debug('注册js载入成功后方法:'+exeFuncNames);
    	approveApp._checkUserSuccFuncNames=exeFuncNames;
    },
    checkUserSuccFuncExec:function(){//用户信息确定后执行的函数
    	if(approveApp._checkUserSuccFuncNames){
    		console.debug('执行登录校验后的方法:'+approveApp._checkUserSuccFuncNames);
    		if($.isArray(approveApp._checkUserSuccFuncNames)){
    			$.each(approveApp._checkUserSuccFuncNames,function(idx,func){
        			console.debug('执行登录校验后的方法:'+idx+":"+func);
    				jsLoader.doCallback(func,[]);
				});
    		}else{
    			jsLoader.doCallback(approveApp._checkUserSuccFuncNames,[]);
    		}
    	}else{
    		//if(!jsLoader.isDebug())//debug环境不隐藏按钮
			//	approveApp.hidePageAllMenu();
    		approveApp.closeCover();
    	}
    },
    jsConfigStart:function(){//启用客户端jssdk功能
    	if(approveApp.isWeixinClient()){
    		console.debug('载入 wx jssdk');
        	jsLoader.loadOneJs("//res.wx.qq.com/open/js/jweixin-1.0.0.js",'approveApp.wxJsLoadSuccess');
    	}
//    	else if(approveApp.isDingTalkClient()){//在checkLogin里已经载入了此处不再载入钉钉的js
//    		console.debug('载入 dingtalk jssdk');
//    		approveApp.ddConfigStart();
//    	}
    },
    //////////////////////////////////////////////////////////
    _ddJsConfigStarted:false,//dingding的js载入是否已经操作过
    ddConfigStart:function(successFunctions){
    	if(!approveApp._ddJsConfigStarted){
    		//approveApp.showCoverText('钉钉对接');
			console.debug('载入dd js.approveApp.ddJsLoadSuccess args ='+successFunctions);
			approveApp._ddJsConfigStarted=true;
			//var js = approveApp.isDingTalkPc()?"//g.alicdn.com/dingding/dingtalk-pc-api/2.3.1/index.js":"//g.alicdn.com/ilw/ding/0.7.5/scripts/dingtalk.js";
			var js = approveApp.isDingTalkPc()?"dd-pc":"dd-mobile";//遇到过两次载入alicdn的js载入成功后也不执行回调，但是更多次就正常，怎么破？
			jsLoader.loadOneJs(js,"approveApp.ddJsLoadSuccess",[successFunctions]);
		}else{
			console.debug('ddjsConfigStart.js loaded');
			console.debug('dd js已经载入,执行successFuncs');	
			approveApp.jsConfigOnReady(successFunctions);
    		approveApp.checkUserSuccFuncExec();
		}
    },
    ddJsLoadSuccess:function(successFunctions){
    	console.debug('ddJsLoadSuccess.successFunctions='+successFunctions);
    	if(successFunctions)
    		approveApp.jsConfigOnReady(successFunctions);
    	
    	if(approveApp.isDingTalkApp()){
    		//增加：载入表单时取消签名校验  xingjjc 2016-8-17
    		if(history.length != 1){//非首页
    			console.debug('---------->>取消签名校验<<---------xingjjc');	
    			approveApp.checkUserSuccFuncExec();
    			return;
    		}
    	}
    	
    	approveApp.showCoverText('获取签名');
    	approveApp.ajax("dingtalk/jsSign",{"url":document.location.href},'approveApp.ddConfig',function(err){
    		approveApp.showCoverText('获取钉钉签名失败');
    		approveApp.showAlert('获取钉钉签名失败.'+err);
    	});
    },
    ddConfig:function(signature){
    	approveApp.showCoverText('校验签名');
    	console.debug("ddConfig startsignature="+JSON.stringify(signature));
    	approveApp._jsSdkCorpId = signature.appid;
    	approveApp._jsSdkAgentId = signature.agentid;
    	var ddVar = approveApp.getDingTalkVar();
    	ddVar.config({
            agentId: signature.agentid, // 必填，微应用ID
            corpId: signature.appid,//必填，企业ID
            timeStamp:signature.timestamp , // 必填，生成签名的时间戳
            nonceStr: signature.noncestr, // 必填，生成签名的随机串
            signature: signature.signature, // 必填，签名
            jsApiList: ['runtime.permission.requestAuthCode','biz.ding.post','ui.progressBar.setColors',
                        'device.notification.alert','device.notification.toast','device.notification.modal',
                        'biz.util.datepicker','biz.util.ut','biz.util.open','biz.util.openModal','biz.util.openLink','biz.contact.choose','biz.contact.complexChoose',
                        'biz.navigation.setTitle','biz.navigation.quit','biz.navigation.close','biz.navigation.setIcon','biz.navigation.setRight','biz.navigation.setMenu'
                       ] // 必填，需要使用的jsapi列表
        });
    	ddVar.ready(function(){
			console.debug('ddconfig ready.');
			var login = approveApp.isLogin();
	    	if(!login){
	    		console.debug('ddconfig ready but user not login ,so getUser.');
	    		approveApp.ddOauth();
	    	}else{
	    		console.debug('ddconfig ready and user is login.so do success funcs');
	    		approveApp.showCoverText('载入数据');
//	    		ddVar.ui.progressBar.setColors({//这个方法在iphone上会导致页面卡死
//	    		    colors: ['red','green','blue','gray'], //array[number] 进度条变化颜色，最多支持4个颜色
//	    		    onSuccess: function(data) {
//	    		    },
//	    		    onFail: function() {
//	    		    }
//	    		});
	    		approveApp.checkUserSuccFuncExec();
	    		
	    		//禁用ios webview弹性效果
		    	if(browser.versions.ios) approveApp.getDingTalkVar().ui.webViewBounce.disable();
	    	}
    	});
    	ddVar.error(function(res){
			approveApp.showCoverText('签名失败');
			approveApp.showAlert('钉钉页面签名失败.'+JSON.stringify(res));
    		console.error("dd js api接口配置错误."+res+".to json="+JSON.stringify(res));
    	});	
    },
    ddOauth:function(){
		console.debug('没有登录dd,则获取用户信息.corpId='+approveApp._jsSdkCorpId);
		approveApp.showCoverText('识别用户');
		approveApp.getDingTalkVar().runtime.permission.requestAuthCode({
    	    corpId: approveApp._jsSdkCorpId,
    	    onSuccess: function(result) {
    	    	console.debug("requestAuthCode.code="+result.code);
    	    	approveApp.showCoverText('核实用户');
    	    	approveApp.ajax("dingtalk/userIdByCode",{"code":result.code},function(userCookie){
    	    		console.debug("userIdByCode.code="+result.code+",userCookie="+userCookie);
    	    		if("NOT_EXISTS"==userCookie){
    	    			approveApp.showAlert("用户不存在,请联系管理员同步用户!");
    	    			approveApp.closeCover();
    	    		}else{
    	    			approveApp.showCoverText('核实通过');
    	    			console.debug('ddOauth success.userCookie='+userCookie);
    	    			approveApp.updateExtCookie("",userCookie);
    	        		approveApp.checkUserSuccFuncExec();
    	    		}
    	    	},function(err){
    	    		approveApp.showAlert('获取当前用户信息失败.'+err);
    	    	});
    	    },
    	    onFail : function(err){
    	    	console.error("requestAuthCode fail:"+JSON.stringify(err));
    	    }
    	});
    },
    
   /**
    *ut数据埋点
    *ISV与钉钉进行数据对接的数据埋点接口，用于采集用户数据，ISV可根据微应用中关键操作进行埋点
    */
    ddut:function(ysType){
    	if(!approveApp.isDingTalkApp()){
    		return;
    	}
    	console.debug('dd 埋点:'+ysType+".corp="+approveApp._jsSdkCorpId+",agent="+approveApp._jsSdkAgentId);
    	if(approveApp._jsSdkCorpId && approveApp._jsSdkAgentId){
    		dd.biz.util.ut({
        		key:'open_micro_general_operat',
    		    value:{'corpId':approveApp._jsSdkCorpId,'agentId':approveApp._jsSdkAgentId,'type':ysType},
    		    onSuccess : function() {console.debug('埋点成功');},
    		    onFail : function(err) {console.error('埋点失败:'+err);}
        	});
    	}else{
    		console.debug('corp,agent信息不全,不执行埋点');
    	}
    },
//    ddCloseHelpIcon:function(){
//    	approveApp.getDingTalkVar().biz.navigation.setIcon({
//    		showIcon : false,//是否显示icon
//    	});
//    },
    ddSetIconPage:function(url){//设置当前页面的帮助icon和页面
    	approveApp.getDingTalkVar().biz.navigation.setIcon({
    	    showIcon : true,//是否显示icon
    	    iconIndex : 1,//显示的iconIndex,1问号2NEW3HOT
    	    onSuccess : function(result) {
    	       console.debug('dd setIcon over.user click icon');
    	       approveApp.ddOpenLink(url);
    	    },
    	    onFail : function(err){    	    	
    	    	console.debug('dd setIcon fail.'+JSON.stringify(err));
    	    }
    	});
    },
//    ddRestoreRightBtn:function(){
//    	approveApp.getDingTalkVar().biz.navigation.setRight({
//    		show: false
//    	});
//    },
    ddSetRightBtn:function(title,callbackFunc){
    	approveApp.getDingTalkVar().biz.navigation.setRight({
    	    show: true,//控制按钮显示， true 显示， false 隐藏， 默认true
    	    control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
    	    text: title,//控制显示文本，空字符串表示显示默认文本
    	    onSuccess : function(result) {
    	        console.debug('navigation.setRight success.'+JSON.stringify(result));
    	        jsLoader.doCallback(callbackFunc, [])
    	    },
    	    onFail : function(err) {
    	    	console.error('navigation.setRight fail.'+JSON.stringify(err));
    	    }
    	});
    },
    ddSetRightMenu:function(items,callbackFunc){
    	approveApp.getDingTalkVar().biz.navigation.setMenu({
    		backgroundColor : "#ADD8E6",
    		items : items,
    	    onSuccess : function(result) {
    	        console.debug('navigation.setMenu success.'+JSON.stringify(result));
    	        jsLoader.doCallback(callbackFunc, result.id)
    	    },
    	    onFail : function(err) {
    	    	console.error('navigation.setMenu fail.'+JSON.stringify(err));
    	    }
    	});
    },
    ddRemoveIconRightBtn:function(){
    	if(!approveApp.isDingTalkClient()){
    		return;
    	}
    	approveApp.getDingTalkVar().biz.navigation.setIcon({
    	    showIcon : false,//是否显示icon
    	    iconIndex : 1,//显示的iconIndex,1问号2NEW3HOT
    	    onSuccess : function(result) {
    	       console.debug('dd removeIcon over.user click icon');
    	    },
    	    onFail : function(err){    	    	
    	    	console.debug('dd removeIcon fail.'+JSON.stringify(err));
    	    }
    	});
    	
    	dd.biz.navigation.setRight({
    	    show: false,//控制按钮显示， true 显示， false 隐藏， 默认true
    	    control: false//是否控制点击事件，true 控制，false 不控制， 默认false
    	});
    },
    ddOpenLink:function(url){
    	console.debug('openLink:'+url);
    	approveApp.getDingTalkVar().biz.util.openLink({
    		url:url,
    		showMenuBar:!0,
    		credible:!0,
    		enableShare:!0,
    		onSuccess:function(result){
    			console.debug('openLink success.'+JSON.stringify(result));
    		},
    		onFail:function(err){
    			console.error('openLink err:'+JSON.stringify(err));
    		}
    	});
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    wxOauth:function(hrf){
		//get请求有时候会缓存,所以加上random
    	console.debug('wxOauth start');
		approveApp.ajax("weixin/getOauthUrl",{"forward":hrf},function(wxUrl){
			console.debug('wxOauth,prepared to :'+wxUrl);
    		approveApp.showCoverText('微信授权');//因为打开微信oauth页面和得到它的反馈极慢因此需要此语句提醒
			setTimeout(function(){
				console.debug('to wx page:'+wxUrl);
				approveApp.toUrl(wxUrl,false);//直接使用本语句有时候不好使.用了setTimeout就好使了
			}, 100);
    	},function(err){
    		approveApp.showAlert('载入微信授权页面失败.'+err);
    	});
    },
    wxJsLoadSuccess:function(){
    	approveApp.showCoverText('获取签名');
    	approveApp.ajax("weixin/jsSign",{"url":document.location.href},approveApp.wxConfig,function(err){
    		approveApp.showCoverText('获取微信签名失败');
    		approveApp.showAlert('获取微信签名失败.'+err);
    	});
    },
    wxConfig:function(signature){
    	console.debug("wx signature="+JSON.stringify(signature));
//    	approveApp._jsSdkCorpId = signature.appid;
		wx.config({
    	    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    	    appId: signature.appid, // 必填，公众号的唯一标识
    	    timestamp:signature.timestamp , // 必填，生成签名的时间戳
    	    nonceStr: signature.noncestr, // 必填，生成签名的随机串
    	    signature: signature.signature,// 必填，签名，见附录1
    	    //jsApiList: ["hideOptionMenu","closeWindow","hideMenuItems","onMenuShareTimeline","onMenuShareAppMessage","chooseImage","previewImage","uploadImage","downloadImage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    	    jsApiList: ["hideOptionMenu","closeWindow","hideMenuItems","onMenuShareTimeline","onMenuShareAppMessage","previewImage"]
		});    	
		wx.ready(function(){
			approveApp.checkUserSuccFuncExec();
    	});
		wx.error(function(res){
    		console.error("微信js api接口配置错误."+res+".to json="+JSON.stringify(res));
    	});
    },
	wxIsMp:function(callback,failCallback){
		this.ajax("weixin/isMp",{},callback,failCallback);
	},
    closePage:function(){
    	if(approveApp.isWeixinClient()){
    		wx.closeWindow();
    	}else if(approveApp.isDingTalkClient()){
    		approveApp.getDingTalkVar().biz.navigation.close({
    		    onSuccess : function(result) {
    		       console.debug('close dd page success:'+JSON.stringify(result));
    		    },
    		    onFail : function(err) {
    		    	console.debug('close dd page err:'+JSON.stringify(err));
    		    	approveApp.toStaticPage("apply-index");
    		    }
    		});
    	}else{
    		var args = jsLoader.getArgs();
    		if(args["external"]){
    			approveApp.showAlert("操作结束,关闭页面.");
        		//关闭窗口
        		window.open('','_self');//firefox不好使?
        		window.close();
    		}else{
    			//approveApp.showAlert("pc端操作成功,将进入首页面");
    			var login = approveApp.isLogin();
    			approveApp.toStaticPage(login?"apply-index":"user-login");
    		}
    	}
    },
    hidePageAllMenu:function(){
    	wx.hideOptionMenu();
    },
    getNoListHtml:function(txt){
    	var html='<div class="nodata-div">'+
					'<div class="nodata-img">'+
					'	<img src="../image/logo1.png" style="height:100%;">'+
					'</div>'+
					'<div class="nodata-div1">'+txt+'</div>'+
					'<div class="nodata-div2">祝您一天过得愉快</div>'+
				 '</div>';
    	return html;
    },
    updateFileContainerSize:function(container){
        //debugger;
    	console.debug('设置文件显示区域大小');		
    	var imgLen = container.children(".upload-file-preview").length;
    	if(imgLen>0)
    		container.css("height","auto");//有图片后撑开div
    	else
    		container.css("min-height","0");
    	
    	var w = 10;
    	if(imgLen==1) w=10;
    	else if(imgLen>=3) w=14;
    	else w=imgLen*7;
    	container.css("width",w+"rem");
    	console.debug('更新文件container的width='+w+'实际结果='+container.css("width"));
    },
	//大图显示图片
	showImg:function(url){
		var w = document.documentElement.clientWidth;
		var loadingImg = approveApp.getAppServerUrl()+"/static/image/loading.gif";
		//判断是否是表单附件上传界面
		var idx = location.href.indexOf("/form/");
		var html = null;
		if(idx==-1){
			console.debug("---------其他界面显示大图");
			html = '<div class="img-view-bg z-index-newPage-bg bg-opactity"></div>';
			html += '<div class="img-view-bg z-index-newPage">';
			html += '	<div class="img-whole">';
			html += '		<img src="'+loadingImg+'" class="img-view img-filter" title="图片" id="bigImg">';// 
			html += ' 	</div>';
			html += '</div>';
		}else{
			console.debug("--------->>表单附件上传界面显示缩略图图");
			html = '<div class="img-view-bg-sl z-index-newPage-bg-sl bg-opactity"></div>';
			html += '<div class="img-view-bg-sl z-index-newPage">';
			html += '	<div class="img-whole-sl">';
			html += '		<img src="'+loadingImg+'" class="img-view-sl img-filter" title="图片" id="bigImg">';// 
			html += ' 	</div>';
			html += '</div>';
		}
	    $("body").append(html);
	    $("#bigImg").animate({"opacity":"1"},500,function(){
	    	$(this).on("error",function(){
	    		var appUrl = approveApp.getAppServerUrl();
	    		$("#bigImg").attr("src",appUrl+"/static/image/fail.jpg");
	    	});
	    	$(this).attr("src",url);
	    });
	    
//	    var img = new Image();
//	    img.src = url;
//	    img.onload = function() {
//	    	$("#bigImg").attr("src",this.src).removeClass("img-filter").css({"":"","":""});
//	    };
	    approveApp.bindClickEvent('.img-view-bg', function(){$(".img-view-bg").remove();});
	    approveApp.bindClickEvent('.img-view-bg-sl', function(){$(".img-view-bg-sl").remove();});
    },
    //文件下载
//    showFile:function(fileId,fileName,fileType){
//    	console.debug("显示文件."+fileName+","+fileType+"=>"+fileId);
//    	var downLink= approveApp.getAppServerUrl()+"/file/downloadattachment/"+fileId;
//    	approveApp.openUrl(downLink);
//    },
    //创建文件的显示和事件对象
    createFileShowDiv:function(att){
    	var appUrl = approveApp.getAppServerUrl();
    	var type = att.type?att.type.toLowerCase():"";
    	var img = null;
        if(type.length>6 && type.substring(0,6)=="image/"){// && type!="image/tif" && type!="image/tiff"
            console.debug('image file.'+att.id+".type="+type);
            var imgSrc = att.aliOSSLimitUrl;
            var loadingImgSrc = appUrl+"/static/image/loading.gif";
            var clientW=document.documentElement.clientWidth;
            var littleWidth = parseInt(clientW/4);
            var imgSrc2 = imgSrc;//+'?w='+littleWidth;
            console.info(imgSrc2);
            approveApp.createPrefetch(imgSrc);

            img=$("<img src='"+loadingImgSrc+"' class='tab3-img'></img>");
            var litterImg = new Image();
            litterImg.src=imgSrc2;
            litterImg.onload=function(){
                console.debug('litterImg load over. '+this.src);
                img.attr("src",this.src);
            };
            litterImg.onerror=function(){
                //载入失败
                img.attr("src",appUrl+"/static/image/fail.jpg");
            };
            approveApp.bindClickEvent(img,function(){
                $.post(appUrl+"/oss/file?filename="+att.externalUrl,function(data){
                    var data= $.parseJSON(data);
                    approveApp.showImg(data.url);
                })

            });
        }else{
            var name = att.name;
            img=$('<a href="'+appUrl+'/file/downloadattachment/'+att.id+'" target="_blank" class="tab3-img font-size-3 tab3-notimg-file"><i class="icon iconfont icon-enclosure"></i><br>'+name+'</a>');
//    		approveApp.bindClickEvent(img,function(){
//    			approveApp.ddut('pageclick');
//    		});
        }
        var fileDiv= $('<div class="tab3-img-div upload-file-preview"></div>');
        fileDiv.append(img);
        return fileDiv;

    },
    createFileDelIcon:function(fileDiv,delFunc){
    	var delicon=$("<i class=\"upload-icon iconfont icon-delete\"></i>");
		fileDiv.append(delicon);
		approveApp.bindClickEvent(delicon,function(){
			var _msg = "确定要删除这个文件吗？";
			if(approveApp.isDingTalkClient()){
	    		approveApp.getDingTalkVar().device.notification.confirm({
	        	    message: _msg,
	        	    title: '文件删除确认',
	        	    buttonLabels: ['取消', '确定'],
	        	    onSuccess : function(result) {
	        	    	if( result.buttonIndex == 1) jsLoader.doCallback(delFunc,[]);
	        	    },
	        	    onFail : function(err) {
	        	    	console.debug("dd.confirm error==>"+JSON.stringify(err));
	        	    }
	        	});
//			}else if(confirm(_msg,'yes','no')) jsLoader.doCallback(delFunc,[]);
	    	//微信多次confirm()时，取消按钮变成关闭网页，所以取消提示弹窗，直接删除图片 2016-09-18 xingjjc
	    	}else jsLoader.doCallback(delFunc,[]); 
		});
    },
    createPrefetch:function(url){//文件预加载,h5新特性
    	var htm='<link rel="prefetch prerender" href="'+url+'">';
    	$("body").append(htm);
    },
    pwdStrength:function(pwdSelector,pwd2Selector){
    	//$(pwd2Selector).attr("disabled","true").attr("readonly","true");
    	$(pwdSelector).complexify({minimumChars: 6, 
    		strengthScaleFactor: 0.5}, function(valid, complexity){
    	    console.debug('valid='+valid+',cmpx='+complexity);
    	    $("div.strength").css("width",Math.round(complexity)+"%");
    	    if(valid){
    	    	//$(pwd2Selector).removeAttr("disabled").removeAttr("readonly");
    	    	$("div.strength").css("background","green");
    	    }else{
    	    	//$(pwd2Selector).attr("disabled","true").attr("readonly","true");
    	    	$("div.strength").css("background","#d3a435");
    	    }
    	});
    },
    pwdEye:function(pwdSelector){
    	$("input[type=password]").after('<i class="icon iconfont click-eye icon-eye-off"></i>');
    	approveApp.bindClickEvent("i.click-eye",function(obj){
    		var $this=$(obj);
    		var pwd = $this.siblings("input");
    		var type = pwd.attr("type");
    		if(type=="password"){
    			pwd[0].type= "text";
    			$this.removeClass("icon-eye-off").addClass("icon-eye");
    		}else{
    			pwd[0].type= "password";
    			$this.removeClass("icon-eye").addClass("icon-eye-off");
    		}
    	});
    },
    checkboxIconSelected:function(iconObj,selected){
    	iconObj.attr("checked",selected);
    },
    btnClicked:function(btnSelector){
    	//这种操作时是异步的咋整!!
    	$(btnSelector).attr("disabled",true).css("background","#7bcfcb").css("color","#fff");
    },
    btnClickOver:function(btnSelector){
    	$(btnSelector).css("background","").css("color","").attr("disabled",false);
    },
    createTextPic:function(eleSecector,url,txt,extCss){
    	if(url && url!='null')
    		return $(eleSecector).attr('src',url);
    	else{
    		extCss = extCss ||'';
    		var nameTxt = (txt.length>2?txt.substring(txt.length-2):(txt.length==0?"no":txt));
    	var htm='<div class="center-line-div-img" style='+(extCss)+'><span style="height:3.572rem; line-height:3.572rem; display:block; color:#FFF; text-align:center">'+nameTxt+'</span></div>';
    		//var htm='<span class="center-line-div-img tab1-img" style='+(extCss)+'>'+nameTxt+'</span>';
    		return $(eleSecector).replaceWith(htm);
    	}
    },
    createListMenu:function(options){
    	var id = options.id?options.id:"list_menu";
    	
    	console.debug('createListMenu被调用.');
    	if($('#'+id).length > 0){
    		console.debug('已存在ListMenu则删除它.');
    		$('#'+id).remove();
    	}
    	
		console.debug('不存在ListMenu则创建.');
		
    	var position = options.position?options.position:"top";
    	var oWidth = options.width?options.width:"100%";
    	
    	var listCssStr = options.listCssStr?options.listCssStr:"";
    	var listItemCssStr = options.listItemCssStr?options.listItemCssStr:"";
    	var bottomBgFlag = options.bottomBgFlag?options.bottomBgFlag:false;
    	
		var html = '<div class="list_menu_whole_bg z-index-newPage-bg" id="' + options.id + '_bgClick" style="width: 100%;height: 100%;position: fixed;top: 0px;"></div><div id="' + options.id + '" class="list_menu_whole z-index-newPage list_menu_'+ position +'" style="width:' + oWidth + ';' +  listCssStr  + '">';
    	if (options.menuOptions) {
    		var l = options.menuOptions.length;
    		$.each(options.menuOptions, function(i) {
    			var lastClass= '';
    			if(i == (l-1)){
    				lastClass = "last_menu";
    			}
    			var thisItemCssStr = listItemCssStr;
    			if(this.id == options.defaultDataId){//默认选中的数据
    				thisItemCssStr += 'color: #ff7a00;';
    			}
    			
    			html += '<div id="' + this.id + '" class="list_menu ' + lastClass + '" style="' + thisItemCssStr +'">';
    			html += this.showName;
    			if(this.id == options.defaultDataId){//默认选中的数据
    				html+= '<div class="icon iconfont icon-submit" style="position:absolute;right:2.5rem;height: 2rem;line-height: 2rem;"></div>';
    			}
    			html += '</div>';
    		});
    	}
		html += '</div>';
		if(bottomBgFlag){
			html += '<div class="list_menu_bottom_bg" style="' + listCssStr + '"></div>';
		}
		$("body").append(html);
				
		if (options.menuOptions) {
			$.each(options.menuOptions, function(idx,menu) {
				approveApp.bindClickEvent("div#"+menu.id,function(){
					$(".list_menu_whole_bg").remove();
					$(".list_menu_bottom_bg").remove();
					jsLoader.doCallback(menu.event,[$(this),menu.id,menu.showName]);
				});
			});
		}
		//屏幕滚动时将下拉条去掉
		$(window).scroll( function(e) {
			console.debug('页面滚动移除listMenu');
			$(".list_menu_whole").remove();
			$(".list_menu_whole_bg").remove();
			$(".list_menu_bottom_bg").remove();
			$(window).unbind('scroll');
		});
		
		//别的地方点击时将下拉条去掉
//		$(document).bind("click", function (e) {
//    		if(! ($(e.target).closest(".list_menu_whole").length > 0) ){
//    			console.debug('点击页面其他地方移除listMenu');
//    			$(".list_menu_whole").remove();
//    			$(document).unbind('click');
//    		}
//    	});
		
		approveApp.bindClickEvent('.list_menu_whole_bg',function(obj,evt){
			if(! ($(evt.target).closest(".list_menu_whole").length > 0) ){
    			console.debug('点击页面其他地方移除listMenu');
    			$(".list_menu_whole").remove();
    			$(".list_menu_whole_bg").remove();
    			$(".list_menu_bottom_bg").remove();
    		}
		});
    },
    loadToken:function(callbackFunc){
    	approveApp.ajax("user/getToken",{},function(token){
    		jsLoader.doCallback(callbackFunc, [token])
    	},function(err){
    		console.error();
    	});
    },
    loadUserSearchCtl:function(callbackFunc){
    	jsLoader.loadOneJs("userSearchCtl",function(){
    		if(callbackFunc)
    			jsLoader.doCallback(callbackFunc,[]);
		});
    },
    loadMultipleSelectCtl:function(callbackFunc){
    	jsLoader.loadOneJs("multipleSelectCtl",function(){
    		if(callbackFunc)
    			jsLoader.doCallback(callbackFunc,[]);
		});
    },
    showInputDialog:function(title,tooltip,leftBtnTxt,rightBtnTxt,leftFun,rightFun){
    	$("div.dialog-bg").remove();//清空旧的
    	var html = '<div class="dialog-bg z-index-newPage-bg bg-opactity"></div>';
	    	html += '<div class="dialog-bg z-index-newPage">';
	    	html += '	<div class="dialog-whole">';
	    	html += '		<div class="dialog-title">';
	    	html += '			<span>' + title + '</span>';
	    	html += '		</div>';
	    	html += '	<div class="dialog-center">';
	    	html += '		<textarea class="dialog-textarea" placeholder="'+tooltip+'"></textarea>';
	    	html += '	</div>';
	    	html += '	<div class="dialog-button">';
	    	html += '		<div  class="dialog-btn dialog-btn-left">' + leftBtnTxt + '</div>';
	    	html += '		<div  class="dialog-btn dialog-btn-right">' + rightBtnTxt + '</div>';
	    	html += '	</div>';
	    	html += ' </div>';
	    	html += '</div>';
    	$("body").append(html);
    	approveApp.forbidEmojiInput(".dialog-textarea");
    	approveApp.bindClickEvent('.dialog-btn-left',function(obj){
    		approveApp.btnClicked(obj);
    		try {
				jsLoader.doCallback(leftFun, []);
			} catch (e) {
				console.error(e);
			}
    		approveApp.btnClickOver(obj);
    	});
    	approveApp.bindClickEvent('.dialog-btn-right',function(obj){
    		approveApp.btnClicked(obj);
    		try {
				jsLoader.doCallback(rightFun, []);
			} catch (e) {
				console.error(e);
			}
			approveApp.btnClickOver(obj);
    	});
//    	$('.dialog-textarea').focus();//默认不获得焦点.因ios里有焦点后不输入还得多点1次以外的地方才能取消焦点
    },
    dialogDefaultLeftFun:function(){
    	$(".dialog-bg").remove();
	},
    bindClickEvent:function(selector,callbackFunc){
    	$(selector).on('click',function(){
    		approveApp.ddut('pageclick');
    		jsLoader.doCallback(callbackFunc,[$(this),event]);
    	});
    },
    //绑定键盘录入事件
    bindKeyEvent:function(selector,keyCode,callbackFunc){
    	$(selector).keydown(function(ev){
    		if(ev.keyCode==keyCode) {
    			jsLoader.doCallback(callbackFunc,$(this));//事件触发对象
    		}
    	});
    },
    bindKeyupEvent:function(selector,callbackFunc,otherArgs){
    	$(selector).keyup(function(ev){
			jsLoader.doCallback(callbackFunc,otherArgs);
    	});
    },
    bindChangeEvent:function(selector,callbackFunc,otherArgs){
    	$(selector).change(function(ev){
			jsLoader.doCallback(callbackFunc,otherArgs);
    	});
    },
    bindBlurEvent:function(selector,callbackFunc){
    	$(selector).blur(function(ev){
    		jsLoader.doCallback(callbackFunc,$(this));//事件触发对象
    	});
    },
    bindScrollEvent:function(selector,callbackFunc,callbackOverFlagVarName,otherArgs){//页面滚动事件
//    	$(selector).on('swipeUp',function(){
//    		console.debug('swipeUp-----');
//    	});
    	console.debug('绑定滚动事件!selector='+selector);
    	$(selector).unbind('scroll');
    	var initHeight = $(selector).height();
    	$(selector).scroll(function(){//只有window才能触发scroll事件?
    		approveApp.trigScrollEvent(selector,initHeight,callbackFunc,callbackOverFlagVarName,otherArgs);
    	});
    	return initHeight;
    },
    trigScrollEvent:function(selector,winHeight,callbackFunc,callbackOverFlagVarName,otherArgs){
        console.log("selector: "+selector);
        var docHeight = winHeight;//内容的高度，随着向下滚动会逐步增大
        if($(selector)[0]==window){
//        	console.info("selector is window");
        	docHeight = $(document).height();
        }else{
        	docHeight = $(selector)[0].scrollHeight;
        }
    	var winScrollPos = $(selector).scrollTop();    	
    	var range = 100;//距下边界长度/单位px

        console.log("winScrollPos: "+winScrollPos);
        console.log("docHeight:"+docHeight);
        console.log('winHeight:'+winHeight);
        
        if( docHeight-winHeight <= winScrollPos+range ) {
        	console.log("滚动超出范围，需要执行callback函数了");
        	var flagVar = eval(callbackOverFlagVarName);
        	console.log(callbackOverFlagVarName+"="+flagVar);
        	if(flagVar){
        		console.debug("可以执行滚动函数");
        		jsLoader.doCallback(callbackFunc,otherArgs);
        	}else{
        		console.log("不可以执行滚动函数");
        	}
        }else{
        	console.debug('滚动没有超过边界,不load数据');
        }
    },
    /**
     * 按顺序对选择器数组中选择器对应元素进行回车键的监听,如果录入了回车且内容不为空(长度>0)则自动将焦点集中在下一个选择器。
     *  最后一个选择器上回车时触发callbackFunc
     * @param selectorChainArray 选择器数组
     * @param callbackFunc
     */
    bindEnterEventChain:function(selectorChainArray,callbackFunc){
    	var length = selectorChainArray.length;
    	$.each(selectorChainArray,function(idx,selector){
    		var nextSelector = idx<length-1?selectorChainArray[idx+1]:null;

			approveApp.bindKeyEvent(selector,13,function(selectorObj){
				if(selectorObj.is("textarea")){
//					console.debug("在文本框里回车不会自动跳到下一个焦点");
					return;
				}
				
    			var val = selectorObj.val();
        		if(val.length>0){
//        			console.debug(selector+"上执行了回车..");
        			if(nextSelector){
        				console.debug('has nextselector:'+nextSelector);
        				$(nextSelector).focus();
        			}else{
        				if(callbackFunc){
//        					console.debug('exe callbackfunc');
        					approveApp.ddut('pageclick');
            				jsLoader.doCallback(callbackFunc,[]);
            			}else{
//            				console.debug('no callbackfunc');
            			}
        			}
        		}
    		});
    	});
    },
	webAppSetup:function(backBtnToWhere,webAppFunc){//如果是手机webApp应用
	}
};