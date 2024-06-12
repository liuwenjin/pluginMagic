/*! webCpu.js 2017-11-26 20:19:15 */
var WebAdapter = {};
WebAdapter.load = function (url, callback, shadowDom, type) {
  var script = document.createElement('script');
  script.setAttribute('src', url);
  script.setAttribute('charset', "utf-8");
  script.setAttribute("type", type || "application/javascript");
  // script.setAttribute("type", "module");
  if (script.readyState) {
    WebTool.bind(script, "readystatechange", function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        if (typeof (callback) === "function") {
          callback();
        }
      }
    });
  } else {
    WebTool.bind(script, "load", function () {
      if (typeof (callback) === "function") {
        callback();
      }
    });
  }
  var _head = document.getElementsByTagName("head")[0];
  if (shadowDom && shadowDom.appendChild) {
    _head = shadowDom
  }
  _head.appendChild(script);
  return script;
}

WebAdapter.jsonp = function (url, run) {
  var k = WebTool.urlQuery(url, "callback");
  var callBack = k || 'webAdapter_callBack_' + (new Date()).getTime();
  if (typeof (run) === "function") {
    window[callBack] = run;
  } else {
    window[callBack] = function (data) {}
  }
  if (!k) {
    if (url.indexOf("?") === -1) {
      url += "?callback=" + callBack;
    } else {
      url += "&callback=" + callBack;
    }
  }

  if (url.search(/^data:/) !== -1) {
    url = url.split("?")[0];
  }

  var script = document.getElementById("webAdapterCallBackScript");
  if (script) {
    script.parentNode.removeChild(script);
  }
  script = document.createElement('script');
  script.id = "webAdapterCallBackScript";
  if (url.search(/\(function/) === 0) {
    script.innerHTML = url;
  } else {
    script.setAttribute('src', url);
  }
  script.setAttribute('charset', "utf-8");
  script.setAttribute("type", "application/javascript");
  var _head = document.getElementsByTagName("head")[0];
  _head.appendChild(script);

  if (script) {
    script.parentNode.removeChild(script);
  }
}

WebAdapter.loadCSS = function (url, shadowDom) {
  if (url.search("{") === -1) {
    var cssLink = document.createElement('link');
    cssLink.setAttribute('type', 'text/css');
    cssLink.setAttribute('class', "TransWebCss");
    cssLink.setAttribute('rel', 'stylesheet');
    cssLink.setAttribute('href', url);
  } else {
    var cssLink = document.createElement("style");
    cssLink.innerHTML = url;
  }
  var _head = document.getElementsByTagName("head")[0];
  if (shadowDom && shadowDom.appendChild) {
    _head = shadowDom;
  }
  _head.appendChild(cssLink);
  return cssLink;
}

WebAdapter.report = function (url, params) {
  var url = WebTool.attachParams(url, params);
  var img = document.createElement("img");
  img.src = url;
}

WebAdapter.request = function (url, type, query, callback, options, params) {
  if (!url) {
    return false;
  }
  options = options || {};
  options.params = params || options.params;
  if (options.params) {
    url = url.bindData(options.params);
  }

  if (type !== "_jsonp") {
    if (typeof options === "string") {
      options = {
        dataType: options
      }
    }
    var request = new WebRequest(url, type, options.dataType, options.contentType, options.proxy);
    request(query, function (data) {
      if (typeof (callback) === "function") {
        callback(data);
      }
    }, params);
  } else {
    this.loadCardData(url, query, callback);
  }
}

WebAdapter.loadCardData = function (url, key, myCallback) {
  var t = url.split("?")[0]
  let id = MurmurHash.rule(t);
  let aItem = {
    id: id,
    url: url,
    key: key,
    callback: myCallback
  };
  this.jsonpMap = this.jsonpMap || {};
  this.jsonpMap[key] = this.jsonpMap[key] || {};
  this.jsonpMap[key][id] = aItem;

  this.jsonpCallback = this.jsonpCallback || {};
  this.jsonpCallback[key + id] = this.jsonpCallback[key + id] || [];
  this.jsonpCallback[key + id].push(aItem);
  var _self = this;
  window[key] = function (d) {
    d.appUrl = url.split("?")[0];
    let item = _self.jsonpMap[key][id];
    if (item && item.id === id && _self.jsonpMap[key][id] && typeof item.callback === "function") {
      item.callback(d);
    }
    let index = _self.jsonpCallback[key + id].indexOf(item);
    _self.jsonpCallback[key + id].splice(index, 1);
    delete _self.jsonpMap[key][id];

    if (_self.jsonpCallback[key + id].length !== 0) {
      item = _self.jsonpCallback[key + id].pop();
      _self.loadCardData(item.url, item.key, item.callback);
    }
  };

  var elem = document.getElementById(id);
  if (elem) {
    elem.parentNode.removeChild(elem);
  }
  var s = document.createElement("script");
  s.id = id;
  if (url.search(/^data:/) !== -1) {
    s.src = url;
  } else {
    s.src = WebTool.attachParams(url, {
      callback: key
    });
  }
  document.head.appendChild(s);
}

var WebRequest = function (url, type, options, contentType, proxy, query) {
  var type = type || "jsonp";
  options = options || {};
  if (typeof options === "string") {
    options = {
      dataType: options
    }
  }
  options.contentType = options.contentType || contentType;
  options.proxy = options.proxy || proxy;
  options.query = options.query || query;
  if (type === "jsonp" || type === "noEcho" || type === "_jsonp") {
    return (new CustomInterface(url, type, options));
  } else {
    return (new AjaxInterface(url, type, options));
  }
}

var CustomInterface = function (url, type, options) {
  this.options = {};
  this.type = type || "jsonp";
  this.query = options.query || {};
  for (var k in options) {
    if (options[k] === 1) {
      this.options[k] = 1;
    }
  }
  this.url = url;
  return this.extend();
}

CustomInterface.prototype.extend = function () {
  var _this = this;
  return (function (data, func, params) {
    if (_this.check(_this.options, data)) {
      var url = _this.url;
      if (params) {
        url = url.bindData(params);
      }
      if (typeof _this.query === "string") {
        url = WebTool.attachParams(url, {
          callback: _this.query
        });
      }
      if (_this.type === "jsonp" || _this.type === "_jsonp") {
        url = WebTool.attachParams(url, data);
        WebAdapter.jsonp(url, func);
      } else {
        WebAdapter.report(url, data);
      }
    }
  })
}

CustomInterface.prototype.check = function (options, params) {
  var ret = true;
  for (var k in options) {
    if (!params || !params[k]) {
      ret = false;
      console.log("Failed, miss the param of '" + k + "'.");
      break;
    }
  }
  return ret;
}

var BackInterface = function (url, callback) {
  var _self = this;
  WebAdapter.request(url, "get", null, function (data) {
    _self.data = data;
    var data = data.data;
    for (var k in data) {
      _self[k] = (function () {
        var m = data[k].method;
        var url = data[k].url;
        var fn = function (param, callback, dataType) {
          $[m](url, param, callback, dataType);
        }
        return fn;
      })();
    };
    if (typeof (callback) === "function") {
      callback(_self);
    }
  });
}
BackInterface.prototype.init = function (data) {
  this.data = data;
  for (var k in data) {
    this[k] = (function () {
      var m = data[k].method;
      var url = data[k].url;
      var fn = function (param, callback, dataType) {
        WebAdapter.request(url, m, param, callback);
      }
      return fn;
    })();
  };
}


var AjaxInterface = function (url, type, options) {
  this.url = url;
  this.contentType = options.contentType;
  this.type = type;
  this.dataType = options.dataType;
  this.proxy = options.proxy;
  this.authorization = options.authorization;
  if (this.proxy === true) {
    let arr = this.url.match(/https?:\/\/([^/]+)\//i);
    if (arr && arr[0]) {
      this.proxy = arr[0] + "proxy.html";
      this.url = url.replace(arr[0], "");
    } else {
      this.proxy = false;
    }
  }
  return this.init(type, options.dataType);
}

AjaxInterface.prototype.sendData = function (query, callback, params, card) {
  var data = query;
  var url = this.url;
  if (params && typeof url.bindData === "function") {
    url = url.bindData(params);
  }
  var type = this.type;
  var dType = this.dataType || "json";
  var cTypeMap = {
    "json": "application/json; charset=UTF-8",
    "form-data": "multipart/form-data",
    "form-urlencoded": "application/x-www-form-urlencoded; charset=UTF-8"
  };
  var cType = this.contentType || "application/x-www-form-urlencoded; charset=UTF-8";
  cType = cTypeMap[cType] || cType;

  if (query && query.constructor.name === "FormData") {
    cType = "multipart/form-data";
  }

  if (type.toLocaleUpperCase() === "GET" || type.toLocaleUpperCase() === "DELETE") {
    var tData = {};
    for (var k in query) {
      if (typeof query[k] === "object") {
        tData[k] = JSON.stringify(query[k]);
      } else {
        tData[k] = query[k];
      }
    }
    url = WebTool.attachParams(url, tData);
  }
  var _self = this;
  this.httpObj.onreadystatechange = function () {
    if (_self.httpObj.readyState == 4 || _self.httpObj.readyState == "complete") {
      if (typeof (callback) === "function") {
        var d = _self.httpObj.responseText;
        // tData = d;
        if (dType === "json") {
          try {
            d = JSON.parse(d);
          } catch (e) {
            console.log("json parse error.")
          }
        }

        if (AjaxInterface.interceptor && typeof AjaxInterface.interceptor.response === "function") {
          AjaxInterface.interceptor.response(_self.httpObj);
        }

        if (_self.httpObj.status > 399) {
          return false;
        }

        callback(d);
      }
    }
  };

  this.httpObj.open(type, url, true);
  if (cType.search("application/x-www-form-urlencoded") !== -1) {
    data = {};
    for (var k in query) {
      if (typeof query[k] === "object") {
        data[k] = JSON.stringify(query[k]);
      } else {
        data[k] = query[k];
      }
    }
    data = WebTool.attachParams("", data).split("?")[1];
  } else if (cType.search("application/json") !== -1) {
    data = JSON.stringify(query);
  } else if (query && cType.search("multipart/form-data") !== -1 && ["FormData", "String", "Number", "Array"].indexOf(query.constructor.name) === -1) {
    data = new FormData();
    for (var k in query) {
      data.append(k, query[k]);
    }
  } else {}

  if (cType.search("multipart/form-data") === -1) {
    this.httpObj.setRequestHeader("Content-Type", cType);
  }

  if (_self.authorization) {
    this.httpObj.setRequestHeader("Authorization", _self.authorization);
  }

  if (AjaxInterface.interceptor && typeof AjaxInterface.interceptor.request === "function") {
    AjaxInterface.interceptor.request(this.httpObj);
  }

  this.httpObj.send(data);
}

AjaxInterface.prototype.init = function () {
  this.httpObj = this.getHttpObj();
  if (this.httpObj) {
    var _self = this;
    return (function (query, callback, params) {
      if (_self.proxy) {
        var proxy = _self.proxy;
        var key = MurmurHash.rule(proxy, 31);
        webCpu.crossItem = webCpu.crossItem || {};
        if (!webCpu.crossItem[key]) {
          webCpu.crossItem[key] = new CrossDomainService(proxy, function () {
            webCpu.crossItem[key].request(_self.url, query, _self.type, callback, _self.dataType, _self.contentType);
          })
        } else if (webCpu.crossItem[key] && webCpu.crossItem[key].inited) {
          webCpu.crossItem[key].request(_self.url, query, _self.type, callback, _self.dataType, _self.contentType);
        } else {
          setTimeout(function () {
            if (webCpu.crossItem[key] && webCpu.crossItem[key].inited) {
              webCpu.crossItem[key].request(_self.url, query, _self.type, callback, _self.dataType, _self.contentType)
            } else {
              webCpu.crossItem[key] = new CrossDomainService(proxy, function () {
                webCpu.crossItem[key].request(_self.url, query, _self.type, callback, _self.dataType, _self.contentType);
              })
            }
          }, 200);
        }
      } else {
        _self.sendData(query, callback, params);
      }
    });
  }
}

AjaxInterface.prototype.getHttpObj = function () {
  var xmlHttp = null;
  try {
    // Firefox, Opera 8.0+, Safari
    xmlHttp = new XMLHttpRequest();
  } catch (e) {
    //Internet Explorer
    try {
      xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
  }
  return xmlHttp;
}
var ViewControl = function (config, callback, mission) {
  this.config = config;
  if (typeof (callback) === "function") {
    this.callback = callback;
  }
  this.initConfig();
  this.mission = mission;
  var _self = this;
  if (this.isReady()) {
    setTimeout(function () {
      _self.execute();
    }, 100);
  }
}

ViewControl.prototype.initTask = function (task) {
  if (typeof (task) === "string") {
    task = {
      container: document.getElementById(task)
    };
  } else if (typeof (task) === "function") {
    task = {
      promise: {
        afterRender: task
      }
    };
  } else if (!!task && task.nodeName) {
    task = {
      container: task
    };
  } else if (!!task && typeof (task.container) === "string") {
    task.container = document.getElementById(task.container);
  } else {}

  task.className = this.config.name;
  return task;
}

ViewControl.prototype.initConfig = function () {

  if (this.config) {
    //init component elements;
    this.html = "";
    this.css = {};
    this.script = {};
    //Set script status
    this.sStatus = 0;
    if (typeof (this.config.script) === "string") {
      if (this.config.name !== "main") {
        this.config.script = this.getPath(this.config.script);
      }
      this.sStatus = 1;
    } else if (typeof (this.config.script) === "object") {
      for (var i in this.config.script) {
        this.sStatus++;
        if (this.config.name !== "main") {
          this.config.script[i] = this.getPath(this.config.script[i]);
        }
      }
    }
    //set html status
    this.hStatus = 0;
    if (typeof (this.config.html) === "string" && (this.config.html.search('<') === -1)) {
      this.config.html = this.getPath(this.config.html);
      this.htmlFetch = new WebRequest(this.config.html, "GET");
      this.hStatus = 1;
    } else {
      this.html = document.createElement("div");
      this.html.innerHTML = this.config.html || "";
    }
    //load css style
    this.prepareCss();
    //load html and script
    this.state = -1;
    this.load();
  }
}

ViewControl.prototype.load = function () {
  if (this.state === -1) {
    if (this.hStatus > 0) {
      this.prepareHtml();
    }
    if (this.sStatus > 0) {
      this.prepareScript();
    }
    this.state = 0;
  }
}

ViewControl.prototype.render = function (task) {
  //update the task state
  var task = this.initTask(task);
  if (task && task.url && typeof (task.url) === "string") {
    this.updateFromRemote(task);
  } else {
    this.update(task);
  }
}

ViewControl.prototype.updateFromRemote = function (task) {
  var _self = this;
  task.query = task.query || {};
  // task.query._t = (new Date()).getTime();
  var callback = function (data) {
    if (task.dataType === "json") {
      var tData = data;
      try {
        data = WebTool.stringToObject(data);
      } catch (e) {
        if (window["$"] && $.xml2json) {
          data = $.xml2json(tData);
        }
      }
    } else if (task.dataType === "xml") {
      var t = document.createElement("div");
      t.innerHTML = data;
      data = t.childNodes[0];
    }
    task.defaultData = task.data;
    task.data = data;
    _self.update(task);
  };
  var rType = task.requestType || task.method || "jsonp";
  // var url = WebTool.attachParams(task.url, task.query);
  let url = task.url;

  let re = `^${location.origin}`;
  if (task.url && task.url.search(/^http/) !== -1 && task.proxy === undefined && task.url.search(re) === -1) {
    task.proxy = true;
  } else if (task.proxy === undefined && task.url.search(/^http/) !== -1) {
    task.proxy = false
  }

  WebAdapter.request(url, rType, task.query, callback, {
    contentType: task.contentType,
    dataType: task.dataType,
    proxy: task.proxy,
    params: task.params
  });

}

ViewControl.prototype._update = function (task) {
  var t = task.container;
  //Todo: adjust the content area
  if (task.style && typeof task.style.width === "number" && typeof task.style.height === "number") {
    var width = task.style.width;
    var height = task.style.height;
    var size = {
      width: task.container.scrollWidth,
      height: task.container.scrollHeight
    }
    task.style.width = width + "px";
    task.style.height = height + "px";
    var radio = Math.min(size.height / height, size.width / width);
    radio = Math.min(1, radio);

    var offset = {
      x: Math.max((size.width - width * radio) / 2, 0),
      y: Math.max((size.height - height * radio) / 2, 0),
    };

    task.style.marginLeft = `${offset.x}px`;
    task.style.marginTop = `${offset.y}px`;
    task.transformRadio = radio;
    task.transform = {
      transform: `scale(${radio}, ${radio})`,
      transformOrigin: '0 0',
    }

  }

  if (task.promise && typeof (task.promise.beforeRender) === "function") {
    if (task.cardName) {
      console.log("start beforeRender of task[%1]".replace("%1", task.cardName));
    }
    task.promise.beforeRender(t, task.data, task);
  }
  var tData = null;
  if (task.option && task.option.filter && task.option.filter.key && task.data.constructor.name === "Array") {
    tData = [];
    var key = task.option.filter.key;
    var value = task.option.filter.value;
    for (var i = 0; i < task.data.length; i++) {
      if (task.data[i][key] === value || value === "_all") {
        tData.push(task.data[i]);
      }
    }
  }
  task._data = task._data || tData || task.data;

  if (task.option && task.footArea && webCpu && webCpu.CardItem && webCpu.CardItem.Pagination && task.option.page) {
    var page = task.option.page;
    if (typeof (task.option.pageFilter) === "function") {
      page = task.option.pageFilter(page);
    }

    if (page.front) {
      page.total = task._data.length;
      task.pageCallback = task.pageCallback || function (n, size, flag) {
        if (n < 1) {
          n = 1;
        }

        var _data = this._data || [];
        try {
          var start = 0;
          if (!flag) {
            start = n - 1;
          }
          this.data = _data.slice(flag * size, n * size);
          var name = this.className || "DataTable";
          webCpu[name].updateView(this);
        } catch (e) {
          console.log(e);
        }
      }
    }

    if (page && !!page.total) {
      task.pagination = new webCpu.CardItem.Pagination(task.footArea, page.total, page.size, page.current, function (n, size) {
        webCpu.CardItem.switchState(task, "loading");
        task.pageCallback(n, size);
      }, page.flag);
    } else {
      task.footArea.innerHTML = "";
    }
  }

  if (task.pageCallback && task.option && task.option.page && task.option.page.front) {
    var page = task.option.page;
    task.pageCallback(page.current, page.size);
  } else {
    this.updateView(task, tData);
  }
}

ViewControl.prototype.update = function (task) {
  if (this.isReady()) {
    if (typeof (task.dataFilter) === "function") {
      try {
        task.data = task.dataFilter(task.data);
      } catch (e) {
        console.log(e);
      }
    }

    var _self = this;
    // setTimeout(function () {
    _self._update(task);
    // });

  } else {
    this.mission.push(task);
  }
}


ViewControl.prototype.createDom = function (container, json, data) {
  var arr = ["br", "input", "img", "hr", "link", "meta", "span", "textarea"];
  var tag = json.tag || "div";
  var elem = document.createElement(tag);
  if (json.props) {
    for (var k in json.props) {
      elem.setAttribute(k, json.props[k]);
    }
  }
  if (arr.indexOf(tag) !== -1 && json.label === undefined) {
    json.label = "";
  }
  if (json.label !== undefined) {
    var label = document.createElement("label");
    label.innerHTML = json.label;
    var style = json.labelStyle || {
      width: json.labelWidth || "100%"
    }
    for (var k in style) {
      label.style[k] = style[k];
    }

    if (arr.indexOf(tag) === -1) {
      elem.appendChild(label);
    } else {
      container.prepend(label);
      label.prepend(elem);
      if (tag === "textarea" && json.props) {
        elem.innerHTML = json.props.value || ""
      }
    }
  }

  if (json.style) {
    for (var k in json.style) {
      elem.style[k] = json.style[k];
    }
  }

  if (json.children && arr.indexOf(tag) === -1) {
    if (json.children.constructor.name !== "Array") {
      json.children = [json.children];
    }
    var tElem = document.createElement("div");
    for (var i in json.children) {
      this.createDom(tElem, json.children[i], data);
    }
    elem.appendChild(tElem);
  }
  if (json.children && arr.indexOf(tag) === -1) {
    container.appendChild(elem);
  }
}

ViewControl.prototype.updateView = function (task, tData) {
  var t = task.container;
  task.data = tData = tData || task.data;

  if (t) {
    if (task.cardName && task.cardName !== "anonymous") {
      console.log("start main callback of task[%1]".replace("%1", task.cardName));
      if (task.cardName && webCpu["CardItem"]) {
        // if (!webCpu.layout || (webCpu.layout && webCpu.layout.mode !== "edit")) {
        //   debugger;
        //   webCpu["CardItem"].dismissMask(task);
        // }
      }
    }
    if (!task.renderType || task.renderType === "replace") {
      t.innerHTML = "";
    }

    var temp = this.initDom(tData, t, task);
    task.container = temp;


    if (typeof (this.callback) === "function") {
      this.callback(temp, tData, task);
    }

  } else {

    if (typeof (this.callback) === "function") {
      this.callback(t, tData, task);
    }
  }



  if (task.promise && typeof (task.promise.afterRender) === "function") {
    if (task.cardName) {
      console.log("start afterRender of task[%1]".replace("%1", task.cardName || "anonymous"));
    }

    task.promise.afterRender(task.container, tData, task);
  }

  if (task.transform) {
    $(task.container).css(task.transform);
  }

  if (typeof task._initView === "function") {
    task._initView(task.container, tData, task);
  }
}

ViewControl.prototype.initDom = function (obj, container, task) {
  if (container.parentNode && container.className.search("_task_container") !== -1 && this.config.name !== "CardItem") {
    var temp = container;
    container = container.parentNode;
    container.removeChild(temp);
    task.container = container;
  }
  t = document.createElement("div");
  task.style = task.style || {};
  task.style.width = task.style.width || "100%";
  task.style.height = task.style.height || "100%";
  task.style.relative = task.style.relative || "relative";
  t.setAttribute("class", this.config.name + " _task_container");
  task.animateStyle = task.animateStyle || {
    type: "animate__fadeIn",
    duration: 'animate__fast'
  }
  if (typeof task.animateStyle === "string") {
    task.animateStyle = {
      type: task.animateStyle,
      duration: "animate__fast"
    }
  }
  if (typeof webCpu.CardItem.removeAnimationClass === "function") {
    webCpu.CardItem.removeAnimationClass(container);
  }

  if (task.animateStyle && task.animateStyle.type) {
    container.setAttribute("class", `${container.getAttribute("class")} animate__animated ${task.animateStyle.type} ${task.animateStyle.duration}`);
  }

  container.innerHTML = "";
  if (container && typeof (container.appendChild) === "function") {
    container.appendChild(t);
    try {
      for (var k in task.style) {
        t.style[k] = task.style[k];
      }
    } catch (e) {
      var style = "width: 1%; height: 2%; position: 3%;";
      style = style.replace("1%", task.style.width);
      style = style.replace("2%", task.style.height);
      style = style.replace("3%", task.style.relative);
      t.setAttribute("style", style);
    }

    t.innerHTML = this.html.innerHTML.bindData(obj, task.filter);
    // $(t).html(this.html.innerHTML);
    // console.log("initDom", t, this.html.innerHTML);
  }
  return t;
}

ViewControl.prototype.isReady = function () {
  var ret = false;
  if ((this.hStatus <= 0 && this.sStatus <= 0) || !this.config) {
    ret = true;
    this.state = 1;
  } else if (!this.html) {
    console.log("waiting html...");
  } else {
    console.log("waiting script...");
  }
  return ret;
}

ViewControl.prototype.execute = function () {
  if (this.isReady()) {
    for (var key in this.mission) {
      this.mission[key] = this.initTask(this.mission[key]);
      this.mission[key] && this.render(this.mission[key]);
    }
  }
}

ViewControl.prototype.prepareScript = function () {
  if (typeof (this.config.script) === "string" && !this.script[0]) {
    this.script[0] = this.loadScript(this.config.script);
  } else if (typeof (this.config.script) === "object") {
    for (var k in this.config.script) {
      if (typeof this.config.script[k] === "string") {
        this.script[k] = this.script[k] || this.loadScript(this.config.script[k]);
      } else if (this.config.script[k] && this.config.script[k].url) {
        this.script[k] = this.script[k] || this.loadScript(this.config.script[k].url, this.config.script[k].type);
      } else {}
    }
  }
}

ViewControl.prototype.prepareCss = function () {
  if (typeof (this.config.css) === "string" && !this.css[0]) {
    if (this.config.css.search("{") === -1) {
      if (this.config.name !== "main") {
        this.config.css = this.getPath(this.config.css);
      }
    }
    this.css[0] = this.loadCSS(this.config.css);
  } else if (typeof (this.config.css) === "object") {
    for (var k in this.config.css) {
      if (this.config.css[k].search("{") === -1 && this.config.path) {
        if (this.config.name !== "main") {
          this.config.css[k] = this.getPath(this.config.css[k]);
        }
      }
      this.css[k] = this.css[k] || this.loadCSS(this.config.css[k]);
    }
  }
}

ViewControl.prototype.getPath = function (str, folderName) {
  let _str = str;
  if (!str) {
    return "";
  } else {
    str = str.url || str;
  }
  var ret = str || "";
  this.config.path = this.config.path || webCpu.componentPath;
  if (str.search('data:text') === 0) {
    //为data url时 ret不用转换
  } else if (this.config && this.config.path && this.config.name) {
    ret = this.config.path + '/' + this.config.name + '/' + str;
    if (folderName) {
      ret = this.config.path + '/' + this.config.name + '/' + folderName + "/" + str;
    }
  } else if (this.config && this.config.name) {
    ret = this.config.name + '/' + str;
    if (folderName) {
      ret = this.config.name + '/' + folderName + '/' + str;
    }
  }
  if (_str.type) {
    ret = {
      url: ret,
      type: _str.type
    }
  }
  return ret;
}

ViewControl.prototype.prepareHtml = function () {
  var _this = this;
  this.htmlFetch({}, function (str) {
    _this.hStatus--;
    _this.html = document.createElement("div");
    _this.html.innerHTML = str;
    _this.execute();
  });

}

ViewControl.prototype.loadScript = function (url, type) {
  var _self = this;
  //判断URL是否为script code
  var tUrl = url.replace(/\s+/g, "");
  if (tUrl.search(/\(function/) === 0) {
    setTimeout(function () {
      (new Function("return " + url))();
      _self.sStatus--;
      _self.execute();
    }, 200);
    var script = tUrl;
  } else {
    var scriptId = MurmurHash.rule(url, 31);
    var script = document.getElementById(scriptId);
    if (script) {
      script.parentNode.removeChild(script);
    }
    script = WebAdapter.load(url, function () {
      _self.sStatus--;
      _self.execute();
    }, _self.config.shadowDom, type);
    script.setAttribute('id', scriptId);
  }

  return script;
}

ViewControl.prototype.loadCSS = function (url) {
  var cssId = MurmurHash.rule(url, 31);
  var cssLink = document.getElementById(cssId);
  if (!cssLink) {
    cssLink = WebAdapter.loadCSS(url, this.config.shadowDom);
  }
  cssLink.setAttribute('id', cssId);
  return cssLink;
}

var MurmurHash = {
  // MurmurHash3 related functions
  //
  // Given two 64bit ints (as an array of two 32bit ints) returns the two
  // added together as a 64bit int (as an array of two 32bit ints).
  //
  x64Add: function (m, n) {
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] + n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] + n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] + n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += m[0] + n[0];
    o[0] &= 0xffff;
    return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
  },
  //
  // Given two 64bit ints (as an array of two 32bit ints) returns the two
  // multiplied together as a 64bit int (as an array of two 32bit ints).
  //
  x64Multiply: function (m, n) {
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] * n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] * n[3];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[2] += m[3] * n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] * n[3];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[2] * n[2];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[3] * n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0]);
    o[0] &= 0xffff;
    return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
  },
  //
  // Given a 64bit int (as an array of two 32bit ints) and an int
  // representing a number of bit positions, returns the 64bit int (as an
  // array of two 32bit ints) rotated left by that number of positions.
  //
  x64Rotl: function (m, n) {
    n %= 64;
    if (n === 32) {
      return [m[1], m[0]];
    } else if (n < 32) {
      return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))];
    } else {
      n -= 32;
      return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))];
    }
  },
  //
  // Given a 64bit int (as an array of two 32bit ints) and an int
  // representing a number of bit positions, returns the 64bit int (as an
  // array of two 32bit ints) shifted left by that number of positions.
  //
  x64LeftShift: function (m, n) {
    n %= 64;
    if (n === 0) {
      return m;
    } else if (n < 32) {
      return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
    } else {
      return [m[1] << (n - 32), 0];
    }
  },
  //
  // Given two 64bit ints (as an array of two 32bit ints) returns the two
  // xored together as a 64bit int (as an array of two 32bit ints).
  //
  x64Xor: function (m, n) {
    return [m[0] ^ n[0], m[1] ^ n[1]];
  },
  //
  // Given a block, returns murmurHash3's final x64 mix of that block.
  // (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
  // only place where we need to right shift 64bit ints.)
  //
  x64Fmix: function (h) {
    h = this.x64Xor(h, [0, h[0] >>> 1]);
    h = this.x64Multiply(h, [0xff51afd7, 0xed558ccd]);
    h = this.x64Xor(h, [0, h[0] >>> 1]);
    h = this.x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
    h = this.x64Xor(h, [0, h[0] >>> 1]);
    return h;
  },

  //
  // Given a string and an optional seed as an int, returns a 128 bit
  // hash using the x64 flavor of MurmurHash3, as an unsigned hex.
  //
  rule: function (key, seed) {
    key = key || "";
    seed = seed || 0;
    var remainder = key.length % 16;
    var bytes = key.length - remainder;
    var h1 = [0, seed];
    var h2 = [0, seed];
    var k1 = [0, 0];
    var k2 = [0, 0];
    var c1 = [0x87c37b91, 0x114253d5];
    var c2 = [0x4cf5ad43, 0x2745937f];
    for (var i = 0; i < bytes; i = i + 16) {
      k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)];
      k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)];
      k1 = this.x64Multiply(k1, c1);
      k1 = this.x64Rotl(k1, 31);
      k1 = this.x64Multiply(k1, c2);
      h1 = this.x64Xor(h1, k1);
      h1 = this.x64Rotl(h1, 27);
      h1 = this.x64Add(h1, h2);
      h1 = this.x64Add(this.x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
      k2 = this.x64Multiply(k2, c2);
      k2 = this.x64Rotl(k2, 33);
      k2 = this.x64Multiply(k2, c1);
      h2 = this.x64Xor(h2, k2);
      h2 = this.x64Rotl(h2, 31);
      h2 = this.x64Add(h2, h1);
      h2 = this.x64Add(this.x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
    }
    k1 = [0, 0];
    k2 = [0, 0];
    switch (remainder) {
      case 15:
        k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 14)], 48));
      case 14:
        k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 13)], 40));
      case 13:
        k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 12)], 32));
      case 12:
        k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 11)], 24));
      case 11:
        k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 10)], 16));
      case 10:
        k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 9)], 8));
      case 9:
        k2 = this.x64Xor(k2, [0, key.charCodeAt(i + 8)]);
        k2 = this.x64Multiply(k2, c2);
        k2 = this.x64Rotl(k2, 33);
        k2 = this.x64Multiply(k2, c1);
        h2 = this.x64Xor(h2, k2);
      case 8:
        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 7)], 56));
      case 7:
        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 6)], 48));
      case 6:
        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 5)], 40));
      case 5:
        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 4)], 32));
      case 4:
        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 3)], 24));
      case 3:
        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 2)], 16));
      case 2:
        k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 1)], 8));
      case 1:
        k1 = this.x64Xor(k1, [0, key.charCodeAt(i)]);
        k1 = this.x64Multiply(k1, c1);
        k1 = this.x64Rotl(k1, 31);
        k1 = this.x64Multiply(k1, c2);
        h1 = this.x64Xor(h1, k1);
    }
    h1 = this.x64Xor(h1, [0, key.length]);
    h2 = this.x64Xor(h2, [0, key.length]);
    h1 = this.x64Add(h1, h2);
    h2 = this.x64Add(h2, h1);
    h1 = this.x64Fmix(h1);
    h2 = this.x64Fmix(h2);
    h1 = this.x64Add(h1, h2);
    h2 = this.x64Add(h2, h1);
    return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
  }
}

