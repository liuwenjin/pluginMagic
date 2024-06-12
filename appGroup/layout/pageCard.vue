<template>
  <el-card shadow="never" :body-style="bodyStyle" :style="cardStyle">
    <slot v-for="(item, index) in config">
      <span
        :key="index"
        :type="item.type"
        :prop="item.prop"
        :style="optionMap[item.prop].style"
        :class="optionMap[item.prop].class || item.class"
        v-if="
          !optionMap[item.prop].hidden &&
          (!optionMap[item.prop].condition ||
            optionMap[item.prop].condition.indexOf(info[item.prop]) !== -1)
        "
        @click="handleClickCard(info, item)"
      >
        <span
          flag="label"
          :style="
            optionMap[item.prop].labelStyle ||
            'display: inline-block; vertical-align: middle;  margin-right: 5px;'
          "
          v-if="!!optionMap[item.prop].label || item.label"
          >{{ optionMap[item.prop].label || item.label }}<slot v-if="optionMap[item.prop].suffix">{{ optionMap[item.prop].suffix }}</slot></span
        >
        <span
          flag="before"
          :style="
            optionMap[item.prop].labelStyle ||
            'display: inline-block; vertical-align: middle; margin-right: 5px;'
          "
          v-if="!!optionMap[item.prop].before"
          >{{ optionMap[item.prop].before }}</span
        >
        <slot
          v-if="
            mode === 'edit' &&
            editorMap &&
            editorMap[item.prop] &&
            !editorMap[item.prop].ignore
          "
        >
          <div
            v-if="editorMap[item.prop].type === 'plugin'"
            :style="
              editorMap[item.prop].valueStyle || {
                width: '100%',
                height: '100%',
                positon: 'relative',
                float: 'left',
              }
            "
            v-plugin="{
              app: editorMap[item.prop],
              info: info,
              prop: item.prop,
            }"
          ></div>
          <slot v-if="editorMap[item.prop].type === 'radio'">
            <el-radio-group
              v-model="info[item.prop]"
              :key="item.prop"
              :size="editorMap[item.prop].size || 'small'"
              @change="dealChangeEvent(item, result)"
              :style="editorMap[item.prop].valueStyle"
            >
              <slot v-for="v in editorMap[item.prop].items || item.items">
                <el-radio
                  :label="v.value === undefined ? v : v.value"
                ></el-radio>
              </slot>
            </el-radio-group>
          </slot>
          <span v-else-if="editorMap[item.prop].type === 'tags'">
            <el-tag
              v-for="(tag, tIndex) in info[item.prop]"
              :key="tIndex"
              class="eTagItem"
              closable
              :type="tag.type"
              :size="editorMap[item.prop].size || 'small'"
              prop="value"
              @close="handleClose(tag, tIndex, info, item)"
              >{{ tag.name || tag }}</el-tag
            >
            <el-input
              v-if="info.inputVisible"
              ref="saveTagInput"
              v-model="info.inputValue"
              clearable
              class="input-new-tag"
              :size="editorMap[item.prop].size || 'small'"
              @keyup.enter="handleInputConfirm(info, item)"
              @blur="handleInputConfirm(info, item)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              :size="editorMap[item.prop].size || 'small'"
              @click="showInput(info, item)"
              >{{ editorMap[item.prop].buttonLabel || "新增" }}</el-button
            >
          </span>
          <span
            v-else-if="item.type === 'checkbox'"
            :style="editorMap[item.prop].valueStyle"
          >
            <el-checkbox
              ref="checkAll"
              v-model="info.checkAll"
              prop="checkAll"
              label="全部"
              :indeterminate="info.isIndeterminate"
              @change="_handleCheckAllChange(info, index, item)"
              :size="editorMap[item.prop].size || 'small'"
            ></el-checkbox>
            <el-checkbox-group
              style="display: inline-block; margin-left: 15px"
              v-model="info[item.prop]"
              :size="editorMap[item.prop].size || 'small'"
              @change="_handleCheckedChange(info, index, item)"
            >
              <slot v-for="v in editorMap[item.prop].items">
                <el-checkbox
                  :label="v.value || v"
                  :size="editorMap[item.prop].size || 'small'"
                  >{{ v.name || v.label || v }}</el-checkbox
                >
              </slot>
            </el-checkbox-group>
          </span>
          <slot v-else-if="editorMap[item.prop].type === 'input'">
            <el-input
              :show-password="
                editorMap[item.prop].showPassword || item.showPassword
              "
              v-model="info[item.prop]"
              clearable
              :style="
                editorMap[item.prop].valueStyle ||
                'display: inline-block; width: 100%'
              "
              :size="editorMap[item.prop].size || 'small'"
              :placeholder="editorMap[item.prop].placeholder"
              @change="dealChangeEvent(info, item)"
            ></el-input>
          </slot>
          <slot v-else-if="editorMap[item.prop].type === 'textarea'">
            <el-input
              v-model="info[item.prop]"
              clearable
              type="textarea"
              :style="
                editorMap[item.prop].valueStyle ||
                'display: inline-block; width: 100%'
              "
              :rows="editorMap[item.prop].rows || 3"
              :size="editorMap[item.prop].size || 'small'"
              :placeholder="editorMap[item.prop].placeholder"
              @change="dealChangeEvent(info, item)"
            ></el-input>
          </slot>
          <slot v-else-if="editorMap[item.prop].type === 'file'">
            <div
              class="custom-file pageCard-file"
              :style="editorMap[item.prop].valueStyle"
            >
              <input
                type="file"
                class="pageCard-file-input custom-file-input"
                :id="'inputGroupFile' + index"
                :prop="item.prop"
                :accept="editorMap[item.prop].accept"
                @change="handleFileChange"
                :aria-describedby="'inputGroupFileAddon' + index"
              />
              <label
                :title="info[item.prop] ? editorMap[item.prop].placeholder : ''"
                class="custom-file-label pageCard-file-label"
                :for="'inputGroupFile01' + index"
                ><span class="selectFileName">{{
                  editorMap[item.prop].placeholder || "选择一个文件"
                }}</span></label
              >
            </div>
            <span
              style="position: relative"
              v-if="
                editorMap[item.prop].isImage &&
                !!info[item.prop] &&
                info[item.prop] !== '-'
              "
            >
              <el-button
                @click="removeImageInput(item.prop)"
                title="取消"
                style="
                  position: relative;
                  top: 30px;
                  margin-left: -50px;
                  transform: scale(0.7);
                  transform-origin: 0;
                  z-index: 888;
                "
                plain
                circle
                size="small"
                ><el-icon><close /></el-icon
              ></el-button>
              <el-image
                style="
                  margin-top: -30px;
                  max-width: 100%;
                  max-height: 200px;
                  width: 100%;
                  height: auto;
                "
                :src="info[item.prop]"
              ></el-image>
            </span>
          </slot>
          <slot v-else-if="editorMap[item.prop].type === 'select'">
            <el-select
              default-first-option
              :allow-create="
                editorMap[item.prop].allowCreate || item.allowCreate
              "
              :style="
                editorMap[item.prop].valueStyle ||
                'display: inline-block; width: 100%'
              "
              :filterable="editorMap[item.prop].filterable || true"
              :reserve-keyword="false"
              v-model="info[item.prop]"
              :multiple="editorMap[item.prop].multiple"
              :multiple-limit="editorMap[item.prop].multipleLimit"
              :clearable="!editorMap[item.prop].multiple"
              :size="editorMap[item.prop].size || 'small'"
              :placeholder="editorMap[item.prop].placeholder"
              :disabled="editorMap[item.prop].disabled"
              @change="dealChangeEvent(info, item)"
            >
              <el-option
                v-for="(tItem, tIndex) in editorMap[item.prop].options"
                :key="tIndex"
                :label="tItem.label || tItem.name || tItem"
                :value="tItem.value === undefined ? tItem : tItem.value"
              ></el-option>
            </el-select>
          </slot>
          <slot v-else-if="editorMap[item.prop].type === 'cascader'">
            <el-cascader
              default-first-option
              :style="
                editorMap[item.prop].valueStyle ||
                'display: inline-block; width: 100%'
              "
              :allow-create="editorMap[item.prop].allowCreate"
              :filterable="editorMap[item.prop].filterable || true"
              :reserve-keyword="false"
              :options="editorMap[item.prop].options"
              v-model="info[item.prop]"
              :multiple="editorMap[item.prop].multiple"
              :multiple-limit="editorMap[item.prop].multipleLimit"
              :clearable="!editorMap[item.prop].multiple"
              :size="editorMap[item.prop].size || 'small'"
              :placeholder="editorMap[item.prop].placeholder"
              @change="dealChangeEvent(info, item)"
            >
            </el-cascader>
          </slot>
          <slot v-else-if="editorMap[item.prop].type === 'switch'">
            <span v-if="editorMap[item.prop].label">{{ item.label }}</span>
            <el-switch
              :style="
                editorMap[item.prop].valueStyle ||
                'display: inline-block; width: 100%'
              "
              v-model="info[item.prop]"
              :active-color="editorMap[item.prop].activeColor || '#13ce66'"
              :inactive-color="editorMap[item.prop].inactive || '#ff4949'"
              :active-text="editorMap[item.prop].activeText || ''"
              :inactive-text="editorMap[item.prop].inactiveText || ''"
              :inline-prompt="editorMap[item.prop].textInside"
              :size="editorMap[item.prop].size || 'small'"
              @change="dealChangeEvent(info, item)"
            ></el-switch>
          </slot>
          <slot v-else-if="editorMap[item.prop].type === 'datePicker'">
            <el-date-picker
              v-model="item.value"
              :size="editorMap[item.prop].size || 'small'"
              clearable
              :style="editorMap[item.prop].valueStyle"
              :format="editorMap[item.prop].format || 'YYYY-MM-DD'"
              :value-format="editorMap[item.prop].valueFormat || 'YYYY-MM-DD'"
              :type="editorMap[item.prop].pickerType || 'datetime'"
              :placeholder="editorMap[item.prop].placeholder || '选择日期时间'"
              @change="dealChangeEvent(info, item)"
            ></el-date-picker>
          </slot>
          <slot v-else-if="editorMap[item.prop].type === 'dateRange'">
            <el-date-picker
              v-model="info[item.prop]"
              clearable
              type="daterange"
              :start-placeholder="
                editorMap[item.prop].startPlaceholder || '开始日期'
              "
              :style="editorMap[item.prop].valueStyle"
              :end-placeholder="
                editorMap[item.prop].endPlaceholder || '结束日期'
              "
              :size="editorMap[item.prop].size || 'small'"
              :format="editorMap[item.prop].format || 'YYYY-MM-DD'"
              :value-format="editorMap[item.prop].valueFormat || 'YYYY-MM-DD'"
              :picker-options="editorMap[item.prop].pickerOptions"
              @change="dealChangeEvent(info, item)"
            ></el-date-picker>
          </slot>
          <span
            :style="editorMap[item.prop].valueStyle"
            v-else-if="editorMap[item.prop].type === 'colorPicker'"
          >
            <el-color-picker
              v-model="info[item.prop]"
              clearable
              :size="editorMap[item.prop].size || 'small'"
              :show-alpha="editorMap[item.prop].showAlpha"
              :predefine="editorMap[item.prop].predefine"
              :color-format="editorMap[item.prop].colorFormat || 'hex'"
              @change="dealChangeEvent(info, item)"
            ></el-color-picker>
          </span>
          <slot v-else-if="editorMap[item.prop].type === 'inputNumber'">
            <el-input-number
              v-model="info[item.prop]"
              clearable
              :style="editorMap[item.prop].valueStyle"
              :size="editorMap[item.prop].size || 'small'"
              :placeholder="editorMap[item.prop].placeholder"
              :min="editorMap[item.prop].min"
              :max="editorMap[item.prop].max"
              @change="dealChangeEvent(info, item)"
            ></el-input-number>
          </slot>
          <slot
            v-else-if="editorMap[item.prop].type === 'slider'"
            style="display: inline-block; width: 100%"
          >
            <el-slider
              v-model="info[item.prop]"
              :range="editorMap[item.prop].range"
              :vertical="editorMap[item.prop].vertical"
              :placement="editorMap[item.prop].placement"
              :size="editorMap[item.prop].size"
              :marks="editorMap[item.prop].marks"
              :min="editorMap[item.prop].min"
              :max="editorMap[item.prop].max"
              :precision="editorMap[item.prop].precision"
              :show-input="editorMap[item.prop].showInput"
              :step="editorMap[item.prop].step"
              :show-stops="editorMap[item.prop].showStops"
              :show-tooltip="editorMap[item.prop].showTooltip"
              :format-tooltip="editorMap[item.prop].formatTooltip"
              :style="editorMap[item.prop].valueStyle"
              @change="dealChangeEvent(info, item)"
            ></el-slider>
          </slot>
        </slot>
        <slot v-else-if="item.type === 'text'">
          <span
            :title="info[item.prop]"
            :type="item.type"
            :style="
              optionMap[item.prop].valueStyle ||
              item.valueStyle ||
              'display: inline-block; vertical-align: middle;'
            "
            :class="optionMap[item.prop].valueClass || item.valueClass"
          >
            {{ info[item.prop] }}
          </span>
        </slot>
        <slot v-else-if="item.type === 'JSON' || item.type === 'json'">
          <div
            :style="
              optionMap[item.prop].valueStyle || {
                width: '100%',
                height: '100%',
              }
            "
            :class="optionMap[item.prop].class || item.class"
            v-json
            :data="
              typeof info[item.prop] !== 'undefined'
                ? JSON.stringify(info[item.prop])
                : '{}'
            "
          ></div>
        </slot>
        <slot v-else-if="item.type === 'html'">
          <span
            :style="
              optionMap[item.prop].valueStyle ||
              'display: inline-block; vertical-align: middle;'
            "
            :class="optionMap[item.prop].valueClass || item.valueClass"
            v-html="info[item.prop]"
            :key="i"
          ></span>
        </slot>
        <slot v-else-if="item.type === 'iframe'">
          <div
            style="position: relative; width: 100%; height: 100%"
            :class="optionMap[item.prop].class || item.class"
          >
            <iframe width="100%" height="100%" :src="info[item.prop]"></iframe>
          </div>
        </slot>
        <slot v-else-if="item.type === 'tags'">
          <slot v-for="tag in info[item.prop]">
            <el-tag :size="optionMap[item.prop].size || item.size || 'small'"
              ><span
                :style="
                  optionMap[item.prop].tagStyle ||
                  item.tagStyle || {
                    width:
                      optionMap[item.prop].tagWidth || item.tagWidth || 'auto',
                  }
                "
                :class="optionMap[item.prop].class || item.class || 'ellipsis'"
                :title="tag.label || tag"
                >{{ tag.label || tag }}</span
              >
              <slot v-if="tag.value !== undefined"
                >(<span>{{ tag.value }}</span
                >)</slot
              >
            </el-tag>
          </slot>
        </slot>
        <slot v-else-if="item.type === 'image'">
          <slot v-if="typeof info[item.prop] === 'string'">
            <el-image
              :style="
                optionMap[item.prop].valueStyle || {
                  width: '100%',
                  height: '100%',
                }
              "
              :src="info[item.prop]"
              :fit="optionMap[item.prop].fit || item.fit"
            ></el-image>
          </slot>
          <slot v-else v-for="url in info[item.prop]">
            <el-image
              :style="
                optionMap[item.prop].valueStyle || {
                  width: '100%',
                  height: '100%',
                }
              "
              :src="url"
              :fit="optionMap[item.prop].fit || item.fit"
            ></el-image>
          </slot>
        </slot>
        <slot v-else-if="item.type === 'avatar'">
          <slot v-if="typeof info[item.prop] === 'string'">
            <el-avatar
              :style="
                optionMap[item.prop].valueStyle || {
                  width: '100%',
                  height: '100%',
                }
              "
              :src="info[item.prop]"
              :size="optionMap[item.prop].size"
              :shape="optionMap[item.prop].shape"
              :fit="optionMap[item.prop].fit || item.fit"
            ></el-avatar>
          </slot>
          <slot v-else v-for="url in info[item.prop]">
            <el-avatar
              :style="
                optionMap[item.prop].valueStyle || {
                  width: '100%',
                  height: '100%',
                }
              "
              :src="url"
              :size="optionMap[item.prop].size"
              :shape="optionMap[item.prop].shape"
              :fit="optionMap[item.prop].fit || item.fit"
            ></el-avatar>
          </slot>
        </slot>
        <slot v-else-if="item.type === 'video'">
          <video
            :height="optionMap[item.prop].height || item.height || '100%'"
            :width="optionMap[item.prop].width || item.width || '100%'"
            :src="info[item.prop]"
            controls="controls"
            :style="optionMap[item.prop].style || item.style"
            :key="index"
          >
            您的浏览器不支持 video 标签。
          </video>
        </slot>
        <slot v-else-if="item.type === 'qrCode'">
          <div
            :key="index"
            :content="info[item.prop]"
            :style="
              optionMap[item.prop].valueStyle || {
                width: '100%',
                height: '100%',
              }
            "
            v-qr
          ></div>
        </slot>
        <slot v-else-if="item.type === 'plugin'">
          <div
            :style="
              optionMap[item.prop].valueStyle ||
              optionMap[item.prop].style || {
                width: '100%',
                height: '100%',
              }
            "
            v-plugin="{
              app: optionMap[item.prop],
              info: info,
              value: info[item.prop],
              prop: item.prop,
            }"
          ></div>
        </slot>
        <slot v-else-if="item.type === 'button'">
          <span
            style="width: 100%; display: block"
            :size="optionMap[item.prop].size || item.size || 'small'"
            v-if="
              optionMap[item.prop].content &&
              optionMap[item.prop].content.length === 1
            "
          >
            <el-button
              :loading="optionMap[item.prop].content[0].loading"
              :size="optionMap[item.prop].content[0].size || 'small'"
              :type="optionMap[item.prop].content[0].type"
              :plain="optionMap[item.prop].content[0].plain"
              :round="optionMap[item.prop].content[0].round"
              :circle="optionMap[item.prop].content[0].circle"
              :text="optionMap[item.prop].content[0].text"
              :style="optionMap[item.prop].content[0].style"
              @click="handleClickButton(info, optionMap[item.prop].content[0])"
            >
              <component
                class="icons"
                v-if="optionMap[item.prop].content[0].icon"
                :is="optionMap[item.prop].content[0].icon"
                :style="`width: ${optionMap[item.prop].content[0].width};`"
              ></component>
              <i :class="optionMap[item.prop].content[0].iconClass"></i>
              {{ optionMap[item.prop].content[0].label }}
            </el-button>
          </span>
          <el-button-group
            v-else
            style="width: 100%; display: block"
            :size="optionMap[item.prop].size || item.size || 'small'"
          >
            <slot v-for="bItem in optionMap[item.prop].content || item.content">
              <el-button
                :loading="bItem.loading"
                :size="bItem.size || 'small'"
                :type="bItem.type"
                :plain="bItem.plain"
                :round="bItem.round"
                :circle="bItem.circle"
                :text="bItem.text"
                v-if="!bItem.hidden"
                :style="bItem.style"
                @click.stop="handleClickButton(info, bItem)"
              >
                <component
                  class="icons"
                  v-if="bItem.icon"
                  :is="bItem.icon"
                  :style="`width: ${bItem.width};`"
                ></component>
                <i :class="bItem.iconClass"></i>
                {{ bItem.label }}
              </el-button>
            </slot>
          </el-button-group>
        </slot>
        <slot v-if="!!optionMap[item.prop].extraInfo && !!info.extraFlag"
          ><span
            :style="optionMap[item.prop].labelStyle || 'display: inline-block;'"
            v-if="typeof optionMap[item.prop].extraInfo === 'string'"
            >{{ optionMap[item.prop].extraInfo }}</span
          >
          <span
            :style="optionMap[item.prop].extraStyle || 'display: inline-block;'"
            v-else
            :data="JSON.stringify(optionMap[item.prop].extraInfo)"
            :value="JSON.stringify(info)"
            :valueType="'JSON'"
            :paramName="optionMap[item.prop].paramName"
            >{{ optionMap[item.prop].extraInfo }}</span
          >
        </slot>
      </span>
    </slot>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      bodyStyle: {},
      cardStyle: {},
      optionMap: {},
      editorMap: {},
      config: [],
      info: {},
      mode: "",
    };
  },
  directives: {
    json: {
      mounted: function (el, a, b) {
        var data = $(el).attr("data");
        data = JSON.parse(data);
        if (data) {
          $(el).jsonViewer(data);
        } else {
          $(el).html("暂无数据");
        }
      },
    },
    plugin: {
      mounted: function (el, param) {
        var app = param.value.app;
        var value = param.value.info[param.value.prop];
        var paramName = app.paramName;
        app.dsl = app.dsl || {
          data: {},
        };
        if (paramName) {
          app.dsl.data[paramName] = value;
        } else {
          app.dsl.data = value;
        }
        app.style = app.style || {};
        app.style.width = "100%";
        app.style.height = "100%";
        webCpu.updateView(el, app);
      },
    },
    qr: {
      mounted: function (el) {
        var content = el.getAttribute("content");
        // var w = el.getAttribute("width");
        // var h = el.getAttribute("height");
        var w = el.clientWidth;
        var h = el.clientHeight;
        var v = Math.min(w, h);
        $(el).qrcode({
          render: "canvas",
          text: content,
          width: v, // 二维码的宽度
          height: v, // 二维码的高度
          background: "#ffffff", // 二维码的后景色
          foreground: "#000000", // 二维码的前景色
          // src: "img/logo.png", // 二维码中间的图片
        });
      },
    },
  },
  beforeMount() {
    this.updateData(this.dataObj || {});
  },
  methods: {
    objectToString(obj) {
      return WebTool.objectToString(obj);
    },
    handleClose(tag, tIndex, d, item) {
      console.log(tag);
      info.splice(tIndex, 1);
    },
    removeImageInput(prop) {
      if (this.info[prop] && this.editorMap[prop].isImage) {
        this.info[prop] = "";
        this.optionMap[prop].style = this.optionMap[prop].style || {};
        this.editorMap[prop].placeholder = "";
      }
      this.dealChangeEvent(this.info, {
        prop: prop,
      });
    },
    handleFileChange(e) {
      let prop = e.target.getAttribute("prop");
      let selectedFile = e.target.files[0];
      if (!selectedFile) {
        return false;
      }
      this.editorMap[prop].placeholder = selectedFile.name;
      // 使用 FileReader 读取文件
      const reader = new FileReader();
      let _self = this;
      reader.onload = function (e) {
        // 将文件读取为Base64格式的字符串
        const base64String = e.target.result;
        if (base64String.search("data:image") !== -1 && _self.editorMap[prop]) {
          _self.editorMap[prop].isImage = true;
        }
        // 在这里可以使用 base64String 进行其他操作，例如显示图片预览等
        console.log("Base64:", base64String);
        _self.info[prop] = base64String;
        _self.dealChangeEvent(_self.info, {
          prop: prop,
        });
      };

      // 以DataURL格式读取文件
      reader.readAsDataURL(selectedFile);
    },
    showInput(d, item) {
      d.inputVisible = true;
      this.$nextTick(() => {
        if (this.$refs && this.$refs.saveTagInput) {
          this.$refs.saveTagInput[0].$refs.input.focus();
        }
      });
    },
    handleInputConfirm(d, item) {
      let inputValue = d.inputValue;
      if (inputValue) {
        info.push(inputValue);
      }
      d.inputVisible = false;
      d.inputValue = "";
    },
    _handleCheckAllChange(d, index, item) {
      if (d.checkAll) {
        info = item.items.map((d) => {
          return d.value || d;
        });
      } else {
        info = [];
      }
      d.isIndeterminate = false;
    },
    _handleCheckedChange(d, index, item) {
      let checkedCount = info.length;
      d.checkAll = checkedCount === item.items.length;
      d.isIndeterminate = checkedCount > 0 && checkedCount < item.items.length;
    },
    updateData(obj) {
      for (var k in obj) {
        this[k] = obj[k] || this[k];
      }
      this.info = this.info || {};
      this.optionMap = this.optionMap || {};
      for (let j = 0; j < this.config.length; j++) {
        var k = this.config[j].prop;
        this.optionMap[k] = this.optionMap[k] || {};
      }
    },
    handleClickCard(d, config) {},
    handleClickButton(d, config) {},
    dealChangeEvent(d, config) {},
  },
  props: {
    dataObj: Object,
  },
};
</script>

