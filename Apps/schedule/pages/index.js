/**
 * 首页的上下分类
 **/
define(["../logic/index", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["testHeader", "body"],
        components: {
            testHeader: {
                type: "view",
                className:"displaynone",
                style: {
                    height: 20,
                    backgroundColor: "#000"
                }
            },
            body: {
                type: "view",
                ref: true,
                style: {
                    flex: 1
                },
                root: ["calendarlist", "today_btn", "add_btn"]
            },

            calendarlist: {
                ref: true,
                type: "schedulecalendar",
                root: ["viewpager"],
                style: {}
            },
            viewpager: {
                type: "viewpager",
                ref: true,
                defaultKey: "month",
                style: {
                    backgroundColor: "#F2F3F4",
                    flex: "1"
                }
            },
            today_btn: {
                type: "icon",
                text: "今",
                className:"displaynone",
                ref:true,
                textStyle: {
                    color: "#fff",
                    fontSize: 20
                },
                style: {
                    w: 50,
                    borderRadius: "100%",
                    position: "absolute",
                    bottom: 20,
                    right: 80,
                    backgroundColor: "#FFCF0E",
                    boxShadow: "0px 5px 8px rgba(255, 207, 14, 0.3)"
                }
            },
            add_btn: {
                type: "icon",
                font: 'sc_e903',
                iconStyle:{
                  fontSize:17,
                },
                style: {
                    w: 50,
                    color: '#fff',
                    borderRadius: "100%",
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    backgroundColor: "#37B7FD",
                    boxShadow: "0px 5px 8px rgba(55, 183, 253, 0.3)"
                }
            },


        },

    };
    return Re;
});
