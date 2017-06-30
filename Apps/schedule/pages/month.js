/**
 * 首页的上下分类
 **/
define(["../logic/month", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["body"],
        components: {
            body: {
                ref: true,
                type: "view",
                root: ["schedule_listview"],
                style: {flex: 1, overflow: "auto"}
            },
            schedule_listview: {
                type: "listview",
                ref: true,
                selectedMode: "m",
                ajaxConfig: {
                    url: "/schedule/getDayList",
                    type: "GET",
                    timeout: 800000000,
                    pageNumKey:"pageNumKey",
                    pageSize: 99999,
                    data: {
                    }
                },
                nodata: "nodata",
                rowStyle: {
                    justifyContent: 'center',
                    padding: '0 15px',
                    flexDirection: "column",
                    height: "70",
                    borderBottom: "1px solid #EEEEEE"
                },
                root: ["row_top", "row_bottom"]
            },
            row_top: {
                style: {
                    marginBottom:8,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                },
                type: 'view',
                root: ['row_top_left', 'row_top_right']
            },
            row_bottom: {
                type: 'view',
                root: ["row_bottom_tag", "row_bottom_content"]
            },
            row_bottom_tag: {
                type: 'text',
                text: '重要',
                textStyle:{
                    fontSize:10,
                    color:'#fc505f',
                    border: '1px solid #fc505f',
                    borderRadius: 3,
                    marginRight:5,
                    padding: '0 3px'
                }
            },
            row_bottom_content: {
                type: 'text',
                numberofline:1,
                style:{
                    width:'90%',
                    fontSize:16,
                    lineHeight:20,
                    color:"#333333"
                },
                text_bind: "title",
            },
            row_top_right: {
                style: {
                    color: '#999999',
                    fontSize: 14,
                },
                type: 'text',
                text_bind: 'endTimeStr'
            },
            row_top_left: {
                iconStyle:{
                    fontSize:12,
                    w:20,
                    justifyContent:"center",
                    alignItems:"center",
                    marginRight:5,
                    borderRadius:'100%',
                    backgroundColor:'#37B7FD',
                    color:"#fff"
                },
                textStyle:{
                  color:'#999999',
                  fontSize: 14,
                },
                type: "icon",
                font: "sc_e92c",
                text_bind: "startTimeStr",
            },
            nodata: {
                type: "view",
                style: {
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"

                },
                root: ["nodata_image"]
            },
            nodata_image: {
                type: "icon",
                style: {
                    marginTop: 60
                },
                iconStyle: {
                    w: 80
                },
                text: "您还未创建日程,赶紧去行动吧",
                textPos: "bottom",
                textStyle: {
                    marginTop: 16,
                    fontSize: 15,
                    color: "#999999"
                },
                src: "./imgs/notask@2x.png"
            },
        },

    };
    return Re;
});