<style scoped>
.cardListArea {
  width: 100%;
  height: auto;
  padding: 0px 0px;
}

.ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  max-width: 100%;
}

.ellipsisTag {
  float: left;
  position: relative;
  margin-right: 5px;
  margin-top: 5px;
}

.ellipsisTag > span.ellipsis {
  position: relative;
  display: inline-block;
  max-width: 100px;
  vertical-align: middle;
}

.el-card {
  position: relative;
  width: 100%;
  border: none;
}

.el-card__body {
  padding: 0px;
  height: 100%;
  float: left;
  width: 100%;
  position: relative;
}

.el-form-item {
  margin-bottom: 0px;
}

i.bi {
  margin-right: 5px;
}

.cardListArea .el-form-item__content {
  display: inline-block;
  vertical-align: middle;
}

.el-input__wrapper {
  width: 100% !important;
}

.cardListArea .el-form-item__content span {
  vertical-align: middle;
  line-height: 1;
}

.resultOptionArea {
  width: 100%;
  position: relative;
  float: left;
  margin-bottom: 35px;
  font-size: 14px;
  color: #999;
  border-bottom: solid 1px #ddd;
  padding-bottom: 5px;
}

.resultOptionArea .el-button,
.resultOptionArea .checkBoxItem {
  bottom: -33px;
  position: absolute;
  z-index: 3;
}

.pageCard-file {
  transform: scale(0.6);
  transform-origin: 0 0;
}

.resultOptionArea .checkBoxItem {
  left: 10px;
}
.resultOptionArea .el-button {
  right: 10px;
}

.el-pagination {
  position: absolute;
  bottom: 5px;
}

.titleInfo {
  margin-left: 10px;
}
.pageCard-file-label > .selectFileName {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  width: calc(100% - 110px);
}

label {
  margin-bottom: 0px;
}

span[flag="label"] {
  font-size: 12px;
}

.ellipsis_2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.ellipsis_3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.ellipsis_4 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}
.ellipsis_5 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  overflow: hidden;
}

.input-new-tag {
  display: inline-block;
  margin-left: 10px;
  width: auto !important;
}

.el-card__body .el-select {
  width: 100%;
}

.el-tag {
  margin-right: 5px;
}
</style>
