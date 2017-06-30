define(["../logic/additionApproval", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor,
            overflow: "auto"
        },
        root: ["body"],
        components: {
            body: {
                type: "view",
                style: {
                    padding: 15,
                    color: "#999"
                },
                root:["title","titleLable","contentText","contentImage","contentText1","contentImage1"]
            },
            title: {
                type: "text",
                text: "什么是明细组件",
                style: {
                    fontSize: 17,
                    color: "#000",
                    margin: "auto",
                    fontWeight: "bold"
                }
            },
            titleLable: {
                type: "text",
                text: "在自定义审批表单时，你会看到“明细”这个组件，它的功能可是很强大哦，下面看看它有什么功能吧",
                style: {
                    fontSize: 14,
                    marginTop: 15
                }
            },
            contentText: {
                type: "text",
                text: "1、在web端，明细相当于一个容器，可以拖动除了明细组件其他任意组件进入，如果有数字，金额，时间段组件，还可以设置“明细内部统计总和”",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },
            contentText1: {
                type: "text",
                text: "2、在移动端，明细的样式相当于一个审批单据内部的小表单，可以增加相同的明细项，达到多个审批单据一起提交的作用",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },
            contentImage: {
                type: "image",
                src: './imgs/help/3.1.png',
                style: {
                    margin: "auto"
                }
            },
            contentImage1: {
                type: "image",
                src: './imgs/help/3.2.png',
                style: {
                    margin: "auto"
                }
            }
        }
    };
    return Re;
});
