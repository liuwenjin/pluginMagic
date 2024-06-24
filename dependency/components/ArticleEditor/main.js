webCpu.regComponent("ArticleEditor", {
  html: '<div class="toolbar-container"></div>\
          <div class="editor-container" style="height: calc( 100% - 120px ); overflow: auto;"></div>',
  css: {
    style: "style.css",
    editor: "editor.css"
  },
  script: {
    eidtor: "editor.js"
  }
}, function (container, data, task) {
  const {
    createEditor,
    createToolbar,
    Boot
  } = window.wangEditor

  const toolbarConfig = {
    toolbarKeys: ["headerSelect", "webPage", "localImage", "localVideo", "insertImage", "insertVideo", "blockquote", "|", "bold", "underline", "italic", {
      "key": "group-more-style",
      "title": "更多",
      "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path></svg>",
      "menuKeys": ["through", "code", "sup", "sub", "clearStyle"]
    }, "color", "bgColor", "|", "fontSize", "fontFamily", "lineHeight", "|", "bulletedList", "numberedList", "todo", {
      "key": "group-justify",
      "title": "对齐",
      "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z\"></path></svg>",
      "menuKeys": ["justifyLeft", "justifyRight", "justifyCenter", "justifyJustify"]
    }, {
      "key": "group-indent",
      "title": "缩进",
      "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z\"></path></svg>",
      "menuKeys": ["indent", "delIndent"]
    }, "|", "emotion", "insertTable", "codeBlock", "divider", "|", "undo", "redo", "|", "fullScreen"],
    excludeKeys: ["fullScreen", "|", "emotion"]
  }

  class WebPageItem {
    constructor() {
      this.title = '插入网页' // 自定义菜单标题
      this.iconSvg = '<svg t="1718860351023" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5205" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M224 416h240v240H224zM16 112h992v128H16z" fill="#54FEBD" p-id="5206"></path><path d="M1008 944H16a16 16 0 0 1-16-16V80a16 16 0 0 1 16-16h992a16 16 0 0 1 16 16v848a16 16 0 0 1-16 16zM32 912h960V96H32v816z" fill="#1D1B4C" p-id="5207"></path><path d="M944 880H80a16 16 0 0 1-16-16V272a16 16 0 0 1 16-16h864a16 16 0 0 1 16 16v592a16 16 0 0 1-16 16zM96 848h832V288H96v560zM1008 224H16a16 16 0 1 1 0-32h992a16 16 0 1 1 0 32zM816 160c-4.16 0-8.32-1.76-11.36-4.64-2.88-3.04-4.64-7.2-4.64-11.36s1.76-8.32 4.64-11.36c5.92-5.92 16.8-5.92 22.72 0 2.88 3.04 4.64 7.2 4.64 11.36s-1.76 8.32-4.64 11.36c-3.04 2.88-7.04 4.64-11.36 4.64zM880 160a16.16 16.16 0 0 1-16-16c0-4.16 1.76-8.32 4.64-11.36 5.92-5.92 16.8-5.92 22.72 0 2.88 3.04 4.64 7.2 4.64 11.36s-1.76 8.32-4.64 11.36c-3.04 2.88-7.04 4.64-11.36 4.64zM944 160a16.16 16.16 0 0 1-16-16c0-4.16 1.76-8.32 4.64-11.36 5.76-5.92 16.8-5.92 22.72 0 2.88 3.04 4.64 7.2 4.64 11.36s-1.76 8.32-4.64 11.36c-3.04 2.88-7.2 4.64-11.36 4.64z" fill="#1D1B4C" p-id="5208"></path><path d="M752 224a16 16 0 0 1-16-16V80a16 16 0 1 1 32 0v128a16 16 0 0 1-16 16zM416 624H176a16 16 0 0 1-16-16V368a16 16 0 0 1 16-16h240a16 16 0 0 1 16 16v240a16 16 0 0 1-16 16z m-224-32h208V384H192v208zM848 384H528a16 16 0 1 1 0-32h320a16 16 0 1 1 0 32zM848 464H528a16 16 0 1 1 0-32h320a16 16 0 1 1 0 32zM848 544H528a16 16 0 1 1 0-32h320a16 16 0 1 1 0 32zM848 624H528a16 16 0 1 1 0-32h320a16 16 0 1 1 0 32zM848 704H176a16 16 0 1 1 0-32h672a16 16 0 1 1 0 32zM848 784H176a16 16 0 1 1 0-32h672a16 16 0 1 1 0 32z" fill="#1D1B4C" p-id="5209"></path></svg>'
      this.tag = 'button'
      this.showModal = true
      this.modalWidth = 500
    }

    getValue(editor) { // JS 语法
      return ''
    }

    // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
    isActive(editor) { // JS 语法
      return false
    }

    isDisabled(editor) { // JS 语法
      return false
    }
    // 点击菜单时触发的函数
    exec(editor, value) { // JS 语法
      // if (this.isDisabled(editor)) return

    }
    // 弹出框 modal 的定位：1. 返回某一个 SlateNode； 2. 返回 null （根据当前选区自动定位）
    getModalPositionNode(editor) { // JS 语法
      return null // modal 依据选区定位
    }

    // 定义 modal 内部的 DOM Element
    getModalContentElem(editor) {
      let inputId1 = `input-${Math.random().toString(16).slice(-8)}`;
      let inputId2 = `input-${Math.random().toString(16).slice(-8)}`;
      const $content = $(`<div style="padding: 20px 10px;"><div style="margin-bottom: 15px; margin-top: -25px;">插入网页</div><input class="form-control" placeholder="请输入网址(必填)" id=${inputId1} style="width: 100%; margin-bottom: 10px; text-indent: 10px;" /><input class="form-control" placeholder="请输入 rpa 脚本地址" id=${inputId2} style="width: 100%; margin-bottom: 10px; text-indent: 10px;" /></div>`);
      const $button = $('<button type="button" class="btn btn-primary btn-sm" style="margin-top: 10px;">确认插入</button>');
      $content.append($button);

      $button.off("click");
      $button.on('click', (e) => {
        e.preventDefault();
        
        let input1 = container.querySelector("#" + inputId1);
        let input2 = container.querySelector("#" + inputId2);
        if (input1.value) {
          let url = input1.value;
          if(input2.value) {
            url = WebTool.attachParams(url, {
              aScript: input2.value
            });
          }
          let iframe = `<iframe width="100%" src="${url}"></iframe>`
         
          let node = {
            type: "video",
            src: iframe,
            poster: "",
            width: 500,
            height: "auto",
            children: [{
              text: ''
            }]
          }
          editor.restoreSelection(); // 恢复选区
          // editor.dangerouslyInsertHtml("<div>（视频占位符）</div>")
          editor.insertNode(node);
        }
        return;
      });

      return $content[0] // 返回 DOM Element 类型

      // PS：也可以把 $content 缓存下来，这样不用每次重复创建、重复绑定事件，优化性能
    }
  }

  class LocalImageItem {
    constructor() {
      this.title = '本地图片' // 自定义菜单标题
      this.iconSvg = '<svg viewBox="0 0 1024 1024"><path d="M828.708571 585.045333a48.761905 48.761905 0 0 0-48.737523 48.761905v18.529524l-72.143238-72.167619a135.972571 135.972571 0 0 0-191.585524 0l-34.133334 34.133333-120.880762-120.953905a138.898286 138.898286 0 0 0-191.585523 0l-72.167619 72.167619V292.400762a48.786286 48.786286 0 0 1 48.761904-48.761905h341.23581a48.737524 48.737524 0 0 0 34.474667-83.285333 48.737524 48.737524 0 0 0-34.474667-14.287238H146.236952A146.212571 146.212571 0 0 0 0 292.400762v585.289143A146.358857 146.358857 0 0 0 146.236952 1024h584.996572a146.212571 146.212571 0 0 0 146.236952-146.310095V633.807238a48.786286 48.786286 0 0 0-48.761905-48.761905zM146.261333 926.45181a48.737524 48.737524 0 0 1-48.761904-48.761905v-174.128762l141.409523-141.458286a38.497524 38.497524 0 0 1 53.126096 0l154.526476 154.624 209.627428 209.724953H146.236952z m633.734096-48.761905c-0.073143 9.337905-3.145143 18.383238-8.777143 25.843809l-219.843048-220.94019 34.133333-34.133334a37.546667 37.546667 0 0 1 53.613715 0l140.873143 141.897143V877.714286zM1009.615238 160.231619L863.329524 13.897143a48.737524 48.737524 0 0 0-16.091429-10.24c-11.849143-4.87619-25.161143-4.87619-37.059047 0a48.761905 48.761905 0 0 0-16.067048 10.24l-146.236952 146.334476a49.005714 49.005714 0 0 0 69.217523 69.241905l62.902858-63.390476v272.627809a48.761905 48.761905 0 1 0 97.475047 0V166.083048l62.902857 63.390476a48.737524 48.737524 0 0 0 69.217524 0 48.761905 48.761905 0 0 0 0-69.241905z"></path></svg>'
      this.tag = 'button'
    }

    getValue(editor) { // JS 语法
      return ''
    }

    // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
    isActive(editor) { // JS 语法
      return false
    }

    isDisabled(editor) { // JS 语法
      return false
    }
    // 点击菜单时触发的函数
    exec(editor, value) { // JS 语法
      if (this.isDisabled(editor)) return
      // 创建一个input，用于选择本地视频文件
      const imageInput = document.createElement('input');
      imageInput.type = 'file';
      imageInput.accept = 'image/*';
      imageInput.style.display = 'none';

      // 监听change事件，当文件选择后触发
      imageInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const base64String = e.target.result;
            let node = {
              type: "image",
              src: base64String,
              poster: "",
              width: 300,
              height: "auto",
              children: [{
                text: ''
              }]
            }
            // editor.dangerouslyInsertHtml("<div>（视频占位符）</div>")
            editor.insertNode(node);
          };
          reader.readAsDataURL(file);
        }
      });

      // 触发input点击，打开文件选择对话框
      imageInput.click();
    }
  }

  class LocalVideoItem {
    constructor() {
      this.title = '本地视频' // 自定义菜单标题
      this.iconSvg = '<svg viewBox="0 0 1056 1024"><path d="M805.902261 521.819882a251.441452 251.441452 0 0 0-251.011972 246.600033 251.051015 251.051015 0 1 0 502.023944 8.823877 253.237463 253.237463 0 0 0-251.011972-255.42391z m59.463561 240.001647v129.898403h-116.701631v-129.898403h-44.041298l101.279368-103.504859 101.279368 103.504859z"></path><path d="M788.254507 0.000781H99.094092A98.663439 98.663439 0 0 0 0.001171 99.093701v590.067495a98.663439 98.663439 0 0 0 99.092921 99.092921h411.7549a266.434235 266.434235 0 0 1-2.186448-41.815807 275.843767 275.843767 0 0 1 275.180024-270.729042 270.650955 270.650955 0 0 1 103.504859 19.834201V99.093701A101.51363 101.51363 0 0 0 788.254507 0.000781zM295.054441 640.747004V147.507894l394.146189 246.600033z"></path></svg>'
      this.tag = 'button'
    }

    getValue(editor) { // JS 语法
      return ''
    }

    // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
    isActive(editor) { // JS 语法
      return false
    }

    isDisabled(editor) { // JS 语法
      return false
    }
    // 点击菜单时触发的函数
    exec(editor, value) { // JS 语法
      if (this.isDisabled(editor)) return
      // 创建一个input，用于选择本地视频文件
      const videoInput = document.createElement('input');
      videoInput.type = 'file';
      videoInput.accept = 'video/*';
      videoInput.style.display = 'none';

      // 监听change事件，当文件选择后触发
      videoInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const base64String = e.target.result;

            let node = {
              type: "video",
              src: base64String,
              poster: "",
              width: 300,
              height: "auto",
              children: [{
                text: ''
              }]
            }
            // editor.dangerouslyInsertHtml("<div>（视频占位符）</div>")
            editor.insertNode(node);
          };
          reader.readAsDataURL(file);
        }
      });

      // 触发input点击，打开文件选择对话框
      videoInput.click();
    }
  }

  let toolItem = container.querySelector(".toolbar-container");
  toolItem.id = "tool_" + new Date().getTime();
  let editorItem = container.querySelector(".editor-container");
  editorItem.id = "editor_" + new Date().getTime();

  task.data = task.data || "";
  if (typeof task.data !== "string") {
    task.data = "";
  }
  let loadingText = "加载内容...";
  setTimeout(function () {
    const editor = createEditor({
      selector: '#' + editorItem.id,
      html: loadingText,
      config: {
        placeholder: '请在此处开始输入内容',
        onChange(editor) {
          const html = editor.getHtml();
          if (html) {
            task.data = html;
            if (loadingText !== html && typeof task.changeCallback === "function") {
              task.changeCallback(task.data);
            }
          }
        },
        customPaste(editor, event) {
          pasteCallback(event);
          return true
        }
      },
      mode: 'simple', // or 'simple'
    });

    task.editor = editor;
    window.theEditor = editor;

    let config = editor.getConfig();

    if (!config.MENU_CONF['localVideo']) {
      const localVideoConf = {
        key: 'localVideo', // 
        factory() {
          return new LocalVideoItem() // 把 `YourMenuClass` 替换为你菜单的 class
        },
      }

      Boot.registerMenu(localVideoConf)
    }

    if (!config.MENU_CONF['webPage']) {
      const webPageConf = {
        key: 'webPage', // 
        factory() {
          return new WebPageItem() // 把 `YourMenuClass` 替换为你菜单的 class
        },
      }

      Boot.registerMenu(webPageConf)
    }

    if (!config.MENU_CONF['localImage']) {
      const localImageConf = {
        key: 'localImage', // 
        factory() {
          return new LocalImageItem() // 把 `YourMenuClass` 替换为你菜单的 class
        },
      }

      Boot.registerMenu(localImageConf)
    }


    config.MENU_CONF.codeSelectLang.codeLangs = [{
      text: 'DSL',
      value: 'dsl'
    }, {
      text: 'Javascript',
      value: 'javascript'
    }, {
      text: 'HTML',
      value: 'html'
    }]

    // 配置字体
    config.MENU_CONF.fontFamily.fontFamilyList = [{
        name: "方正黑体",
        value: "方正黑体"
      },
      '汉仪仿宋',
      '方正楷体',
      '方正书宋',
      '微软雅黑',
      '粉笔字',
      'Arial',
      'Fredericka',
      'FrankRuhl'
    ]

    config.MENU_CONF['uploadImage'] = {
      // 小于该值就插入 base64 格式（而不上传），默认为 0
      base64LimitSize: 10 * 1024 * 1024 // 5mb
    }

    const toolbar = createToolbar({
      editor,
      selector: '#' + toolItem.id,
      config: toolbarConfig,
      mode: 'default', // or 'simple'
    })

    let tConfig = toolbar.getConfig();
    console.log("toolbar config", tConfig);
    window.tConfig = tConfig;


    let tempHtml = task.data || "";
    setTimeout(function () {
      let h = $(container).find("#" + toolItem.id).height();
      $(container).find("#" + editorItem.id).css({
        height: `calc( 100% - ${h + 15}px )`
      });
      if (task.typingStyleOutput) {
        webCpu.ArticleEditor.typingStyleOutput(task, tempHtml);
      } else {
        editor.setHtml(tempHtml || "");
      }
    }, 200)

  }, 500);

  let pasteCallback = (event) => {
    const d = (event.clipboardData || event.originalEvent.clipboardData || window.clipboardData);
    const items = d.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // 判断是否为图片

      if (item.kind === "file") {
        const blob = item.getAsFile();
        const reader = new FileReader();
        let type = item.type;
        // 读取图片文件
        reader.onload = function (e) {
          let content = e.target.result;
          if (type.indexOf('image') !== -1) {
            const img = new Image();
            img.src = content;
            // 将图片添加到粘贴区域
            // container.appendChild(img);
            task.editor.dangerouslyInsertHtml(`<img src="${img.src}" width="700px" height="auto" />`);
          }
        };
        if (blob) {
          reader.readAsDataURL(blob);
        }
        event.preventDefault();
      }
    }
  }
});

webCpu.ArticleEditor.typingStyleOutput = function (card, content, n) {
  let t = card.task || card;
  let container = document.createElement("div");
  container.innerHTML = content;
  let arr = container.childNodes;
  n = n || 100;
  var i = 0;
  t.editor.setHtml("");
  clearInterval(webCpu.ArticleEditor.typingInterval);
  webCpu.ArticleEditor.typingInterval = setInterval(function () {

    let count = arr.length - 1;
    if (i > count) {
      clearInterval(webCpu.ArticleEditor.typingInterval);
      return false;
    }
    let tContainer = document.createElement("div");
    let tNode = arr[i].cloneNode(true);
    tContainer.appendChild(tNode);
    let eItem = $(t.container).find(".w-e-scroll")[0];
    // 将光标移动到内容末尾
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(eItem.childNodes[0]);
    range.collapse(false); // 移动到末尾
    selection.removeAllRanges();
    selection.addRange(range);

    t.editor.dangerouslyInsertHtml(tContainer.innerHTML || "");

    let height = eItem.scrollHeight;
    eItem.scrollTop = height;

    // 
    i++;
  }, n); // 每500毫秒添加一行
}