/**
 * 首页的上下分类
 **/
define(["../logic/day", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: '#fff',
            overflowY: 'scroll'
        },
        root: ["mydayview","nodata"],
        components: {
            mydayview: {
                ref: true,
                type: "dayview",
            },
            nodata: {
                ref: true,
                type: "view",
                style: {
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    display:'none'

                },
                root: ["nodata_image"]
            },
            nodata_image: {
                type: "icon",
                style: {
                    marginTop: 150
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
