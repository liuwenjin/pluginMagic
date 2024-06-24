(function () {
  var config = {
    script: {
      script: "script.js",
    },
    css: {
      style: "style.css",
      bootstrap: "bootstrap/bootstrap.min.css",
      animation: "animate.min.css",
      bootstrapIcons: "bootstrap/bootstrap-icons.css",
      jsonViewer: "jsonViewer/jquery.json-viewer.css"
    },
    html: `<div class="CardItem_contentArea">
    <div class="CardItem_content">
      <div class="CardItem_titleArea">
        <div class="CardItem_title">{{title}}</div>
      </div>
      <div class="__CardItem_componentArea">
        <div class="CardItem_componentArea"></div>
      </div>
      <div class="CardItem_footArea">
        {{foot}}
      </div>
    </div>
    <div class="CardItem_mask" style="text-align: center;"></div>
  </div>
  <div class="CardItem_loading" style="display: none">
    <div style="width: 100%; display: inline-block; text-align:center;">
      <div class="box">
        <span>加载中...</span>
        <div class="loader-16"></div>
        <span class="loadingTips" style="position: absolute; font-size: 12px; margin-top: 70px;">请稍后...</span>
      </div>
    </div>
  </div>
  <div class="CardItem_stateTemplate" style="display: none">
    <textarea class="CardItem_template_loading">
      <div style="width: 100%; height: 100%; display: flex; justify-content:center; align-items:center;">
        <span class="CardItem_loadingTips CardItem_stateTips"></span>
      </div>
    </textarea>
    <textarea class="CardItem_template_error">
      <div style="color: #600; width: 100%; height: 100%; display: flex; justify-content:center; align-items:center;">
        <span class="CardItem_stateTips"></span>
      </div>
    </textarea>
    <textarea class="CardItem_template_empty">
      <div style="width: 100%; height: 100%; display: flex; justify-content:center; align-items:center;">
        <span class="CardItem_stateTips"></span>
      </div>
    </textarea>
    <textarea class="CardItem_template_notice">
      <div style="width: 100%; height: 100%; display: flex; justify-content:center; align-items:center;">
        <span class="CardItem_stateTips"></span>
      </div>
    </textarea>
    <textarea class="CardItem_template_html">
      <div style="width: 100%; height: 100%; display: flex; flex-wrap: wrap; justify-content:center; align-items:center;">
        <span class="CardItem_stateTips">HTML片段区域</span>
      </div>
    </textarea>
  </div>`
  }
  webCpu.regComponent("CardItem", config, function (container, data, task) {
    // console.log("debuglog", task.template, task.url, container.parentNode);
    if (!data.title) {
      $(container).find(".CardItem_titleArea").hide();
      $(container).find(".__CardItem_componentArea").css("top", "0px");
    }
    if (data.border && (webCpu.cards && webCpu.cards.transweb && webCpu.cards.transweb.task.current === "preview")) {
      $(container).css("border", data.border);
    }
    if (data.padding && (webCpu.cards && webCpu.cards.transweb && webCpu.cards.transweb.task.current === "preview")) {
      $(container).children(".CardItem_contentArea").css("padding", data.padding);
    }
    if (data.background) {
      $(container).children(".CardItem_contentArea").css("background", data.background);
    }

    if (data.position) {
      $(container).css("position", data.position);
    }

    if (data.overflow) {
      $(container).children(".CardItem_contentArea").children(".CardItem_content").children(".__CardItem_componentArea").children(".CardItem_componentArea").css("overflow", data.overflow);
    }

    if (task.config) {
      task.adapter = webCpu.initAdapter(task.config);
    }

    if (!task.unit || ($(container.parentNode).attr("flag") === "activeArea")) {
      $(container).css("width", "100%");
      $(container).css("height", "100%");
    } else {
      if (!data.size) {
        data.size = [Math.ceil(webCpu.layout.options.width / 3), Math.ceil(webCpu.layout.options.height / 3)];
      }

      var tWidth = data.size[0] * task.unit[0];
      var tHeight = data.size[1] * task.unit[1];
      if (webCpu.cards.transweb.task.current !== "preview") {
        tWidth -= 2;
        tHeight -= 2;
      }
      $(container).css("width", tWidth);
      $(container).css("height", tHeight);
      if (data.target) {
        for (var k in data.target) {
          if (data.target[k] === "center" && (k === "left" || k === "right")) {
            data.target[k] = $(container.parentNode).width() / 2 - $(container).width() / 2;
          }
          if (data.target[k] === "center" && (k === "top" || k === "bottom")) {
            data.target[k] = $(container.parentNode).height() / 2 - $(container).height() / 2;
          }
          if (k === "left" || k === "marginLeft") {
            $(container).css(k, data.target[k] * task.unit[0]);
          }

          if (k === "top" || k === "marginTop") {
            $(container).css(k, data.target[k] * task.unit[1]);
          }
        }
      }
    }
    if (data.style) {
      $(container).css(data.style);
    }
    data.task = data.task || {};
    data.className = data.className || "TemplateItem";
    $(container).find(".CardItem_componentArea").attr("mouldName", data.className);
    data.task.container = $(container).find(".CardItem_componentArea")[0];
    data.task.cardName = data.cardName || "anonymous";

    data.task.cardBody = container;

    data.task.card = data;

    data.task.mask = $(container).children(".CardItem_contentArea").children(".CardItem_mask")[0];

    webCpu.CardItem.fresh(data);

    if (data.cardName) {
      $(container).attr("cardName", data.cardName);
    }

    $.toText = function (v) {
      let str = "<span>" + v + "</span>";
      let text = $(str).text();
      return text;
    }

  });


  webCpu.CardItem.message = {};
  webCpu.CardItem.tips = {
    empty: "暂无数据",
    loading: '<span style="position: absolute; text-align: center; display: inline-block;left: 0px;width: 100%;" class="loadingTipsItem">加载中...</span><div style="margin-top: 30px;" class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>',
    error: "出现异常"
  }

  webCpu.CardItem.switchMask = function (data, state, n) {
    webCpu.CardItem.switchMaskStyle(data, {
      width: "100%",
      height: "100%",
      top: "0px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    });
    webCpu.CardItem._switchMask(data, state, n);
  }
  webCpu.CardItem._switchMask = function (data, state, n) {
    var task = data.task || data;
    if (!task.cardBody) {
      return false;
    }
    var t = $(task.cardBody).children(".CardItem_stateTemplate");
    var c = ".CardItem_template_" + state;
    var tips = this.tips[state];
    if (data.tips && data.tips[state]) {
      tips = data.tips[state];
    }
    var str = t.find(c).val();
    var mask = $(task.mask);

    mask.html(str);

    mask.find(".CardItem_stateTips").html(tips);
    if (typeof (n) === "number") {
      setTimeout(function () {
        mask.hide();
      }, n * 1000);
    } else if (typeof (n) === "object" && n.task) {
      n.container = mask[0];
      webCpu.render(n.className || "TemplateItem", n.task);
    } else if (typeof (n) === "object" && !n.task) {
      if (n.type === "message") {
        mask.find(".btn-default").hide();
      }
      if (n.rightBtnName) {
        mask.find(".btn-default").html(n.rightBtnName);
      }
      if (n.leftBtnName) {
        mask.find(".btn-primary").html(n.leftBtnName);
      }
      if (n.message) {
        if (state !== "loading") {
          mask.html(n.message);
        } else {
          mask.children().children(".CardItem_stateTips").html(n.message);
        }

      }
    } else if (typeof n == "string") {
      if (state !== "loading") {
        mask.html(n);
      } else {
        mask.children().find(".CardItem_stateTips .loadingTipsItem").html(n);
      }
    } else if (typeof n === "function") {
      n(mask[0]);
    }
    mask.show();
    return mask[0];
  }

  webCpu.CardItem.switchMaskStyle = function (data, style) {
    var task = data.task || data;
    if (task.cardBody) {
      var mask = $(task.mask);
      for (var k in style) {
        mask.css(k, style[k]);
      }
    }
  }

  webCpu.CardItem.setForbidArea = function (data, tips, style) {
    webCpu.CardItem.switchMaskStyle(data, style);
    webCpu.CardItem._switchMask(data, "html", "<span class='forbidTips'>" + tips + "</span>");
    var task = data.task || data;
    if (task.cardBody) {
      var mask = $(task.mask);
      mask.attr("title", tips);
    }
  }

  webCpu.CardItem.cancelForbidArea = function (data) {
    if (!data) {
      return false;
    }
    webCpu.CardItem.dismissMask(data);
    var task = data.task || data;
    if (task.cardBody) {
      var mask = $(task.mask);
      mask.attr("title", "");
    }
  }

  webCpu.CardItem.dismissMask = function (data) {
    if (!data) {
      return false;
    }
    var task = data.task || data;
    if (task.mask) {
      var tipsArea = $(task.mask);
      tipsArea.children().remove();
      tipsArea.hide();
      delete task.childCard;
    }
  }

  webCpu.CardItem.switchState = function (data, state) {
    if (!data) {
      return false;
    }
    var t = data.task || data;
    if (!t.container) {
      return false;
    }
    var elem = $(t.cardBody).parent().parent().parent().find(".CardItem_stateTemplate");
    var c = ".CardItem_template_" + state;
    var tips = this.tips[state];
    if (data.tips && data.tips[state]) {
      tips = data.tips[state];
    }
    var str = elem.find(c).val();
    var tipsArea = $(t.container);
    tipsArea.html(str);
    tipsArea.find(".CardItem_stateTips").html(tips);
  }

  webCpu.CardItem.leftCardDialog = function (card, objectCard, title, w, style, callback1, callback2) {
    var task = card.task || card;
    var w = w || 200;
    if (!task.cardBody) {
      return false;
    }
    var tParam = callback1;
    if (typeof (tParam) === "function") {
      tParam = {
        callback: callback1
      }
    }

    var maskSelector = $(task.mask);
    var htmlString = "<div class='cardDialogArea' style='position: relative; width: 100%; height: 100%;'>\
                        <div style='float: left; position:relative; height: 100%; overflow:auto; top: 0px; bottom:0px;' class='maskContentArea'></div>\
                        <div class='dialogBlankArea' style='float: left; position:relative; height: 100%; top: 0px; bottom: 0px; margin-left:0px; margin-right: 0px;'></div>\
                      </div>";
    maskSelector.html(htmlString);
    style = style || {
      "float": "left",
      "width": w
    };
    style.position = "relative";
    style.float = style.float || "left";
    style.width = style.width || w;
    var _self = this;
    var cSelector = maskSelector.find(".maskContentArea");
    for (var k in style) {
      cSelector.css(k, style[k]);
    }
    maskSelector.find(".dialogBlankArea").css("width", "calc( 100% - " + w + " )");
    if (style.float === "left") {
      maskSelector.find(".dialogBlankArea").css("float", "right");
    } else {
      maskSelector.find(".dialogBlankArea").css("float", "left");
    }
    maskSelector.show();
    maskSelector.find(".dialogBlankArea").on("click", function (e) {
      _self.dismissMask(card);
      if (tParam && typeof (tParam.closeCallback) === "function") {
        tParam.closeCallback();
      }
      e.stopPropagation();
    });
    if (objectCard) {
      let mArea = cSelector[0];
      objectCard.title = title;
      webCpu.updateView(mArea, objectCard, function (c0, d0, t0) {
        if (tParam && typeof (tParam.callback) === "function") {
          tParam.callback(c0, d0, t0);
        }
      });
    }
  }

  webCpu.CardItem.rightCardDialog = function (card, objectCard, title, w, style, callback1, callback2) {
    var task = card.task || card;
    var w = w || 200;
    if (!task.cardBody) {
      return false;
    }
    var tParam = callback1;
    if (typeof (tParam) === "function") {
      tParam = {
        callback: callback1
      }
    }

    var maskSelector = $(task.mask);
    var htmlString = "<div class='cardDialogArea' style='position: relative; width: 100%; height: 100%;'>\
                        <div class='dialogBlankArea' style='float: left; position:relative; height: 100%; top: 0px; bottom: 0px; margin-left:0px; margin-right: 0px;'></div>\
                        <div style='float: right; position:relative; height: 100%; overflow:auto; top: 0px; bottom:0px;' class='maskContentArea'></div>\
                      </div>";
    maskSelector.html(htmlString);
    style = style || {
      "float": "right",
      "width": w
    };
    style.position = "relative";
    style.float = style.float || "right";
    style.width = style.width || w;
    var _self = this;
    var cSelector = maskSelector.find(".maskContentArea");
    for (var k in style) {
      cSelector.css(k, style[k]);
    }
    maskSelector.find(".dialogBlankArea").css("width", "calc( 100% - " + w + " )");
    if (style.float === "left") {
      maskSelector.find(".dialogBlankArea").css("float", "right");
    } else {
      maskSelector.find(".dialogBlankArea").css("float", "left");
    }
    maskSelector.show();
    maskSelector.find(".dialogBlankArea").on("click", function (e) {
      _self.dismissMask(card);
      if (tParam && typeof (tParam.closeCallback) === "function") {
        tParam.closeCallback();
      }
      e.stopPropagation();
    });
    maskSelector.css({
      backgroundColor: "rgba(250, 250, 250, 0.2)"
    })
    if (objectCard) {
      let mArea = cSelector[0];
      objectCard.title = title;
      webCpu.updateView(mArea, objectCard, function (c0, d0, t0) {
        if (tParam && typeof (tParam.callback) === "function") {
          tParam.callback(c0, d0, t0);
        }
      });
    }
  }

  webCpu.CardItem.updateConfig = function (data, _interface) {
    var config = _interface;
    if (typeof (_interface) === "string" && webCpu._interface && webCpu._interface[_interface]) {
      config = webCpu._interface[_interface];
    }
    this._updateConfig(data, config);
  }

  webCpu.CardItem._updateConfig = function (data, config, params) {
    var t = data.task || data;
    if (config && config.data && !config.url) {
      t.url = "";
    }
    //update the render task params
    params = params || ["url", "data", "requestType", "dataType", "query", "option", "dsl"];
    for (var k in config) {
      if (params.indexOf(k) !== -1) {
        if (k === "option") {
          t.option = t.option || {};
          for (var j in config.option) {
            t.option[j] = config.option[j];
          }
        } else {
          t[k] = config[k];
        }
      }
    }
  }


  webCpu.CardItem.maskDialog = function (card, objectCard, title, option, style) {
    var pCardName = card.cardName;
    // var task = card.task || card;
    title = title || "";
    option = option || {};
    style = style || {};

    var maskCard = {
      cardName: "transwebMaskCard",
      task: {
        option: option,
        promise: {
          afterRender: function (mc, md, mt) {
            webCpu.addCardItem(mc, objectCard, {
              key: mt.option.key || mt.option || "transweb",
              _interface: option._interface,
              callback: function (c, d, t) {
                if (typeof (option.callback) === "function") {
                  option.callback(c, d, t);
                }
                card.maskDialogCard = d;
                var storage = window.localStorage;
                if (webCpu.cards.transwebCms && webCpu.cards.transwebCms.task.logined) {
                  storage.transwebLogined = webCpu.cards.transwebCms.task.logined;
                }
                if (d.cardName === "transwebSignIn" || d.cardName === "transwebCms") {
                  return false;
                }

                if (d.cardName === "transwebArticleViewer" && pCardName === "transwebView") {
                  storage.transwebType = "markdown";
                  storage.transwebData = d.task.data;
                } else if (d.cardName !== "output" && pCardName === "transwebView") {
                  storage.transwebType = "js";
                  storage.transwebData = WebTool.objectToString(d);
                } else {

                }

              }
            }, function (c1, d1, t1) {
              d1.task.maskCard = maskCard;
            });
          }
        }
      }
    }
    this._maskDialog(card, maskCard, title, style);
  }

  webCpu.CardItem._maskDialog = function (card, objectCard, title, style) {
    var h = h || 40;
    var htmlString = "<div class='dialogContent' style='position: relative;  width: 100%; height: 100%; display: inline-block;'>\
                        <div style='position:relative; display: inline-block;  background-color: #fff; overflow:auto; width: 100%; height:" + h + "px; text-align: center;'>\
                          <span style='position: absolute; left: 0px; top: 50%; margin-top: -11px; display: inline-block; width: 30px; padding: 2px; vertical-align: middle; text-align: center; cursor: pointer;' class='bi bi-backspace closeBtn'></span>\
                          <span style='position: absolute; left: 60px; top: 50%; margin-top: -11px; width: calc( 100% - 120px ); display: inline-block; padding: 2px; vertical-align: middle; text-align: center; '>" + title + "</span>\
                        </div>\
                        <div style='float: left; position:absolute; overflow:auto; width: 100%; top: " + h + "px; bottom:0px;' class='tipsStringArea'></div>\
                      </div>";
    var task = card.task || card;
    if (!task.cardBody) {
      return false;
    }
    var maskSelector = $(task.mask);
    maskSelector.html(htmlString);

    if (style) {
      maskSelector.find(".dialogContent").css(style);
    }

    var supports = ["js", "txt", "md"];

    maskSelector.show();

    var _self = this;
    maskSelector.find(".closeBtn").on("click", function () {
      _self.dismissMask(card);
    });
    if (objectCard) {
      let mArea = maskSelector.find(".tipsStringArea")[0];
      card.maskDialogCard = objectCard;
      if (typeof (objectCard) === "string") {
        var sub = getSubfix(objectCard);
        if (supports.indexOf(sub) === -1 && webCpu.cards.previewTool) {
          var _objectCard = WebTool.copyObject(webCpu.cards.previewTool);
          _objectCard.task.option.url = objectCard;
          objectCard = _objectCard;
        }
      }
      webCpu.addCardItem(mArea, objectCard, null, function (c, d, t) {
        card.maskDialogCard = d;
      });
    }
  }
  webCpu.CardItem.previewCard = function (container, card, size) {
    if (!webCpu.cards.previewTool) {
      return false;
    }
    webCpu.cards.previewTool.task.size = size;
    webCpu.cards.previewTool.task.card = card;
    webCpu.addCardItem(container, webCpu.cards.previewTool);
  }


  webCpu.CardItem.fresh = function (data, _interface) {
    webCpu.CardItem.updateCardLayout(data);
    if (!data.inactive || $("#tModalDialog").attr("state") === "previewCardItem") {
      webCpu.CardItem._fresh(data, _interface);
    } else if (data.sketch) {
      $(data.task.container).html('<div class="CardItem_sketch"><img src="#" /></div>');
      $(data.task.container).find(".CardItem_sketch>img").attr("src", data.sketch);
      $(data.task.container).find(".CardItem_sketch>img").attr("alt", data.title || data.cardName);
    } else {}
  }

  webCpu.CardItem._fresh = function (data, _interface) {
    var t = data.task || data;

    webCpu.CardItem.updateConfig(data, _interface);

    webCpu.CardItem.switchState(t, "loading");
    var className = data.className || "TemplateItem";
    t.shadowDom = null;
    // if ($(t.container).hasClass("_task_container")) {
    //   var elem = t.container;
    //   t.container = t.container.parentNode;
    //   t.container.removeChild(elem);
    // }


    if (webCpu.settings && webCpu.settings.limitedItems && webCpu.settings.limitedItems.indexOf(className) !== -1) {
      delete webCpu[className];
      t.shadowDom = t.container.attachShadow({
        mode: "closed"
      });
      t.container = document.createElement("div");
      t.shadowDom.appendChild(t.container);
      t.container.setAttribute("style", "width: 100%; height: 100%; position: relative;");
    }
    webCpu.render(className, t, data.componentPath || this.config.path, t.shadowDom);
  }


  webCpu.CardItem.updateMenuItems = function (elem, data) {
    for (var i = 0; i < data.length; i++) {
      var menuItem = data[i];
      var value = menuItem.name || menuItem.text || menuItem.label || menuItem;
      if (menuItem.data) {
        value = value.bindData(menuItem.data);
      }
      var item = $('<div class="menuItem" style="float: left; height: 100%; width: auto; padding-left: 10px; padding-right: 10px; display: flex; flex-wrap: wrap; justify-content:center; align-items:center;">' + value + '</div>')
      item.appendTo($(elem));
      let callback = menuItem.action || menuItem.callback;
      if (typeof (callback) === "function") {
        item.on("click", callback);
      }
    }
  }

  webCpu.CardItem.createMenuItem = function (menu, type) {
    var nav = $('<ul class="nav navbar-nav" style="margin: 0px;"></ul>');
    for (let k in menu) {
      var name = menu[k].name || menu[k].label || menu[k];
      var item = $('<li index=' + k + ' key="' + menu[k].key + '"  ><a index=' + k + ' path="' + menu[k].path + '" href="#">' + name + '</a></li>');
      if (!menu[k].path) {
        item = $('<li index=' + k + '  key="' + menu[k].key + '"  ><a index=' + k + ' href="#">' + name + '</a></li>');
      }
      if (menu[k].children) {
        item = $('<li index=' + k + ' index=' + k + ' key="' + menu[k].key + '"  class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" \
                            aria-haspopup="true" aria-expanded="false">' + name + '<span class="caret"></span> </a> \
                            <ul class="dropdown-menu ' + (type || "dropdown-menu-left") + '"></ul> \
                        </li>');
        var tList = item.children(".dropdown-menu")
        for (let i in menu[k].children) {
          var tItem = menu[k].children[i];
          var mItem = $('<li value="' + tItem.value + '" title="' + tItem.name + '" ><a index="' + i + '" path="' + tItem.path + '" href="#">' + tItem.name + '</a></li>');
          if (!tItem.path) {
            mItem = $('<li value="' + tItem.value + '" title="' + tItem.name + '" ><a index="' + i + '" href="#">' + tItem.name + '</a></li>');
          }
          mItem.appendTo(tList);
        }
        tList.appendTo(item);
      }
      item.appendTo(nav);
    }
    return nav;
  }

  webCpu.CardItem.updateCardLayout = function (data) {
    if (!(data && data.task && data.task.container)) {
      return false;
    }
    var container = data.task.container.parentNode.parentNode;
    if (!$(container).hasClass("CardItem_content")) {
      container = container.parentNode;
    }
    if (!data.title && !data.titleMenu && !data.titleMenu && !data.titleData && !data.breadcrumb && !data.dialogData) {
      $(container).children(".CardItem_titleArea").hide();
      $(container).children(".__CardItem_componentArea").css("padding-top", "0px");
    } else {
      if (typeof (data.titleHeight) === "number" || typeof (data.titleHeight) === "string") {
        var h = data.titleHeight;
      } else {
        h = 40;
      }
      $(container).children(".__CardItem_componentArea").css({
        "padding-top": h,
        "box-sizing": "border-box"
        // "height": "calc( 100% - " + h + "px )"
      });

      $(container).children(".CardItem_titleArea").css("height", h);
      $(container).children(".CardItem_titleArea").show();
      var titleSelector = $(container).children(".CardItem_titleArea").children(".CardItem_title");
      data.task.titleArea = titleSelector[0];
      if (data.titleMenu && data.titleMenu.constructor.name === "Array") {
        titleSelector.html("");
        webCpu.CardItem.updateMenuItems(data.task.titleArea, data.titleMenu);

      } else if (data.titleData) {
        titleSelector.html("");
        if (data.titleData.title) {
          var t = $('<div class="navbar-header"><a class="navbar-brand" href="#">' + data.titleData.title + '</a></div>');
          t.appendTo(titleSelector)
        }
        if (data.titleData.menu || data.titleData.leftMenu) {
          var lMenu = data.titleData.menu || data.titleData.leftMenu;
          var nav = webCpu.CardItem.createMenuItem(lMenu);
          var clickCallback = function (e, mData) {
            var elem = e.target;
            var path = $(elem).attr("path");
            if (!path) {
              path = $(elem.parentNode).attr("path");
            }
            if (path && webCpu.cards && webCpu.cards.main) {
              webCpu.cards.main.task.switchModule(path);
            } else {
              var index = $(elem).attr("index");
              var pIndex = -1;
              var pSelector = $(elem).parent().parent();
              if (pSelector.hasClass("dropdown-menu")) {
                pIndex = pSelector.parent().attr("index");
              }
              var tItem = lMenu[index];
              var rItem = lMenu[index];
              if (pIndex !== -1) {
                tItem = lMenu[pIndex].children[index];
                rItem = lMenu[pIndex];
              }
              if (tItem && typeof (tItem.callback) === "function") {
                tItem.callback(rItem);
              }
            }
          }
          nav.appendTo(titleSelector);
          nav.find("li>a").on("click", function (e) {
            clickCallback(e, lMenu);
          });
        }
        if (data.titleData.rightMenu) {
          var rMenu = data.titleData.rightMenu;
          var nav = webCpu.CardItem.createMenuItem(rMenu, "dropdown-menu-right");
          nav.appendTo(titleSelector);
          nav.find("li>a").on("click", function (e) {
            var elem = e.target;
            var index = $(elem).attr("index");
            var pIndex = -1;
            var pSelector = $(elem).parent().parent();
            if (pSelector.hasClass("dropdown-menu")) {
              pIndex = pSelector.parent().attr("index");
            }
            var tItem = rMenu[index];
            var rItem = rMenu[index];
            if (pIndex !== -1) {
              tItem = rMenu[pIndex].children[index];
              rItem = rMenu[pIndex];
            }
            if (tItem && typeof (tItem.callback) === "function") {
              tItem.callback(rItem);
            }
          });
          nav.css({
            position: "absolute",
            right: "0px"
          });
        }
        if (data.titleData.style) {
          titleSelector.css(data.titleData.style);
        }

      } else if (data.breadcrumb) {
        titleSelector.html("");
        var tSelector = $('<nav aria-label="breadcrumb"></nav>');
        var bSelector = $('<ol class="breadcrumb" style="background: none; padding-left: 0px; margin: 0px;"></ol>');
        for (var k = 0; k < data.breadcrumb.length; k++) {
          var text = data.breadcrumb[k].text || data.breadcrumb[k];
          var item = $('<li class="breadcrumb-item">' + text + '</li>');
          if (data.breadcrumb[k].href) {
            var target = data.breadcrumb[k].target || "_blank";
            item = $('<li class="breadcrumb-item"><a target="' + target + '" href="' + data.breadcrumb[k].href + '">' + text + '</a></li>')
          }
          item.appendTo(bSelector);
          if (data.breadcrumbStyle) {
            item.css(data.breadcrumbStyle);
          }
        }
        bSelector.appendTo(tSelector);
        tSelector.appendTo(titleSelector);
      } else if (data.dialogData) {
        var temp = ("<div style='width: 100%; height: 100%; position: relative;'>\
                              <div class='titleInfoArea' style=''></div>\
                              <div class='leftEmptyArea' style=''></div>\
                              <div class='rightEmptyArea' style=''></div></div>");
        if (data.dialogData.titlePosition && data.dialogData.titlePosition === "left") {
          temp = ("<div style='width: 100%; height: 100%; position: relative;'>\
          <div class='titleInfoArea'  style=''></div>\
          <div class='rightEmptyArea' ></div></div>");
        }
        titleSelector.html(temp);
        titleSelector.find(".titleInfoArea").html(data.dialogData.title);
        if (data.dialogData.titleStyle) {
          titleSelector.find(".titleInfoArea").css(data.dialogData.titleStyle);
        }

        data.dialogData.closeType = data.dialogData.closeType || "";

        var leftSelector = titleSelector.find(".leftEmptyArea");
        var rightSelector = titleSelector.find(".rightEmptyArea");
       
        
        var closeSelector = leftSelector;
        var menuSelector = rightSelector;
        if (data.dialogData.closeType === "left") {
          // closeSelector.html("<i style='margin-left: 5px;' class='maskCloseBtn bi bi-x-circle' />");
          closeSelector.html("<i class='maskCloseBtn bi bi-x-circle' />");
        } else if (data.dialogData.closeType === "right") {
          closeSelector = rightSelector;
          menuSelector = leftSelector;
          closeSelector.html("<i class='maskCloseBtn bi bi-x-circle' />");
        } else if (data.dialogData.closeType === "back") {
          closeSelector.html("<i title='返回' class='maskCloseBtn bi bi-chevron-left' />");
        } else {
          closeSelector = rightSelector;
          menuSelector = leftSelector;
          closeSelector.html("<i class='maskCloseBtn bi bi-x-circle' />");
        }
        if (data.dialogData.disClosed) {
          closeSelector.hide();
        }
        if (data.dialogData.fullScreen) {
          titleSelector.parent().hide();
          $(container).children(".__CardItem_componentArea").css("padding-top", "0px");
        } else if (data.dialogData.titleStyle) {
          titleSelector.parent().css(data.dialogData.titleStyle);
        } else {

        }



        if (data.dialogData.menu) {
          webCpu.CardItem.updateMenuItems(menuSelector[0], data.dialogData.menu);
        } else {
          menuSelector.hide();
        }

        closeSelector.on("click", function () {
          if (data.dialogData.parentCard) {
            if (typeof (data.dialogData.closeCallback) === "function") {
              data.dialogData.closeCallback()
            }
            webCpu.CardItem.dismissMask(data.dialogData.parentCard);
            // delete data.dialogData.parentCard;
          }

        });

      } else {}

      if (data.titleStyle) {
        titleSelector.css(data.titleStyle);
      }
      titleSelector.parent().css("overflow", "visible")
    }

    if (!data.foot && !data.footMenu) {
      $(container).children(".CardItem_footArea").hide();
      $(container).children(".__CardItem_componentArea").css("padding-bottom", "0px");
    } else {
      var h = data.footHeight || "40px";
      $(container).children(".CardItem_footArea").css("height", h);
      $(container).children(".__CardItem_componentArea").css("padding-bottom", h);
      data.task.footArea = $(container).children(".CardItem_footArea")[0];
      if (data.footMenu && data.footMenu.constructor.name === "Array") {
        $(container).children(".CardItem_footArea").html("");
        for (var i = 0; i < data.footMenu.length; i++) {
          var menuItem = data.footMenu[i];
          var value = menuItem.text || menuItem;
          if (menuItem.data) {
            value = value.bindData(menuItem.data);
          }
          var item = $('<div style="float: left; height: 100%; width: ' + 100 / data.footMenu.length + '%; display: flex; flex-wrap: wrap; justify-content:center; align-items:center;">' + value + '</div>')
          item.appendTo($(container).children(".CardItem_footArea"));
          if (typeof (menuItem.action) === "function") {
            item.on("click", menuItem.action);
          }
        }
      }

      $(container).children(".CardItem_footArea").show();
    }


    if (data.footStyle) {
      $(container).children(".CardItem_footArea").css(data.footStyle);
    }
  }

  webCpu.CardItem.configDialog = function (mCard, title, data, param, style) {
    param = param || {}
    if (typeof (param) === "function") {
      param = {
        callback: param
      }
    }
    if (data && data.constructor.name === "Array") {
      var editorCard = {
        titleStyle: {
          "padding-left": "30px",
          "font-weight": 900,
          "color": "#000",
          "box-shadow": "0px 1px 0px #ddd",
          "background": "#f0f0f0"
        },
        className: "Editor",
        task: {

          option: data
        }
      }
    } else {
      var editorCard = data;
    }

    var str = "<div class='CardMask_configArea' style='float: left; position: relative; width: 100%; height: calc( 100% - 50px ); margin-top: 5px;'>**</div>\
               <div style='float: left; position: absolute; bottom: 10px; padding-right: 10px; text-align: right; margin-top: 10px; width: 100%;'>\
                <button style='margin-right: 10px;' class='btn btn-default btn-sm'>取消</button>\
                <button class='btn btn-primary btn-sm'>确认</button></div>"
    var _self = this;
    var ret = editorCard;
    webCpu.CardItem.htmlDialog(mCard, title, str, {
      callback: function (c) {
        var configArea = $(c).find(".CardMask_configArea")[0];
        webCpu.updateView(configArea, editorCard);
        $(c).find(".btn-primary").on("click", function () {
          if (typeof (param.callback) === "function") {
            param.callback();
          }
          _self.dismissMask(mCard);
        });
        $(c).find(".btn-default").on("click", function () {
          _self.dismissMask(mCard);
        });
      },
      closeCallback: param.closeCallback
    }, style);
    return ret;
  }

  webCpu.CardItem.confirmDialog = function (mCard, tips, param, style) {
    param = param || {}
    style = style || webCpu.config.confirmDialog || {
      width: "300px",
      height: "100px",
      paddingLeft: "20px",
      border: "solid 1px #aaa",
      borderRadius: "10px",
      float: "left",
      display: "inline-block",
      background: "rgba(250, 250, 250, 0.7)"
    }
    if (typeof (param) === "function") {
      param = {
        callback: param
      }
    }
    var str = "<div class='confirmDialogContainer' style='float: left; position: relative; width: 100%; margin-top: 10px;'>" + tips + "</div>\
               <div style='float: left; position: absolute; bottom: 10px; padding-right: 10px; text-align: right; margin-top: 10px; width: 100%;'>\
                <button style='margin-right: 10px;' class='btn btn-default btn-sm'>取消</button>\
                <button class='btn btn-primary btn-sm'>确认</button></div>"
    var _self = this;
    webCpu.CardItem.htmlDialog(mCard, "提示", str, {
      callback: function (c) {
        $(c).find(".btn-primary").on("click", function () {
          if (typeof (param.callback) === "function") {
            param.callback();
          }
          _self.dismissMask(mCard);
        });
        $(c).find(".btn-default").on("click", function () {
          _self.dismissMask(mCard);
        });
      },
      closeCallback: param.closeCallback
    }, style);
  }

  webCpu.CardItem.tipsDialog = function (mCard, tips, param, style) {
    param = param || {}
    var str = "<div style='float: left; position: relative; width: 100%; margin-top: 10px;'>" + tips + "</div>\
               <div style='float: left; position: absolute; bottom: 10px; padding-right: 10px; text-align: right; margin-top: 10px; width: 100%;'>\
               <button class='btn btn-primary btn-sm'>确认</button></div>"
    var _self = this;
    if (typeof (param) === "function") {
      param = {
        callback: param
      }
    }

    webCpu.CardItem.htmlDialog(mCard, "提示", str, {
      callback: function (c) {
        $(c).find(".btn-primary").on("click", function () {
          if (typeof (param.callback) === "function") {
            param.callback();
          }
          _self.dismissMask(mCard);
        });
      },
      closeCallback: param.closeCallback
    }, style);
  }

  webCpu.CardItem.iframeDialog = function (mCard, title, url, params, style) {
    var html = "<iframe style='border-radius: 3px;' frameborder=0 width='100%' height='100%' src='" + url + "'></iframe>";
    let tParams = {
      closeType: "back",
      renderMode: "stack",
    };
    webCpu.attachAttribute(params, tParams);
    this.htmlDialog(mCard, title, html, tParams, style);
  }

  webCpu.CardItem.htmlDialog = function (mCard, title, html, param, style) {
    style = style || {
      width: "100%",
      height: "100%",
      background: "rgba(255, 255, 255, 0.9)",
      border: "solid 1px #f8f8f8",
      boxShadow: "1px 1px 2px #000",
      color: "#ddd"
    };
    param = param || {}
    if (typeof (param) === "function") {
      param = {
        callback: param
      }
    }

    var card = {
      task: {
        template: html,
        promise: {
          afterRender: function (c, d, t) {
            if (typeof (param.callback) === "function") {
              param.callback(c, d, t);
            }
          }
        }
      }
    }
    param.title = title;
    this.renderCardDialog(mCard, card, param, style);
  }


  webCpu.CardItem.renderCardDialog = function (mCard, option, params, style, tStyle) {
    if (!mCard) {
      return false;
    }
    var task = mCard.task || mCard;
    params = params || {};

    if (task.childCard && params.renderMode === 'stack') {
      webCpu.CardItem.renderCardDialog(task.childCard, option, params, style, tStyle);
      return;
    }
    this.switchMask(mCard, "html", "");
    if (params) {
      params.parentCard = mCard;
    }
    if (params.style) {
      $(task.mask).css(params.style);
    }
    if (params.fullScreen) {
      WebTool.fullscreenDisplay(task.mask);
    }
    var tempCard = {
      title: params.title,
      titleStyle: params.titleStyle,
      titleHeight: 30,
      dialogData: params,
      foot: params.foot,
      cardName: params.dialogName,
      style: style,
      task: {
        style: tStyle || {},
        promise: {
          afterRender: function (c1, d1, t1) {
            webCpu.updateView(c1, option, params.callback);
            if (option.card && option.card.task) {
              option.card.task._parent = t1.card;
            }
          }
        }
      }
    }
    if (params.fullScreen) {
      setTimeout(function () {
        webCpu.updateView(task.mask, tempCard);
      }, 200);
    } else {
      webCpu.updateView(task.mask, tempCard);
    }

    task.childCard = tempCard;
    return tempCard;
  }

  webCpu.CardItem.moduleDialog = function (mCard, name, params) {
    var task = mCard.task || mCard;
    this.switchMask(mCard, "html", "");
    if (params) {
      params.parentCard = mCard;
    }
    webCpu.renderModule(task.mask, name, function (c, d, t) {
      var tempCard = {
        titleStyle: {
          "box-shadow": "0px -1px 0px inset #fff"
        },
        titleHeight: 50,
        dialogData: params,
        task: {
          data: d,
          promise: {
            afterRender: function (c1, d1, t1) {
              webCpu.addCardItem(c1, d1);
            }
          }
        }
      }
      t.data = tempCard;
      mCard.task.childCard = tempCard;
    });
  }

  webCpu.CardItem.confirmRequest = function (adapterItem, query, card, tips, callback) {
    webCpu.CardItem.htmlDialog(card, "提示", "<div style='padding: 20px; font-size: 20px;'>" + tips + "</div>", {
      foot: '<div><input class="btn btn-primary btn-sm" type="button" value="确认">\
                  <input class="btn btn-default btn-sm" type="button" value="取消"></div>',
      callback: function (c, d, t) {
        $(t.footArea).find(".btn-primary").on("click", function () {
          adapterItem(query, function (ret) {
            callback(ret);
          });
        });
        $(t.footArea).find(".btn").on("click", function () {
          webCpu.CardItem.dismissMask(card);
        });
      },
      titlePosition: "left",
      titleStyle: {
        "padding-left": "20px"
      }
    }, {
      border: "solid 1px #ddd",
      "border-radius": "5px",
      "background-color": "#fefefe",
      width: "450px",
      height: "200px"
    });
  }

  webCpu.CardItem.dialog = function (data, options, closePromise) {
    var options = options || {};
    webCpu.render("ModalDialog", function () {
      var task = {
        data: data
      }

      if (typeof (closePromise) === "function") {
        task.promise = {
          closeDialog: closePromise
        }
      }

      var t = {
        container: data.task.container
      };

      $("#tModalDialog").attr("state", "previewCardItem");
      webCpu["ModalDialog"].displayComponent(options.title || "", "CardItem", task, options);
      task.data.task.container = t.container;
      task = null;
    });
  }

  webCpu.CardItem.updateByRemoteData = function (data, url, query) {
    if (url) {
      data.task.url = url;
    }
    data.inactive = false;
    data.task.container.innerHTML = "";
    data.task.query = query || data.task.query;
    webCpu.render(data.className || "TemplateItem", data.task, data.componentPath || this.config.path);
  }

  webCpu.CardItem.getLabelWidth = function (str, fontSize, fontFamily) {
    let canvas = document.createElement("canvas");
    canvas.width = 0;
    canvas.height = 0;
    var ctx = canvas.getContext('2d');
    // 设置字体样式
    ctx.font = `${fontSize} ${fontFamily}`;
    // 测量字符串的宽度
    var textWidth = ctx.measureText(str).width;
    return textWidth;
  }

  webCpu.CardItem.addAnimation = function (elem, animation, duration) {
    if (!elem) {
      return false;
    }
    this.removeAnimationClass(elem);
    $(elem).addClass("animate__animated");
    let tClass = "animate__" + animation;
    $(elem).addClass(tClass);
    $(elem).addClass("animate__infinite");

    duration = duration || 3;
    if (typeof duration === "number") {
      let _self = this;
      setTimeout(function () {
        _self.removeAnimationClass(elem);
      }, duration * 1000);
    }
  }

  webCpu.CardItem.attachLabel = function (elem, html, style, animation, duration) {
    elem = elem || document.querySelector(".CardItem") || document.body;

    var box = document.createElement("div");
    box.setAttribute("class", "_label_box");
    box.style.width = "0px";
    box.style.height = "0px";
    elem.prepend(box);

    var content = document.createElement("div");
    // content.innerHTML = ;
    let tContent = document.createElement("div");
    tContent.innerHTML = html;
    content.appendChild(tContent);
    // tContent.style.backgroundColor = "rgba(245, 245, 245, 0.8)";
    style = style || {};
    webCpu.attachAttribute(style, tContent.style);
    tContent.setAttribute("class", `animate__animated animate__${animation} animate__infinite`);
    box.appendChild(content);

    box.style.position = "absolute";
    box.style.zIndex = style.zIndex || 9999;
    content.style.position = "relative";
    box.style.display = "inline-block";
    content.style.display = "inline-block";
  
    let x = Math.max(elem.getBoundingClientRect().left - content.getBoundingClientRect().left, 0)
    box.style.left = x + "px";
    let y = Math.max(elem.getBoundingClientRect().top - content.getBoundingClientRect().top, 0);
    box.style.top = y + "px";

    duration = duration || 3;
    setTimeout(function () {
      elem.removeChild(box);
    }, duration * 1000);
    return content;
  }

  webCpu.CardItem.triggerTimeEvent = function (item, elem) {
    let task = elem.task || elem;
    if (task.container) {
      elem = task.container;
    }

    elem = elem || document.body;
    if (typeof item.callback === "function") {
      try {
        item.callback(task, task.vueItem);
      } catch (e) {
        console.log("timeEvents: ", i + " " + e);
      }
      console.log(`#timeEvent_${item.offset}_callback`, item);
    } else if (item.animation) {
      if (item.animation.type && typeof (this[item.animation.type]) === "function") {
        this[item.animation.type](
          item.animation,
          elem,
          item.repeat
        );
      } else {
        this.setAnimateStyle(
          item.animation,
          elem,
          item.repeat
        );
      }
      console.log(`#timeEvent_${item.offset}_animation`, item);
    } else if (item.event) {
      this.triggerEvent(item, elem);
      console.log(`#timeEvent_${item.offset}_event`, item);
    }

    if (item.timer !== undefined) {
      item.gap = new Date().getTime() - item.start;
      clearTimeout(item.timer);
      item.timer = null;
    }
  }

  webCpu.CardItem.initTimeEvent = function (elem, arr, _parent) {
    _parent = _parent || this;
    //清除所有定时器
    if (_parent.timeEvents && _parent.timeEvents.length !== 0) {
      _parent.timeEvents.map(item => {
        if (item.timer) {
          clearTimeout(item.timer);
        }
        return item;
      })
    }
    let _self = this;
    _parent.timeEvents = arr;
    this.eventCallback = {};
    for (let i = 0; i < arr.length; i++) {
      console.log(`___timeEvent_${arr[i].offset}`, arr[i]);
      arr[i].start = new Date().getTime();
      let t = arr[i].offset;
      let d = arr[i];
      let item = d.animation || d.event;
      let objectElement = _self.getAnimateElement(item, elem);
      let selector = $(objectElement);
      if (d.animation && d.animation.type === "typingOutput" && selector && selector.length !== 0) {
        selector.attr("textInfo", selector.text());
        selector.html("");
        selector.css({
          visibility: "hidden"
        })
      }
      if (t) {
        this.eventCallback['setupTimer' + i] = function () {
          d.timer = setTimeout(function () {
            let item = d.animation || d.event;
            let elemObj = _self.getAnimateElement(item, elem);
            let kArr = webCpu.CardItem.keyArray.concat(["showtips", "showattention"]);
            if (!elemObj && item && kArr.indexOf(item.type.toLocaleLowerCase()) === -1) {
              console.warn("设置动效失败", d.offset, item.object);
              return false;
            }
            _self.triggerTimeEvent(d, elem);
          }, t * 1000);
        }
        this.eventCallback['setupTimer' + i]();
      } else {
        if (!objectElement && item) {
          console.warn("设置动效失败", d.offset, item.object);
        }
        _self.triggerTimeEvent(d, elem);
      }
    }
  }
  webCpu.CardItem.keyArray = ["keydown", "keyup", "keypress"];
  webCpu.CardItem.mouseArray = ["mouseleave", "mouseenter", "mousedown", "mouseup"];
  webCpu.CardItem.tipsStyle = {
    padding: "10px",
    borderRadius: "3px",
    backgroundColor: "rgba(15, 15, 15, 0.8)",
    border: "solid 1px #666",
    color: "#f2f2f2",
    fontSize: "30px",
    minWidth: "100px",
    maxWidth: "500px",
    height: "auto"
  }

  webCpu.CardItem.triggerEvent = function (obj, container) {
    let item = obj.event;
    let elem = null;
    let keyArray = webCpu.CardItem.keyArray.concat(["showtips", "showattention"]);
    let mouseArray = webCpu.CardItem.keyArray;
    let selector = $(container).find(item.object[0]);
    if ((selector && selector.length !== 0) || keyArray.indexOf(item.type.toLocaleLowerCase()) !== -1) {
      if (keyArray.indexOf(item.type) === -1) {
        item.object[1] = item.object[1] || 1;
        elem = selector[(item.object[1] - 1) || 0];
      }
    } else {
      console.warn("事件触发无效", obj.offset, item.object);
      return false;
    }

    elem = elem || container;

    try {
      if (item.type) {
        if (item.type === "showTips" || item.type === "showAttention") {
          let tStyle = webCpu.CardItem.tipsStyle;
          tStyle = WebTool.copyObject(tStyle);
          let root = container.getBoundingClientRect();
          let tBox = root;
          if (elem) {
            tBox = elem.getBoundingClientRect();
          }
          let gapX = tBox.x - root.x;
          let gapY = tBox.y - root.y;
          let radio = 1;
          let funcCallStr = window.getComputedStyle(container).transform;
          const regex = /\(([^)]+)\)/;
          const match = funcCallStr.match(regex);
          if (match && match[1]) {
            // 分割参数字符串，并获取第一个参数
            const args = match[1].split(',');
            radio = Number(args[0].trim());
          }
          gapX = gapX / radio;
          gapY = gapY / radio;

          tStyle["margin-left"] = (item.xPos || 0) + gapX + "px";
          tStyle["margin-top"] = (item.yPos || 0) + gapY + "px";

          if (item.type === "showAttention") {
            item.tips = "";
            webCpu.attachAttribute({
              width: "34px",
              height: "34px",
              padding: "2px",
              background: "radial-gradient(circle at 50% 50%, #ff00ff, #000000)",
              borderRadius: "100%",
              zIndex: 100000
            }, tStyle);
            tStyle["minWidth"] = "";
            tStyle["maxHeight"] = "";
          } else {
            var computedStyle = window.getComputedStyle(document.body);
            // 获取fontFamily属性
            var fontFamily = computedStyle.fontFamily;
            tStyle.width = this.getLabelWidth(item.tips, tStyle.fontSize || "30px", fontFamily) + 30 + "px";
          }
          elem = container;
          let labelItem = this.attachLabel(elem, item.tips || "", tStyle, item.animation, item.duration);
        } else if (item.type === "inputText") {
          // elem.value = item.text;
          this.typingInput(elem, item.text, 2);
        } else if (item.type === "addAnimation") {
          this.addAnimation(elem, item.animation, item.duration);
        } else if (item.type === "hover") {
          var event = new MouseEvent('mouseenter', {
            'bubbles': true,
            'cancelable': true,
            'clientX': 2,
            'clientY': 2
          });
          elem.dispatchEvent(event);
        } else if (mouseArray.indexOf(item.type) !== -1) {
          var event = new MouseEvent(item.type, {
            'bubbles': true,
            'cancelable': true,
            // 可以设置模拟的鼠标位置
            'clientX': 2,
            'clientY': 2
          });
          elem.dispatchEvent(event);
        } else if (keyArray.indexOf(item.type) !== -1) {
          // 创建键盘事件
          var event = new KeyboardEvent(item.type, {
            bubbles: item.object.bubbles || true,
            cancelable: item.object.cancelable || true,
            view: window,
            char: item.object.char || '',
            code: item.object.code || '',
            key: item.object.key || '',
            location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD
          });
          // 触发键盘事件
          document.dispatchEvent(event);
        } else if (item.type && typeof $(elem)[item.type] === "function") {
          $(elem)[item.type]();
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  webCpu.CardItem.typingInput = function (elem, text, duration) {
    duration = duration || 3;
    clearInterval(webCpu.CardItem.typingInterval);
    if (text && text.length !== 0) {
      let gap = Math.ceil(duration || 3) * 1000 / text.length || 10;
      let i = 1;
      webCpu.CardItem.typingInterval = setInterval(function () {
        elem.value = text.substring(0, i);
        if (i > text.length) {
          clearInterval(webCpu.CardItem.typingInterval);
        }
        i++;
      }, gap);
    }
  }

  webCpu.CardItem.typingOutput = function (item, container) {
    let elem = this.getAnimateElement(item, container);
    if (!elem) {
      console.warn("选择器无效", item.object);
      return false;
    }
    let selector = $(elem);
    let text = selector.attr("textInfo") || selector.html();
    clearInterval(webCpu.CardItem.typingInterval);
    selector.css({
      visibility: "visible"
    })
    if (text && text.length !== 0) {
      let gap = Math.ceil(item.duration || 3) * 1000 / text.length || 10;
      let i = 1;
      webCpu.CardItem.typingInterval = setInterval(function () {
        selector.html(text.substring(0, i));
        if (i > text.length) {
          clearInterval(webCpu.CardItem.typingInterval);
        }
        i++;
      }, gap);
    }
  }

  webCpu.CardItem.getAnimateElement = function (item, container) {
    let task = container.task || container;
    if (task.container) {
      container = task.container;
    }
    container = container || document.body;

    if (!item || item.object === undefined) {
      return false;
    }
    let elem = null;
    if (typeof item.object === "number") {
      item.object = [".el-card", item.object];
    }
    let selector = $(container).find(item.object[0]);
    if (selector.length === 0) {
      selector = $(document.body).find(item.object[0]);
    }
    if (selector && selector.length !== 0) {
      item.object[1] = item.object[1] || 1;
      elem = selector[(item.object[1] - 1) || 0];
    } else {

    }
    return elem;
  }

  webCpu.CardItem.setAnimateStyle = function (item, container, repeat) {
    let elem = this.getAnimateElement(item, container);
    if (!elem) {
      return false;
    }
    //删除所有animate__为前缀的class
    this.removeAnimationClass(elem);
    $(elem).css({
      visibility: "visible"
    })
    let text = elem.getAttribute("textInfo");
    if (text) {
      $(elem).html(text);
    }
    if (item.type) {
      $(elem).addClass("animate__animated");
      let tClass = "animate__" + item.type;
      $(elem).addClass(tClass);
    }
    if (item.duration) {
      if (typeof item.duration === "number") {
        item.duration = item.duration + "s";
      }
      $(elem).addClass("animate__" + item.duration);
    }

    if ("infinite" !== repeat) {
      $(elem).addClass("animate__repeat-" + repeat);
    } else {
      $(elem).addClass("animate__" + repeat);
    }

  }
  webCpu.CardItem.removeAnimationClass = function (elem) {
    $(elem).removeClass(function (index, className) {
      return (className.match(/\banimate__.*/g) || []).join(" ");
    });
  }

  webCpu.CardItem.Pagination = function (container, total, number, current, callback, flag) {
    this.container = container;
    this.total = total || 0;
    if (flag) {
      this.total = 100000000;
    }
    this.size = number || 10;
    this.flag = flag;
    this.count = Math.ceil(this.total / (this.size));
    this.current = current || 1;
    this.container.innerHTML = "";
    this.callback = callback;
    var nav = document.createElement("nav");
    this.container.appendChild(nav);
    this.nav = nav;
    $(nav).css({
      "line-height": "40px",
      "padding-left": "0px"
    })
    this.ul = document.createElement("ul");
    this.ul.setAttribute("class", "pagination pagination-sm");
    var label = document.createElement("div");
    // if (this.count < 1000) {
    //   label.innerHTML = '<label class="totalItemInfo" style="margin-bottom: 0px;"> 共: <span class="countValue">' + total + '</span>条</label>\
    //                     <span style="margin-left: 5px; display: inline-block; vertical-align: middle;"  class="pageNumberArea"></span>\
    //                     <label class="goToPageItem" style="margin-right: 5px; margin-bottom: 0px;"><span>第</span>\
    //                     <select value=' + current + ' class="pageNumber form-control form-control-sm" style="width: auto;display: inline-block; color: #999; padding: 0px 5px;"></select>页</label> \
    //                     <label style="margin-bottom: 0px;"><span>每页</span><select value=' + number + ' class="pageSize form-control form-control-sm" style="width: auto;display: inline-block; color: #999; padding: 0px 5px;"></select>条</label>'

    // } else {
    label.innerHTML = '<label class="totalItemInfo" > 共: <span class="countValue">' + total + '</span>条</label>\
                        <span style="margin-left: 5px; display: inline-block; vertical-align: middle;" class="pageNumberArea"></span>\
                        <label class="goToPageItem" style="margin-right: 5px;"><span>前往</span>\
                        <input value=' + (this.current) + ' class="pageNumber form-control form-control-sm" style="transform: scale(0.8); text-align: center; font-size: 14px; display: inline-block; color: #999; width: 70px;"/>页 \
                        <label><span>每页</span><select value=' + number + ' class="pageSize form-control form-control-sm" style="transform: scale(0.8); text-align: center; font-size: 14px; width: 70px; display: inline-block; color: #999;"></select>条</label>'
    // }

    label.setAttribute("class", "DataTable_goBtnArea");
    label.style.display = "inline-block";
    label.style.verticalAlign = "middle";
    label.style.float = "left";
    this.ul.style.display = "inline-block";
    this.ul.style.margin = "0px";
    this.ul.style.verticalAlign = "middle";
    this.ul.style.float = "left";
    // nav.appendChild(this.ul);
    nav.appendChild(label);
    label.querySelector(".pageNumberArea").appendChild(this.ul);

    this.goBtnArea = label;
    var select = $(label).find("select.pageSize");
    var sizes = [10, 20, 50, 100];
    for (var i = 0; i < sizes.length; i++) {
      $("<option value=" + Number(sizes[i]) + ">" + sizes[i] + "</option>").appendTo(select);
    }
    if (!this.flag) {
      if (this.current > this.count) {
        this.current = this.count;
      }
      if (this.count < 1000) {
        this.initPageSelect();
      }
    } else {
      $(label).find(".goToPageItem").hide();
      $(label).find(".totalItemInfo").hide();
    }

    this.updatePages(this.current, this.size, this.flag);
  }
  webCpu.CardItem.Pagination.prototype.initPageSelect = function () {
    var select = $(this.nav).find("select.pageNumber");
    select.html("");
    for (var i = 0; i < this.count; i++) {
      $("<option>" + (i + 1) + "</option>").appendTo(select);
    }
  }

  webCpu.CardItem.Pagination.prototype.switchNextPage = function (flag) {
    var p = this.current + 1;
    if (p > Math.ceil(this.total / this.size) - 1) {
      if (typeof (this.callback) === "function") {
        var size = this.size || 10;
        this.callback(p, size, flag);
        this.updatePages(p, size, this.flag);
      }
    }
  }

  webCpu.CardItem.Pagination.prototype.updatePages = function (n, size, flag) {
    n = Number(n) || 0;
    this.size = size;
    this.count = Math.ceil(this.total / (this.size));
    this.initPageSelect();
    if (n < this.count + 1) {
      this.ul.innerHTML = "";
      this.current = n;

      if (!flag) {
        if (this.current < 5) {
          $(this.ul).append("<li  class='page-item active'><a class='page-link'>" + (this.current) + "</a></li>");
          for (var i = 1; i < this.current; i++) {
            $(this.ul).prepend("<li class='page-item'><a class='page-link'>" + (this.current - i) + "</a></li>");
          }
          if (this.current !== 1) {
            $(this.ul).prepend("<li class='page-item lastPageBtn'><a class='page-link'><i class='bi bi-chevron-left'></i></a></li>");
          } else {
            $(this.ul).prepend("<li class='page-item lastPageBtn disabled'><a class='page-link'><i class='bi bi-chevron-left'></i></a></li>");
          }
        } else {
          $(this.ul).prepend("<li class='page-item'><a class='page-link'>" + (this.current - 1) + "</a></li>");
          $(this.ul).prepend("<li class='page-item'><a class='page-link'>" + (this.current - 2) + "</a></li>");

          $(this.ul).prepend("<li class='page-item'><a class='page-link'>...</a></li>");

          $(this.ul).prepend("<li class='page-item'><a class='page-link'>1</a></li>");
          $(this.ul).prepend("<li class='lastPageBtn'><a class='page-link'><i class='bi bi-chevron-left'></i></a></li>");
        }

        if (this.count - this.current < 4) {
          for (var i = 1; i < this.count - this.current + 1; i++) {
            $(this.ul).append("<li class='page-item'><a class='page-link'>" + (this.current + i) + "</a></li>");
          }
          if (this.current !== this.count) {
            $(this.ul).append("<li class='page-item nextPageBtn'><a class='page-link'><i class='bi bi-chevron-right'></i></a></li>");
          } else {
            $(this.ul).append("<li class='page-item nextPageBtn disabled'><a class='page-link'><i class='bi bi-chevron-right'></i></a></li>");
          }
        } else {
          $(this.ul).append("<li class='page-item'><a class='page-link'>" + (this.current + 1) + "</a></li>");
          $(this.ul).append("<li class='page-item'><a class='page-link'>" + (this.current + 2) + "</a></li>");
          $(this.ul).append("<li class='page-item'><a class='page-link'>...</a></li>");
          $(this.ul).append("<li class='page-item'><a class='page-link'>" + this.count + "</a></li>");
          $(this.ul).append("<li class='page-item nextPageBtn'><a class='page-link'><i class='bi bi-chevron-right'></i></a></li>");
        }
      } else {
        $(this.ul).prepend("<li class='page-item lastPageBtn'><a class='page-link'><i class='bi bi-chevron-left'></i></a></li>");
        $(this.ul).append("<li class='page-item nextPageBtn'><a class='page-link'><i class='bi bi-chevron-right'></i></a></li>");
      }


      var _self = this;
      $(this.container).find("li>a").click(function () {
        var p = Number(this.innerHTML);
        if ($(this.parentElement).hasClass("nextPageBtn")) {
          p = _self.current + 1;
        } else if ($(this.parentElement).hasClass("lastPageBtn")) {
          p = _self.current - 1;
        } else if (this.innerHTML == "...") {
          p = (Number(this.parentNode.previousSibling.innerText) || 0) + 1;
        } else {}

        if (typeof (_self.callback) === "function") {
          var size = Number($(_self.container).find("select.pageSize").val()) || 10;
          _self.callback(p, size);
          _self.updatePages(p, size, _self.flag);
        }

      });

      $(this.container).find(".pageNumber").val(n + "");

      $(this.container).find("select.pageNumber").on("change", function () {
        var value = Number($(this).val());
        var size = Number($(_self.container).find("select.pageSize").val()) || 10;
        if (value !== NaN && value < _self.count + 1 && value > 0) {
          _self.callback(value, size);
          _self.updatePages(value, size, _self.flag);
        }
      });

      $(this.container).find("input.pageNumber").on("change", function () {
        var value = Number($(this).val());
        if (!value) {
          $(this).val(_self.current);
          return false;
        }
        var size = Number($(_self.container).find("select.pageSize").val()) || 10;
        if (value !== NaN && value < _self.count + 1 && value > 0) {
          _self.callback(value, size);
          _self.updatePages(value, size, _self.flag);
        }
      });

      $(this.container).find("select.pageSize").val(Number(size));
      $(this.container).find("select.pageSize").on("change", function () {
        var value = Number($(this).val());
        _self.callback(1, value);
        _self.updatePages(1, value, _self.flag);
      });
    }
  }



})();