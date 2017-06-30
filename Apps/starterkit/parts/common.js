define(["utils"], function(utils) {
    var mainColor = "#8991FF";
    var titleColor = "#333333";
    var seTitleColor = "#999999";
    var descColor = "#666666";
    var backColor = "#f2f4f4";
    var Re = {
        descColor: descColor,
        backColor: backColor,
        mainColor: mainColor,
        seTitleColor: seTitleColor,
        labelColor: "#666666",
        titleColor: titleColor,

        //清单特有日期格式转换
        smartTimestamp: function(timestamp) {
            var timeStr = "";
            try {
                timestamp = parseFloat(timestamp);
                var date = new Date(timestamp),
                    now = new Date(),
                    time = now.getTime(),
                    dateInfo = utils.getDateInfo(date),
                    nowDateInfo = utils.getDateInfo(now);
                time = parseInt((time - timestamp) / 1000);

                if (nowDateInfo.year === dateInfo.year && nowDateInfo.day === dateInfo.day && nowDateInfo.month === dateInfo.month) {
                    timeStr = "今天";
                } else {
                    timeStr = dateInfo.year + "-" + dateInfo.monthStr + "-" + dateInfo.dayStr;
                }
            } catch (e) {

            }
            return timeStr;
        },
        //自定义格式的 日期格式 （优先处理showToday字段）
        // 例子：
        // customTimestamp(14444444444,"yyyy-MM-dd   .S",true) ==> 今天 08:09:04.423
        // customTimestamp(14444444444,"yyyy-M-d h:m:s.S",false)      ==> 2006-7-2 8:9:4.18
        customTimestamp: function(timestamp, fmt, showToday) {
            var timeStr = "";
            try {
                timestamp = parseFloat(timestamp);
                var date = new Date(timestamp),
                    now = new Date(),
                    time = now.getTime(),
                    dateInfo = utils.getDateInfo(date),
                    nowDateInfo = utils.getDateInfo(now);
                time = parseInt((time - timestamp) / 1000);

                //如果是今天
                if (nowDateInfo.year === dateInfo.year && nowDateInfo.day === dateInfo.day && nowDateInfo.month === dateInfo.month && showToday) {
                    //如果要显示文字今天
                    timeStr = "今天 "+ this.formatTime(date, "hh:mm");
                }else {
                    //如果不是今天，判断fmt是否存在，
                    if(fmt){
                        timeStr = this.formatTime(date, fmt);
                    }else {
                        timeStr = this.formatTime(date, "yyyy-MM-dd hh:mm");
                    }

                }
            } catch (e) {}
            return timeStr;
        },
        //格式化日期
        // 例子：
        // (new Date()).Format("yyyy-MM-dd   .S") ==> 2006-07-02 08:09:04.423
        // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
        formatTime: function (date,fmt) {
            var o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        selectAttachment:function(plugin,type){
            var _this = plugin;
            if(_this.imagesRepeat.datasource.length>=5){
                _this.pageview.showTip({text:"最多上传5张图片",duration:1000,style:{width:"220px"}});
                return;
            }

            try{
                var last  = 5 - _this.imagesRepeat.datasource.length;
                window.yyesn.client.selectAttachment(function(Re){
                    var data= Re.data;
                    if(data.length > last){
                        _this.pageview.showTip({text:"最多上传5张图片",duration:1000,style:{width:"220px"}});
                    }
                    for(var i=0,j=last;i<j;i++){
                        _this.imagesRepeat.addItem({src:data[i].path});
                    }

                },{type:type||1,maxselectnum:last});
            }catch(e){

            }
        },

    };
    return Re;
});
