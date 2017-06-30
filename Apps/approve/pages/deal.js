define(["../logic/deal", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: "#F2F3F4"
        },
        root: ["main_view", "submit"],
        components: {
            main_view: {
                type: "view",
                root: ["input_textarea", "images_repeat"],
                style: {
                    flexDirection: "column",
                    paddingBottom: 15,
                    backgroundColor: "#fff"
                }
            },
            input_textarea: {
                type: "textarea",
                ref: true,
                max: 500,
                limitStyle: {
                    right: 10,
                    color: "#aaa",
                    display: "none"
                },
                numStyle: {
                },
                maxStyle: {
                },
                placeholder: "请输入同意理由（非必填, 500字以内）",
                style: {
                    height: 100,
                    paddingLeft: 15,
                    paddingRight: 15,
                    fontSize: 15,
                    paddingTop: 15,
                    width: "100%"
                },

            },
            images_repeat: {
                type: "repeat",
                ref: true,
                subComponentAlwaysShow: true,
                root: ["image", "image_del_icon"],
                style: {
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginTop: 10,
                    paddingLeft: 10
                },
                itemStyle: {
                    w: 90,
                    justifyContent: "center",
                    alignItems: "center",
                },
                subComponent: "add_image_icon"
            },
            add_image_icon: {
                type: "icon",
                text: "＋",
                style: {
                    w: 80,
                    backgroundColor: "#fff",
                    marginTop: 5,
                    marginLeft: 5,
                    border: "1px dashed rgb(207,207,207)",
                },
                textStyle: {
                    color: "rgb(207,207,207)",
                    fontSize: 28
                },
            },
            image: {
                type: "image",
                src_bind: "src",
                src: "",
                style: {
                    w: 80,
                    backgroundColor: "rgba(0,0,0,.1)"
                }
            },
            image_del_icon: {
                type: "icon",
                font: "icomoon_e909",
                style: {
                    position: "absolute",
                    right: 8,
                    border: "2px solid #fff",
                    borderRadius: "100%",
                    backgroundColor: "#fff",
                    top: 8
                },
                iconStyle: {
                    color: "#FC505F",
                    fontSize: 17
                }
            },
            submit: {
                type: "button",
                title: "提交",
                style: {
                    fontSize: 16,
                    height: 45,
                    backgroundColor: "#37B7FD",
                    border: "none",
                    color: "#fff",
                    margin: 15,
                    width: "auto"
                }
            }
        }
    };
    return Re;
});
