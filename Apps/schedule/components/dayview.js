/**
 * Created by liuqingling on 16/12/6.
 */
define(["utils", "base"], function (utils, baseClass) {
    var data = {
        list: [

        ]
    }
    var Dialog  = function (data) {
        var its=data;
        var ittpls='';
        its.forEach(function (it) {
            var color='background:#37B7FD;      margin: 3px 0px;  overflow: hidden;text-overflow: ellipsis;border-radius:2px;white-space: nowrap;width: '+ utils.getRealWidth(323)+'px;'
            ittpls+='<div id="'+it.id+'" style="'+color+'">'+it.title+'</div>';
        });
        var tpl= '<div class="dv-dialog-wrap" style="height: '+utils.getRealHeight(73)+'px; border-bottom: 1px solid #eeeeee  ; box-shadow: rgba(204,204,204,0.2) 0px 4px 8px;margin-bottom: 8px;"><div>全天</div><div>'+ittpls+'</div></div> '
        this.$el =$(tpl);
    };

    var Component = function (config) {
        var _this = this;
        this.count=0;
        Component.baseConstructor.call(this, config);
        var item = '';
        for (var i = 0; i <= 24; i++) {
            item += '<div class="time-cell"> ' + i + '时 </div>';
        }
        this.firstColumn = '<div class="first-column" >' + item + '</div>';
        this.secColumn = '<div class="sec-column" ></div>'
        this.$el.html('<div class="dayview">' + this.firstColumn + this.secColumn + '</div>');
        loadData(this,data.list);
        var itemClickName = this.config.comKey+"_itemclick";
        this.itemClickNameMethod = this.pageview.plugin[itemClickName];
        this.$el.delegate('.row','click',function (e) {
            var id=$(e.currentTarget).attr('id');
            _this.itemClickNameMethod&&_this.itemClickNameMethod.call(_this.pageview.plugin,_this,id);
        });
        this.$el.delegate('.dv-dialog-wrap div[id]','click',function (e) {
            var id=$(e.currentTarget).attr('id');
            _this.itemClickNameMethod&&_this.itemClickNameMethod.call(_this.pageview.plugin,_this,id);
        });
        this.loadData=loadData;
        //xxx_itemclick:func(sender,params)
    };
    function loadData(component,data){
        component.$el.find('.sec-column').empty();
        this.count=0;
        data.forEach(function (it) {
            if((it.endTime - it.startTime)/1000/60/60>=24){
                it.wholeDay=1;
            }
        });
        renderColumn(component,data);
        var wholeDay=data.filter(function (it) {
            return it.wholeDay===1;
        });
        component.dialog?component.dialog.$el.remove():'';
        if(wholeDay.length>0){
            component.dialog= new Dialog(wholeDay);
            component.$el.prepend(component.dialog.$el);
        }

    }
    function getItemColor(obj){
        var color='';
        // if(obj.role===0){
        // }else if(obj.type==='task'&&obj.completed===1){
        //     color+='background:#ececec;border-left:1px solid #666666';
        // }else if(obj.type==='task'&&obj.completed===0){
        //     color+='background:#ebfbff;border-left:1px solid #5CDDFD';
        // }else
        if(obj.role===2){
            color+='background:#fff9e2;border-left:1px solid#FFCF0E';
        }else {
            color+='background:#e7f6ff;border-left:1px solid #37B7FD';
        }
        return color;

    }
    function renderColumn(_this,data) {
        var currentColumn;
        var rendedItem = [];
        var nextColumn = [];
        var noWholeDay=data.filter(function (it) {
            return it.wholeDay===0;
        });
        noWholeDay.forEach(function (it, index) {
                if (index == 0) {
                    currentColumn = renderColumnWrap(_this);
                    renderItem(currentColumn, it);
                    rendedItem.push(it);
                } else {
                    //在之前的item的区间
                    var needRender = true;
                    for(var i=0;i<rendedItem.length;i++){
                        //与之前的有重叠
                        if (Number(it.startTime) <= Number(rendedItem[i].endTime) && Number(it.endTime) >= Number(rendedItem[i].startTime)) {
                            nextColumn.push(it);
                            needRender = false;
                            break;
                        }
                    }
                    if (needRender) {
                        renderItem(currentColumn, it);
                        rendedItem.push(it);
                    }
                }

        });
        _this.count++
        if(_this,nextColumn.length>0&&_this.count<20){
            renderColumn(_this,nextColumn)
        }

    };
    function renderColumnWrap(component) {
        var height = 40 * 24;
        component.wraper = $("<div class='column' style='height:" + height + "px;margin-right:2px'></div>");
        component.$el.find('.sec-column').append(component.wraper);
        return component.wraper;
    };
    function renderItem(container, data) {
        var itemOffset = 20;
        var height = 40 * 24;
        var cd=new Date(data.startTime);
        var cdstart =new Date(cd.getFullYear(),cd.getMonth(),cd.getDate(),0,0,1).getTime();
        var offsetTopPer = (data.startTime-cdstart) /  (24*60*60*1000);
        var itemHeightPer = (data.endTime - data.startTime) / (24*60*60*1000);
        var itemView;
        if(itemHeightPer * height>20){
             itemView = "<div class='row' id='"+data.id+"' style='padding-left:6px;padding-top:5px;padding-right:6px;width: 100%;color:#333333;font-size:12px;word-break:break-all; overflow:hidden;text-overflow:ellipsis;position: absolute;display:inline-block;text-align:left;height: " + itemHeightPer * height + "px;"+getItemColor(data)+";top:" + (offsetTopPer * height + itemOffset) + "px'><p>"+data.title+"</p></div>"
        }else{
             itemView = "<div class='row' id='"+data.id+"' style='padding-left:6px;padding-top:5px;padding-right:6px;width: 100%;color:#333333;font-size:12px;word-break:break-all; overflow:hidden;text-overflow:ellipsis;position: absolute;display:inline-block;text-align:left;height: " + itemHeightPer * height + "px;"+getItemColor(data)+";top:" + (offsetTopPer * height + itemOffset) + "px'><p></p></div>"
        }
        container.append(itemView);
    };
    utils.extends(Component, baseClass);
    return Component;
})