// var MurmurHashRule = MurmurHash.rule;

var NetIdentity = function (config, callback) {
  for (var k in config) {
    this[k] = config[k];
  }
  this.id = WebTool.cookie(this.community);
  if (!this.id) {
    var _self = this;
    this.getCacheParams(this.url, function (data) {
      if (data && data["id"]) {
        _self.id = data["id"];
        // _self.community = data["id"];
      } else {
        _self.id = _self.generateId();
        _self.setCacheParams(_self.url, {
          id: _self.id,
          community: _self.community
        });
      }
      if (typeof (callback) === "function") {
        callback(_self.id);
      }
      //ID有效期100年（第一方cookie）
      WebTool.cookie(_self.community, _self.id, 365 * 100);

      //收集传播路径
      _self.trackIdentity();

    });
  } else {
    if (typeof (callback) === "function") {
      callback(this.id);
    }
    //ID有效期100年
    WebTool.cookie(this.community, this.id, 365 * 100);

    this.setCacheParams(this.url, {
      id: this.id,
      community: this.community
    });

    //收集传播路径
    this.trackIdentity();

  }
}
NetIdentity.track = 0;

NetIdentity.prototype.trackIdentity = function () {
  try {
    this.fp = MurmurHash.rule(this.getCanvasFp() + navigator.userAgent);
  } catch (e) {
    this.fp = "";
  }
  var _self = this;
  if (typeof (this.track) === "string" && NetIdentity.track === 0) {
    var hash = location.hash;
    var id = decodeURIComponent(this.urlQuery(hash, this.community));
    var tParam = {
      infector: id,
      hash: WebTool.pageHash(location.href),
      refer: document.referrer,
      fp: _self.fp
    };
    // tParam[this.community] = this.id;

    if (id && id !== "null") {
      WebAdapter.report(WebTool.attachParams(this.track, tParam));
      if (this.id != id) {
        location.hash = hash.replace(encodeURIComponent(id), encodeURIComponent(this.id));
      }
    } else {
      WebAdapter.report(WebTool.attachParams(this.track, tParam));
      var param = {};
      param[this.community] = this.id;
      location.hash = WebTool.attachParams(hash, param);
    }
    //每个页面只执行一次
    NetIdentity.track = 1;
  }
}

