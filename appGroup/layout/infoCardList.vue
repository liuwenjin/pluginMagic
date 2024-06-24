<template>
  <div class="cardListArea" :style="style">
    <slot v-if="info.length !== 0">
      <div
        class="resultOptionArea"
        v-if="showOption"
        :style="{
          marginBottom: withSelection && optionBtn ? '35px' : '5px',
        }"
      >
        <span class="checkBoxItem">
          <el-checkbox
            v-if="withSelection"
            @change="handleCheckAllChange"
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            label="全选"
            ref="checkAll"
            :size="checkboxSize || 'large'"
          />
        </span>
        <span class="titleInfo">{{ name }}</span
        >共: <span>{{ page.total }} 条</span>
        <el-button
          v-if="optionBtn"
          style="float: right"
          type="primary"
          size="small"
          >{{ optionBtnText || "导出" }}</el-button
        >
      </div>
      <el-row
        :gutter="gutter"
        :style="{
          position: 'relative',
          width: '100%',
          height: '100%',
          margin: 'auto',
          paddingBottom: !!page && page.total ? '50px' : '0px',
        }"
      >
        <el-col
          v-for="(d, i) in info"
          :key="i"
          :span="span"
          :style="{
            'padding-left': '0px',
            'padding-right':
              i % (24 / span) === 24 / span - 1 ? '0px' : gutter / 2 + 'px',
          }"
        >
          <el-card shadow="never" :style="cardStyle">
            <slot v-if="withSelection">
              <el-checkbox
                @change="handleCheckedChange(d, i)"
                :style="{
                  position: 'absolute',
                  top: '3px',
                  left: '10px',
                  display: 'inline-block',
                }"
                v-model="d.checked"
                :size="checkboxSize || 'large'"
              />
            </slot>
            <slot v-for="(item, index) in config" :key="index">
              <span
                :key="index"
                :type="item.type"
                :prop="item.prop"
                v-if="
                  !optionMap[item.prop].hidden &&
                  (!optionMap[item.prop].condition ||
                    optionMap[item.prop].condition.indexOf(d[item.prop]) !== -1)
                  && (
                    typeof(optionMap[item.prop].check) !== 'function' ||
                    optionMap[item.prop].check(d, item)
                  )
                "
                :style="optionMap[item.prop].style || item.style"
                @click="handleClickCard(d, item, i)"
              >
                <span
                  flag="label"
                  :style="
                    optionMap[item.prop].labelStyle ||
                    'display: inline-block; vertical-align: middle; float: left; margin-right: 5px;'
                  "
                  v-if="!!optionMap[item.prop].label"
                  >{{ optionMap[item.prop].label }}:</span
                >
                <span
                  flag="before"
                  :style="
                    optionMap[item.prop].labelStyle ||
                    'display: inline-block; vertical-align: middle; float: left; margin-right: 5px;'
                  "
                  v-if="!!optionMap[item.prop].before"
                  >{{ optionMap[item.prop].before }}</span
                >

                <slot
                  v-if="mode === 'edit' && editorMap && editorMap[item.prop]"
                >
                  <span
                    v-if="editorMap[item.prop].type === 'plugin'"
                    :style="editorMap[item.prop].valueStyle"
                    :index="i"
                    v-plugin="{
                      app: editorMap[item.prop],
                      info: d,
                      prop: item.prop,
                    }"
                  >
                  </span>
                  <slot v-if="editorMap[item.prop].type === 'radio'">
                    <el-radio-group
                      v-model="info[i][item.prop]"
                      :key="item.prop"
                      :size="editorMap[item.prop].size || 'small'"
                      @change="dealChangeEvent(item, result)"
                      :style="editorMap[item.prop].valueStyle"
                    >
                      <slot
                        v-for="v in editorMap[item.prop].items || item.items"
                      >
                        <el-radio
                          :label="v.value === undefined ? v : v.value"
                        ></el-radio>
                      </slot>
                    </el-radio-group>
                  </slot>
                  <span v-else-if="editorMap[item.prop].type === 'tags'">
                    <el-tag
                      v-for="(tag, tIndex) in info[i][item.prop]"
                      :key="tIndex"
                      class="eTagItem"
                      closable
                      :type="tag.type"
                      :size="editorMap[item.prop].size || 'small'"
                      prop="value"
                      @close="handleClose(tag, tIndex, d, item)"
                      >{{ tag.name || tag }}</el-tag
                    >
                    <el-input
                      v-if="d.inputVisible"
                      ref="saveTagInput"
                      v-model="d.inputValue"
                      clearable
                      class="input-new-tag"
                      :size="editorMap[item.prop].size || 'small'"
                      @keyup.enter="handleInputConfirm(d, item)"
                      @blur="handleInputConfirm(d, item)"
                    >
                    </el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      :size="editorMap[item.prop].size || 'small'"
                      @click="showInput(d, item)"
                      >{{
                        editorMap[item.prop].buttonLabel || "新增"
                      }}</el-button
                    >
                  </span>
                  <span
                    v-else-if="item.type === 'checkbox'"
                    :style="editorMap[item.prop].valueStyle"
                  >
                    <el-checkbox
                      ref="checkAll"
                      v-model="info[i].checkAll"
                      prop="checkAll"
                      label="全部"
                      :indeterminate="info[i].isIndeterminate"
                      @change="_handleCheckAllChange(d, index, item)"
                      :size="editorMap[item.prop].size || 'small'"
                    ></el-checkbox>
                    <el-checkbox-group
                      style="display: inline-block; margin-left: 15px"
                      v-model="d[item.prop]"
                      :size="editorMap[item.prop].size || 'small'"
                      @change="_handleCheckedChange(d, index, item)"
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
                      v-model="info[i][item.prop]"
                      clearable
                      :style="
                        editorMap[item.prop].valueStyle ||
                        'display: inline-block; width: 100%'
                      "
                      :size="editorMap[item.prop].size || 'small'"
                      :placeholder="editorMap[item.prop].placeholder"
                      @change="dealChangeEvent(item, d)"
                    ></el-input>
                  </slot>
                  <slot v-else-if="editorMap[item.prop].type === 'textarea'">
                    <el-input
                      v-model="info[i][item.prop]"
                      clearable
                      type="textarea"
                      :style="
                        editorMap[item.prop].valueStyle ||
                        'display: inline-block; width: 100%'
                      "
                      :rows="editorMap[item.prop].rows || 3"
                      :size="editorMap[item.prop].size || 'small'"
                      :placeholder="editorMap[item.prop].placeholder"
                      @change="dealChangeEvent(item, d)"
                    ></el-input>
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
                      v-model="info[i][item.prop]"
                      :multiple="editorMap[item.prop].multiple"
                      :multiple-limit="editorMap[item.prop].multipleLimit"
                      :clearable="!editorMap[item.prop].multiple"
                      :size="editorMap[item.prop].size || 'small'"
                      :placeholder="editorMap[item.prop].placeholder"
                      @change="dealChangeEvent(item, d)"
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
                      v-model="info[i][item.prop]"
                      :multiple="editorMap[item.prop].multiple"
                      :multiple-limit="editorMap[item.prop].multipleLimit"
                      :clearable="!editorMap[item.prop].multiple"
                      :size="editorMap[item.prop].size || 'small'"
                      :placeholder="editorMap[item.prop].placeholder"
                      @change="dealChangeEvent(item, d)"
                    >
                    </el-cascader>
                  </slot>
                  <slot v-else-if="editorMap[item.prop].type === 'switch'">
                    <span v-if="editorMap[item.prop].label">{{
                      item.label
                    }}</span>
                    <el-switch
                      :style="
                        editorMap[item.prop].valueStyle ||
                        'display: inline-block; width: 100%'
                      "
                      v-model="info[i][item.prop]"
                      :active-color="
                        editorMap[item.prop].activeColor || '#13ce66'
                      "
                      :inactive-color="
                        editorMap[item.prop].inactive || '#ff4949'
                      "
                      :active-text="editorMap[item.prop].activeText || ''"
                      :inactive-text="editorMap[item.prop].inactiveText || ''"
                      :inline-prompt="editorMap[item.prop].textInside"
                      :size="editorMap[item.prop].size || 'small'"
                      @change="dealChangeEvent(item, d)"
                    ></el-switch>
                  </slot>
                  <slot v-else-if="editorMap[item.prop].type === 'datePicker'">
                    <el-date-picker
                      v-model="info[i][item.prop]"
                      :size="editorMap[item.prop].size || 'small'"
                      clearable
                      :format="editorMap[item.prop].format || 'YYYY-MM-DD'"
                      :value-format="
                        editorMap[item.prop].valueFormat || 'YYYY-MM-DD'
                      "
                      :type="editorMap[item.prop].pickerType || 'datetime'"
                      :placeholder="
                        editorMap[item.prop].placeholder || '选择日期时间'
                      "
                      @change="dealChangeEvent(item, d)"
                    ></el-date-picker>
                  </slot>
                  <slot v-else-if="editorMap[item.prop].type === 'dateRange'">
                    <el-date-picker
                      v-model="info[i][item.prop]"
                      clearable
                      type="daterange"
                      :start-placeholder="
                        editorMap[item.prop].startPlaceholder || '开始日期'
                      "
                      :end-placeholder="
                        editorMap[item.prop].endPlaceholder || '结束日期'
                      "
                      :size="editorMap[item.prop].size || 'small'"
                      :format="editorMap[item.prop].format || 'YYYY-MM-DD'"
                      :value-format="
                        editorMap[item.prop].valueFormat || 'YYYY-MM-DD'
                      "
                      :picker-options="editorMap[item.prop].pickerOptions"
                      @change="dealChangeEvent(item, d)"
                    ></el-date-picker>
                  </slot>
                  <slot v-else-if="editorMap[item.prop].type === 'colorPicker'">
                    <el-color-picker
                      v-model="info[i][item.prop]"
                      clearable
                      :size="editorMap[item.prop].size || 'small'"
                      :show-alpha="editorMap[item.prop].showAlpha"
                      :predefine="editorMap[item.prop].predefine"
                      :color-format="editorMap[item.prop].colorFormat"
                      @change="dealChangeEvent(item, d)"
                    ></el-color-picker>
                  </slot>
                  <slot v-else-if="editorMap[item.prop].type === 'inputNumber'">
                    <el-input-number
                      v-model="info[i][item.prop]"
                      clearable
                      :size="editorMap[item.prop].size || 'small'"
                      :placeholder="editorMap[item.prop].placeholder"
                      :min="editorMap[item.prop].min || 0"
                      :max="editorMap[item.prop].max || 100"
                      :precision="
                        editorMap[item.prop].precision !== undefined
                          ? editorMap[item.prop].precision
                          : 1
                      "
                      @change="dealChangeEvent(item, d)"
                    ></el-input-number>
                  </slot>
                  <slot
                    v-else-if="editorMap[item.prop].type === 'slider'"
                    style="display: inline-block; width: 100%"
                  >
                    <el-slider
                      v-model="info[i][item.prop]"
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
                      @change="dealChangeEvent(item, d)"
                    ></el-slider>
                  </slot>
                </slot>
                <slot v-else-if="item.type === 'text'">
                  <div
                    :style="
                      optionMap[item.prop].valueStyle ||
                      item.valueStyle ||
                      'display: inline;'
                    "
                    :type="item.type"
                    :title="info[i][item.prop]"
                  >
                    <span :class="optionMap[item.prop].class || item.class">
                      {{ info[i][item.prop] }}
                    </span>
                  </div>
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
                      typeof info[i][item.prop] !== 'undefined'
                        ? JSON.stringify(info[i][item.prop])
                        : '{}'
                    "
                  ></div>
                </slot>
                <slot v-else-if="item.type === 'html'">
                  <div
                    :style="
                      optionMap[item.prop].valueStyle || {
                        width: '100%',
                        height: '100%',
                      }
                    "
                    :class="optionMap[item.prop].class || item.class"
                    v-html="info[i][item.prop]"
                    :key="i"
                  ></div>
                </slot>
                <slot v-else-if="item.type === 'iframe'">
                  <div
                    style="position: relative; width: 100%; height: 100%"
                    :class="optionMap[item.prop].class || item.class"
                  >
                    <iframe
                      width="100%"
                      height="100%"
                      :src="info[i][item.prop]"
                    ></iframe>
                  </div>
                </slot>
                <slot v-else-if="item.type === 'tags'">
                  <slot v-for="tag in info[i][item.prop]">
                    <el-tag
                      :size="optionMap[item.prop].size || item.size || 'small'"
                      ><span
                        :style="
                          optionMap[item.prop].tagStyle ||
                          item.tagStyle || {
                            width:
                              optionMap[item.prop].tagWidth ||
                              item.tagWidth ||
                              'auto',
                          }
                        "
                        :class="
                          optionMap[item.prop].class || item.class || 'ellipsis'
                        "
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
                  <slot v-if="typeof info[i][item.prop] === 'string'">
                    <el-image
                      :style="optionMap[item.prop].style || item.style"
                      :src="info[i][item.prop]"
                      :fit="optionMap[item.prop].fit || item.fit"
                    ></el-image>
                  </slot>
                  <slot v-else v-for="url in info[i][item.prop]">
                    <el-image
                      :style="optionMap[item.prop].style || item.style"
                      :src="url"
                      :fit="optionMap[item.prop].fit || item.fit"
                    ></el-image>
                  </slot>
                </slot>
                <slot v-else-if="item.type === 'avatar'">
                  <slot v-if="typeof info[i][item.prop] === 'string'">
                    <el-avatar
                      :style="optionMap[item.prop].style || item.style"
                      :src="info[i][item.prop]"
                      :size="optionMap[item.prop].size"
                      :shape="optionMap[item.prop].shape"
                      :fit="optionMap[item.prop].fit || item.fit"
                    ></el-avatar>
                  </slot>
                  <slot v-else v-for="url in info[i][item.prop]">
                    <el-avatar
                      :style="optionMap[item.prop].style || item.style"
                      :src="url"
                      :size="optionMap[item.prop].size"
                      :shape="optionMap[item.prop].shape"
                      :fit="optionMap[item.prop].fit || item.fit"
                    ></el-avatar>
                  </slot>
                </slot>
                <slot v-else-if="item.type === 'video'">
                  <video
                    :height="
                      optionMap[item.prop].height || item.height || '100%'
                    "
                    :width="optionMap[item.prop].width || item.width || '100%'"
                    :src="info[i][item.prop]"
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
                    :content="info[i][item.prop]"
                    :style="optionMap[item.prop].style || item.style"
                    v-qr
                  ></div>
                </slot>
                <slot v-else-if="item.type === 'plugin'">
                  <span
                    :style="
                      optionMap[item.prop].valueStyle || {
                        width: '100%',
                        height: '100%',
                      }
                    "
                    :type="item.type"
                    :index="i"
                    v-plugin="{
                      app: optionMap[item.prop],
                      info: info,
                      value: info[i][item.prop],
                      prop: item.prop,
                    }"
                  ></span>
                </slot>
                <slot v-else-if="item.type === 'button'">
                  <span
                    :style="optionMap[item.prop].style || item.style"
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
                      :text="optionMap[item.prop].content[0].textFlag"
                      :style="optionMap[item.prop].content[0].style"
                      @click.stop="
                        handleClickButton(d, optionMap[item.prop].content[0], i)
                      "
                    >
                      <component
                        class="icons"
                        v-if="optionMap[item.prop].content[0].icon"
                        :is="optionMap[item.prop].content[0].icon"
                        :style="`width: ${
                          optionMap[item.prop].content[0].width
                        };`"
                      ></component>
                      <i :class="optionMap[item.prop].content[0].iconClass"></i>
                      {{ optionMap[item.prop].content[0].label }}
                    </el-button>
                  </span>
                  <el-button-group
                    v-else
                    :style="optionMap[item.prop].style || item.style"
                    :size="optionMap[item.prop].size || item.size || 'small'"
                  >
                    <slot
                      v-for="bItem in optionMap[item.prop].content ||
                      item.content"
                    >
                      <el-button
                        :loading="bItem.loading"
                        :size="bItem.size || 'small'"
                        :type="bItem.type"
                        :plain="bItem.plain"
                        :text="bItem.textFlag"
                        v-if="!bItem.hidden"
                        :style="bItem.style"
                        @click.stop="handleClickButton(d, bItem, i)"
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
                <slot v-if="!!optionMap[item.prop].extraInfo && !!d.extraFlag"
                  ><span
                    :style="
                      optionMap[item.prop].labelStyle ||
                      'display: inline-block;'
                    "
                    v-if="typeof optionMap[item.prop].extraInfo === 'string'"
                    >{{ optionMap[item.prop].extraInfo }}</span
                  >
                  <span
                    :style="
                      optionMap[item.prop].extraStyle ||
                      'display: inline-block;'
                    "
                    v-else
                    :data="JSON.stringify(optionMap[item.prop].extraInfo)"
                    :value="JSON.stringify(d)"
                    :valueType="'JSON'"
                    :paramName="optionMap[item.prop].paramName"
                    >{{ optionMap[item.prop].extraInfo }}</span
                  >
                </slot>
              </span>
            </slot>
          </el-card>
        </el-col>
      </el-row>
      <slot v-if="page && page.total">
        <el-pagination
          :current-page="page.currentPage"
          :page-size="page.pageSize"
          size="small"
          :layout="page.layout || 'prev, pager, next, total'"
          :total="page.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </slot>
      <slot v-else-if="page && page.pageSize === 1">
        <el-pagination
          :current-page="page.currentPage"
          :page-size="page.pageSize"
          size="small"
          layout="prev, next"
          :total="page.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </slot>
    </slot>
    <el-empty v-else description="暂无数据"></el-empty>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showOption: false,
      name: "科研信息",
      mode: "view",
      gutter: 10,
      span: 24,
      style: "",
      withSelection: false,
      isIndeterminate: false,
      optionBtn: false,
      optionBtnText: "导出",
      cardStyle: {},
      config: [],
      info: {},
      data: [],
      page: {},
      pluginCard: {}
    };
  },
  directives: {
    json: {
      mounted: function (el, a, b) {
        let data = $(el).attr("data");
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
        let app = param.value.app;
        let index = el.getAttribute("index") || 0;
        let tData = param.instance.info[index];
        param.instance.pluginCard = param.instance.pluginCard || {};
        param.instance.pluginCard[param.value.prop] = param.instance.pluginCard[param.value.prop] || []
        let value = tData[param.value.prop];
        let paramName = app.paramName;
        app.dsl = app.dsl || {
          data: "",
        };
        app.dsl.data = app.dsl.data || "";
        if (paramName) {
          app.dsl.data = app.dsl.data || {};
          app.dsl.data[paramName] = value;
        } else if (value) {
          app.dsl.data = value;
        }
    
        webCpu.updateView(el, app, function(t) {
          
        });
        param.instance.pluginCard[param.value.prop].push(el);
      },
    },
    qr: {
      mounted: function (el) {
        let content = el.getAttribute("content");
        // let w = el.getAttribute("width");
        // let h = el.getAttribute("height");
        let w = el.clientWidth;
        let h = el.clientHeight;
        let v = Math.min(w, h);
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
      d[item.prop].splice(tIndex, 1);
    },
    showInput(d, item) {
      d.inputVisible = true;
      this.$nextTick(() => {
        if (this.$refs && this.$refs.saveTagInput) {
          this.$refs.saveTagInput[0].$refs.input.focus();
        }
      });
    },
    loadByScroll() {
      console.log("loading more...");
    },
    getResult(index) {
      index = index || 0;
      return this.info[index];
    },
    handleInputConfirm(d, item) {
      let inputValue = d.inputValue;
      if (inputValue) {
        d[item.prop].push(inputValue);
      }
      d.inputVisible = false;
      d.inputValue = "";
    },
    _handleCheckAllChange(d, index, item) {
      if (d.checkAll) {
        d[item.prop] = item.items.map((d) => {
          return d.value || d;
        });
      } else {
        d[item.prop] = [];
      }
      d.isIndeterminate = false;
    },
    _handleCheckedChange(d, index, item) {
      let checkedCount = d[item.prop].length;
      d.checkAll = checkedCount === item.items.length;
      d.isIndeterminate = checkedCount > 0 && checkedCount < item.items.length;
    },
    updateData(obj) {
      for (let i in obj) {
        this[i] = obj[i] || this[i];
      }
      this.info = this.info || {};
      if (this.info && this.info.constructor.name !== "Array") {
        this.info = [this.info];
      }
      this.info = Vue.reactive(JSON.parse(JSON.stringify(this.info)));
      this.optionMap = this.optionMap || {};
      for (let j = 0; j < this.config.length; j++) {
        let k = this.config[j].prop;
        this.optionMap[k] = this.optionMap[k] || {};
        let type = this.config[j].type;
        if (
          type === "text" &&
          this.config[j].icon &&
          this.config[j].icon.constructor.name !== "Array"
        ) {
          this.config[j].icon = [this.config[j].icon];
        }
      }
      this.$forceUpdate();
    },
    addDataItem(param, callback) {
      this.info.unshift(param);
      this.info = JSON.parse(JSON.stringify(this.info));
      this.$nextTick(() => {
        this.updateData();
        if (typeof callback === "function") {
          callback();
        }
      });
    },
    removeDataItem(index, callback) {
      this.info.splice(index, 1);
      this.$nextTick(() => {
        this.updateData();
        if (typeof callback === "function") {
          callback();
        }
      });
    },
    handleClickCard(d, config, i) {},
    handleClickButton(d, config, i) {},
    handleSizeChange(v) {},
    handleCurrentChange(v) {},
    dealChangeEvent(item, data) {},
    handleCheckAllChange() {
      let item = this;
      item.value = [];
      for (let i = 0; i < item.info.length; i++) {
        if (item.checkAll) {
          item.info[i].checked = true;
          item.value.push(item.info[i].value || item.info[i].name);
        } else {
          item.info[i].checked = false;
        }
      }
      item.isIndeterminate = false;

      this.$forceUpdate();
      // this.$emit("change", item.value, this);
    },
    handleCheckedChange(index) {
      let item = this;
      item.value = [];
      for (let i = 0; i < item.info.length; i++) {
        if (item.info[i] && item.info[i].checked) {
          item.value.push(item.info[i].value || item.info[i].name);
        }
      }
      let checkedCount = item.value.length;
      item.checkAll = checkedCount === item.info.length;
      item.isIndeterminate =
        checkedCount > 0 && checkedCount < item.info.length;
      this.$forceUpdate();
      // this.$emit("change", index, item.value, this);
    },
  },
  props: {
    dataObj: Object,
  },
};
</script>

<style scoped>
.cardListArea {
  width: 100%;
  margin: auto;
  height: auto;
  padding: 10px 0px;
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

.el-col {
  margin-bottom: 5px;
}

.el-card {
  position: relative;
  width: 100%;
  border: none;
}

.el-input__wrapper {
  width: 100%;
}
.el-card__body {
  padding: 5px 0px;
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

label {
  margin-bottom: 0px;
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
