
define(["../parts/common", "utils", "../parts/timepicker"], function(c, utils, timepicker) {

    function pageLogic(config) {
        this.pageview = config.pageview;

        this.calendarResultDict = {};

        this.year = new Date().getFullYear();
        this.NowDate = utils.getDateInfo(new Date());
        this.selectEndTime = utils.ConvertDateToStr(new Date(), "yyyy-MM-dd");


        this.deadlineTimePicker = null;

        this.calendarResultDict={};
        this.setHeader();
    }
    pageLogic.prototype = {
    	// todo_listview_beforeload:function(sender){
    	// },
      onPageResume:function(){
        this.setHeader();
      },
      setHeader: function () {
          // var _this = this;
          try {
              window.yyesn.ready(function () {
                  window.yyesn.register({
                      rightvalue: function (d) {
                      }
                  });
                  window.yyesn.client.configNavBar(function (d) {}, {
                      "centerItems":[
                          {"title":"日历",
                              "titleColor":"#292f33"},
                      ],
                      "rightItems":[
                      ]
                  });
              });
          }catch (e) {

          }
          // try {
          //     window.yyesn.client.setHeader(function () {
          //     }, {
          //         type: 2,
          //         title: "日历",
          //         rightTitle: "",
          //         rightValues: [],
          //     }, function (b) {});
          // } catch (e) {}

      },

    	todo_listview_afterload:function(sender,params){
    		this.pageview.hideLoading(params.isSuccess);
    	},
    	todo_listview_init:function(sender,params){
    		this.todo_listview = sender;
    	},
    	todo_listview_parsedata:function(sender,params){
    		 var data = params.data;
          if (data.code !== 0) {
                return false;
          }
            return data.data;
    	},

      calendarlist_slidechange:function(sender,params){
      	this.loadCalendarData();
      },
      calendarlist_pulldown:function(sender,params){
      	return this.pageview.refs.list_wrapper.$el.scrollTop()<=0;
      },
      calendarlist_itemclick:function(sender,params){
      	this.loadDetailData(params.dateStr);
      },
      calendarlist_didmount:function(sender,params){
        var _this = this;
        window.setTimeout(function(){
          _this.loadCalendarData();
          _this.loadDetailData(sender.selectedTime);
        },300);

      },

      listwrap_init:function(sender){
      	this.listwrap = sender;
      },
      loadDetailData:function(date){
        var _this = this;


        this.pageview.showLoading({
          timeout:9000,
          style:{
            position:"absolute"
          },
          reLoadCallBack:function(){
        }});

      	var info = utils.ConvertDateToStr(date,"all");
      	this.pageview.delegate("list_title",function(target){
      		var key = "yyyy年MM月dd日";
      		target.setText(info[key]);
      	});
      	var conditionStr = "yyyy-MM-dd";
      	this.pageview.delegate("todo_listview",function(target){
          _this.selectedTime = info[conditionStr];

      		target.setAjaxConfigParams({date:info[conditionStr]});
      		target.loadFirstPageData();
      	});

      },

      _getData:function(start,end,monthArr){
      	var _this = this;
        this.pageview.ajax({
          type:"GET",
          url:"sche/getTaskByBeginAndEndDate",
          data:{
            beginDate:start,
            endDate:end,
            completed:0
          },
          success:function(data){
            if(data.code===0){
              var ReData = data.data;
              var ajaxResul = {};
              for(var i=0,j=ReData.length;i<j;i++){
                ajaxResul[ReData[i]] = true;
              }

              for(var n=0,m=monthArr.length;n<m;n++){
                var key = monthArr[n];
                _this.calendarResultDict[key] = ajaxResul[key]||"";
              }
              _this.loadCalendarDataSuccess();
            }
          },
          error:function(error){

          }
        });

      },
      loadCalendarDataSuccess:function(){
      	this.bindCalendarData();
      },
      bindCalendarData:function(){
      	//
      	var mode = this.calendarlist.curShow;
      	var curSwipWrapper,dayItems;
      	if(mode==="day"){
      		curSwipWrapper = this.calendarlist.Swiper.getMidWrapper();
      		dayItems = curSwipWrapper.daysCreator.dayItems;
      	}else if(mode==="week"){
      		curSwipWrapper = this.calendarlist.weekCalendar.Swiper.getMidWrapper();
      		dayItems = curSwipWrapper.weekCreator.dayItems;
      	}
      	for(var key in dayItems){
      		if(this.calendarResultDict[key]===true){
      			dayItems[key].$el.addClass("wc-calendar-day-hasdata");
      		}
      	}
      },
      loadCalendarData:function(){
      	var _this = this;
      	var mode = this.calendarlist.curShow;
      	var curSwipWrapper,curSwipMidWrapperCreator,monthRange,monthArr;
      	if(mode==="day"){
      		curSwipWrapper = this.calendarlist.Swiper.getMidWrapper();
      		curSwipMidWrapperCreator = curSwipWrapper.daysCreator;
      	}else if(mode==="week"){
      		curSwipWrapper = this.calendarlist.weekCalendar.Swiper.getMidWrapper();
      		curSwipMidWrapperCreator = curSwipWrapper.weekCreator;
      	}
      	monthRange = curSwipMidWrapperCreator.range;
      	monthArr = curSwipMidWrapperCreator.monthArr;

      	// if(this.calendarResultDict[monthRange.start]!==undefined&&this.calendarResultDict[monthRange.start]!==null&&this.calendarResultDict[monthRange.end]!==undefined&&this.calendarResultDict[monthRange.end]!==null){
      	// 	this.bindCalendarData();
      	// 	return;
      	// }


      	if(this.timeID){
      		window.clearTimeout(this.timeID);
      		this.timeID = null;
      	}
      	this.timeID = window.setTimeout(function(){
      		_this._getData(monthRange.start,monthRange.end,monthArr);
      	},800);

      },
        //简易创建清单回车事件
        addInput_keydown: function(sender, params) {
            if (params.e.keyCode === 13) {
                sender.blur();
                this.addTask();
            }
        },
        addInput_init: function(sender) {
            this.addInput = sender;
        },
        addInput_focus: function(sender, params) {
            var _this = this;
            this.sureIcon.$el.removeClass("displaynone");
            window.setTimeout(function() {
                sender.$el[0].scrollIntoViewIfNeeded();
            }, 200);
        },
        addInput_blur: function(sender, params) {
            var _this = this;
            if(sender.getValue()){
                return;
            }
            setTimeout(function() {
                _this.sureIcon.$el.addClass("displaynone");
            }, 100);
        },
        sureIcon_click: function(sender, params) {
            this.addTask();
        },
        sureIcon_init: function(sender, params) {
            this.sureIcon = sender;
            sender.$el.addClass("displaynone");
        },
        row_time_init: function(sender, params) {
          var text = sender.config.text;
          if (sender.datasource.completed === 1) {
              sender.$el.addClass("todo-time-completed");
          }
          if (sender.datasource.expired === 1) {
              sender.$el.addClass("todo-time-limit");
          }
          sender.config.text = utils.ConvertDateToStr(text,'yyyy-MM-dd');
        },
        row_title_init: function(sender, params) {
            if (sender.datasource.completed === 1) {
                sender.$el.addClass("todo-text-completed");
            }
        },
        row_checkbox_init: function(sender, params) {
            if (sender.datasource.completed === 1) {
                sender.selected();
                sender.$el.addClass("todo-checkbox-completed");
            }
        },
        row_flag_init: function(sender, params) {
            if (sender.datasource.importance === 1) {
                sender.selected();
            }
            if (sender.datasource.completed === 1) {
                sender.$el.addClass("todo-flag-completed");
            }
        },
        row_flag_click: function(sender, params) {
            var _this = this;
            if (this.todo_listview.status === "edit") {
                return;
            }
            if(sender.datasource.completed === 1){
                return;
            }
            if (sender.isSelected) {
                //设置为不重要
                this.pageview.ajax({
                    url: "/task/importance",
                    type: "POST",
                    timeout: 7000,
                    data: {
                        ids: sender.datasource.id,
                        importance: 0
                    },
                    success: function(data) {
                        if (data.code === 0) {
                            sender.rowInstance.datasource.importance = 0;
                            sender.unSelected();
                        } else {
                            _this.pageview.showLoadingError();
                        }
                    },
                    error: function(error) {
                        _this.pageview.showLoadingError();
                    }

                });
            } else {
                //设置为重要
                this.setImportant(sender.datasource.id, sender);
                //sender.selected();
            }
        },
        setImportant: function(ids, aim) {
            //标记重要请求
            var _this = this;
            this.pageview.ajax({
                url: "task/importance",
                type: "POST",
                timeout: 7000,
                data: {
                    ids: ids,
                    importance: 1
                },
                success: function(data) {
                    if (data.code === 0) {
                        if (aim) {
                            aim.selected();
                            aim.rowInstance.datasource.importance = 1;
                        }
                    } else {
                        _this.pageview.showLoadingError();
                    }
                },
                error: function(error) {
                    _this.pageview.showLoadingError();
                }

            });
        },
        addTask: function() {
            var importance = 0; //0为不重要,1为重要
            if (this.listtype === '1003') {
                importance = 1;
            } else {
                importance = 0;
            }
            if (this.selectEndTime) {
                var inputVal = this.addInput.getValue();
                if (inputVal) {
                    if (inputVal === '' || 1 > inputVal.length || inputVal.length > 50) {
                        this.pageview.showTip({
                            text: "请输入50个字符以内的任务内容",
                            duration: 1800
                        });
                        return;
                    }
                    //ajax请求
                    var _this = this;
                    this.pageview.ajax({
                        url: "task/add",
                        type: "POST",
                        timeout: 7000,
                        data: {
                            name: inputVal,
                            listId: 0,
                            importance: importance,
                            endTime: _this.selectEndTime
                        },
                        success: function(data) {
                            if (data.code === 0) {
                                // _this.todo_listview.insertGroup(data.data, 0).insertRow(data.data, 0);
                                _this.addSuccess(data.data, _this.selectEndTime);
                                _this.loadCalendarData();
                            } else {
                                _this.pageview.showLoadingError();
                            }
                        },
                        error: function(error) {
                            _this.pageview.showLoadingError();
                        }

                    });
                } else {
                    this.pageview.showTip({
                        text: "请填写任务",
                        duration: 1000
                    });
                }
            } else {
                this.pageview.showTip({
                    text: "请选择结束时间",
                    duration: 1000
                });
            }
        },
        addSuccess:function(data,endTime){
          this.addInput.setValue("");
          this.sureIcon.$el.addClass("displaynone");

          if(utils.compareDate(endTime,this.selectedTime)<0){
            this.pageview.showTip({
              text:"新增成功",
              duration:2000,
              pos:'top'
            });
            return;
          }
          var RowData = {
            completed:0,
            completedTime:null,
            endTime:utils.convertToDate(endTime).getTime(),
            id:data.mirrorId,
            importance:0,
            multi:0,
            name:data.name
          };

          this.todo_listview.insertRow(RowData, 0);
          this.pageview.refs.list_wrapper.$el[0].scrollTop = 0;
        },
        todo_listview_rowclick: function(sender, params) {
            this.curPageSelectedRow = sender;

            c.gotoDetail(sender,this.pageview);

        },
        row_checkbox_wrapper_click:function(sender,params){
            this.row_checkbox_click(sender.components.row_checkbox,null);
        },
        row_checkbox_click: function(sender, params) {
            var rowdata = sender.datasource;
            var _this = this;
            _this.pageview.showLoading({text:"正在处理中"});
            if (!sender.value) {
                this.setComplete(rowdata.id, sender);
            } else {
                //标记待办请求
                this.pageview.ajax({
                    url: "task/complete",
                    type: "POST",
                    timeout: 7000,
                    data: {
                        ids: rowdata.id,
                        completed: 0
                    },
                    success: function(data) {
                        if (data.code === 0) {
                            sender.unSelected();
                            rowdata.completed = 0;
                            sender.rowInstance.rebind(rowdata);
                        } else {
                        }
                        _this.pageview.hideLoading(data.code === 0);

                    },
                    error: function(error) {
                      _this.pageview.hideLoading(false);
                    }

                });
            }
        },
        setComplete: function(ids, aim) {
            var _this = this;
            //标记已完成请求
            this.pageview.ajax({
                url: "task/complete",
                type: "POST",
                timeout: 7000,
                data: {
                    ids: ids,
                    completed: 1
                },
                success: function(data) {
                    if (data.code === 0) {
                        // _this.pageview.showTip({
                        //     text: "清单已完成，可前往已完成列表查看",
                        //     duration: 2500,
                        // });

                        if (aim) {
                            aim.selected();
                            aim.datasource.completed = 1;
                            aim.rowInstance.rebind(aim.datasource);
                        }

                    } else {
                    }

                    _this.pageview.hideLoading(data.code === 0);
                },
                error: function(error) {
                      _this.pageview.hideLoading(false);
                }

            });
        },
        dateIcon_init: function(sender, params) {
            //今日,最近七天,全部,重要 默认选中当天,样式相应改变
            sender.config.font = "wc_e912";
            sender.config.text = this.NowDate.day;
            sender.config.style.color = "#0093ff";
        },

        dateIcon_click: function(sender, params) {
            // this.pageview.go("add");
            var _this = this;
            if (this.deadlineTimePicker === null) {
                this.deadlineTimePicker = new timepicker({
                    cancelText: "移除",
                    cancelBtnClassName: "wc-tp-btn",
                    okBtnClassName: "wc-tp-btn"
                });
                this.deadlineTimePicker.mapping.yyyy.start = (this.year);
                this.deadlineTimePicker.mapping.yyyy.end = (this.year + 4);
                this.deadlineTimePicker.setMode("yyyy-MM-dd").setParent(this.pageview.$el[0]).done()
                    .setMinValue((this.year) + "-1-1 00:00")
                    .bind("clear", function() {

                    })
                    .bind("ok", function(valStr) {
                        var dateInfo = utils.getDateInfo(valStr);
                        var selectDay = dateInfo.day;
                        _this.curSelecteData = valStr;
                        sender.setText(selectDay);
                        sender.setIcon("wc_e912", {
                            color: "#0093ff"
                        });
                        _this.selectEndTime = valStr;
                    })
                    .bind("cancel", function() {
                        _this.curSelecteData = _this.NowDate.year + '-' + _this.NowDate.month + '-' + _this.NowDate.day;
                        sender.setText(_this.NowDate.day);
                        sender.setIcon("wc_e912");
                        _this.selectEndTime = _this.curSelecteData;

                    }).setTitle("到期时间");
            }
            this.deadlineTimePicker.show(_this.curSelecteData);
        },

        calendarlist_init:function(sender,params){
      	this.calendarlist = sender;
      },
      calendarlist_modechange:function(sender,params){
      	this.loadCalendarData();
      }
    };
    return pageLogic;
});
