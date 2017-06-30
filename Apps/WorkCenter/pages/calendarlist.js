/**
 * 首页的上下分类
 **/
define(["../logic/calendarlist", "../parts/common", 'utils'], function(pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["calendarlist"],
        components: {
          calendarlist:{
            type:"wccalendar",
            root:["listwrap"],
            style:{
            }
          },
          listwrap:{
            type:"view",
            ref:true,
            style:{
              width:"100%",
              flex:1
            },
            root:["list_title","list_wrapper","BottomBar"]
          },
          list_title:{
            type:"text",
            ref:true,
            style:{
              height:34,
              backgroundColor:'#F2F3F4',
              fontSize:14,
              paddingLeft:10
            }
          },
          list_wrapper:{
            ref:true,
            type:"view",
            style:{
              flex:1,
              overflow:"auto"
            },
            root:["todo_listview"]
          },
                   //start listview
            todo_listview: {
                type: "listview",
                ref:true,
                selectedMode: "m",
                autoLoadData: false,
                ajaxConfig: {
                    url: "/sche/getTaskByDate",
                    type: "GET",
                    timeout:8000,
                    pageSize: 211110,
                    pageNumKey: "-",
                    data: {
                      completed:0
                    }
                },
                nodata:"nodata",
                rowStyle: {
                    flexDirection: "row",
                    alignItems: "stretch",
                    height:"70",
                    borderBottom:"1px solid #EEEEEE"
                },
                root: ["row_checkbox_wrapper", "row_main_wrapper"]
            },
            nodata:{
                type:"view",
                style:{
                    flexDirection:"column",
                    alignItems:"center",
                    justifyContent: "center"

                },
                root:["nodata_image"]
            },
            nodata_image:{
                type:"icon",
                style:{
                    marginTop:40
                },
                iconStyle:{
                    w:80
                },
                text:"您还未创建任务,赶紧去行动吧",
                textPos:"bottom",
                textStyle:{
                    marginTop:16,
                    fontSize:15,
                    color:"#999999"
                },
                src:"./imgs/notask@2x.png"
            },
            row_checkbox_wrapper: {
                type: "view",
                disableParentSelect: true,
                root: ["row_checkbox"],
                ref: true,
                style: {
                    justifyContent: "center",
                    overflow: "hidden",
                    alignItems: "center",
                    width: 50,
                },
            },
            row_checkbox: {
                type: "checkbox",
                selectedStyle:{
                    backgroundColor:"#ccc",
                    border:"1px solid #ccc",
                },
            },
            row_radiobox_wraper: {
                type: "view",
                root: ["row_radiobox"],
                style: {
                    justifyContent: "center",
                    overflow: "hidden",
                    alignItems: "center",
                    width: 0,
                },
            },
            row_radiobox: {
                type: "radiobox"
            },

            row_main_wrapper: {
                type: "view",
                style: {
                    flexDirection: "row",
                    alignItems: "stretch",
                    flex: 1
                },
                root: ["row_left", "row_right"]
            },
            row_left: {
                type: "view",
                style: {
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "flex-start"
                },
                root: ["row_title", "row_time"]
            },
            row_title: {
                type: "text",
                text_bind: "name",
                numberofline: 1,
                style: {
                    paddingTop:3,
                    paddingBottom:3,
                    fontSize: 15,
                    color: "#333"
                },
            },
            row_time: {
                type: "text",
                text_bind: "endTime",
                style: {
                    color: "#999",
                    fontSize: 13
                }
            },
            row_right: {
                type: "view",
                style: {
                    width: 50,
                    justifyContent: "center",
                    alignItems: "center"
                },
                root: ["row_flag"]
            },
            row_flag: {
                type: "icon",
                font: "wc_e90c",
                disableParentSelect: true,
                selectedClassName: "flag-selected",
                iconStyle: {
                    color: "#CCCCCC"
                },
                style:{
                    width: "100%",
                    height: "76"
                }
            },

             //end listview

        BottomBar:{
          type:"view",
          style:{
            height:"50",
            borderTop:"1px solid #DCDCDC",
            backgroundColor:'#fff',
            justifyContent:"center",
            alignItems:"center",
            flexDirection:"row"
          },
          root:["dateIcon", "addInput","sureIcon"]
        },
            dateIcon: {
                type: "icon",
                font: "wc_e913",
                className:"wc-date-icon",
                text:"",
                textStyle:{
                    position:"absolute",
                    top:8,
                    left:"50%",
                    color:"#0093ff",
                    fontSize:13

                },
                iconStyle:{
                    fontSize:24
                },
                style: {
                    width: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#bbbbbb"
                },

            },
            addInput: {
                type: "input",
                placeholder: "添加任务...",
                isInForm: true,
                style: {
                    flex: 1,
                    height: 30,
                    marginRight: 10,
                    fontSize: 16,
                    paddingLeft: 10,
                    borderRadius: "5px",
                    color: "#333333",
                    backgroundColor: "#F2F3F4"
                }
            },
            sureIcon: {
                type: "text",
                text: "添加",
                style: {
                    width: 50,
                    fontSize: 16,
                    paddingRight: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#37B7FD"
                },

            }
      }


    };
    return Re;
});
