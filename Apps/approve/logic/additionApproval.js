define([], function () {
    function pageLogic(config) {
        this.pageview = config.pageview;
    }

    pageLogic.prototype = {};
    return pageLogic;
});