NetIdentity.prototype.getCanvasFp = function () {
  var result = [];
  // Very simple now, need to make it more complex (geo shapes etc)
  var canvas = document.createElement("canvas");
  canvas.width = 2000;
  canvas.height = 200;
  canvas.style.display = "inline";
  var ctx = canvas.getContext("2d");
  // detect browser support of canvas winding
  // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
  // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
  ctx.rect(0, 0, 10, 10);
  ctx.rect(2, 2, 6, 6);
  result.push("canvas winding:" + ((ctx.isPointInPath(5, 5, "evenodd") === false) ? "yes" : "no"));

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f60";
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = "#069";
  ctx.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 2, 15);
  ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
  ctx.font = "18pt Arial";
  ctx.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 4, 45);

  // canvas blending
  // http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
  // http://jsfiddle.net/NDYV8/16/
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = "rgb(255,0,255)";
  ctx.beginPath();
  ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgb(0,255,255)";
  ctx.beginPath();
  ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgb(255,255,0)";
  ctx.beginPath();
  ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgb(255,0,255)";
  // canvas winding
  // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
  // http://jsfiddle.net/NDYV8/19/
  ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
  ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
  ctx.fill("evenodd");

  result.push("canvas fp:" + canvas.toDataURL());
  return result.join("~");
}

NetIdentity.prototype.urlQuery = function (url, key) {
  if (url) {
    var re = new RegExp(key + "=([^\&]*)", "i");
    var a = re.exec(url);
    if (a == null) {
      return null;
    }
    return a[1];
  } else {
    return null;
  }
}

