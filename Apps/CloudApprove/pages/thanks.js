define(["../logic/thanks", "../parts/common", 'utils'], function (pluginClass, c, utils) {
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
                    backgroundColor: "#fff",
                    alignItems: "center"
                },
                root: ["body_top", "body_middle", "body_bottom"]
            },
            body_top: {
                type: "icon",
                font: "cap_e90a",
                style: {
                    fontSize: 93,
                    marginTop: 50,
                    marginBottom: 30,
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    // backgroundColor: "#09BB07"
                },
                iconStyle: {
                    fontSize: 93,
                    color: "#09BB07"
                }
            },
            body_middle: {
                type: "text",
                text: "感谢您的填写",
                style: {
                    marginBottom: 5,
                    fontWeight: 400,
                    fontSize: 20
                }
            },
            body_bottom: {
                type: "text",
                text: "由 <span style='color: #29b6f6'>用友云表单</span> 提供支持",
                style: {
                    position: "absolute",
                    textAlign: "center",
                    width: "100%",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    margin: "auto",
                    marginBottom: 20,
                    fontSize: 14,
                    color: "#666"
                },
                textStyle: {
                    width: "100%"
                }
            }
        }
    };
    return Re;
});
