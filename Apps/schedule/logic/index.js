/**
 * 首页的上下分类
 **/
define(["../parts/common", "utils", "../../../components/dialog"], function (c, utils, Dialog) {


    function pageLogic(config) {
        this.pageview = config.pageview;
        this.calendarResultDict = {};
        this.sd=null;
        this.today = new Date();
        this.currentDateStr = utils.ConvertDateToStr(this.today,"yyyy-MM-dd");
        this.setHeader();
    }

    function getFirstAndLastMonthDay( year, month){
        var   firstdate = year + '/' + month + '/01'+" "+"00:00:00";
        var  day = new Date(year,month,0);
        var lastdate = year + '/' + month + '/' + day.getDate()+' '+"23:59:59";//获取当月最后一天日期
        //给文本控件赋值。同下
        return {firstDate:new Date(firstdate).getTime(),lastDate: new Date(lastdate).getTime()};
    }
    pageLogic.prototype = {
        setHeader: function() {
            var _this = this;
            try {
                window.yyesn.ready(function () {
                    window.yyesn.register({
                        rightvalue: function (d) {
                            _this.pageview.go("untreated");
                        }
                    });
                    window.yyesn.client.configNavBar(function (d) {}, {
                        "centerItems":[
                            {"title":"日程",
                                "titleColor":"#292f33"},
                        ],
                        "rightItems":[
                            {"title":"未处理",
                                "callback":'rightvalue'},
                        ]
                    });
                });
            }catch (e) {}
        },
        calendarlist_didmount: function (sender, params) {
            var _this = this;
            this.curDate=new Date();
            window.setTimeout(function () {
                _this.loadCalendarData(_this.curDate);
               // _this.loadDetailData(sender.selectedTime);
            }, 300);

        },
        loadCalendarDataSuccess:function(){
            this.bindCalendarData();
        },
        bindCalendarData:function(){
            //
            var mode = this.pageview.refs.calendarlist.curShow;
            var curSwipWrapper,dayItems;
            if(mode==="day"){
                curSwipWrapper = this.pageview.refs.calendarlist.Swiper.getMidWrapper();

                dayItems = curSwipWrapper.daysCreator.dayItems;
            }else if(mode==="week"){
                curSwipWrapper = this.pageview.refs.calendarlist.weekCalendar.Swiper.getMidWrapper();
                dayItems = curSwipWrapper.weekCreator.dayItems;
            }
            for(var key in dayItems){
                if(this.calendarResultDict[key]===true){
                    var itemInstance = dayItems[key].$el;
                    var dateMark = itemInstance.attr("date-mark");
                    if(dateMark !=="curmonth"&&this.pageview.refs.calendarlist.curShow==="day"){
                        continue;
                    }
                    if(!itemInstance.hasClass("wc-calendar-day-item-nextmonth")){
                        dayItems[key].$el.addClass("wc-calendar-day-hasdata");
                    }
                }
            }
        },
        _getData:function(start,end,monthArr){
            var _this = this;
            _this.calendarResultDict={};
            this.pageview.ajax({
                type:"GET",
                url: "/schedule/getMonthList",
                data:{
                    selectStart:start,
                    selectEnd:end,
                },
                success:function(data){
                    if(data.code===0){
                        var ReData = data.data;
                        var ajaxResul = {};
                        for(var i=0,j=ReData.length;i<j;i++){
                            ajaxResul[ReData[i]] = true;
                        }
                        _this.calendarResultDict={};
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
        calendarlist_slidechange:function (sender,p) {
            this.curDate=sender.curDate;
            this.loadCalendarData(sender.curDate);
        },
        calendarlist_itemclick:function (Conponent,obj) {

            var _this = this;
            var todayStr = utils.ConvertDateToStr(this.today,"yyyy-MM-dd");
            this.currentDateStr = obj.dateStr;
            if(todayStr === obj.dateStr){
                this.pageview.refs.today_btn.$el.addClass("displaynone");
            }else{
                this.pageview.refs.today_btn.$el.removeClass("displaynone");
            }
            this.sd=new Date(obj.dateStr+' 00:00:00').getTime();
            this.pageview.refs.viewpager.items.month.contentInstance.refs.schedule_listview.setAjaxConfigParams({date:new Date(obj.dateStr.replace(new RegExp(/(-)/g),'/')+' 00:00:00').getTime()});
            this.pageview.refs.viewpager.items.month.contentInstance.refs.schedule_listview.loadFirstPageData();
            if(this.pageview.refs.viewpager.curPageViewItem.contentInstance.refs.mydayview){
                this.pageview.refs.viewpager.curPageViewItem.contentInstance.plugin.onShowItem(null,{rootPage:this.pageview,date:new Date(obj.dateStr.replace(new RegExp(/(-)/g),'/')+' 00:00:00').getTime()});
            }

        },
        loadCalendarData:function(ctime){
            var _this = this;
            //var ctime= new Date();
            var fullyear = ctime.getFullYear();
            var month = ctime.getMonth()+1;
            var params=getFirstAndLastMonthDay(fullyear,month);
            var mode = this.pageview.refs.calendarlist.curShow;
            var weekCalendar = this.pageview.refs.calendarlist.weekCalendar;
            var curSwipWrapper,curSwipMidWrapperCreator,monthRange,monthArr;
            if(mode==="day"){
                curSwipWrapper = this.pageview.refs.calendarlist.Swiper.getMidWrapper();
                curSwipMidWrapperCreator = curSwipWrapper.daysCreator;
            }else if(mode==="week"){
                curSwipWrapper = this.pageview.refs.calendarlist.weekCalendar.Swiper.getMidWrapper();
                curSwipMidWrapperCreator = curSwipWrapper.weekCreator;
            }
            monthRange = curSwipMidWrapperCreator.range;
            monthArr = curSwipMidWrapperCreator.monthArr;
            if(this.timeID){
                window.clearTimeout(this.timeID);
                this.timeID = null;
            }
            if(mode==="day"){
                this.timeID = window.setTimeout(function(){
                    _this._getData(params.firstDate,params.lastDate,monthArr);
                },800);
            }else if(mode==="week"){
                this.timeID = window.setTimeout(function(){
                    var startTime = weekCalendar.curDate.getTime() - 7*24*60*60*1000;
                    _this._getData(startTime,weekCalendar.curLastDate.getTime(),monthArr);
                },800);
            }


        },
        add_btn_click: function (sender, params) {
            var _this = this;
            this.pageview.ajax({
                type:"GET",
                url: "/schedule/self",
                data:{},
                success:function (res) {
                    if(res.code===0){
                        _this.pageview.go("add",{currentDateStr:_this.currentDateStr,self:JSON.stringify({name:res.data.memberName,member_id:res.data.memberId})});

                    }
                }
            });
        },
        testHeader_click: function (sender, params) {
            this.pageview.go("untreated");
        },
        onPageBeforeLeave: function (sender, params) {
            if (params.isForward !== true) {
                if (this.pageview.refs.calendarlist.curShow === "week") {
                    this.pageview.refs.calendarlist.canChangeMode = true;
                    this.pageview.refs.calendarlist.WeekModeToDaysMode();
                    this.pageview.refs.viewpager.showItem("month", {rootPage: this.pageview});
                    return false;
                } else {
                    window.yyesn.client.closePage();
                    return false;
                }
            }

        },

        calendarlist_pulldown: function (sender, params) {
            if (this.pageview.refs.calendarlist.curShow === "week") {
                if (this.pageview.refs.viewpager.curPageViewItem.contentInstance.config.pageKey === "month") {
                    return this.pageview.refs.viewpager.curPageViewItem.contentInstance.refs.body.$el.scrollTop() <= 0;
                }
                return false;
            }
            return false;
        },
        calendarlist_calendarTouchChange: function (sender, params) {
            if (params.diff < 0) {
                this.pageview.refs.calendarlist.canChangeMode = false;
                this.pageview.refs.calendarlist.DaysModeToWeekMode();
                this.pageview.refs.viewpager.showItem("day", {rootPage: this.pageview,date:this.sd});
            } else {
                this.pageview.refs.calendarlist.canChangeMode = true;
                this.pageview.refs.calendarlist.WeekModeToDaysMode();
                this.pageview.refs.viewpager.showItem("month", {rootPage: this.pageview});
            }

        },
        calendarlist_modechange:function(sender,params){
            //console.log(sender.curDate);
            this.loadCalendarData(sender.curDate);
        },
        today_btn_click: function (sender, params) {
            this.pageview.refs.calendarlist.setValue(new Date());
            this.pageview.refs.viewpager.items.month.contentInstance.refs.schedule_listview.setAjaxConfigParams({date:new Date().getTime()});
            this.pageview.refs.viewpager.items.month.contentInstance.refs.schedule_listview.loadFirstPageData();            // this.pageview.refs.calendarlist.$el.find('.wc-calendar-day-selected').click();
            this.pageview.refs.today_btn.$el.addClass("displaynone");
            if(this.pageview.refs.viewpager.curPageViewItem.contentInstance.refs.mydayview){
                this.pageview.refs.viewpager.curPageViewItem.contentInstance.plugin.onShowItem(null,{rootPage:this.pageview,date:new Date().getTime()});
            }
            this.currentDateStr = utils.ConvertDateToStr(new Date(),"yyyy-MM-dd");
            // this.pageview.refs.calendarlist.canChangeMode = false;
            // this.pageview.refs.calendarlist.DaysModeToWeekMode();
            // this.pageview.refs.viewpager.showItem("day", {rootPage: this.pageview,date:new Date(utils.ConvertDateToStr(new Date(),'yy-mm-dd')+' 00:00:00').getTime()});
        },
        onPageResume: function (sender, params) {
            this.setHeader();
            this.loadCalendarData(new Date(utils.getDateInfo(this.currentDateStr).timestamp));
            this.pageview.refs.calendarlist.$el.find('.wc-calendar-day-hasdata').removeClass('wc-calendar-day-hasdata');
            this.pageview.refs.viewpager.curPageViewItem.contentInstance.plugin.body_reload();
        },
    };
    return pageLogic;
});