NetIdentity.prototype.rand = function (x) {
  var s = "";
  while (s.length < x && x > 0) {
    var r = Math.random();
    s += String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97 : 65));
  }
  return s;
}

NetIdentity.prototype.getCacheParams = function (url, callback) {
  if (!!window.postMessage) {
    this.getCacheParamsByMessage(url, callback);
  } else {
    this.getCacheParamsByName(url, callback);
  }
}

NetIdentity.prototype.getCacheParamsByMessage = function (url, callback) {
  var _self = this;
  if (window.addEventListener) {
    window.addEventListener('message', function (e) {
      if (typeof (callback) === "function") {
        _self.id = e.data["id"];
        _self.crossData = e.data;
        callback(e.data);
      }
    }, false)
  } else {
    window.attachEvent('onmessage', function (e) {
      if (typeof (callback) === "function") {
        _self.id = e.data["id"];
        _self.crossData = e.data;
        callback(e.data);
      }
    })
  }

  this.iframe = this.getBridgeIframe("_bridge_iframe");
  this.iframe.src = url;
}

NetIdentity.prototype.setCacheParams = function (url, params) {
  if (this.iframeSet) {
    this.iframeSet.parentNode.removeChild(this.iframeSet);
  }
  this.iframeSet = this.getBridgeIframe("_bridge_iframe_set");
  //使用hash值向跨域iframe传递参数
  this.iframeSet.src = WebTool.attachParams(url, params);
}

NetIdentity.prototype.getCacheParamsByName = function (url, callback) {
  if (this.iframeGet) {
    this.iframeGet.parentNode.removeChild(this.iframeGet);
  }
  this.iframeGet = this.getBridgeIframe("_bridge_iframe_get");
  this.iframeGet.src = url;
  var state = 0;
  this.iframeGet.onload = function () {
    if (state === 1) {
      //使用iframe通过window.name跨域传递的参数
      var params = strToJson(this.contentWindow.name);
      if (typeof (callback) === "function") {
        callback(params);
      }
    } else if (state === 0) {
      state = 1;
      this.contentWindow.location = 'about:blank';
    }
  }
}

NetIdentity.prototype.getBridgeIframe = function (id, callback) {
  var iframe = this.iframe || document.getElementById("_bridge_iframe");
  if (iframe) {
    iframe.parentNode.removeChild(iframe);
  }
  iframe = document.createElement('iframe');
  iframe.setAttribute('allowTransparency', 'true');
  iframe.setAttribute('id', id);
  iframe.setAttribute('frameBorder', '0');
  iframe.setAttribute('scrolling', 'no');
  iframe.style.cssText = 'height:0px;width:0px;float:none;position:absolute;overflow:hidden;z-index:333333;margin:0;padding:0;border:0 none;background:none;';
  document.body.appendChild(iframe);
  iframe.onload = function () {
    if (typeof (callback) === "function") {
      callback();
    }
  }
  return iframe;
}

NetIdentity.prototype.generateId = function () {
  var href = location.href;
  var referrer = document.referrer;
  var random = this.rand(32);
  return MurmurHash.rule(this.fp + random + href + referrer + (new Date()).getTime(), 31);
}

function strToJson(str) {
  return (new Function("return " + str))();
}

var WebCpu = function (container, url, config) {
  if (container && url) {
    this.exec(container, url, config);
  }
  this.adapter = {};
  this.appMap = {};
  this.componentPath = "dependency/components";
}

WebCpu.prototype.runWebApp = function (container, app, config, style) {
  if (!app || !app.url || !app.key) {
    console.log("invalid app.");
    return false;
  }
  var _self = this;
  WebAdapter.loadCardData(app.url, app.key, function (data) {
    if (typeof app.callback === "function") {
      app.callback(data);
    }
    localStorage.setItem("transwebWebApp", WebTool.objectToString(data));

    _self.initProject(container, data);
  });
}

WebCpu.prototype.exec = function (container, app, config, style) {
  this.cards = {};
  if (config) {
    var _self = this;
    this.initModule(config, "main", function (c, d, t) {
      _self.initWebApp(c, t.app);
    });

    config.path = config.path || this.componentPath;
    var task = config;
    task.app = app;
    task.style = style || {};

    if (typeof (config.interface) === "string") {
      config.interface = webCpu.interface[config.interface];
    }
    if (config.interface) {
      for (var k in config.interface) {
        task[k] = config.interface[k];
      }
    }

    var myCard = {
      className: "main",
      cardName: "main",
      task: task
    }
    // task.container = container;
    // this.main.render(task);
    this.addCardItem(container, myCard);
  } else {
    this.initWebApp(container, app);
  }
}

WebCpu.prototype.initAdapter = function (config) {
  this.adapter = this.adapter || {};
  for (var k in config) {
    var adapter = config[k];
    var type = adapter.type || adapter.requestType || adapter.method;
    this.adapter[k] = new WebRequest(adapter.url, type, adapter);
  }
  return this.adapter;
}


WebCpu.prototype.startApp = function (elem, config, style) {
  this.componentPath = config.components || this.componentPath;
  this.exec(elem, config.main, config.dependency, style);
}

WebCpu.prototype.initModule = function (config, name, _callback) {
  var _self = this;
  var callback = function (container, data, task) {

    if (typeof (config.callback) === "function") {
      config.callback(container, data, task);
    }

    if (typeof _callback === "function") {
      _callback(container, data, task);
    }
    // else {
    //   _self.initWebApp(container, task.app);
    // }

    console.log("execed successfully");
  }
  config.path = config.path;
  this[name] = null;
  this.regComponent(name, config, callback);
}

WebCpu.prototype.loadPageData = function (container, url, flag, callback) {
  var _self = this;
  WebAdapter.loadCardData(url, "transweb_cn", function (data) {
    _self.renderPageData(container, data, flag, callback);
  })
}

WebCpu.prototype.renderRemoteCard = function (container, url, cardName, options, callback) {
  this.cards = this.cards || {};
  this.componentPath = options.components;
  var _self = this;
  WebAdapter.loadCardData(url, "transweb_cn", function (data) {
    _self._renderPageData(container, data.cardData, cardName, callback);
  });
}

WebCpu.prototype._renderPageData = function (container, cardData, cardName, callback) {
  var myCard = null;
  for (var i in cardData) {
    if (cardData[i].cardName) {
      this.cards[cardData[i].cardName] = cardData[i];
    }
    if (cardData[i].cardName === cardName) {
      myCard = cardData[i];
    }
  }
  if (myCard) {
    callback(this.cards);
    this.addCardItem(container, myCard);
  }
}

WebCpu.prototype.renderPageData = function (container, data, flag, callback) {
  if (data.options && data.options.width && data.options.height) {
    this.layout = new LayoutEngine(container, flag, data.options, data.cardData, callback);
  } else if (data.options) {
    var enter = data.options || "main";
    if (typeof (enter) !== "string") {
      enter = "main";
    }
    this._renderPageData(container, data.cardData, enter, callback);
  } else {
    this.addCardItem(container, data, "replace", callback);
  }
}

WebCpu.prototype.excuteSingleTask = function (elem, appMap, index) {
  var appName = elem.getAttribute("appName") || elem.getAttribute("cardName");
  appMap = appMap || {};

  if (appMap.constructor.name === "Array") {
    appName = index;
  }

  if (!appMap[appName]) {
    return false;
  }

  var cItem = appMap[appName] || {};
  if (cItem.url || cItem.dsl) {
    this.updateView(elem, cItem);
  } else if (cItem.task) {
    this.addCardItem(elem, cItem);
  } else {
    console.log(elem, "组件渲染失败，appName无效: ", appName);
  }

}

WebCpu.prototype.addCardItem = function (container, cardData, options, callback) {
  var options = options || {};
  if (typeof (options) === "string") {
    options = {
      key: options
    };
  } else if (typeof (options) === "function") {
    options = {
      callback: options
    };
  } else {}
  var task = this.transferCardData(container, cardData, options, callback);
  if (task) {
    this.render("CardItem", task, cardData.path || options.components || this.componentPath);
  }
}

WebCpu.prototype.fresh = function (task, data, flag) {
  task = task.task || task;
  var cName = task.className || "TemplateItem";
  var _self = this;
  setTimeout(function () {
    if (data) {
      task.query = task.query || {};
      task.query._time_ = new Date().getTime();
      task._data = null;
      _self[cName].render(task, data);
    } else {
      _self[cName].updateFromRemote(task);
    }
  }, 10);
}

