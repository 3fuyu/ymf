define(["../parts/timepicker","../parts/common", "utils",
	"../components/ApplyDetail",
	"../components/ApplyInputDate",
	"../components/ApplyInputCheckbox",
	"../components/ApplyInputDateBetween",
	"../components/ApplyInputRadio",
	"../components/ApplyLayout",
	"../components/ApplyInputText",
	"../components/ApplyInputTextarea",
	"../components/ApplyInputTextNum",
	"../components/ApplyImage",
	"../components/ApplyInputTextMoney",
  "../components/ApplyInputString",

	 "../../../components/dialog"

], function (timepicker,c, utils,ApplyDetail,
		ApplyInputDate,
		ApplyInputCheckbox,
		ApplyInputDateBetween,
		ApplyInputRadio,
		ApplyLayout,
		ApplyInputText,
		ApplyInputTextarea,
		ApplyInputTextNum,
		ApplyImage,
		ApplyInputTextMoney,ApplyInputString,Dialog) {
    function pageLogic(config) {
        this.pageview = config.pageview;
        var _this = this;
		this.itemDict = {};
		this.mode =null;//or MODIFY
		this.isFreeApprove = false;
		this.isQrRreview =this.pageview.params.qrcodepreview==="1";
		this.templateid = (this.pageview.params.templateid);//模版ID
		this.isPreview = this.pageview.params.preview==="1";
		this.formName = this.pageview.showPageParams.formName||decodeURI(this.pageview.params.name);
		if(!this.isPreview){
			this.id = (this.pageview.showPageParams.id);//用户提交的单据ID
			if(this.templateid||this.templateid==="0"){
				this.mode = "NEW";
			}else if(this.id||this.id==="0"){
				this.mode = "MODIFY";
			}else{
				this.pageview.showTip({text:"程序出错,未提供有效的模版ID或者单据ID"});
				return;
			}

	        this.loadData();
		}else{
			$(document.body).addClass("pc-zoom");
			window.isPreview = true;
			window.previewPlugin = this;
		}
		if(this.isQrRreview){
			window.isPreview = true;
		}

		this.year = (new Date()).getFullYear();
		this.itemInstanceArr = [];
		//全天日程控件,yyyy-MM-dd
		this.yyyyMMddTimePicker = new timepicker();
		this.yyyyMMddTimePicker.mapping.yyyy.start = (1910);
		this.yyyyMMddTimePicker.mapping.yyyy.end = (this.year + 20);
		this.yyyyMMddTimePicker.setMode("yyyy-MM-dd").setParent(this.pageview.$el[0]).done()
			.bind("clear", function() {})
			.bind("ok", function(valStr) {
				if(_this.yyyyMMddTimePicker.curDateInstance){
					_this.yyyyMMddTimePicker.curDateInstance.setValue(valStr,_this.yyyyMMddTimePicker.sender);
				}else if(_this.yyyyMMddTimePicker.curDateBetweenInstance){

					_this.yyyyMMddTimePicker.curDateBetweenInstance.setSingleValue(valStr,_this.yyyyMMddTimePicker.curDateBetweenInstanceIndex,_this.yyyyMMddTimePicker.sender);
        }

			})
			.bind("cancel", function() {});
		//非全天日程控件,yyyy-MM-dd hh:mm
		this.yyyyMMddhhssTimePicker = new timepicker();
		this.yyyyMMddhhssTimePicker.mapping.yyyy.start = (1910);
		this.yyyyMMddhhssTimePicker.mapping.yyyy.end = (this.year + 20);
		this.yyyyMMddhhssTimePicker.setMode("yyyy-MM-dd hh:mm").setParent(this.pageview.$el[0]).done()
			.bind("clear", function() {})
			.bind("ok", function(valStr) {
				if(_this.yyyyMMddhhssTimePicker.curDateInstance){
					_this.yyyyMMddhhssTimePicker.curDateInstance.setValue(valStr,_this.yyyyMMddhhssTimePicker.sender);
				}else if(_this.yyyyMMddhhssTimePicker.curDateBetweenInstance){
					_this.yyyyMMddhhssTimePicker.curDateBetweenInstance.setSingleValue(valStr,_this.yyyyMMddhhssTimePicker.curDateBetweenInstanceIndex,_this.yyyyMMddhhssTimePicker.sender);
        }
			})
			.bind("cancel", function() {});


			this.setHeader();
     }

    pageLogic.prototype = {
		onPageResume:function(){
			this.setHeader();

		},
		setHeader:function(){
			try{
			  window.yyesn.client.setHeader(function(){},{
				type:2,
				title:this.formName||"审批",
				rightTitle:"",
				rightValues:[],
			  },function(b){

			  });
			}catch(e){

			}
		},
		approve_line_repeat_itemclick:function(sender,params){
			if(this.isFreeApprove){
				sender.remove();
			}
		},
		getItemTitle:function(item){
			if(item.type==="ApplyInputDateBetween"){
				return (item.title||"")+"-"+(item.title1||"");
			}else{
				return (item.title);
			}
		},
		pushTitle:function(item,titleArr){
			if(item.type==="ApplyInputString"){
				return false;
			}
			titleArr.push(this.getItemTitle(item)+"$$xz"+item.id);
		},
		getExcelContent:function(config){
			var titleArr = [];
			var detailInfoArr = [];
			for(var i=0,j=config.length;i<j;i++){
				var item = config[i];
				if(this.pushTitle(item,titleArr)===false){
					continue;
				}
				if(item.type==="ApplyLayout"&&item.isChildForm==="1"){
					var inputs = item.inputs||[];
					var startIndex  =-1;
					var endIndex  =-1;
					for(var ii=0,jj=inputs.length;ii<jj;ii++){
						var inputItem = inputs[ii];
						if(this.pushTitle(inputItem,titleArr,true)===false){
							continue;
						}
						if(startIndex===-1){
							startIndex = titleArr.length-1;
						}
						endIndex = titleArr.length-1;
					}

					var detailRowCount = 0;
					if(inputs.length>0){
						detailRowCount = inputs[0].value.length;
					}
					detailInfoArr.push({
						detailItem:item,
						detailRowCount:detailRowCount
					});
				}
			}
			var content = {
				title:titleArr
			};
			this.getExcelContentValue(content,detailInfoArr,config,titleArr);

			for(var iii=0,jjj=content.title.length;iii<jjj;iii++){
				content.title[iii] = content.title[iii].split("$$xz")[0];
			}
			return content;
		},
		getExcelContentValue:function(re,detailInfoArr,config,titleArr){
			var content = [];
			if(detailInfoArr.length===0){
				//没有详情
				var itemData = [];
				for(var i=0,j=config.length;i<j;i++){
					if(config[i].type==="ApplyInputString"){
						continue;
					}
					itemData.push(this.formartValue(config[i].value,config[i]));
				}
				content.push(itemData);
			}else{
				//第一层循环 循环明细个数
				//第二层循环 循环明细的条数
				for(var len=0;len<detailInfoArr.length;len++){
					var singleDetail = detailInfoArr[len];
					var singleDetailConfig = singleDetail.detailItem;
					var detailRowCount = singleDetail.detailRowCount;
					for(var row=0;row<detailRowCount;row++){
						var singleRe = [];
						for(var flen = 0;flen<titleArr.length;flen++){
							singleRe.push(this.getExcelFieldValue(titleArr[flen],singleDetailConfig,row,config));
						}
						content.push(singleRe);
					}
				}


			}
			re.content = content;


		},
		formartValue:function(value,itemConfig,rowIndex){
			try {
				if(itemConfig.type==="ApplyLayout"&&itemConfig.isChildForm==="1"){
					return itemConfig.title +""+(rowIndex+1);
				}

				if(itemConfig.type === "ApplyInputRadio"){
					var v = itemConfig.value||{};
					return v.value||"";
				}

				if(itemConfig.type === "ApplyInputCheckbox"){
					var arr =  itemConfig.value||[];
					arr = arr[rowIndex]||[];
					var ReArr = [];
					for(var i=0,j=arr.length;i<j;i++){
							ReArr.push(arr[i].value);
					}

					return ReArr.join(",");
				}
				return value.toString();
			} catch (e) {
				return "";
			}
		},
		getExcelFieldValue:function(title,DetailConfig,rowIndex,allConfig){
			//通过title中的id取数据 如果在明细外面能够找到字段的话 就不去明细中找
			//如果在明细外找不到的话 就从当前提供的明细配置以及行index中去找  如果找不到就是空字符串
			var id = title.split("$$xz")[1];
			var Re = "";
			var filedIsInOut = false;
			for(var i=0,j=allConfig.length;i<j;i++){
				var itemConfig = allConfig[i];
				if(itemConfig.id.toString()===id.toString()){
					Re = this.formartValue(itemConfig.value,itemConfig,rowIndex);
					filedIsInOut = true;
					break;
				}
			}
			if(filedIsInOut===false){
				var inputs = DetailConfig.inputs;
				for(var ii=0;ii<inputs.length;ii++){
					var inputItem = inputs[ii];
					if(inputItem.id.toString()===id.toString()){
						var valueArr = inputItem.value;
						var value  = valueArr[rowIndex];
						Re =  this.formartValue(value,inputItem,rowIndex);
						break;
					}
				}
			}

			return Re;
		},
		submitbtn_click:function(){
			var _this = this;
			if(this.isPreview||this.isQrRreview){
				return;
			}
      	//如果是条件审批  需要重新请求一下获取审批人员  如果不存在 就需要提示

			var config = [];
			for(var i=0,j = this.itemInstanceArr.length;i<j;i++){

				var itemConfig = this.itemInstanceArr[i].getConfig();
				if(itemConfig===false){
					config = null;
					break;
				}
				config.push(itemConfig);
			}
			if(config===null){
				return;
			}
			//cc_line_repeat memberId



			var ccArray = [];
			for(var ii=0,jj=this.pageview.refs.cc_line_repeat.datasource.length;ii<jj;ii++){
				ccArray.push(this.pageview.refs.cc_line_repeat.datasource[ii].memberId);
			}
			////userName headImgUrl memberId
			var postData = {
				ftId:this.templateid,
				formData:JSON.stringify({body:config}),
				cc:ccArray.join(","),
				excelContent:JSON.stringify(this.getExcelContent(config))
			};


			if(this.isFreeApprove){
				//customize
				var persons = this.pageview.refs.approve_line_repeat.datasource;
				var personsArr = [];
				for(var iii=0,jjj=persons.length;iii<jjj;iii++){
					personsArr.push(persons[iii].memberId);
				}
				if(personsArr.length===0){
					this.pageview.showTip({
						text:"请选择审批人",
						duration:1200
					});
					return;
				}
				postData.customize = personsArr.join(",");
				this.pageview.showLoading({
				  text:"正在提交..."
				});
				this.submitData(postData);
			}else{
				this.pageview.showLoading({
				  text:"正在提交..."
				});
				if(this.isConditionApprove){
					// 做审批人检测
					this.updateApproveLines(function(data){
						if(data.length>0){
							_this.submitData(postData);
						}else{
							_this.pageview.hideLoading(true);
							_this.pageview.showTip({text:"请选择审批人员",duration:1400});
						}
					},function(){
						_this.pageview.hideLoading(true);
					});
				}else{
					this.submitData(postData);
				}

			}


		},
		// updateApproveLines
		submitData:function(postData){
			var _this = this;

			this.pageview.ajax({
				type:"POST",
				url:"/formdata",
				data:postData,
				success:function(data){
					_this.pageview.hideLoading(data.code===0);
					if(data.code===0){
						window.needRefresMyApproveListData = true;
						window.needRefresCopyApproveListData = true;
						_this.pageview.showTip({text:"已提交成功",duration:1000});
						window.setTimeout(function(){
							_this.pageview.replaceGo("detail",{formId:data.data,formDataName:encodeURI(_this.formName)});
						},1000);
					}else{
						_this.pageview.showTip({text:data.msg||"操作失败!请稍后再试",duration:1000});
					}
				},
				error:function(error){
					_this.pageview.hideLoading(false);
					_this.pageview.showTip({text:"操作失败!请稍后再试",duration:1000});
				}
			});

		},
       loadData:function(){
       	var _this = this;
       	this.pageview.showLoading({
       		text:"努力加载中...",
       		timeout:9000,
       		reLoadCallBack:function(){
       			_this._loadData();
       		}
       	});
       	_this._loadData();
       },
       _loadData:function(){
       	var _this = this;
		var id;
		var ajaxConfig = {
			type:"GET",
			error:function(e){
				_this.pageview.hideLoading(false);
			}
		};
		if(this.mode==="NEW"){
			id = this.templateid;
			ajaxConfig.url = "/index/findTemplate";
			ajaxConfig.data= {
				templateId:id
			};
			ajaxConfig.success = function(data){
				if(data.code===0){
					_this.layoutData=[];
					try{
						_this.layoutData=JSON.parse(data.data.formTemplate.format);
						_this.currentMemberId =data.data.memberId;
					}catch(e){
						_this.pageview.showTip({text:"模版结构错误！请联系管理员"});
					}
					if(_this.isPreview||_this.isQrRreview){

					}else{
						_this.initSetApprovePersonData(data.data.formTemplate.rule);
					}
					_this.loadSuccess(_this.layoutData);
				}else{
					if(_this.isQrRreview){
						_this.pageview.showTip({text:"预览失败,在预览期间请勿关闭二维码,请重试!"});
					}
				}
				_this.pageview.hideLoading(data.code===0);
			};
		}else if(this.mode==="MODIFY"){
			id = this.id;
			ajaxConfig.url = "/formdata/mylist/"+id;
			ajaxConfig.data = {};
			ajaxConfig.success = function(data){
				if(data.code===0){
					_this.layoutData=[];
					try{
						var formData=JSON.parse(data.data.formData.formData);
						_this.currentMemberId = data.data.currentMemberId;
						_this.templateid = data.data.formData.ftId;
						_this.layoutData = formData.body;
					}catch(e){
						_this.pageview.showTip({text:"模版结构错误！请联系管理员"});
					}
          			_this.initSetApprovePersonData(data.data.rule);
					_this.loadSuccess(_this.layoutData);
					if(_this.isConditionApprove){
						window.setTimeout(function(){
							_this.updateApproveLines();
						},100);

					}
		            window.setTimeout(function(){
						for(var key in _this.itemDict){
			              if(_this.itemDict[key].isDetail===true){
			                _this.itemDict[key].updateSummary();
			              }
			            }
					},100);
				}
				_this.pageview.hideLoading(data.code===0);
			};
		}
		this.pageview.ajax(ajaxConfig);
       },
       loadSuccess:function(data){
       	this.pageview.hideLoading(true);
		this.createLayout(data);
       },

	   createLayout:function(data){
		   var _this = this;
		   if(this.isPreview||this.isQrRreview){
			   window.setTimeout(function(){
				   for(var key in _this.itemDict){
					 if(_this.itemDict[key].isDetail===true){
					   _this.itemDict[key].updateSummary();
					 }
				   }
			   },100);
		   }
		   var components = this.pageview.config.components;
		   for(var i=0,j=data.length;i<j;i++){
			   var itemData = data[i];
			   this.addItemLayout(itemData,components);
		   }


		   components.body.root.push("approve_line_wrap");
		   components.body.root.push("cc_line_warp");
		   components.body.root.push("submitbtn");

		   this.pageview.delegate("statusview",function(target){
			   target.change("body");
		   });
	   },



       dateCtlClick:function(sender,params){
        console.log(sender);
       },

	   detailItemDeleteInit:function(sender,params){
		   if(sender.parent.parent.config.index===0){
			   sender.config.style.display = "none";
		   }
	   },

	   detailItemDeleteClick:function(sender,params){
		   var _this = this;
		   this.curDateInstance = params.DetailInstance;
			this.curDetailItem = sender;
		   if (!this.chexiaoDialog) {
			   this.chexiaoDialog = new Dialog({
				   mode: 3,
				   wrapper: this.pageview.$el,
				   contentText: "你确定要删除该明细吗？",
				   btnDirection: "row",
				   buttons: [{
					   title: "取消",
					   style: {
						   height: 45,
						   fontSize: 16,
						   color: c.titleColor
					   },
					   onClick: function () {
						   _this.chexiaoDialog.hide();
					   }
				   }, {
					   title: "确定",
					   style: {
						   height: 45,
						   fontSize: 16,
						   color: "#37b7fd",
					   },
					   onClick: function () {
						  _this.delDetailItem();
						  _this.chexiaoDialog.hide();
					   }
				   }]
			   });
		   }
		   this.chexiaoDialog.show();

	   },
	   delDetailItem:function(){
		   var sender = this.curDetailItem;
		   sender.rowInstance.remove();
		   var titleKeyStr = sender.config.titleLabel;
		   var titleKey =sender.config.titleKey;
		   this.curDateInstance.updateSummary();
		   this.updateApproveLines();
		   sender.rowInstance.parent.eachItem(function(item,index){
			   		if(index!==0){
						item.delegate(titleKey,function(label){
	 					   label.setText(titleKeyStr+"("+(index)+")");
	 				   });
					}

		   });
	   },

	   detailItemTitleInit:function(sender,params){
		   var index = sender.parent.parent.config.index;
		   if(index>0){
			   sender.config.text = sender.config.text +"("+(index)+")";
		   }
	  },
       repeatAddMoreClick:function(sender,params){
		   if(this.isPreview||this.isQrRreview){
			   return;
		   }
		   sender.parent.addItem({});
       },
       approve_icon_init:function(sender){
         sender.config.src = c.thumbImg(sender.config.src);
       },

       addSubComponent:function(itemData,components,root,repeatKey,DetailInstance){
          var type = itemData.type;
        var itemInstance;
        var params = {plugin:this,components:components,itemData:itemData,root:root,repeatKey:repeatKey,DetailInstance:DetailInstance};
        switch(type){
          case "ApplyInputText":
            itemInstance = new ApplyInputText(params);
          break;
          case "ApplyInputTextarea":
            itemInstance = new ApplyInputTextarea(params);
          break;
          case "ApplyInputTextNum":
            itemInstance = new ApplyInputTextNum(params);
          break;
          case "ApplyImage":
            itemInstance = new ApplyImage(params);
          break;
          case "ApplyInputTextMoney":
            itemInstance = new ApplyInputTextMoney(params);
          break;
          case "ApplyLayout":
            itemInstance = new ApplyDetail(params);
          break;
          case "ApplyInputRadio":
            itemInstance = new ApplyInputRadio(params);
          break;
          case "ApplyInputDateBetween":
            itemInstance = new ApplyInputDateBetween(params);
          break;
          case "ApplyInputCheckbox":
            itemInstance = new ApplyInputCheckbox(params);
          break;
          case "ApplyInputDate":
            itemInstance = new ApplyInputDate(params);
          break;
            case "ApplyInputString":

            itemInstance = new ApplyInputString(params);
          break;

        }
		    this.itemDict[itemData.id.toString()] = itemInstance;
        if(itemInstance.isEnabledConditionField()){
          this.conditionItemInstance = itemInstance;
        }
	    	return itemInstance;
       },
       addItemLayout:function(itemData,components){
	        var itemInstance= this.addSubComponent(itemData,components,components.body.root,null,null);
			if(itemInstance){
				this.itemInstanceArr.push(itemInstance);
			}

		},
		setFreeApprove:function(){
			this.isFreeApprove = true;
			this.pageview.delegate("approve_line_repeat",function(repeat){
				repeat.$el.removeClass("displaynone");
			});
			this.pageview.delegate("approve_line_wrap_title",function(approve_line_wrap_title){
				approve_line_wrap_title.setNextText("(点击头像可删除)");
			});
		},
		initSetApprovePersonData:function(rule){

			this.isConditionApprove = false;
			if(rule===null||rule===undefined||rule===""){
				//自由审批
				this.setFreeApprove();
				return;
			}
			try{
				rule = JSON.parse(rule);
			}catch(e){
				//
				this.pageview.showTip({text:"规则设置错误"});
			}
			this.rule = rule;
			if(!rule){
				return;
			}
			var activation = rule.activation;
			var typeKey = "type_"+activation;
			var approveConfig = rule[typeKey];
			if(approveConfig===null||approveConfig===undefined){
				//自由审批
				this.setFreeApprove();
				return;
			}
			if(activation.toString()==="1"){
				//无条件审批
				this.isConditionApprove = false;
				this.loadApprovePerson();
			}else if(activation.toString()==="2"){
				//条件审批
				this.isConditionApprove = true;
        this.showDefaultApprveLineWhenHasCondition();


			}
		},

		cc_line_repeat_itemclick:function(sender,params){
			//	memberId:itemData.member_id
			var itemMemberID = sender.datasource.memberId.toString();
			if(this.cc_select_list){
				for(var i= this.cc_select_list.length-1;i>=0;i--){
					if( this.cc_select_list[i].member_id.toString()===itemMemberID){
						this.cc_select_list.splice(i,1);
					}
				}
			}
			sender.remove();
		},


		add_cc_btn_click:function(sender){
			if(this.isPreview||this.isQrRreview){
				 return;
			}
			var _this = this;
			// var data = {"error_code":"0",
			// 			"data":
			// 				[
			// 						{"email":"chenzhpb@yonyou.com","member_id":"2834473",
			// 						"mobile":"18928723980","name":"陈展鹏",
			// 						"avatar":"http://staticoss.upesn.com/74269/2834473/201606/4/14650438766130ce89f350bf5cbef7cd359e450723.jpg.middle.jpg"}],
			// 						"tip_level":"0"};
			// var itemData = data.data[0];
			// _this.pageview.refs.cc_line_repeat.addItem({
			// 	userName:itemData.name,
			// 	headImgUrl:itemData.avatar,
			// 	memberId:itemData.member_id
			// });

			try{
			  window.yyesn.enterprise.selectContacts(function(b){
				if(b.error_code==="0"){
					var persons =  b.data;
					_this.pageview.refs.cc_line_repeat.empty();
					_this.cc_select_list = [];
					for(var i=0,j=persons.length;i<j;i++){
						var itemData = persons[i];
						_this.cc_select_list.push(itemData);
						_this.pageview.refs.cc_line_repeat.addItem({
							userName:itemData.name,
							headImgUrl:itemData.avatar,
							memberId:itemData.member_id
						});
					}

				}
			  },{
				mode:1,
				multi:1,
				select_list:_this.cc_select_list||[]
			  },function(b){
			  });
			}catch(e){
				alert(JSON.stringify(e));
			}
		},
		// isExistsCCPerson:function(itemData){
		// 	var datasource = this.pageview.refs.cc_line_repeat.datasource;
		// 	var Re = false;
		// 	for(var i=0,j=datasource.length;i<j;i++){
		// 		if(datasource[i].memberId.toString()===itemData.member_id.toString()){
		// 			Re = true;
		// 			break;
		// 		}
		// 	}
		// 	return Re;
		// },
		add_approve_btn_click:function(sender){
			if(this.isPreview||this.isQrRreview){
				 return;
			 }
			var _this = this;

				// var data = {"error_code":"0",
				// 			"data":
				// 				[
				// 						{"email":"chenzhpb@yonyou.com","member_id":"2834473",
				// 						"mobile":"18928723980","name":"陈展鹏",
				// 						"avatar":"http://staticoss.upesn.com/74269/2834473/201606/4/14650438766130ce89f350bf5cbef7cd359e450723.jpg.middle.jpg"}],
				// 						"tip_level":"0"};
				// 						var itemData = data.data[0];
				// _this.pageview.refs.approve_line_repeat.addItem({
				// 	userName:itemData.name,
				// 	headImgUrl:itemData.avatar,
				// 	memberId:itemData.member_id
				// });
				// return;
			try{
	          window.yyesn.enterprise.selectContacts(function(b){
				//   document.write(JSON.stringify(b))
				if(b.error_code==="0"){
					var itemData = b.data[0];
					////userName headImgUrl memberId
					var checkResult = _this.checkSelectedPerson(itemData);
					if(checkResult===false){
						return;
					}
					_this.pageview.refs.approve_line_repeat.addItem({
						userName:itemData.name,
						headImgUrl:itemData.avatar,
						memberId:itemData.member_id
					});
				}


			  },{
			 	mode:1,
  				multi:0
	          },function(b){
	          });
	        }catch(e){
				alert(JSON.stringify(e));
	        }

		},

		checkSelectedPerson:function(itemData){
			var Re = true;
			// if(itemData.member_id.toString()===this.currentMemberId.toString()){
			// 	this.pageview.showTip({text:"不能添加自己作为的审批人!",duration:1200});
			// 	return false;
			// }

			var datasource = this.pageview.refs.approve_line_repeat.datasource;
			for(var i=0,j=datasource.length;i<j;i++){
				var singleData = datasource[i];
				if(singleData.memberId.toString() === itemData.member_id.toString()){
					this.pageview.showTip({text:"不能添加重复的审批人!",duration:1200});
					Re =  false;
					break;
				}
			}
			return Re;
		},

		showDefaultApprveLineWhenHasCondition:function(){
			var _this = this;
			this.pageview.delegate("approve_line_wrap_title",function(approve_line_wrap_title){
				approve_line_wrap_title.setNextText("(审批人已由管理员内置)");
				approve_line_wrap_title.$el.removeClass("displaynone");
			});
		},
		approve_line_loadingtext_click:function(sender,params){
			var text = sender.getText();
			if(text.indexOf("加载")>=0){
				this.loadApprovePerson();
			}
		},
		getItemInstanceById:function(id){
			return this.itemDict[id.toString()];
		},
		updateApproveLines:function(success,error){
			if(this.isPreview||this.isQrRreview){
				return;
			}
			var _this = this;

			if(!this.conditionItemInstance&&this.isConditionApprove===true){
			    this.pageview.showTip({text:"本单据审批流程错误!请联系管理员配置修改"});
			    return;
			}
			if(this.loadApprovePersonTimeID){
				window.clearTimeout(this.loadApprovePersonTimeID );
			}
			this.loadApprovePersonTimeID = window.setTimeout(function(){
				var value;
				if(_this.conditionItemInstance.isInDetail){
					value = _this.conditionItemInstance.itemData.summaryvalue;
				}else{
					if(_this.conditionItemInstance.itemData.type==="ApplyInputDateBetween"){
						value = _this.conditionItemInstance.itemData.diff;
					}else{
						value = _this.conditionItemInstance.getValue();
					}
				}
				_this.loadApprovePerson(value,function(data){
				   	 if(success){success(data);}
				   },function(){
					   if(error){error();}
				   });
			},700);
		},
		loadApprovePerson:function(val,success,error){
			var _this = this;
			this.pageview.delegate("approve_line_loadingtext",function(target){
				target.setText("");
				target.showLoading();
			});
			var ajaxConfig = {
				type:"GET",
				url:"/formdata/member",
				data:{
					ftid:this.templateid
				},//userName headImgUrl memberId
				success:function(data){
					_this.pageview.delegate("approve_line_loadingtext",function(target){
						target.hideLoading();
						if(data.code===0){
							_this.pageview.delegate("approve_line_repeat",function(repeat){
								repeat.$el.removeClass("displaynone");
								if(data.data.length===0){
									_this.isFreeApprove = true;
									repeat.bindData([]);
									repeat.showOrHideSubComponent(true);
									_this.pageview.delegate("approve_line_wrap_title",function(approve_line_wrap_title){
										approve_line_wrap_title.$el.removeClass("displaynone");
										approve_line_wrap_title.setNextText("(点击头像可删除)");
									});
								}else{
									_this.pageview.delegate("approve_line_wrap_title",function(approve_line_wrap_title){
										approve_line_wrap_title.setNextText("(审批人已由管理员内置)");
										approve_line_wrap_title.$el.removeClass("displaynone");
									});
									window.setTimeout(function(){
										repeat.showOrHideSubComponent(false);
									},60);
									repeat.bindData(data.data);
								}

							});

							if(success){success(data.data);}
						}else{
							target.setText("审批人获取失败,点击重新加载");
							_this.pageview.delegate("approve_line_wrap_title",function(approve_line_wrap_title){
								approve_line_wrap_title.$el.addClass("displaynone");
							});

							if(error){error();}
						}
					});

				},
				error:function(e){
					if(error){error();}
					_this.pageview.delegate("approve_line_loadingtext",function(target){
						target.hideLoading();
						target.setText("审批人获取失败,点击重新加载");
						_this.pageview.delegate("approve_line_wrap_title",function(approve_line_wrap_title){
							approve_line_wrap_title.$el.addClass("displaynone");
						});
					});
				}
			};
			if(this.isConditionApprove===true){
				ajaxConfig.data.condition = val;
			}
			this.pageview.ajax(ajaxConfig);
		}

    };







    return pageLogic;
});
