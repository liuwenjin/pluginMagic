webCpu.regComponent("ElementVueItem", {
  css: {
    elementui: "index.css",
    display: "display.css",
  },
  script: "script.js",
}, function (container, data, task) {
  webCpu.mitt = webCpu.mitt || new mitt();

  function updateTempData(selector, tempData) {
    tempData = tempData || [];
    selector.html(function (html, index) {
      return tempData[index] || html
    });
  }
  var _updateContent = function (task) {
    let elem = task.container;
    task.promise = task.promise || {};

    var obj = {};
    var tData = null;
    tData = webCpu.renderHTML(elem, task.html || task.template, "vuejs");
   
    webCpu.attachAttribute(tData, obj);

    if (typeof obj.data === "function") {
      task.vueData = obj.data() || {};
    } else {
      task.vueData = task.vueData || {}
    }
    // task.data.appMap = task.appMap || task.data.appMap;
    webCpu.attachAttribute(task.data, task.vueData);

    if (task.data) {
      obj.data = function () {
        task.vueData.appMap = task.appMap || task.vueData.appMap;
        return task.vueData;
      }
    }

    webCpu.attachAttribute(task.promise, obj);

    obj.directive = obj.directive || {};
    obj.methods = obj.methods || {};
    obj.computed = obj.computed || {};
    obj.watch = obj.watch || {};
    var tMethods = task.methods || {};
    webCpu.attachAttribute(tMethods, obj.methods);

    var computed = task.computed || {};
    webCpu.attachAttribute(computed, obj.computed);

    var watch = task.watch || {};
    webCpu.attachAttribute(watch, obj.watch);

    var directive = task.directive || {};
    webCpu.attachAttribute(directive, obj.directive);
    if(obj._mountedCallback !== "inited") {
      obj.methods._mountedCallback = obj.mounted || function () {};
    }

    obj.mounted = function () {
      if (typeof this._mountedCallback === "function") {
        this._mountedCallback();
        this._mountedCallback = "inited";
        if (task.cardBody.parentNode && task.cardBody.parentNode.getAttribute("type") === "module") {
          return false;
        }
        updateTempData($(container).find("[editable='true']"), task.tempData);
        webCpu.excuteTasks(container, task.appMap || task.appData, task.routeView);
      }
    }


    const app = Vue.createApp(obj);

    app.directive('card', {
      data() {
        return {
          appMap: task.appMap || {}
        }
      },
      mounted(el) {
        console.log("v-card", this);
        if (el.offsetWidth === 0 || el.offsetHeight === 0) {
          return false;
        }
        let cardName = el.getAttribute("cardName");
        webCpu.appMap = webCpu.appMap || {};
        task.appMap = task.appMap || {};
        let app = task.appMap[cardName] || webCpu.appMap[cardName];
        if (cardName && app) {
          webCpu.updateView(el, app);
        } else {
          console.log("initCard error", el, cardName);
          el.innerHTML = "initCard error";
        }
      }
    })

    app.use(ElementPlus, {
      locale: ElementPlusLocaleZhCn,
    });

    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }

    task.vueItem = app.mount(elem);
    
    if (task.vueItem) {
      task.vueItem._parent = task;
      task.vueItem.mitt = webCpu.mitt;
    }

  }


  if (data && data.cardData) {
    task.cards = task.cards || {};
    data.cardData.map(function (item) {
      if (item.cardName) {
        task.cards[item.cardName] = item;
      }
      return item;
    });
  }
  task.template = task.template || "";
  // try {
  //   task.template = unescape(task.template);
  // } catch (e) {

  // }

  if (task.template && task.template && -1 != task.template.search("<")) {
    //update content
    _updateContent(task);

  } else if (task.template) {
    if (task.promise && task.promise.afterRender) {
      // debugger
      task._afterRender = task.promise.afterRender;
      task.promise.afterRender = null;
    }

    // if (location.origin === 'file://' && task.template.search(/^http/) === -1) {
    //   let prefix = webCpu.componentPath.replace("transweb/components", "");
    //   task.template = prefix + task.template;
    // }

    let re = `^${location.origin}`;
    if (task.template && task.template.search(/^http/) !== -1 && task.tProxy === undefined && task.template.search(re) === -1) {
      task.tProxy = true;
    } else if (task.template.search(/^http/) === -1) {
      task.tProxy = false
    }
    var htmlFetch = new WebRequest(task.template, "GET", "html/text", null, task.tProxy);
    htmlFetch({}, function (str) {
      task.html = str;
      if (!container) {
        return false;
      }

      if (typeof (task._afterRender) === "function") {
        task.promise.afterRender = task._afterRender;
      }
      //update content
      _updateContent(task);
      // webCpu.excuteTasks(container, task.appMap || task.appData, task.routeView);
      if (typeof (task.promise.afterRender) === "function") {
        task.promise.afterRender(container, data, task);
      }

    });
  } else {

  }

});