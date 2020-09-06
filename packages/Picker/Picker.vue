<template>
    <div class="oc-picker-container" @touchmove.prevent="touchmoveHandler($event)" @touchend="touchendHandler">
        <div v-if="showToolbar" class="oc-picker-switch-wrapper">
            <div class="oc-picker-btn-wrapper">
                <slot name="cancel-btn" :text="cancelBtnText">
                    <div class="oc-picker-cancel" @click="onCancel">{{ cancelBtnText || t('picker.cancel') }}</div>
                </slot>
            </div>
            <div class="oc-picker-text-grow">
                <slot name="title" :text="title">
                    <div class="oc-picker-title">{{ title }}</div>
                </slot>
            </div>
            <div v-if="!singleColumnMode" class="oc-picker-btn-wrapper">
                <slot name="confirm-btn" :text="confirmBtnText">
                    <div class="oc-picker-confirm" @click="onSubmit('confirm')">
                        {{ confirmBtnText || t('picker.confirm') }}
                    </div>
                </slot>
            </div>
        </div>
        <slot name="columns-top"></slot>
        <div v-if="singleColumnMode" class="" :class="['oc-picker-upper-line', selectedClassName]">
            <div
                v-for="(item, i) in selectedData"
                :key="i"
                class="oc-picker-upper-line-item"
                :class="{'oc-picker-upper-selected': i === selectedIndex}"
                @click="singleColumnClickHandler(i)"
            >
                <div>{{ item === null ? t('picker.placeholder') : item }}</div>
            </div>
        </div>
        <div ref="innerPicker" class="oc-picker-inner" :style="{height: `${lineHeight * lineCount}px`}">
            <div v-show="!singleColumnMode" class="oc-picker-selected-line" :style="{height: `${lineHeight}px`}"></div>
            <div class="oc-picker-wrapper">
                <div
                    v-for="(list, i) in dataList"
                    v-show="!singleColumnMode || i === selectedIndex"
                    :key="i"
                    class="oc-picker-list-container"
                    :class="getListClassName(i)"
                >
                    <div
                        ref="innerList"
                        class="oc-picker-inner-list-wrapper"
                        :class="{'oc-picker-column-mask': !singleColumnMode}"
                        @touchstart="touchstartHandler(i)"
                        @transitionend="transitionendHandler(i)"
                        @click="selectHandler(i, $event)"
                    >
                        <ul
                            class="oc-picker-list"
                            :class="{'oc-picker-list-item-center': listAlign === 'center'}"
                            :style="{
                                'margin-top': `${singleColumnMode ? 0 : sideLineCount * lineHeight}px`,
                                transform: `translateY(${translationList[i]}px)`,
                                transitionDuration: `${durationList[i]}s`,
                                transitionProperty: 'transform',
                                transitionFunction: 'ease-out'
                            }"
                        >
                            <li
                                v-for="(item, j) in list"
                                :key="j"
                                class="oc-picker-list-item"
                                :class="{'oc-picker-item-selected': j === indices[i]}"
                                :style="{height: `${lineHeight}px`}"
                            >
                                {{ item instanceof Object ? item.text : item }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <slot name="columns-bottom"></slot>
    </div>
</template>

<script>
import Locale from '../Locale/locale.js';
export default {
    name: 'OcPicker',
    mixins: [Locale],
    props: {
        isLinkage: {
            type: Boolean,
            default: true
        },
        multiArray: {
            type: Array,
            required: true
        },
        className: {
            type: [Array, String]
        },
        selectedClassName: {
            type: String,
            default: null
        },
        initIndices: {
            type: Array
        },
        lineCount: {
            type: Number,
            default: 5,
            validator(num) {
                return num >= 3 && num % 2 === 1;
            }
        },
        listAlign: {
            type: String,
            default: 'left'
        },
        isSingleColumn: {
            type: Boolean,
            default: false
        },
        showToolbar: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: ''
        },
        confirmBtnText: String,
        cancelBtnText: String
    },

    // Array.prototype.fill在目前的兼容要求下无法使用
    data() {
        // boolean
        this.isLocked = false;
        // 上次滑动的方向 负数向上 正数向下 number
        this.direction = 0;
        // 是否开始滑动 boolean[]
        this.touched = this.multiArray.map(() => false);
        this.touchMoved = this.multiArray.map(() => false);

        // 上一个滑动时的信息 object[]
        this.originList = new Array(this.multiArray.length);
        // 各列表是否处于滑动中 boolean[]
        this.inTransition = new Array(this.multiArray.length);

        return {
            selectedIndex: 0, // 当前选中的列表下标

            dataList: (() => {
                // 列表
                const multiArray = this.multiArray;
                const indices = this.initIndices || this.multiArray.map(() => 0);
                const len = multiArray.length;
                const list = multiArray.concat();
                if (this.isLinkage) {
                    for (let i = 0; i < len; i += 1) {
                        for (let j = 0; j < i; j += 1) {
                            const index = indices[j];
                            if (index >= 0) {
                                list[i] = list[i][index];
                            }
                        }
                    }
                }
                return list;
            })(),
            // 各列表当前选中的下标
            indices: this.initIndices
                ? this.initIndices.concat()
                : this.multiArray.map(() => {
                      return this.isSingleColumn && this.isLinkage ? -1 : 0;
                  }),
            // 各列表的translateY值
            translationList: this.initIndices ? this.initIndices.concat() : this.multiArray.map(() => 0),
            // 各列表的transition-duration值
            durationList: this.multiArray.map(() => 0),

            selectedData: null
        };
    },
    computed: {
        lineHeight() {
            return 34;
        },
        // 选中的那一行的上下行数
        sideLineCount() {
            /* eslint-disable */
            return this.lineCount >> 1;
        },
        singleColumnMode() {
            return this.isSingleColumn && this.isLinkage;
        }
    },
    mounted() {
        const lineHeight = this.lineHeight;
        const len = this.translationList.length;
        const indices = this.indices;
        const singleColumn = this.singleColumnMode;
        let i = 0;
        let selectedIndex = 0;
        for (; i < len; i += 1) {
            const index = indices[i];
            if (index >= 0) {
                selectedIndex += 1;
            } else {
                break;
            }
            let translateY;
            if (singleColumn) {
                this.refreshSingleColumn(i);
            } else {
                translateY = -lineHeight * index;
                this.$set(this.translationList, i, translateY);
            }
        }
        this.selectedIndex = selectedIndex && selectedIndex - 1;
        this.refreshSelectedData();
    },
    methods: {
        // 取消
        onCancel() {
            this.$emit('cancel');
        },
        submit(type) {
            if (this.isLocked) {
                return;
            }
            const indices = this.indices;
            const result = this.dataList.map((list, index) => {
                const target = list[indices[index]];
                let val, text;
                if (target instanceof Object) {
                    val = target.val;
                    text = target.text;
                } else {
                    val = target;
                }
                return {
                    index: indices[index],
                    val,
                    text
                };
            });
            // type: 'change' | 'confirm'
            this.$emit(type, result);
        },
        // 提交数据
        onSubmit(type) {
            this.submit(type);
        },
        refreshSingleColumn(listIndex) {
            const lineHeight = this.lineHeight;
            const lineCount = this.lineCount;
            const index = this.indices[listIndex];
            let translateY;
            if (index < 0) {
                translateY = 0;
            } else {
                const columnsLen = this.dataList[listIndex].length;
                if (columnsLen <= lineCount) {
                    translateY = 0;
                } else if (columnsLen - 1 - index >= lineCount) {
                    translateY = -lineHeight * index;
                } else {
                    translateY = -lineHeight * (columnsLen - lineCount);
                }
            }
            this.$set(this.translationList, listIndex, translateY);
        },
        refreshSelectedData() {
            const indices = this.indices;
            const dataList = this.dataList;
            const selectedData = [];
            for (let i = 0, len = this.dataList.length; i < len; i += 1) {
                const j = indices[i];
                if (j >= 0) {
                    const target = dataList[i][j];
                    selectedData.push(target instanceof Object ? target.text : target);
                } else {
                    selectedData.push(null);
                    break;
                }
            }
            this.selectedData = selectedData;
        },
        // 调整滑动translateY值
        getFixedTranslateY(translateY, round) {
            // round ? 调用Math.round : 根据direction调用Math.floor/ceil
            let fixedY;
            const lineHeight = this.lineHeight;
            if (round) {
                fixedY = Math.round(translateY / lineHeight) * lineHeight;
            } else {
                fixedY = Math[this.direction < 0 ? 'floor' : 'ceil'](translateY / lineHeight) * lineHeight;
            }
            const currentList = this.dataList[this.selectedIndex];
            let translateLimit;
            if (this.singleColumnMode) {
                if (currentList.length <= this.lineCount) {
                    translateLimit = 0;
                } else {
                    translateLimit = lineHeight * (this.lineCount - currentList.length);
                }
            } else {
                translateLimit = -lineHeight * (currentList.length - 1);
            }
            if (fixedY < translateLimit) {
                fixedY = translateLimit;
            } else if (translateY > 0) {
                fixedY = 0;
            }
            return fixedY;
        },
        // 设置数组下标
        setIndex(optionIndex, duration = 0.3, listIndex = this.selectedIndex) {
            // 避免-0
            if (optionIndex === 0) {
                optionIndex = 0;
            }
            this.$set(this.durationList, listIndex, duration);
            if (optionIndex === this.indices[listIndex]) {
                return;
            }
            if (duration) {
                this.inTransition[listIndex] = true;
            }
            // 非单列模式下才需要重新设置下标
            if (optionIndex !== null) {
                this.indices[listIndex] = optionIndex;
                if (this.isLinkage) {
                    this.dataListMutation(listIndex);
                }
                this.refreshSelectedData();
            }
        },
        dataListMutation(listIndex) {
            const isSingleColumn = this.isSingleColumn;
            const list = this.multiArray.concat();
            const len = list.length;
            const indices = this.indices;
            for (let i = listIndex + 1; i < len; i += 1) {
                // 重置索引
                this.$set(indices, i, isSingleColumn ? -1 : 0);
            }
            // 重新整理列表
            for (let i = 0; i < len; i += 1) {
                for (let j = 0; j < i; j += 1) {
                    // 单列模式下有可能indices中存有-1值，未选择前一项
                    if (indices[j] >= 0) {
                        list[i] = list[i][indices[j]];
                    } else {
                        break;
                    }
                }
            }
            const translationList = this.translationList;
            const dataList = this.dataList;
            for (let i = listIndex + 1; i < len; i += 1) {
                this.$set(dataList, i, list[i]);
                this.$set(translationList, i, 0);
            }
        },
        // 列表滑动结束事件
        transitionendHandler(index) {
            this.$set(this.durationList, index, 0);
            this.inTransition[index] = false;
            if (!this.singleColumnMode) {
                this.submit('change');
            }
        },
        // 点选
        selectHandler(index, e) {
            if (this.isLocked) {
                return;
            }
            this.isLocked = true;
            const singleColumn = this.singleColumnMode;
            const currentList = this.dataList[index];
            const lineHeight = this.lineHeight;
            let step;
            if (singleColumn) {
                step = -Math.floor(e.offsetY / lineHeight);
            } else {
                // 判断点在哪一行，正中间为0，依次类推
                step = -(Math.floor(e.offsetY / lineHeight) - this.sideLineCount);
            }
            // 处于动画过程中则暂停动画，反之滚动到指定位置
            const innerList = this.$refs.innerList[index];
            const ul = innerList.querySelector('ul');
            const transform = getComputedStyle(ul).transform || getComputedStyle(ul).webkitTransform;
            // 匹配出当前的滑动列表的translateY值
            let translateY = Number(transform.match(/^matrix\(.*,\s?(.*)\)$/)[1]);
            let targetIndex;
            if (singleColumn) {
                targetIndex = Math.round(-translateY / lineHeight - step);
                if (targetIndex < 0 || targetIndex >= currentList.length) {
                    return;
                }
            } else {
                // 边界问题处理
                translateY = this.getFixedTranslateY(translateY + step * lineHeight);
                targetIndex = Math.round(-translateY / lineHeight);
            }
            const isSingle = singleColumn && index < this.dataList.length - 1;
            if (this.inTransition[index]) {
                if (!singleColumn) {
                    this.$set(this.translationList, index, translateY);
                }
                this.setIndex(targetIndex, 0.02);
            } else {
                // 边界合法性处理
                if (targetIndex < currentList.length && targetIndex >= 0) {
                    const translationList = this.translationList;
                    if (!singleColumn) {
                        this.$set(translationList, index, -targetIndex * this.lineHeight);
                    }
                    // 防止下标变成-0
                    this.setIndex(targetIndex, step && void 0);
                }
            }
            this.selectedIndex = isSingle ? index + 1 : index;
            if (isSingle) {
                this.refreshSingleColumn(index);
            }
            this.isLocked = false;
            if (singleColumn && index === this.dataList.length - 1) {
                this.submit('confirm');
            }
        },
        // 滑动/点击开始
        touchstartHandler(index) {
            this.selectedIndex = index;
            this.touched[index] = true;
        },
        // 松开手指 对准基准线
        touchendHandler() {
            const index = this.selectedIndex;
            if (!this.touched[index]) {
                this.isLocked = false;
                return;
            }
            if (!this.touchMoved[index]) {
                this.touched[index] = false;
                this.isLocked = false;
                return;
            }
            this.isLocked = true;
            const lineHeight = this.lineHeight;
            // 加速度处理
            let duration;
            let distance = 0;
            const originY = this.originList[index];
            let round = false;
            if (originY) {
                const now = Date.now();
                if (now - originY.time < 50) {
                    // 速度达到一定的值则有额外的“制动”距离
                    let speed = originY.speed;
                    const abs = Math.abs(speed);
                    // 达到一定的拖拽速度，加上加速度，并且基准执行math.ceil/floor，未达到基准则执行math.round
                    if (abs > 100) {
                        if (abs > 1500) {
                            speed = speed > 0 ? 1500 : -1500;
                        }
                        const acceleration = 1000;
                        duration = Math.abs(speed) / acceleration;
                        distance = duration * speed * 0.5;
                        const curTranslateY = this.translationList[index];
                        let limit;
                        if (this.singleColumnMode) {
                            const lineCount = this.lineCount;
                            limit = speed < 0 ? -lineHeight * (this.dataList[index].length - lineCount) : 0;
                        } else {
                            limit = speed < 0 ? -lineHeight * (this.dataList[index].length - 1) : 0;
                        }
                        const limitDistance = limit - curTranslateY;
                        // 计算出的距离不能超过边界范围
                        distance = Math.abs(limitDistance) < Math.abs(distance) ? limitDistance : distance;
                        duration = distance / speed;
                        duration = Math.max(0.3, duration);
                    }
                } else {
                    round = true;
                }
            }
            let translateY = this.translationList[index];
            translateY = this.getFixedTranslateY(translateY + distance, round);

            const targetIndex = Math.round(-translateY / lineHeight);
            this.$set(this.translationList, index, translateY);

            // 在单列模式下，移动结束不需要重新计算所有列表下标，除非点选
            // 反之，移动结束居中的即为已选择项
            if (this.singleColumnMode) {
                this.setIndex(null);
            } else {
                this.setIndex(targetIndex, duration);
            }

            // 状态置空
            this.touched[index] = false;
            this.touchMoved[index] = false;
            this.originList[index] = null;
            this.isLocked = false;
        },
        // 滑动处理
        touchmoveHandler(e) {
            if (this.isLocked) {
                return;
            }
            const index = this.selectedIndex;
            if (this.touched[index]) {
                this.touchMoved[index] = true;
                this.isLocked = true;
                // Mobile(touchmove) / PC(mousemove)
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                const originY = this.originList[index];
                // 维护上次移动到的点信息，并移动列表
                if (originY) {
                    const translationList = this.translationList;
                    const distance = clientY - originY.clientY;
                    this.direction = distance;
                    this.$set(translationList, index, translationList[index] + distance * 1.1);
                    const now = Date.now();
                    originY.speed = (distance / (now - originY.time)) * 1000;
                    originY.clientY = clientY;
                    originY.time = now;
                } else {
                    this.originList[index] = {
                        clientY: clientY,
                        time: Date.now(),
                        speed: null
                    };
                }
            }
            this.isLocked = false;
        },
        getListClassName(index) {
            const className = this.className;
            if (!className) {
                return null;
            }
            if (Array.isArray(className)) {
                return className[index];
            }
            return className;
        },
        singleColumnClickHandler(index) {
            this.selectedIndex = index;
        }
    }
};
</script>
