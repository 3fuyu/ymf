define(["utils", "base", "swiper"],
function(utils, baseClass, swiper) {

  function addDay(date,count){
    date = utils.convertToDate(date);
    return new Date(date.setDate(date.getDate()+count));//获取AddDayCount天后的日期
  }

  function getPreWeek(date){
    date =  new Date(date.getTime());
    var pre =  addDay(date,0-utils.getDateWhichDayInWeek(date)-7);
    return pre;
  }

  function getNextWeek(date){
    date =  new Date(date.getTime());
    var next =  addDay(date,0-utils.getDateWhichDayInWeek(date)+7);
    return next;
  }

  function getCurWeekInfo(date){
    date =  new Date(date.getTime());
    var curDate = addDay(date,0-utils.getDateWhichDayInWeek(date));
    var Re = {
      preweek:[],
      curweek:[],
      nextweek:[]
    };
    var d = curDate;
    for(var i=1;i<=7;i++){
      if(i>1){
        d = addDay(d,1);
      }
      fillDateInfo(Re,"curweek",d);
    }
    return Re.curweek;
  }
  function getWeekInfo(date){

    date =  new Date(date.getTime());
    var preWeekStartDate = addDay(date,0-utils.getDateWhichDayInWeek(date)-7);

    var Re = {
      preweek:[],
      curweek:[],
      nextweek:[]
    };
    var d = preWeekStartDate;
    for(var i=1;i<=7;i++){
      if(i>1){
        d = addDay(d,1);
      }
      fillDateInfo(Re,"preweek",d);
    }
    for(var n=1;n<=7;n++){
      d = addDay(d,1);
      fillDateInfo(Re,"curweek",d);
    }
    for(var m=1;m<=7;m++){
      d = addDay(d,1);
      fillDateInfo(Re,"nextweek",d);
    }
    return Re;
  }

  function fillDateInfo(Re,key,date){
    var curDate = new Date(date.getTime());
    var dateInfo = utils.getDateInfo(date);
    var item = {
        date:curDate,
        dateStr :utils.ConvertDateToStr(date),
        year: dateInfo.year,
        month: dateInfo.month,
        day: dateInfo.day,
      };
    Re[key].push(item);
  }

  function DayItem(dateInfo, itemStyle,dayWidth,calendar) {
    var _this = this;
    var todayDate = new Date();
    _this.dateInfo = dateInfo;
    this.calendar = calendar;
    this.$el = $("<div date-seed='"+dateInfo.dateStr+"' date-mark='" + dateInfo.mark + "' date-day='" + dateInfo.day + "'  date-month='" + dateInfo.month + "' date-year='" + dateInfo.year + "' class='wc-calendar-day-item displayflex jc-center ai-center wc-calendar-day-item-" + dateInfo.mark + "'></div>");
    var isSelected = utils.ConvertDateToStr(calendar.selectedTime) == _this.dateInfo.dateStr;
    var isToday = utils.compareDate(todayDate,dateInfo.date) === 0 ? true : false;
    if(isSelected){
      this.calendar.selectedItem = this;
    }
    this.dayLabel = $("<div style='font-size:"+utils.fontSize15()+"px;width:"+dayWidth+"px;height:"+dayWidth+"px;line-height:"+(dayWidth)+"px' class='wc-calendar-day'>"+dateInfo.day +"</div>");
    if(isSelected){
      this.selected();
    }
    if(isToday){
      this.$el.addClass("wc-calendar-today-item");
    }
    this.$el.append(this.dayLabel);
    utils.css(this.$el,itemStyle);

  }
  DayItem.prototype = {
    selected:function(){
      this.$el.addClass("wc-calendar-day-selected");

    },
    unSelected:function(){
      this.$el.removeClass("wc-calendar-day-selected");
    }
  }



  function WeekDayItem(dateInfo, itemStyle,dayWidth,calendar) {
    var _this = this;
    _this.dateInfo = dateInfo;
    this.weekCalendar = calendar;
    this.$el = $("<div date-seed='"+dateInfo.dateStr+"' date-mark='" + dateInfo.mark + "' date-day='" + dateInfo.day + "'  date-month='" + dateInfo.month + "' date-year='" + dateInfo.year + "' class='wc-calendar-day-item displayflex jc-center ai-center'></div>");

    var isSelected = utils.ConvertDateToStr(this.weekCalendar.selectedTime) == _this.dateInfo.dateStr;
    this.dayLabel = $("<div style='font-size:"+utils.fontSize15()+"px;width:"+dayWidth+"px;height:"+dayWidth+"px;line-height:"+(dayWidth)+"px' class='wc-calendar-day'>"+dateInfo.day +"</div>");
    if(isSelected){
      this.selected();
    }
    this.$el.append(this.dayLabel);
    utils.css(this.$el,itemStyle);

  }
  WeekDayItem.prototype = {
    selected:function(){
      this.$el.addClass("wc-calendar-day-selected");

    },
    unSelected:function(){
      this.$el.removeClass("wc-calendar-day-selected");
    }
  }

  function weekCalendar(config){
    this.rootInstance = config.rootInstance;
    var wrapHeight = config.labelBarHeight + config.itemHeight + 5;
    var top = config.top - 5;
    this.$el = $("<div  style='top:"+top+"px;height:"+wrapHeight+"px' class='wc-week-calendar displayflex flex-v displaynone'></div>");
    var barFontSize = utils.getRealWidth(14);
    var barItemStyle = "style='line-height:" + config.labelBarHeight + "px;font-size:" + barFontSize + "px'";
    var bar = $("<div style='height:" + config.labelBarHeight + "px' class='wc-calendar-bar'><div " + barItemStyle + " class='yy-c-bar-item'>日</div><div " + barItemStyle + " class='yy-c-bar-item'>一</div><div " + barItemStyle + " class='yy-c-bar-item'>二</div><div " + barItemStyle + " class='yy-c-bar-item'>三</div><div " + barItemStyle + " class='yy-c-bar-item'>四</div><div " + barItemStyle + " class='yy-c-bar-item'>五</div><div " + barItemStyle + " class='yy-c-bar-item'>六</div></div>");
    this.$el.append(bar);
    this.createWeekSwip(config);
  }

  weekCalendar.prototype = {
    initLayout:function(date){

      date = new Date(date.getTime());
      this.curDate = new Date(date.getTime());
      this.curLastDate = new Date(date.getTime()+6*24*60*60*1000);
      this.selectedTime = date;
      var weekInfo = getWeekInfo(date);
      this.Swiper.reset();
      this.Swiper.itemWrappers[0].weekCreator.createLaytout(weekInfo.preweek);
      this.Swiper.itemWrappers[1].weekCreator.createLaytout(weekInfo.curweek);
      this.Swiper.itemWrappers[2].weekCreator.createLaytout(weekInfo.nextweek);
    },


    createWeekSwip:function(config){
      //周视图滑动
      var _this = this;
      new swiper({
        onChange: function(args) {
          if (args.action == "gopre") {
            var curDate = getPreWeek(_this.curDate);
            var preDate = getPreWeek(curDate);
            _this.curDate =curDate;
            _this.curLastDate = getPreWeek(_this.curLastDate);
            args.itemWrapper.weekCreator.createLaytoutByDate(preDate);
          } else if (args.action == "gonext") {
            var curDate = getNextWeek(_this.curDate);
            var nextDate = getNextWeek(curDate);
            _this.curDate =curDate;
            _this.curLastDate = getNextWeek(_this.curLastDate);
            args.itemWrapper.weekCreator.createLaytoutByDate(nextDate);
          }

          if(_this.rootInstance.slideChangeMethod){
            _this.rootInstance.slideChangeMethod.call(_this.rootInstance.pageview.plugin,_this.rootInstance,{
              mode:"week",
              swiper:_this.Swiper
            });
          }
        },
        beforeGoNext:function(){
          // return false;
        },
        initItem: function(itemWrapper, index) {
          itemWrapper.weekCreator = new WeekCreator({
            calendar:_this,
            itemWrapper: itemWrapper,
            itemHeight:config.itemHeight
          })
        },
        init: function(me) {
          _this.Swiper = me;
        }
      });
      this.Swiper.$el.bind("click",function(e){
        var node = e.target;
        var dateSeed = node.getAttribute("date-seed");
        while(dateSeed == null){
          node = node.parentNode;
          dateSeed =  node.getAttribute("date-seed");
          if(dateSeed){
            break;
          }
          if(node.tagName.toUpperCase() == "BODY"){
            break;
          }
        }
        _this.setDateSelected(dateSeed,node);
      });
      this.$el.append(this.Swiper.$el);
    },
    setDateSelected:function(date,node){

      if(this.rootInstance.itemClickMethod){
        this.rootInstance.itemClickMethod.call(this.rootInstance.pageview.plugin,this.rootInstance,{
          from:"week",
          dateStr:date
        });
      }
      var date = utils.convertToDate(date);
      var year = date.getFullYear();
      var dateStr = utils.ConvertDateToStr(date);


        this.rootInstance.DayItemSelected({
        from:"week",
        date:date,
        dateStr:dateStr
      });

      this.selectedTime = date;
      for(var i=0;i<3;i++){
        var weekCreator = this.Swiper.itemWrappers[i].weekCreator;
        for(var key in weekCreator.dayItems){
          var dayItem = weekCreator.dayItems[key];
          if(dayItem.dateInfo.dateStr == dateStr){
            dayItem.selected();
          }else{
            dayItem.unSelected();
          }
        }
      }

    }



  }


  function WeekCreator(config) {
    this.config = config;
    this.curDate = null;
    this.weekCalendar = config.calendar;
    this.itemWrapper = config.itemWrapper;
    this.dayInnerWidth = utils.getRealWidth(36);
    this.weekRange = {start:"",end:""};
    this.range = {start:"",end:''};
    this.monthArr = [];
  }
  WeekCreator.prototype = {
    createLaytoutByDate:function(date){

      date = new Date(date.getTime());
      var info = getCurWeekInfo(date);
      this.createLaytout(info);
    },
    createLaytout: function(dataInfo) {
      if(!dataInfo){
        return;
      }
      this.monthArr = [];
      this.dayItems={};
      var _this = this;
      this.itemWrapper.$el.empty();
      var wrap  = $("<div></div>");
      var itemStyle = {
        "height": this.config.itemHeight + "px",
        "font-size": utils.getRealWidth(14) + "px"
      };
      for(var i=0,j=dataInfo.length;i<j;i++){
        var itemData = dataInfo[i];
        if(i==0){
          this.weekRange.start = itemData.dateStr;
        }
        if(i==itemData.length-1){
          this.weekRange.end = itemData.dateStr;
        }
        var dayItem = new WeekDayItem(itemData, itemStyle,this.dayInnerWidth,this.weekCalendar);
        this.dayItems[itemData.dateStr] = dayItem;
        wrap.append(dayItem.$el);
      }
      this.itemWrapper.$el.append(wrap);


      var monthInfo = getCalendarDaysInfoInOneWrap(this.weekRange.start);
      for(var n=0,m=monthInfo.length;n<m;n++){
        var item = monthInfo[n];
        if(n===0){
          this.range.start = item.dateStr;
        }
        if(n===m-1){
          this.range.end = item.dateStr;
        }
        this.monthArr.push(item.dateStr);
      }

    }
  }

  function DaysCreator(config) {
    this.config = config;
    this.itemWrapper = config.itemWrapper;
    this.calendar = config.calendar;
    this.SumDay = 7 * 6;
    this.dayInnerWidth = utils.getRealWidth(34);
    this.dayItems = {};
    this.monthArr = [];
    this.range = {start:"",end:""};
  }
  DaysCreator.prototype = {
    createLaytout: function(date) {
      var _this = this;
      this.dayItems = {};
      this.monthArr=[];
      this.date = utils.convertToDate(date);

      this.itemWrapper.$el.empty();
      var DaysArr = this.getDaysArr();
      var itemStyle = {
        "height": this.config.itemHeight + "px",
        "font-size": utils.getRealWidth(14) + "px"
      };
      var docuFrag = document.createDocumentFragment();
      for (var i = 0; i < this.SumDay; i++) {
        var itemData = DaysArr[i];
        if(i===0){
          this.range.start = itemData.dateStr;
        }
        if(i===this.SumDay-1){
          this.range.end = itemData.dateStr;
        }
        var dayItem = new DayItem(itemData, itemStyle,this.dayInnerWidth,this.calendar);
        this.dayItems[itemData.dateStr] = dayItem;
        this.monthArr.push(itemData.dateStr);
        docuFrag.appendChild(dayItem.$el[0]);
      }

      this.itemWrapper.$el[0].appendChild(docuFrag);
    },
    getDaysArr: function() {
     return getCalendarDaysInfoInOneWrap(this.date);
    }
  }


  function getCalendarDaysInfoInOneWrap(dateparam){
     var Re = [];
      var monthDayCount = utils.getMonthDayCount(dateparam);
      var monthInfo = utils.getDateInfo(dateparam);
      var firstDayWhichDayInWeek = utils.getMonthFirstDayWhicDayInWeek(dateparam);
      var nextMonthCount = 6*7 - firstDayWhichDayInWeek - monthDayCount;
      if (firstDayWhichDayInWeek > 0) {
        var preMonth = utils.getPreMonth(dateparam);
        var preMonthLastDay = utils.getMonthDayCount(preMonth);
        var preMonthInfo = utils.getDateInfo(preMonth);
        for (var i = 0; i < firstDayWhichDayInWeek; i++) {
          var day = (preMonthLastDay - firstDayWhichDayInWeek + i + 1);
          var date = new Date(preMonthInfo.year,preMonthInfo.month-1,day);
          Re.push({
            date:date,
            dateStr :utils.ConvertDateToStr(date),
            year: preMonthInfo.year,
            month: preMonthInfo.month,
            day: day,
            mark: "premonth"
          });
        }
      }
      for (var i = 1; i <= monthDayCount; i++) {
        var date = new Date(monthInfo.year,monthInfo.month-1,i);
        Re.push({
          date:date,
          dateStr :utils.ConvertDateToStr(date),
          year: monthInfo.year,
          month: monthInfo.month,
          day: i,
          mark: "curmonth"
        });
      }
      if (nextMonthCount > 0) {

        var nextMonth = utils.getNextMonth(dateparam);
        var nextMonthInfo = utils.getDateInfo(nextMonth);
        for (var i = 1; i <= nextMonthCount; i++) {
          var date = new Date(nextMonthInfo.year,nextMonthInfo.month-1,i);
          Re.push({
            date:date,
            dateStr :utils.ConvertDateToStr(date),
            year: nextMonthInfo.year,
            month: nextMonthInfo.month,
            day: i,
            mark: "nextmonth"
          });
        }
      }
      return Re;
  }
  var MonthArr = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
  var Component = function(config) {
    var _this = this;
    Component.baseConstructor.call(this, config);
    this.$el.addClass("wc-calendar-wrapper displayflex flex-1 flex-v yy-ai-center");
    var configItemHieght = this.config.itemHeight;
    if (isNaN(configItemHieght)) {
      configItemHieght = 40;
    }
    this.canChangeMode = true;
    this.curDate = config.date||new Date();
    this.selectedTime = new Date(utils.convertToDate(this.curDate).getTime());
    configItemHieght = parseInt(configItemHieght);
    this.itemHeight = utils.getRealHeight(configItemHieght);
    var pluginChangeMethodName = config.comKey + "_change";
    if(this.pageview&&this.pageview.plugin){
      this.pluginChangeMethod = this.pageview.plugin[pluginChangeMethodName];
    }
    var CanlendarTouchChangeMethodName = config.comKey+"_calendarTouchChange";
     if(this.pageview&&this.pageview.plugin){
      this.CanlendarTouchChangeMethod = this.pageview.plugin[CanlendarTouchChangeMethodName];
    }

    var preventDefaultMethodName = config.comKey+"_preventDefault";
    this.preventDefaultMethod = this.pageview.plugin[preventDefaultMethodName];
    this.labelBarHeight = utils.getRealHeight(27);
    this.innerWrapperTop = utils.getRealHeight(20);
    var wrapperHeight = this.itemHeight * 6 + this.labelBarHeight+this.innerWrapperTop+utils.getRealHeight(10);
    this.innerWrapper = $("<div style='height:" + (wrapperHeight)  +"px;width:100%' class='wc-calendar-inner'></div>");


    this.bindInnerWrapEvent();


    this.innerWrapperHeight = wrapperHeight;
    this.weekWrapperHeight = this.itemHeight + this.labelBarHeight+this.innerWrapperTop;

    this.bottomArea = new BottomArea({
      type:"bottomarea",
      root:this.config.root,
      style:this.config.bottomStyle,
      $$pageview:this.pageview,
      $$parent:this,
    });

    var isShowYearAndMonthPicker = this.config.isShowYearAndMonthPicker || true;

    if (isShowYearAndMonthPicker) {
      var mt = utils.getRealHeight(2);
      var mb = utils.getRealHeight(0);
      this.yearAndMonthPickerHeight = utils.getRealHeight(30);
      wrapperHeight += this.yearAndMonthPickerHeight+mt+mb;
      this.initYearAndMonthPicker(this.yearAndMonthPickerHeight, wrapperHeight,mt,mb);
    }
    this.wrapperHeight = wrapperHeight;
    this.mode = config.mode||"年月日";

    this.curShow = "day";
    _this.createDayWraper();
    this.$el.append(this.innerWrapper).append(this.bottomArea.$el);

    var slideChangeMethodName = this.config.comKey+"_slidechange";
    this.slideChangeMethod = this.pageview.plugin[slideChangeMethodName];


    var modeChangeMethodName =  this.config.comKey+"_modechange";
    this.modeChangeMethod = this.pageview.plugin[modeChangeMethodName];


    var itemClickMethodName =  this.config.comKey+"_itemclick";
    this.itemClickMethod = this.pageview.plugin[itemClickMethodName];



    var pullDownName =  this.config.comKey+"_pulldown";
    this.pullDownMethod = this.pageview.plugin[pullDownName];
  }
  utils.extends(Component, baseClass);

  Component.prototype.bindInnerWrapEvent = function(){
    var _this = this;
    var diffY = 0,startY = 0 ;
    this.innerWrapper.bind("touchstart",function(e){

      diffY = 0;
      startY = e.touches[0].pageY;
    });
    this.innerWrapper.bind("touchmove",function(e){
      e.preventDefault();
      var curY = e.touches[0].pageY;
      diffY = curY - startY;

    });
    this.innerWrapper.bind("touchend",function(e){
      if(diffY>3){
          _this.CanlendarTouchChangeMethod&& _this.CanlendarTouchChangeMethod.call(_this.pageview.plugin,_this,{diff:diffY});
      }
      if(diffY<-3){
          _this.CanlendarTouchChangeMethod&& _this.CanlendarTouchChangeMethod.call(_this.pageview.plugin,_this,{diff:diffY});
      }
    });
  };


  Component.prototype.setDateSelected=function(date,node){
    var date = utils.convertToDate(date);
    var year = date.getFullYear();
    var dateStr = utils.ConvertDateToStr(date);
      this.curDate = date;
      this.selectedTime = date;
      console.log(this.Swiper.itemWrappers);
    for(var i=0;i<3;i++){
      var daysCreator = this.Swiper.itemWrappers[i].daysCreator;
      for(var key in daysCreator.dayItems){
        var dayItem = daysCreator.dayItems[key];
        if(dayItem.dateInfo.dateStr == dateStr){
          dayItem.selected();
        }else{
          dayItem.unSelected();
        }
      }
    }
    if(!node){return;}
    var dateMark = node.getAttribute("date-mark");
    if(dateMark =="premonth"){
      this.goPre();
    }else if(dateMark == 'nextmonth'){
      this.goNext();
    }
  }



  Component.prototype.createDayWraper = function() {
    var _this = this;
    new swiper({
      onChange: function(args) {
        if (args.action == "gopre") {
          var curDate = utils.getPreMonth(_this.curDate);
          var preDate = utils.getPreMonth(curDate);
          _this.curDate =utils.getCurMonthFirstDay(curDate);
          _this.triggerChange();
          args.itemWrapper.daysCreator.createLaytout(preDate);
        } else if (args.action == "gonext") {
          var curDate = utils.getNextMonth(_this.curDate);
          var nextDate = utils.getNextMonth(curDate);
          _this.curDate =utils.getCurMonthFirstDay(curDate);
          _this.triggerChange();
          args.itemWrapper.daysCreator.createLaytout(nextDate);
        }

        if(_this.slideChangeMethod){
          _this.slideChangeMethod.call(_this.pageview.plugin,_this,{
            mode:"day",
            swiper:_this.Swiper
          });
        }

      },
      beforeGoNext:function(){
        // return false;
      },
      initItem: function(itemWrapper, index) {
        itemWrapper.daysCreator = new DaysCreator({
          calendar:_this,
          itemWrapper: itemWrapper,
          itemHeight: _this.itemHeight
        })
      },
      init: function(me) {
        _this.Swiper = me;
      }
    });
    var barFontSize = utils.getRealWidth(14);
    var barItemStyle = "style='line-height:" + this.labelBarHeight + "px;font-size:" + barFontSize + "px'";
    var bar = $("<div style='height:" + this.labelBarHeight + "px' class='wc-calendar-bar'><div " + barItemStyle + " class='yy-c-bar-item'>日</div><div " + barItemStyle + " class='yy-c-bar-item'>一</div><div " + barItemStyle + " class='yy-c-bar-item'>二</div><div " + barItemStyle + " class='yy-c-bar-item'>三</div><div " + barItemStyle + " class='yy-c-bar-item'>四</div><div " + barItemStyle + " class='yy-c-bar-item'>五</div><div " + barItemStyle + " class='yy-c-bar-item'>六</div></div>");
    this.dayWrapper = $("<div style='top:"+this.innerWrapperTop+"px' class='wc-calendar-ymd-wrapper displayflex flex-v'></div>");
    this.dayWrapper.append(bar).append(this.Swiper.$el);

    this.Swiper.$el.bind("click",function(e){
      var node = e.target;
      var dateSeed = node.getAttribute("date-seed");
      while(dateSeed == null){
        node = node.parentNode;
        dateSeed =  node.getAttribute("date-seed");
        if(dateSeed){
          break;
        }
        if(node.tagName.toUpperCase() == "BODY"){
          break;
        }
      }
      if(_this.itemClickMethod){

        _this.itemClickMethod.call(_this.pageview.plugin,_this,{
           from:"day",
           dateStr:dateSeed
        });
      }
      _this.setDateSelected(dateSeed,node);
    });

    this.innerWrapper.append(this.dayWrapper);
    this.weekCalendar = new weekCalendar({rootInstance:this,top:this.innerWrapperTop,labelBarHeight:this.labelBarHeight,itemHeight:this.itemHeight});
    this.innerWrapper.append(this.dayWrapper).append(this.weekCalendar.$el);

    this.show();

    var diffY = 0,startY = 0 ;
    // this.bottomArea.$el.bind("touchstart",function(e){
    //   if(!_this.canChangeMode){
    //     return;
    //   }
    //   diffY = 0;
    //   startY = e.touches[0].pageY;
    // });
    // this.bottomArea.$el.bind("touchmove",function(e){
    //   if(!_this.canChangeMode){
    //     return;
    //   }
    //
    //   var curY = e.touches[0].pageY;
    //   diffY = curY - startY;
    //
    //   if(diffY<0&&_this.curShow==="day"){
    //     // e.stopPropagation();
    //     // e.preventDefault();
    //   }
    // });
    // this.bottomArea.$el.bind("touchend",function(e){
    //   if(!_this.canChangeMode){
    //     return;
    //   }
    //   if(diffY>20){
    //     if(_this.pullDownMethod){
    //       var isPrevent = _this.pullDownMethod.call(_this.pageview.plugin,_this);
    //       if(isPrevent!==false){
    //         // _this.WeekModeToDaysMode();
    //       }
    //     }else{
    //       // _this.WeekModeToDaysMode();
    //     }
    //   }
    //   if(diffY<-20){
    //     // _this.DaysModeToWeekMode();
    //   }
    // });
  };

  /*
    {
      from:"week"//day
      itemInstance:""
    }
  */
  Component.prototype.DayItemSelected  =function(config){

  };

  Component.prototype.DaysModeToWeekMode = function(){
    if(this.curShow==="week"){
      return;
    }
    this.curShow = "week";

    this.SwicthWapper.css({"height":"0px","visibility":"hidden"});
    var _this = this;
    this.innerWrapper.css({height:this.weekWrapperHeight});

    _this.weekCalendar.initLayout(this.selectedTime);
    window.setTimeout(function(){
      _this.dayWrapper.css({display:"none"});
      _this.weekCalendar.$el.removeClass("displaynone");
    },300);

    if(this.modeChangeMethod){
      this.modeChangeMethod.call(this.pageview.plugin,this,{
        curmode:"week"
      });
    }
  };
  Component.prototype.WeekModeToDaysMode = function(){
    if(this.curShow==="day"){
      return;
    }
    var _this =this;
    this.curShow = "day";
    this.SwicthWapper.css({"height":this.yearAndMonthPickerHeight+"px","visibility":"hidden"});
    this.weekCalendar.$el.addClass("displaynone");
    this.dayWrapper.css({display:"block"});
    this.innerWrapper.css({height:this.innerWrapperHeight});
    this.show(this.weekCalendar.selectedTime);
    this.setDateSelected(this.weekCalendar.selectedTime);
    window.setTimeout(function(){
      _this.SwicthWapper.css({"visibility":"visible"});
    },320);
     if(this.modeChangeMethod){
      this.modeChangeMethod.call(this.pageview.plugin,this,{
        curmode:"day"
      });
    }
  };


  Component.prototype.initYearAndMonthPicker = function(height, wrapperHeight,mt,mb) {
    var labelFontSize = utils.getRealWidth(18);
    var _top = utils.getRealWidth(10);
    var _this = this;
    var width = height+10;
    this.SwicthWapper = $("<div style='top:"+_top+"px;height:" + height + "px;margin-bottom:"+mb+"px;margin-top:"+mt+"px;border-radius:"+(height/2+4)+"px' class='wc-calendar-ym-picker displayflex flex-h'></div>");

    this.monthLeftIcon = $("<div class='wc-calendar-picker-lefticon' style='width:" + width + "px;height:" + height + "px;line-height:" + height + "px'></div>");
    this.monthLeftIcon.bind("click",
    function() {
      _this.goPre();
    });
    this.monthLabel = $("<div style='font-size:" + labelFontSize + "px' class='wc-calendar-picker-label displayflex ai-center jc-center flex-1'>2013</div>");


    this.monthRightIcon = $("<div class='wc-calendar-picker-righticon' style='width:" + width + "px;height:" + height + "px;line-height:" + height + "px'></div>");
    this.monthRightIcon.bind("click",
    function() {
      _this.goNext();
    });
    this.SwicthWapper.append(this.monthLeftIcon).append(this.monthLabel).append(this.monthRightIcon);
    this.$el.append(this.SwicthWapper)
  }



  Component.prototype.show = function(str, notriggerChange) {

    str = str ||this.curDate|| new Date();
    this.curDate =  utils.convertToDate(str);
    this.Swiper.reset();
    var preDate = utils.getPreMonth(this.curDate);
    this.Swiper.itemWrappers[0].daysCreator.createLaytout(preDate);
    this.Swiper.itemWrappers[1].daysCreator.createLaytout(this.curDate);
    var nextDate = utils.getNextMonth(this.curDate);
    this.Swiper.itemWrappers[2].daysCreator.createLaytout(nextDate);
    if (!notriggerChange) {
      this.triggerChange();
    }
  }
  Component.prototype.triggerChange = function() {
    var curDateInfo = utils.getDateInfo(this.curDate);
    this.monthLabel.html(curDateInfo.year+"年"+(curDateInfo.monthStr )+"月");
    this.pluginChangeMethod && this.pluginChangeMethod.call(this.pageview.plugin, this, {});
  }
  Component.prototype.goPre = function() {
    this.Swiper.goPre();
  }
  Component.prototype.goNext = function() {
    this.Swiper.goNext();
  }

  Component.prototype.setValue = function(date) {
      date = date || new Date();
      date = utils.convertToDate(date);
      this.selectedTime = date;
    if(this.curShow==="day"){

        this.goTo(date);
    }else if(this.curShow==="week"){
      this.gotoInWeekMode(date);
    }

  }
    Component.prototype.gotoInWeekMode = function(date){
        this.weekCalendar.initLayout(date);
    };
  Component.prototype.goTo = function(date) {
    var _this = this;

    date = date || new Date();
    date = utils.convertToDate(date);
    if (utils.ConvertDateToStr(this.curDate) == utils.ConvertDateToStr(date)) {
      return;
    }
    if (utils.ConvertDateToStr(this.curDate,"yyyy-MM") == utils.ConvertDateToStr(date,"yyyy-MM")) {
      this.setDateSelected(date);
      return;
    }
    this.curDate = date;

    if (this.curDate > date) {
      this.show(utils.getNextMonth(date), true);
      window.setTimeout(function(){
        _this.goPre();
      },0);
    } else {
      this.show(utils.getPreMonth(date), true);
      window.setTimeout(function(){
        _this.goNext();
      },0);
    }
  }


  var BottomArea = function(config){
    var _this = this;
    BottomArea.baseConstructor.call(this,config);
    this.$el.addClass("wc-bottom-wrapper flex-1 displayflex flex-v");
    this.initLayout(config.$$datasource,null,null);
  }

  utils.extends(BottomArea,baseClass);

  return Component;
});