WebCpu.prototype.attachAttribute = function (obj, subObj) {
  if (!obj || !subObj) {
    return false;
  }
  for (var k in obj) {
    if (obj[k] && obj[k].constructor.name === "Object") {
      subObj[k] = subObj[k] || {};
      this.attachAttribute(obj[k], subObj[k]);
    } else {
      subObj[k] = obj[k];
    }
  }
}

WebCpu.prototype.updateView = function (elem, option, data, flag) {
  option = option || {};
  data = data || option.dsl || option.data;
  if (option.dsl) {
    flag = "DSL";
  }
  if (typeof (option) === "string") {
    option = {
      url: option
    }
  }
  var scene = option;
  var _self = this;
  var callback = null;
  if (typeof (data) === "function") {
    callback = data;
  } else if (flag && option.key) {
    callback = function (c, d, t) {
      if (typeof (data) === "string") {
        data = {
          url: data
        };
        if (_self.interface && _self.interface[data]) {
          data = _self.interface[data];
        }
      }
      if (d && d.task) {
        _self.attachAttribute(data, d.task);
      }
    };
  } else if (data && option.key) {
    callback = function (c, d, t) {
      d.task.data = data || d.task.data;
      d.task.url = "";
    }
  } else {

  }

  if (option.url && option.key) {
    if (option.limited) {
      var iframe = document.createElement("iframe");
      iframe.setAttribute("style", "width: 100%; height: 100%;");
      elem.appendChild(iframe);
      this.settings = this.settings || {};
      this.settings.appContainer = this.settings.appContainer || "https://transweb.cn"
      iframe.src = WebTool.attachParams(this.settings.appContainer, {
        url: option.url,
        key: option.key
      });
    } else {
      this.addCardItem(elem, option.url, {
        key: option.key,
        interface: option.interface,
        callback: function (c, d, t) {
          d.style = option.style || d.style;
          scene.card = d;
          d.title = option.title || d.title;
          d.foot = option.foot || d.foot;
          d.titleStyle = option.titleStyle || d.titleStyle;
          d.footStyle = option.footStyle || d.footStyle;

          if (option.dsl) {
            _self.attachAttribute(option.dsl, d.task);
          }

          if (typeof (option.callback) === "function") {
            option.callback(c, d, t);
          }
          // if (typeof (callback) === "function") {
          //   callback(c, d, t);
          // }
        }
      }, callback);
    }
  } else {
    var tCard = option;
    if ((option.url && !option.key) || option.className) {
      tCard = {
        task: tCard.task || {}
      }
      tCard.className = option.className || (option.url.search(/\.vue$/i) === -1 ? 'TemplateItem' : 'ElementVueItem');
      tCard.cardName = option.cardName;
      tCard.task.remote = tCard.task.remote === undefined ? true : tCard.task.remote;
      tCard.foot = option.foot;
      tCard.footStyle = option.footStyle;
      tCard.footHeight = option.footHeight;
      tCard.title = option.title;
      tCard.titleStyle = option.titleStyle;
      if (option.style) {
        tCard.style = WebTool.copyObject(option.style);
      }

      if (!option.url) {
        tCard.task.remote = false;
      }

      tCard.task.template = option.url || tCard.task.template;

      tCard.task.data = tCard.task.data || option.data;
      tCard.task.appMap = option.appMap;
      tCard.task.appData = option.appData;
      tCard.task.tempData = option.tempData;
      tCard.task.routeView = option.routeView;
      tCard.task.url = "";
      tCard.task.tProxy = option.tProxy;

      if (option.dsl) {
        _self.attachAttribute(option.dsl, tCard.task);
      }

      tCard.task.promise = tCard.task.promise || {};

      if (flag === "initData") {
        tCard.task.promise.beforeRender = function (c, d, t) {
          callback(c, d, t);
        }
      }

      var tCallback = null;
      if (tCard.task.promise.afterRender) {
        tCallback = tCard.task.promise.afterRender;
      }

      tCard.task.promise.afterRender = function (c, d, t) {
        if (typeof tCallback === "function") {
          tCallback(c, d, t);
        }
        if (typeof (option.callback) === "function") {
          option.callback(c, d, t);
        }
        if (flag !== "initData" && typeof (callback) === "function") {
          callback(c, d, t);
        }
      }
    }

    // if (typeof data !== "function") {
    //   tCard.task.data = data;
    // }

    this.addCardItem(elem, tCard);
    scene.card = tCard;

  }
  return scene;
};

WebCpu.prototype.transferCardData = function (container, cardData, options, callback) {
  var _self = this;
  var task = {
    mode: options.mode,
    renderType: options.renderType || "replace",
    container: container,
    unit: options.unit,
    initData: options.callback,
    initView: callback,
    promise: {
      beforeRender: function (container, data, task) {
        if (options.interface && _self.CardItem && webCpu.CardItem.updateConfig) {
          webCpu.CardItem.updateConfig(data, options.interface);
        }
        if (typeof (task.initView) === "function" && data.task) {
          // task.initView(container, data, task);
          data.task._initView = task.initView;
        }
        if (typeof (task.initData) === "function") {
          task.initData(container, data, task);
        }
        if (options.clone) {
          task.data = WebTool.copyObject(data);
        }
        task.data.className = task.data.className || "TemplateItem";
        _self.cards = _self.cards || {};
        if (task.data.cardName) {
          if (!_self.layout) {
            _self.cards[task.data.cardName] = task.data;
          } else {
            _self.layout.cards[task.data.cardName] = task.data;
          }
        }
      },
      afterRender: function (container, data, task) {

      }
    }
  }
  if (typeof (cardData) === "string") {
    task.url = cardData;
    task.requestType = "_jsonp";
    task.query = options.key || "transweb_cn";
    task.cardName = options.cardName;
  } else {
    task.data = cardData;
    task.url = "";
  }
  return task;
}

WebCpu.prototype.excuteTasks = function (elem, appMap, routerIndex) {
  try {
    var containers = elem.querySelectorAll("[component]");
    for (var i = 0; i < containers.length; i++) {
      if (routerIndex === i) {
        continue;
      }
      // containers[i].innerHTML = "<div class='renderingTips'>rendering...</div>";
      this.excuteSingleTask(containers[i], appMap, i);
    }
  } catch (e) {
    console.log("Tasks excute error:");
    console.log(e);
  }
}

WebCpu.prototype.render = function (param, task, path, shadowDom) {
  if (typeof (param) === "string" && task) {
    this._render(param, task, path, shadowDom);
  } else if (param.className && param.task) {
    this._render(param.className, param.task, param.componentPath, shadowDom);
  } else {
    console.log("Invalid component[%1]".replace("%1", (param.className || param)));
  }
}

WebCpu.prototype._render = function (name, task, path, shadowDom) {
  if (!this[name]) {
    var mission = []
    if (typeof (task) === "object" && task.constructor.name === "Array") {
      mission = task;
    } else if (!!task) {
      mission = [task];
    } else {
      mission = [];
    }
    var path = path || this.componentPath;
    this.link(path, name, mission, shadowDom);
  } else if (this[name].state !== 1) {
    this[name].mission.push(task);
  } else {
    this[name].render(task);
  }
}

WebCpu.prototype.link = function (path, name, mission, shadowDom) {
  if (!this[name]) {
    var control = {
      path: path,
      mission: mission,
      shadowDom: shadowDom
    }
    if (path) {
      WebAdapter.load(path + '/' + name + "/main.js");
    } else {
      WebAdapter.load(name + "/main.js");
    }
    this[name] = control;
  }
}

WebCpu.prototype.regComponent = function (name, config, callback) {
  try {
    config = config || {};
    var _self = this;
    if (this[name] && this[name].path) {
      var control = this[name];
      config.path = control.path;
      config.shadowDom = control.shadowDom;
    }
    config.name = name;
    var mission = (control && control.mission) || [];
    this[name] = new ViewControl(config, function (container, data, t) {
      //initial component
      callback(container, data, t);
      console.log("execed successfully: Component " + name);
    }, mission);
  } catch (e) {
    console.log("Reg failed: component[" + name + "], " + e);
  }
}

WebCpu.prototype.request = function (interface, query, callback, param) {
  var url = interface.url || interface.path;
  var type = interface.requestType || interface.method;
  var options = {
    dataType: interface.dataType || "json",
    contentType: interface.contentType,
    proxy: interface.proxy
  }
  query = query || interface.query;
  WebAdapter.request(url, type, query, callback, options, param);
}

WebCpu.prototype.renderCard = function (elem, option, cardName, callback) {
  let current = 0;
  let _self = this;
  WebAdapter.loadCardData(option.url, option.key, function (cData) {
    if (typeof cardName === "number") {
      current = cardName;
    } else if (typeof cardName === "string") {
      current = WebTool.searchArray(cData, "cardName", cardName);
      if (current === -1) {
        current = 0;
      }
    } else {}
    _self.updateView(elem, cData[current], callback);
  });
}

WebCpu.prototype.initWebApp = function (elem, app) {
  if (!app) {
    return false;
  }
  var tCard = app;
  var key = app.key;
  var url = app.url || app;
  var _self = this;
  if (key && url) {
    WebAdapter.loadCardData(url, key, function (data) {
      tCard = data;
      if (typeof (app.callback) === "function") {
        app.callback(data);
      }
      if (data.style) {
        var style = document.querySelector("style.commonStyle");
        if (style) {
          style.parentNode.removeChild(style);
        }
        style = document.createElement("style");
        style.innerHTML = data.style;
        style.setAttribute("class", "commonStyle");
        document.head.appendChild(style);
      }

      if (data.moduleMap && data.routeData) {
        _self.initProject(elem, data);
      } else {
        _self.addCardItem(elem, data);
      }
    });
  } else {
    tCard = {
      task: {}
    }
    for (var k in app) {
      tCard.task[k] = app[k];
    }
    tCard.task.remote = true;
    tCard.task.template = app.url;
    tCard.task.url = "";
    tCard.task.promise = {
      afterRender: function (c, d, t) {
        if (typeof (app.callback) === "function") {
          app.callback(c, d, t);
        }
      }
    }
    webCpu.addCardItem(elem, tCard);
  }
  return tCard;
}

WebCpu.prototype.getDslData = function (htmlStr) {
  var div = document.createElement("div");
  div.innerHTML = htmlStr;
  var ret = {};
  var script = div.querySelector("script");
  if (script) {
    var tStr = script.innerHTML.trim();
    var tArr = tStr.split("{");
    tArr.shift();

    tStr = "{" + tArr.join("{");

    if (tStr) {
      tStr = tStr.trim();
      tStr = tStr.replace(/\;$/, '');
      try {
        ret = eval('(' + tStr + ')');
      } catch (e) {
        console.log(e, elem, htmlStr, type);
      }
    }
    div.removeChild(script);
  }
  return ret;
}

