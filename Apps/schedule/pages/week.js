/**
 * 首页的上下分类
 **/
define(["../logic/week", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["addtest"],
        components: {

          addtest:{
            type:"text",
            text:"week"
          }


        },

    };
    return Re;
});
