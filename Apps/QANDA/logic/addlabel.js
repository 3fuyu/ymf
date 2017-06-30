define(["../components/commonCtl", "../../../components/dialog"],
function(c, dialog) {

  function pageLogic(config) {
    this.pageview = config.pageview;

    this.historyLabelStorage = "S@WaAQ*&YY^%w@";
    var labels = this.pageview.showPageParams.labels;

    this.isDetailPageModifyLable = this.pageview.showPageParams.type === "modify";

    this.pageview.do("addLabelRepeat",
    function(target) {
      target.bindData(labels);
    });

    this.setHeader();
  }
  pageLogic.prototype = {
    onPageLoad: function() {
      var _this = this;
      this.addLabelDialog = new dialog({
        mode: 3,
        wrapper: this.pageview.$el,
        title: "添加标签",
        createContent: function(contentBody) {
          _this.pageview.getComponentInstanceByComKey("labelInput", null, null,
          function(comInstance) {
            contentBody.append(comInstance.$el);
            _this.addLabelInput = comInstance;
          },
          function() {});
        },
        btnDirection: "row",
        buttons: [{
          title: "取消",
          style: {
            height: 45,
            fontSize: 16,
            color: c.titleColor,
            borderRight: "1px solid #EEEEEE"
          },
          onClick: function() {
            _this.addLabelDialog.hide();
          }
        },
        {
          title: "添加",
          style: {
            height: 45,
            fontSize: 16,
            color: c.mainColor
          },
          onClick: function() {
            _this.addLabel();
          }
        }]
      });
    },
    onPageResume: function() {
      this.setHeader();
    },
    setHeader: function() {
      var _this = this;

      try {
        window.yyesn.client.setHeader(function() {},
        {
          type: 2,
          title: "添加标签",
          //navColor:c.mainColor,
          rightTitle: "",
          rightValues: []
        },
        function(b) {

        });
      } catch(e) {

      }
    },
    labelInput_init: function(sender, params) {
      this.labelInput = sender;
    },
    addLabelBtn_click: function(sender, params) {
      var _this = this;
      var len = this.addLabelRepeat.datasource.length;
      if (len == 5) {
        this.showCannotAddLabel();
        return;
      }
      if (!this.addLabelDialog) {

}
      this.addLabelDialog.show();
      if (this.addLabelInput) {
        this.addLabelInput.focus();
      }
    },

    onPageClose: function() {
      var Re = [];

      var storage = window.localStorage;
      var items = storage.getItem(this.historyLabelStorage);
      var history = [];
      if (items) {
        history = items.split(";");
      }

      for (var i = 0,
      j = this.addLabelRepeat.datasource.length; i < j; i++) {
        var title = this.addLabelRepeat.datasource[i].title;
        var index = history.indexOf(title);
        if (index >= 0) {
          history.splice(index, 1);
        }
        if (history.length > 18) {
          history.splice(history.length-1, 1);
        }
        Re.push(title);
      }

      if (Re.length > 0) {
        Re = Re.concat(history);
        storage.setItem(this.historyLabelStorage, Re.join(";"));
      }
      if (!this.isDetailPageModifyLable) {
        this.pageview.ownerPage.plugin.setLabelValue(this.addLabelRepeat.datasource);
      } else {
        this.pageview.ownerPage.plugin.modifyLabel(this.addLabelRepeat.datasource);
      }
    },
    right_icon_click: function(sender, params) {
      this.sharePoplayer.show();
    },
    shareCancelIcon_click: function() {
      this.sharePoplayer.hide();
    },
    backIcon_click: function(sender, params) {
      if (this.pageview.ownerPage) {
        this.pageview.ownerPage.hideCurShowPage();
      } else {
        this.pageview.goBack();
      }
    },
    showCannotAddLabel: function() {
      this.pageview.showTip({
        text: "超过最大限制",
        duration: 700,
        style: {
          width: 120
        }
      });
    },
    hasExistLabe: function(label) {
      for (var i = 0; i < this.addLabelRepeat.datasource.length; i++) {
        var itemData = this.addLabelRepeat.datasource[i];
        if (itemData.title === label) {
          this.pageview.showTip({
            text: "已存在该标签",
            duration: 900,
            pos: "top",
          });
          return true;
        }
      }
      return false;
    },
    historyLabelRepeat_itemclick: function(sender, params) {
      var label = sender.datasource.title;
      var len = this.addLabelRepeat.datasource.length;
      if (len == 5) {
        this.showCannotAddLabel();
        return;
      }
      if (this.hasExistLabe(label)) {
        return;
      }
      this.addLabelRepeat.addItem({
        title: label
      });
    },
    addLabel: function() {
      var label = this.labelInput.getValue();
      if (label.length > 8) {
        this.pageview.showTip({
          text: "标签不能超过8个字",
          pos: "top",
          duration: 1000,
        });
        return;
      }
      if (!this.hasExistLabe(label) && label !== "") {
        this.addLabelRepeat.addItem({
          title: label
        });
      }
      this.labelInput.setValue("");
      this.addLabelDialog.hide();
    },
    addLabelRepeat_init: function(sender) {
      this.addLabelRepeat = sender;
    },
    addLabelRepeat_itemclick: function(sender, params) {
      sender.remove();
    },
    historyLabelRepeat_init: function(sender, params) {
      var storage = window.localStorage;
      var items = storage.getItem(this.historyLabelStorage);
      sender.bindData(c.convertLabelStrToJson(items));
    },
    sharePoplayer_init: function(sender, params) {
      this.sharePoplayer = sender;
    }
  };
  return pageLogic;
});