WebCpu.prototype.renderHTML = function (elem, htmlStr, type) {
  try {
    var div = document.createElement("div");
    div.innerHTML = htmlStr;
    var style = div.querySelector("style");
    var id = MurmurHash.rule(Math.random() + '', 31);
    if (style) {
      div.removeChild(style);
      var str = style.innerHTML;
      str = WebTool.json2css(WebTool.css2json(str), id);
      style.innerHTML = str;
      if (elem.parentNode) {
        elem.parentNode.appendChild(style);
      } else {
        document.head.appendChild(style);
      }
    }
    var ret = {};
    var script = div.querySelector("script");
    if (script) {
      var tStr = script.innerHTML.trim();
      var tArr = tStr.split("{");
      tArr.shift();

      tStr = "{" + tArr.join("{");

      if (tStr) {
        tStr = tStr.trim();
        tStr = tStr.replace(/\;$/, '');
        try {
          ret = eval('(' + tStr + ')');
        } catch (e) {
          console.log(e, elem, htmlStr, type);
        }
      }
      div.removeChild(script);
    }

    if (type === "vuejs") {
      var template = div.querySelector("template") || div;
      elem.innerHTML = template.innerHTML;
    } else {
      elem.innerHTML = div.innerHTML;
    }

    var arr = elem.querySelectorAll("[component='CardItem']");
    for (var i = 0; i < arr.length; i++) {
      arr[i].setAttribute("itemType", "layoutCardItem");
    }

    elem.setAttribute("transweb-id", id);
  } catch (e) {
    console.log(e, elem, htmlStr, type);
  }
  return ret;
}

WebCpu.prototype.previewAppData = function (elem, data, type, url) {
  if (typeof data !== "string" && !data.className && data.className !== "TemplateItem" && data.className !== "ElementVueItem") {
    data = WebTool.objectToString(data);
  }
  if (!elem) {
    return false;
  }
  elem.innerHTML = "";
  $(elem).find(".appDataPreviewItem").remove();
  var iframe = document.createElement("iframe");
  var time = new Date().getTime() + "";
  var iFrameId = MurmurHash.rule(time, 31);
  iframe.src = url || "preview.html" + "?iFrameId=" + iFrameId;
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.frameborder = "0px";
  iframe.style = "border: none;"
  elem.appendChild(iframe);
  WebTool.listenMessage(function (tData) {
    var d = tData.data || {};
    if (iframe.contentWindow && d.iFrameId === iFrameId && d.type === "inited" && d.value === "previewIframe") {
      iframe.contentWindow.postMessage({
        type: "viewAppData",
        appType: type,
        data: data,
        iFrameId: iFrameId
      }, "*");
    }
  }, "*")
}

WebCpu.prototype.initAppItem = function (elem, app, webApp, callback) {
  webApp = webApp || {};
  if (webApp.interface) {
    this.initAdapter(webApp.interface);
  }
  if (webApp.appMap) {
    this.attachAttribute(webApp.appMap, this.appMap);
  }
  this.params = webApp.params || {};
  this.data = webApp.data || {};

  if (webApp.interceptor) {
    AjaxInterface.interceptor = webApp.interceptor;
  }
  config = webApp.dependency || {};
  config.path = config.path || this.componentPath;
  let _self = this;
  this.initModule(config, "main", function (c, d, t) {
    _self.updateView(c, app, function (cc, dd, tt) {
      if (typeof callback === "function") {
        callback(cc, dd, tt);
      }
    });
  });
  var task = config;
  if (typeof (config.interface) === "string") {
    config.interface = this.interface[config.interface];
  }
  if (config.interface) {
    for (var k in config.interface) {
      task[k] = config.interface[k];
    }
  }

  var myCard = {
    className: "main",
    cardName: "main",
    task: task
  }
  this.addCardItem(elem, myCard);
}

WebCpu.prototype.initProject = function (elem, webApp) {
  if (webApp.interface) {
    this.initAdapter(webApp.interface);
  }
  if (webApp.appMap) {
    this.attachAttribute(webApp.appMap, this.appMap);
  }
  this.params = webApp.params || {};
  this.data = webApp.data || {};

  if (webApp.interceptor) {
    AjaxInterface.interceptor = webApp.interceptor;
  }
  config = webApp.dependency || {};
  config.path = config.path || this.componentPath;
  this.initModule(config, "main", function (c, d, t) {
    webCpu.router = new TranswebRouter(c, webApp.moduleMap, webApp.routeData, webApp.breadcrumb, webApp.breadMap);
  });

  var task = config;
  if (typeof (config.interface) === "string") {
    config.interface = webCpu.interface[config.interface];
  }
  if (config.interface) {
    for (var k in config.interface) {
      task[k] = config.interface[k];
    }
  }
  // if(config.dsl) {
  //   this.attachAttribute(config.dsl, task);
  // }
  style = webApp.style || {};
  if (style.contentStyle) {
    var sItem = document.querySelector(".contentStyleItem");
    if (sItem && sItem.parentNode) {
      sItem.parentNode.removeChild(sItem);
    }
    sItem = document.createElement("style");
    sItem.innerHTML = decodeURIComponent(style.contentStyle);
    document.head.appendChild(sItem);
  }
  task.style = style.renderStyle || {};
  if (webApp.size && webApp.mode !== "mobile") {
    task.style.width = webApp.size.width;
    task.style.height = webApp.size.height;
  }
  var myCard = {
    className: "main",
    cardName: "main",
    style: style.containerStyle || {},
    task: task
  }
  this.addCardItem(elem, myCard);
}

WebCpu.prototype.playScript = function (script, key) {
  let app = {
    className: "TemplateItem",
    dsl: {
      url: script,
      query: {
        callback: key
      },
      requestType: "jsonp",
      promise: {
        beforeRender: function (c, d, t) {
          arr = d.timeEvents || d;
          if (arr && arr.length !== 0 && typeof webCpu.CardItem.initTimeEvent === "function") {
            webCpu.CardItem.initTimeEvent(document.body, arr, window);
          }
        }
      }
    }
  }
  let elem = document.createElement("div");
  elem.style = {
    position: "absolute",
    width: "1px",
    height: "1px",
    zIndex: -1000,
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0.1)"
  }
  document.body.appendChild(elem);
  this.updateView(elem, app);
}

TranswebRouter = function (elem, moduleMap, routeData, breadcrumb, breadMap) {
  this.routeData = routeData || [];
  this.breadcrumb = breadcrumb || {};
  this.moduleMap = moduleMap;
  //面包屑点击跳转地址映射map对象(在CardItem组件中实现跳转)
  this.breadMap = breadMap || {};
  this.elem = elem || document.body;
  this.query = {};
  this.path = "/";
  this.home = routeData[0];
  for (var i = 0; i < routeData.length; i++) {
    var module = routeData[i].module;
    if (this.moduleMap[module] && this.moduleMap[module].isHome) {
      this.home = routeData[i];
      break;
    }
  }

  var _self = this;
  window.window.onhashchange = function (d) {
    _self.switchPage(d);
  }
  this.routeMap = this.initData(this.routeData);
  this.switchPage();
}

TranswebRouter.prototype.initData = function (arr) {
  var ret = {};
  arr = arr || [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].path) {
      ret[arr[i].path] = arr[i];
      if (arr[i].children && arr[i].children.constructor.name === "Array") {
        ret[arr[i].path].children = this.initData(arr[i].children);
      }
    }
  }
  return ret;
}



TranswebRouter.prototype.renderPage = function (elem, arr, rMap) {
  if (!this.routeData || this.routeData === 0) {
    return false;
  }
  var key = "home";
  this.moduleMap = this.moduleMap || {};
  if (!this.routeData || !this.routeData[0]) {
    return false;
  }

  var temp = this.moduleMap[this.home.module] || this.moduleMap[key];
  if (!arr || arr.length === 0) {
    var app = temp;
    webCpu.updateView(elem, app);
  } else {
    var path = arr.shift();
    var rData = rMap[path] || rMap[this.home.path] || rMap['/' + key];
    if (!rData) {
      return false;
    }

    var mName = rData.module;
    var app = this.moduleMap[mName] || {};
    app.routeView = rData.routeView;
    var _self = this;
    elem.setAttribute("name", mName);
    webCpu.updateView(elem, app, function (cc, d, t) {
      if (rData.children && arr.length !== 0) {
        var elemArr = $(cc).find("div[component='CardItem']");
        var rIndex = rData.routeView;
        var view = elemArr[rIndex];
        if (rIndex || view) {
          _self.renderPage(view, arr, rData.children);
        }
      }
    });
  }
}

TranswebRouter.prototype.switchPage = function (d) {
  this.initRouter();
  var arr = this.path.match(/\/\w*/g);
  this.renderPage(this.elem, arr, this.routeMap);
}

TranswebRouter.prototype.push = function (d) {
  d = d || {};
  if (typeof d === "string") {
    d = {
      path: d
    }
  }
  var hash = "#" + (d.path || "/");
  if (d.query) {
    hash = WebTool.attachParams(hash, d.query);
  }
  this.params = d.params || {};
  location.hash = hash;
}

