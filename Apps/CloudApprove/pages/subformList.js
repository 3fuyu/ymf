/**
 * Created by Gin on 17/3/10.
 */

define(["../logic/subformList", "../parts/common"], function (pluginClass, c) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["body"],
        components: {
            body:{
                type:"view",
                root:["list_repeat"]
            },
            list_repeat: {
                type: "repeat",
                ref: true,
                root: ["list_view"],
                style: {
                    display: "inline",
                    width: "100%",
                    backgroundColor: "#fff",
                    marginTop: 10
                },
                itemStyle: {
                    borderBottom: "solid 1px #EDEDED",
                    height: 40,
                    flexDirection: "row"
                }
                // items: [{title: "标题1", content: "内容11"}, {title: "标题2", content: "内容2"}, {title: "标题3", content: "内容3"}]
            },
            list_view: {
                type: "view",
                root: ["list_item_left", "list_item_right","rp_right_icon"],
                style:{
                    width:"100%",
                    flexDirection:"row"
                }
            },
            list_item_left: {
                type: "text",
                text: "title:",
                text_bind: "title",
                style: {
                    color: "#262626",
                    fontSize: 14,
                    flex:1,
                    paddingLeft:14
                }
            },
            list_item_right: {
                type: "text",
                text: " ",
                style: {
                    color: "#ADADAD",
                    fontSize: 14,
                    flex:1,
                    justifyContent: "flex-end"
                }
            },
            rp_right_icon:{
                type:"icon",
                iconStyle:{
                    fontSize:14,
                    color:"#ccc"
                },
                style:{
                    width:30
                },
                font:"cap_e901"
            }
        }
    };
    return Re;
});