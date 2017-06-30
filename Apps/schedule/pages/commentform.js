define(["../logic/commentform", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["page_content"],
        components: {
            page_content: {
                type: "view",
                style: {
                    flex: 1,
                    overflowY: "auto",
                    backgroundColor: "#f2f3f4",
                },
                root: ["comment_input_area","submitIcon"]
            },
            submitIcon: {
                type: "icon",
                text: "回复",
                style: {
                    marginTop:20,
                    marginBottom:20,
                    borderRadius:5,
                    height: 45,
                    backgroundColor: "#37b7fd",
                    marginRight:15,
                    marginLeft:15,
                },
                textStyle: {
                    fontSize: 16,
                    marginLeft: 4,
                    color: "#fff"
                },
                iconStyle: {
                    fontSize: 16,
                    color: c.mainColor
                }

            },
            comment_input_area:{
                type: "view",
                style:{
                    padding:"10px 15px",
                    backgroundColor:"#fff",
                    wordBreak:"break-all"
                },
                root:["comment_input","comment_count"]
            },
            comment_input:{
                type:"textarea",
                placeholder: "写点什么吧. . .",
                style:{
                    height:100,
                }
            },
            comment_count:{
                type:"text",
                text:"0",
                nextText:"/500",
                style:{
                    color:"#cccccc",
                    fontSize:12,
                    justifyContent:"flex-end",
                    height:20
                },
                nextTextStyle:{
                    color:"#cccccc",
                }
            }
        },
    };
    return Re;
});