TranswebRouter.prototype.initRouter = function () {
  var hash = location.hash || "";
  if (!hash) {
    return false;
  }
  var t = hash.match(/\#\S*\?/) || [''];
  this.path = t[0].replace(/[\#\?]/g, "") || hash.replace(/^\#/g, "");
  t = hash.match(/\?\S*/) || [''];
  var qStr = t[0].replace(/^\?/, "");
  arr = qStr.match(/\w+\=/g) || [];
  arr = arr.map(function (item) {
    return item.replace("=", "");
  });
  var vArr = qStr.match(/\=\w*/g) || [];
  vArr = vArr.map(function (item) {
    return item.replace("=", "");
  });
  for (var i = 0; i < arr.length; i++) {
    this.query[arr[i]] = vArr[i] || "";
  }
}


var CrossDomainService = function (interfaceData, callback) {
  // this.cardList = cardList;
  this.interfaceData = interfaceData;
  this.messageCallback = {};
  if (!this.interfaceData) {
    return;
  };

  if (this.interfaceData.constructor.name !== "Array") {
    var iUrl = this.interfaceData.src || this.interfaceData
    this.iframe = this.getBridgeIframe(iUrl);
  }

  var _self = this;
  WebTool.listenMessage(function (e) {
    var data = e.data;
    if (typeof (data) === "string" && data.search('{') !== -1 && data.search('}') !== -1) {
      data = JSON.parse(data);
    }
    if (data.inited) {
      var proxy = data.url;
      var key = MurmurHash.rule(proxy, 31);
      if (webCpu.crossItem[key]) {
        webCpu.crossItem[key].inited = data.inited;
      }
      if (typeof (callback) === "function") {
        data = data || {};
        callback(_self, data.data);
      }
    }
    if (data.messageId && typeof (_self.messageCallback[data.messageId]) === "function") {
      _self.messageCallback[data.messageId](data.data);
      delete _self.messageCallback[data.messageId];
    } else {}
  });
}

CrossDomainService.prototype.request = function (url, query, requestType, callback, type, contentType) {
  var key = MurmurHash.rule(url + JSON.stringify(query), 31);
  var messageId = "_" + (new Date()).getTime() + key;
  var requestData = {
    query: query,
    requestType: requestType,
    url: url,
    dataType: type,
    contentType: contentType,
    messageId: messageId
  }
  requestData = JSON.parse(JSON.stringify(requestData));
  this.iframe.contentWindow.postMessage(requestData, "*");
  this.messageCallback[messageId] = function (data) {
    if (typeof callback === "function") {
      callback(data);
    }
  }
}

CrossDomainService.prototype.getBridgeIframe = function (url) {
  var id = MurmurHash.rule(url);
  var iframe = document.getElementById(id);
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.setAttribute('allowTransparency', 'true');
    iframe.setAttribute('id', MurmurHash.rule(url));
    iframe.setAttribute('frameBorder', '0');
    iframe.setAttribute('scrolling', 'no');
    iframe.style.cssText = 'height:0px;width:0px;float:none;position:absolute;overflow:hidden;z-index:333333;margin:0;padding:0;border:0 none;background:none;';
    document.body.appendChild(iframe);
  }
  iframe.src = url;

  return iframe;
}

var WebTool = {};

WebTool.listenMessage = function (callback, origin) {
  var tCallback = function (message) {
    if (!origin || origin === message.origin || origin === "*") {
      callback(message);
    }
  };
  if (window.addEventListener) {
    window.removeEventListener('message', tCallback);
    window.addEventListener('message', tCallback, false)
  } else {
    window.detachEvent("onmessage", tCallback);
    window.attachEvent('onmessage', tCallback);
  }
}

WebTool.urlQuery = function (url, key) {
  var t = url.split("#");
  var ret = 0;
  for (var i = 0; i < t.length; i++) {
    ret = ret || this._urlQuery(t[i], key);
  }
  return ret;
}

WebTool.downLoadByUrl = function (url, name, method, param, header) {
  if (!url) {
    return false;
  }
  var arr = url.split("/");
  if (arr.length < 2) {
    arr = url.split("\\");
  }
  name = name || arr[arr.length - 1];

  var xhr = new XMLHttpRequest();
  //GET请求,请求路径url,async(是否异步)
  method = method || "GET";
  xhr.open(method, url, true);
  //设置请求头参数的方式,如果没有可忽略此行代码
  if (header) {
    for (var k in header) {
      xhr.setRequestHeader(k, header[k]);
    }
  }
  //设置响应类型为 blob
  xhr.responseType = 'blob';

  var _self = this;
  //关键部分
  xhr.onload = function (e) {
    //如果请求执行成功
    if (this.status == 200) {
      var blob = this.response;
      _self.downloadString(blob, name);
    }
  };
  //发送请求
  if (header && header['Content-Type'].search("application/json") !== -1) {
    param = JSON.stringify(param);
  }
  xhr.send(param);
}

WebTool.jsonToExcel = function (data, head, name = 'test') {
  let str = head ? head + '\n' : '';
  data.forEach(item => {
    // 拼接json数据, 增加 \t 为了不让表格显示科学计数法或者其他格式
    for (let key in item) {
      str = `${str + item[key] + '\t'},`
    }
    str += '\n'
  });
  console.log(str)
  // encodeURIComponent解决中文乱码
  const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
  // 通过创建a标签实现
  const link = document.createElement("a");
  link.href = uri;
  // 对下载的文件命名
  link.download = `${name + '.csv'}`;
  link.click();
}

WebTool.urlToBase64 = function (url, callback, type) {
  let proxy = false;
  let re = `^${location.origin}`;
  if (url && url.search(/^http/) !== -1 && url.search(re) === -1) {
    proxy = true;
  }
  var request = new WebRequest(url, "get", "text", "", proxy);
  request({}, function (data) {
    WebTool.stringToBase64(data, callback, type);
  });
}

WebTool.stringToBase64 = function (blob, callback, type) {
  if (typeof blob === "string") {
    type = type || "text/plain";
    blob = new Blob([blob], {
      type: type
    });
  }
  blob.type = "application/octet-stream";
  const fileReader = new FileReader();
  fileReader.onload = (e) => {
    // resolve(e.target.result);
    if (typeof callback === "function") {
      callback(e.target.result);
    }
  };
  // readAsDataURL
  fileReader.readAsDataURL(blob);
  fileReader.onerror = () => {
    reject(new Error('blobToBase64 error'));
  };
}

WebTool.downloadString = function (blob, name, type) {
  if (typeof blob === "string") {
    type = type || "text/plain";
    blob = new Blob([blob], {
      type: type
    });
  }
  var filename = name || '匿名文件'; //如123.xls
  var a = document.createElement('a');

  blob.type = "application/octet-stream";
  //创键临时url对象
  var url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  //释放之前创建的URL对象
  window.URL.revokeObjectURL(url);
}

WebTool.getQueryParams = function (url) {
  url = url || window.location.search;
  let arr = url.split("?");
  url = arr[arr.length - 1];
  const params = url.substring(0).split('&').reduce((acc, param) => {
    let [key, value] = param.split('=');
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
  return params;

}

WebTool._urlQuery = function (url, key) {
  let params = this.getQueryParams(url);
  return params[key];
}



WebTool.getRandomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

WebTool.cookieQuery = function (cookie, name) {
  if (cookie.search(name + "=") === 0) {
    var value = cookie.split(name + "=")[1].split("; ")[0];
  } else if (cookie.search("; " + name + "=") !== -1) {
    var value = cookie.split("; " + name + "=")[1].split("; ")[0];
  } else {
    var value = null;
  }
  return value;
}

WebTool.pageHash = function (url) {
  var tArr = url.split("#");
  if (tArr.length > 1) {
    return tArr[1].split("?")[0];
  } else {
    return "";
  }
}

WebTool.attachParams = function (url, params) {
  if (url.indexOf("?") === -1) {
    flag = 0;
  } else {
    flag = 1;
  }
  for (var k in params) {
    var v = params[k];
    if (typeof (v) != "string") {
      v = JSON.stringify(v);
    }
    if (flag == 0) {
      url += "?" + k + "=" + encodeURIComponent(v);
      flag = 1;
    } else {
      url += "&" + k + "=" + encodeURIComponent(v);
    }
  }
  return url;
}

WebTool.objectToString = function (obj, flag) {
  if (obj && obj.constructor.name === "Object") {
    var str = "{";
    for (var k in obj) {
      if (typeof (obj[k]) === "string") {
        if (obj[k].search("'") !== -1) {
          str += "\"" + k + '\":"' + obj[k] + '",';
        } else {
          str += "\"" + k + "\":'" + obj[k] + "',";
        }

      } else {
        str += "\"" + k + "\":" + this.objectToString(obj[k]) + ","
      }
    }
    if (str.length === 1) {
      str = "{}"
    } else {
      str = str.slice(0, str.length - 1) + "}";
    }
  } else if (obj && (obj.constructor.name === "Array")) {
    if (obj.length > 0) {
      var str = "[ " + this.objectToString(obj[0]);
      for (var i = 1; i < obj.length; i++) {
        str += "," + this.objectToString(obj[i]);
      }
      str += "]"
    } else {
      var str = "[]";
    }
  } else if (obj && (obj.constructor.name === "Function")) {
    var str = obj.toString();
  } else if (obj && (typeof (obj) === "string")) {
    if (flag) {
      var str = "\'" + escape(obj) + "\'";
    } else {
      var str = "\'" + obj.replace(/\'/g, "\\'") + "\'";
    };
  } else if ((typeof (obj) === "number") || (typeof (obj) === "boolean")) {
    var str = obj;
  } else {
    var str = "''";
  }
  return str;
}

WebTool.stringToObject = function (str, flag) {
  if (flag) {
    try {
      var temp = unescape(str);
      str = temp;
    } catch (e) {
      console.log(e);
    }
  }
  var data = eval("(\n" + str + "\n)");
  return data;
}

WebTool.copyString = function (val) {
  var input = document.createElement("input");
  input.value = val;
  input.readOnly = true
  input.style.position = "fixed";
  input.style.left = "-999px";
  input.style.top = "10px";
  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, input.value.length)
  document.execCommand('copy');
  document.body.removeChild(input);
}

WebTool.copyObject = function (obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  const clone = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'function') {
        let t = eval(`({a: ${value.toString()}})`);
        clone[key] = t.a;
      } else {
        clone[key] = this.copyObject(value);
      }
    }
  }
  return clone;
}

WebTool.bind = function (node, type, listener, flag) {
  if (node.attachEvent) {
    node.attachEvent('on' + type, listener);
  } else if (node.addEventListener) {
    node.addEventListener(type, listener, flag);
  } else {}
}

WebTool.tranformImage = function (elem, name, type, color, callback) {

  var _self = this;
  setTimeout(function () {
    html2canvas(
      elem, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: color || "transparent"
      }
    ).then(htmlCanvas => {
      var dataurl = htmlCanvas.toDataURL(type || 'image/jpeg');
      var bin = atob(dataurl.split(',')[1]);
      //创建空的Uint8Array
      var buffer = new Uint8Array(bin.length);
      //将图像数据逐字节放入Uint8Array中
      for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
      }

      //利用Uint8Array创建Blob对象
      var blob = new Blob([buffer.buffer], {
        type: type
      });

      if (typeof (callback) === "function") {
        callback(dataurl, blob);
      } else {
        _self.downloadString(blob, name)
      }

    });
  }, 200);
};
WebTool.srcToDataUrl = function (imageUrl, callback) {
  if (imageUrl) {
    // 创建一个图片元素
    var image = new Image();

    // 设置图片的源
    image.src = imageUrl;

    // 当图片加载完成时
    image.onload = function () {

      // 创建一个Canvas元素
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');

      // 设置Canvas的大小为图片的大小
      canvas.width = image.width;
      canvas.height = image.height;

      // 在Canvas上绘制图片
      context.drawImage(image, 0, 0);

      // 获取 Data URL
      var dataUrl = canvas.toDataURL('image/png'); // 可以根据需要调整图片格式
      if (typeof callback === "function") {
        callback(dataUrl);
      }
    };
  }
}

WebTool.fullscreenDisplay = function (fullscreenElement) {
  // 为元素添加点击事件，点击时进入全屏模式
  if (fullscreenElement.requestFullscreen) {
    fullscreenElement.requestFullscreen();
  } else if (fullscreenElement.mozRequestFullScreen) {
    // Firefox
    fullscreenElement.mozRequestFullScreen();
  } else if (fullscreenElement.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    fullscreenElement.webkitRequestFullscreen();
  } else if (fullscreenElement.msRequestFullscreen) {
    // IE/Edge
    fullscreenElement.msRequestFullscreen();
  }
}

WebTool.exitFullscreen = function () {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { // Firefox
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { // IE/Edge
    document.msExitFullscreen();
  }
}


WebTool.searchArray = function (arr, k, v) {
  if (!arr || arr.constructor.name !== "Array") {
    return -1;
  }
  var ret = -1;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][k] === v) {
      ret = i;
      break;
    }
  }
  return ret;
}

WebTool.cookie = function () {
  if (arguments.length === 0) {
    return document.cookie;
  } else if (arguments.length === 1) {
    var name = arguments[0];
    var cookie = document.cookie;
    value = WebTool.cookieQuery(cookie, name);
    return value;
  } else if (arguments.length === 2) {
    var name = arguments[0];
    var value = arguments[1];
    document.cookie = name + '=' + value;
  } else if (arguments.length === 3) {
    var name = arguments[0];
    var value = arguments[1];
    var expires = arguments[2];
    var tData = new Date();
    tData.setDate(tData.getDate() + expires);
    document.cookie = name + '=' + value + ';expires=' + tData + ';path=/;';
  } else if (arguments.length === 4) {
    var name = arguments[0];
    var value = arguments[1];
    var expires = arguments[2];
    var domain = arguments[3];
    var tData = new Date();
    tData.setDate(tData.getDate() + expires);
    document.cookie = name + '=' + value + ';expires=' + tData + ';path=/;' + 'domain=' + domain;
  } else {}
}

