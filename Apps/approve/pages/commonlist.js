define(["../logic/commonlist", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["body"],
        components: {
            body: {
                type: "view",
                style: {
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden"
                },
                root: ["searchview", "listview"]
            },
            searchview: {
                cancelBtnStyle: {
                    color: "#37B7FD",
                    fontSize: 15
                },
                style:{
                    paddingTop:4,
                    paddingBottom:4,
                    backgroundColor:"#fff"
                },
                placeholder: "搜索标题",
                type: "simplesearchview"
            },
            nodata:{
                type:"text",
                text:"未查询到相关数据",
                style:{
                    justifyContent:"center",
                    fontSize:17,
                    color:"#999",
                    marginTop:180
                }
            },
            listview: {
                ref: true,
                type: "listview",
                nodata:"nodata",
                rowStyle: {
                    flexDirection: "row",
                    paddingTop: 7,
                    paddingBottom: 9,
                    borderBottom: "1px solid #eee"
                },
                style: {
                    flexDirection: "column"
                },
                root: ["row_left", "row_mide", "row_right"]
            },
            row_left: {
                type: "view",
                style: {
                    width: 70,
                    alignItems: "center",
                    justifyContent: "center"
                },
                root: ["row_image"]
            },
            row_mide: {
                type: "view",
                style: {
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "center"
                },
                root: ["row_title", "row_status"]
            },
            row_right: {
                type: "view",
                style: {
                    width: 100,
                    alignItems: "center"
                },
                root: ["row_time"]
            },
            row_status: {
                type: "text",
                style: {
                    fontSize: 14,
                    lineHeight:"14px",
                    marginTop:6,
                    color: "#8C8D8E"
                },
                text_bind: "formDataResult"
            },
            row_image: {
                type: "image",
                style: {
                    w: 40,
                    borderRadius: "100%",
                    backgroundColor: "#eee"
                },
                title_bind:"name",
                src_bind: "avatar"
            },
            row_title: {
                type: "text",
                numberofline: 1,
                style: {
                    color: "#292F33",
                    fontSize: 16,
                    lineHeight:"18px"
                },
                text: ""
            },
            row_time: {
                type: "text",
                style: {
                    top: 2,
                    color: "#999999",
                    fontSize: 12
                },
                text_bind: "time"
            }
        },

    };
    return Re;
});
