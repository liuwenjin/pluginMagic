webCpu.regComponent("TemplateItem", {
  script: {
    aframe: "aframe.min.js",
  },
  css: ".TemplateItem .a-enter-vr-button { display: none; }"

}, function (container, data, task) {
  if (data && data.cardData) {
    task.cards = task.cards || {};
    data.cardData.map(function (item) {
      if (item.cardName) {
        task.cards[item.cardName] = item;
      }
      return item;
    });
  }

  var initEvent = function (task) {
    var methods = task.methods || {};
    var eventMap = task.eventMap || {};
    for (var k in eventMap) {
      var arr = eventMap[k] || {};
      if (arr.constructor.name !== "Array") {
        arr = [arr];
      }
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (item.event && item.callback) {
          var selector = $(task.container).find("[ref=" + k + "]");
          if (selector.length !== 0) {
            if (typeof item.callback === "function") {
              selector.on(item.event, function (e) {
                item.callback(e, task);
              });
            } else if (typeof methods[item.callback] === "function") {
              selector.on(item.event, function (e) {
                methods[item.callback](e, task);
              });
            } else {}
          }
        }
      }
    }
  }

  var updateContent = function (task, str) {
    let dsl = webCpu.getDslData(str) || {};
    // webCpu.attachAttribute(dsl, task);
    if (!dsl.dependency) {
      webCpu.attachAttribute(dsl, task);
      webCpu.renderHTML(task.container, str);
      updateTempData($(task.container).find("[editable='true']"), task.tempData);
      initEvent(task);
      if (!(task.cardBody.parentNode && task.cardBody.parentNode.getAttribute("type") === "module")) {
        webCpu.excuteTasks(container, task.appMap || task.appData, task.routeView);
      }
    } else {
      let tModule = 'm_' + (task.cardName || Math.random());
      
      webCpu.initModule(dsl.dependency || {}, tModule, function (c1, d1, t1) {
        // init tModule success;
        
      });
      let promise = dsl.promise || {};
        var myCard = {
          className: tModule,
          cardName: tModule,
          task: {
            promise: {
              beforeRender: promise.beforeRender,
              afterRender: function (c, d, t) {
                
                console.log(tModule)
                let dsl = webCpu.renderHTML(c, str.bindData(data)) || {};
                updateTempData($(c).find("[editable='true']"), task.tempData);
                initEvent(task);
                if (!(task.cardBody.parentNode && task.cardBody.parentNode.getAttribute("type") === "module")) {
                  webCpu.excuteTasks(c, task.appMap || task.appData, task.routeView);
                }
                if (typeof promise.afterRender === "function") {
                  promise.afterRender(c, d, t);
                }
              }
            }
          }
        }

        webCpu.updateView(task.container, myCard);

    }
  }

  task.template = task.template || "";

  function updateTempData(selector, tempData) {
    tempData = tempData || [];
    selector.html(function (index, html) {
      if (tempData[index]) {
        html = tempData[index].label || tempData[index].html || tempData[index] || html
      }
      return html;
    });
  }

  if (task.template && task.template && -1 != task.template.search("<")) {
    updateContent(task, task.template);
  } else if (task.template) {
    if (task.promise && task.promise.afterRender) {
      var afterRender = task.promise.afterRender;
      task.promise.afterRender = null;
    }
    var htmlFetch = new WebRequest(task.template, "GET", "text", null, task.tProxy);
    htmlFetch({}, function (str) {
      task.html = str;
      if (!container) {
        return false;
      }
      updateContent(task, str);

      if (typeof (afterRender) === "function") {
        afterRender(container, data, task);
        task.promise.afterRender = afterRender;
      }

    }, "html/text");
  } else {

  }

});