WebTool.removeRecord = function (key, n, kName) {
  if (kName) {
    n = this.searchRecord(key, n, kName);
  }
  var data = this.getItem(key);
  if (!data) {
    data = [];
    this.setItem(key, data);
  }
  data.splice(n, 1);
  this.setItem(key, data);
  return data;
}

WebTool.searchRecord = function (key, item, kName) {
  var data = this.getItem(key);
  if (!data) {
    data = [];
    this.setItem(key, data);
  }
  var ret = -1;
  for (var i = 0; i < data.length; i++) {
    if (data[i][kName] === item[kName]) {
      ret = i;
      break;
    }
  }
  return ret;
}


WebTool.addRecord = function (key, item, kName) {
  var data = this.getItem(key);
  if (!data) {
    data = [];
    this.setItem(key, data);
  }
  kName = kName || "$$$";
  var t = this.searchRecord(key, item, kName);
  if (t === -1) {
    data.push(item);
  } else {
    data[t] = item;
  }
  this.setItem(key, data);
  return data;
}
WebTool.setItem = function (key, d) {
  localStorage.setItem(key, JSON.stringify(d));
  return d;
}
WebTool.getItem = function (key) {
  return JSON.parse(localStorage.getItem(key));
}

WebTool.readXPath = function (element, root) {
  root = root || document.body;
  if (element.id !== "") { //判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
    return '//*[@id=\"' + element.id + '\"]';
  }
  //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
  if (element == root) { //递归到body处，结束递归
    return element.tagName.toLowerCase();
  }
  var ix = 1, //在nodelist中的位置，且每次点击初始化
    siblings = element.parentNode.childNodes; //同级的子元素

  for (var i = 0, l = siblings.length; i < l; i++) {
    var sibling = siblings[i];
    //如果这个元素是siblings数组中的元素，则执行递归操作
    if (sibling == element) {
      return arguments.callee(element.parentNode, root) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
      //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
    } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
      ix++;
    }
  }
};

WebTool.queryXPath = function (xpath, element) {
  var tElem = element.parentNode || document;
  var elem = document.evaluate(xpath, tElem).iterateNext();
  return elem;
}

WebTool.getBgColor = function (ctx) {
  let w = ctx.canvas.width;
  let h = ctx.canvas.height;
  let t = 30;
  let arr = [{
    x: t,
    y: t
  }];
  let color = this.getColor(ctx, arr[0].x, arr[0].y);

  return color;
}

WebTool.getColor = function (ctx, x, y) {
  var imageData = ctx.getImageData(x, y, 1, 1);
  var pixel = imageData.data;
  var r = pixel[0];
  var g = pixel[1];
  var b = pixel[2];
  var a = pixel[3] / 255;
  a = Math.round(a * 100) / 100;
  var rHex = r.toString(16);
  r < 16 && (rHex = "0" + rHex);
  var gHex = g.toString(16);
  g < 16 && (gHex = "0" + gHex);
  var bHex = b.toString(16);
  b < 16 && (bHex = "0" + bHex);
  var rgbaColor = "rgba(" + r + "," + g + "," + b + "," + a + ")";
  var rgbColor = "rgb(" + r + "," + g + "," + b + ")";
  var hexColor = "#" + rHex + gHex + bHex;
  return {
    rgba: rgbaColor,
    rgb: rgbColor,
    hex: hexColor,
    r: r,
    g: g,
    b: b,
    a: a
  };
}

WebTool.removeImgBg = function (imgUrl, tolerance, callback) {
  var img = new Image(); // 创建 img 元素
  img.crossOrigin = '';
  let _self = this;
  img.onload = function () {
    var w = img.width;
    var h = img.height;
    var imgData = null;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', {
      willReadFrequently: true
    });
    canvas.width = w;
    canvas.height = h;
    context.drawImage(img, 0, 0);
    imgData = context.getImageData(0, 0, w, h);

    tolerance = tolerance || 10;

    let color = _self.getBgColor(context);

    const [r0, g0, b0, a0] = [color.r, color.g, color.b, color.a];
    var r, g, b, a;

    for (let i = 0; i < imgData.data.length; i += 4) {
      r = imgData.data[i];
      g = imgData.data[i + 1];
      b = imgData.data[i + 2];
      a = imgData.data[i + 3];
      const t = Math.sqrt((r - r0) ** 2 + (g - g0) ** 2 + (b - b0) ** 2 + (a - a0) ** 2);
      if (t <= tolerance) {
        imgData.data[i] = 0;
        imgData.data[i + 1] = 0;
        imgData.data[i + 2] = 0;
        imgData.data[i + 3] = 0;
      }
    }
    context.putImageData(imgData, 0, 0);
    const newBase64 = canvas.toDataURL('image/png');
    if (typeof callback === "function") {
      callback(newBase64, img.src);
    }
  };
  img.src = imgUrl; // 设置图片源地址
}

/**
 * 将CSS形式的字符串转换为JSON
 *
 * @param {css字符串} css
 */
WebTool.css2json = function (css) {
  // 移除CSS所有注释
  while ((_open = css.indexOf("/*")) !== -1 &&
    (close = css.indexOf("*/")) !== -1) {
    css = css.substring(0, _open) + css.substring(close + 2);
  }

  // 初始化返回值
  let json = {};

  while (css.length > 0) {
    // 存储第一个左/右花括号的下标
    const lbracket = css.indexOf('{');
    const rbracket = css.indexOf('}');

    // 第一步：将声明转换为Object，如：
    // `font: 'Times New Roman' 1em; color: #ff0000; margin-top: 1em;`
    //  ==>
    // `{"font": "'Times New Roman' 1em", "color": "#ff0000", "margin-top": "1em"}`

    // 辅助方法：将array转为object
    function toObject(array) {
      let ret = {};
      array.forEach(e => {
        const index = e.indexOf(':');
        const property = e.substring(0, index).trim();
        const value = e.substring(index + 1).trim();
        ret[property] = value;
      });
      return ret;
    }

    // 切割声明块并移除空白符，然后放入数组中
    let declarations = css.substring(lbracket + 1, rbracket)
      .split(";")
      .map(e => e.trim())
      .filter(e => e.length > 0); // 移除所有""空值

    // 转为Object对象
    declarations = toObject(declarations);



    // 第二步：选择器处理，每个选择器会与它对应的声明相关联，如：
    // `h1, p#bar {color: red}`
    // ==>
    // {"h1": {color: red}, "p#bar": {color: red}}

    let selectors = css.substring(0, lbracket)
      // 以,切割，并移除空格：`"h1, p#bar, span.foo"` => ["h1", "p#bar", "span.foo"]
      .split(",")
      .map(selector => selector.trim());

    // 迭代赋值
    selectors.forEach(selector => {
      // 若不存在，则先初始化
      if (!json[selector]) json[selector] = {};
      // 赋值到JSON
      Object.keys(declarations).forEach(key => {
        json[selector][key] = declarations[key];
      });
    });

    // 继续下个声明块
    css = css.slice(rbracket + 1).trim();
  }

  // 返回JSON形式的结果串
  return json;
}

WebTool._css2json = function (cssString) {
  const json = {};

  // 匹配媒体查询规则
  const mediaQueryRegex = /@media[^{]*\{([\s\S]*?)\s*}/g;
  cssString.replace(mediaQueryRegex, (match, mediaQuery) => {
    json['@media'] = json['@media'] || [];
    json['@media'].push(this.css2json(mediaQuery));
    return '';
  });

  // 匹配选择器规则
  const selectorRegex = /([^{]+)\s*{([^}]*)}/g;
  cssString.replace(selectorRegex, (match, selectors, declarations) => {
    const selectorArray = selectors.split(',').map(s => s.trim());
    selectorArray.forEach(selector => {
      json[selector] = json[selector] || {};
      const properties = this.css2json(declarations);
      Object.assign(json[selector], properties);
    });
    return '';
  });

  return json;
}

WebTool._json2css = function (styleObject) {
  let str = cssobj(styleObject).toString();
  return str;
}

/**
 * 将json对象转换为css
 *
 * @param {json对象} json
 */
WebTool.json2css = function (json, id) {
  var str = "";
  for (var k in json) {
    var d = json[k];
    for (var t in d) {
      if (d[t] === '""') {
        d[t] = "''";
      }
    }
    var v = JSON.stringify(d).replace(new RegExp(',"', 'gm'), '; "').replace(new RegExp('"', 'gm'), '').replace(/:{/ig, "{");
    var temp = `div[transweb-id='${id}'] ${k} ${v}`;
    str += temp + "\n";
  }
  return str;
}

WebTool.adjustSize = function (arr, _arr) {
  var v = document.body.clientWidth;
  var ret = arr[0];
  _arr = _arr || [768, 1200];
  if (v < _arr[1] && v > _arr[0]) {
    ret = arr[1] === undefined ? arr[0] : arr[1];
  } else if (v > _arr[1] + 0.00001) {
    ret = arr[0];
  } else if (v < _arr[0] - 0.00001) {
    ret = arr[2] === undefined ? arr[1] : arr[2];
  }

  return ret;
}

WebTool.setShortcutKey = function (elem, key, callback) {
  try {
    $(elem).on("keydown", function (e) {
      if ((typeof (key) === "string" || typeof (key) === "number") && e.keyCode == key) {
        callback(e);
        return false;
      } else if (key && key.constructor.name === "Array" && e.keyCode == key[1] && e[key[0]]) {
        callback(e);
        return false;
      } else {}
      // console.log(e.keyCode);

    });
  } catch (e) {

  }
}




/****************************************************************************/
String.prototype.getKeys = function () {
  let re = /{{([^}}]+)?}}/g;
  let arr = this.match(re) || [];
  arr = arr.map(item => {
    item = item.replace(/^\{\{/, "");
    item = item.replace(/\}\}$/, "");
    return item;
  });
  return arr;
}
//模板HTML字符串与JSON对象绑定
String.prototype.bindData = function (obj, filter) {
  var ret = this;
  if (obj && typeof (obj) === "object") {
    var re = /{{([^}}]+)?}}/g;
    this.filter = filter;
    var _self = this;
    var ret = this.replace(re, function (m, t) {
      var temp = obj;
      var ret = (function () {
        var o = temp;
        var keys = t.split(".");
        for (var i = 0; i < keys.length; i++) {
          o = o[keys[i]];
          if (o === undefined || o === null) {
            o = "{{" + keys[i] + "}}";
          }
        }
        var m = !(_self.filter && typeof (_self.filter[keys[i - 1]]) === "function") ? o : _self.filter[keys[i - 1]](o);
        return m;
      })();
      return ret;
    });
  }
  return ret;
}

window.webCpu = new WebCpu();
webCpu.componentPath = "https://transweb.cn/transweb/components";

let aScript = WebTool.urlQuery(location.href, "aScript");
let scriptKey = WebTool.urlQuery(location.href, "scriptKey") || "transweb_events";
let scriptDelay = WebTool.urlQuery(location.href, "scriptDelay");
if (aScript) {
  if (scriptDelay) {
    let t = Number(scriptDelay) || 0;
    setTimeout(function () {
      webCpu.playScript(aScript, scriptKey);
    }, t * 1000);
  } else {
    webCpu.playScript(aScript, scriptKey);
  }
}