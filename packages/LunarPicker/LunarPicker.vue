<template>
    <div class="oc-lunar-picker" @touchmove.prevent="moveHandler($event)" @touchend="touchend">
        <div class="oc-lunar-back" @click="cancel"></div>
        <div class="oc-lunar-container">
            <div class="oc-lunar-switch-wrap" :style="{color: topicColor}">
                <div class="oc-lunar-switchers">
                    <div
                        class="oc-lunar-switcher"
                        :class="{'oc-lunar-switcher-sel': !isLunar}"
                        @click="isLunar = false"
                    >
                        公历
                    </div>
                    <div class="oc-lunar-switcher" :class="{'oc-lunar-switcher-sel': isLunar}" @click="isLunar = true">
                        农历
                    </div>
                </div>
                <div class="oc-lunar-confirm" @click="submit">确定</div>
            </div>
            <div class="oc-lunar-border-line"></div>
            <div class="oc-lunar-inner-picker" ref="innerPicker" :style="{height: `${lineHeight * lineCount}px`}">
                <div class="oc-lunar-selected-line" :style="{height: `${lineHeight}px`}">
                    <div class="oc-lunar-border-line"></div>
                    <div class="oc-lunar-border-line"></div>
                </div>
                <div class="oc-lunar-wrap">
                    <div class="oc-lunar-list-container" v-for="(list, i) in dataList" :key="i">
                        <div
                            class="oc-lunar-inner-list"
                            @touchstart="touchstart(i)"
                            @click="selectItem(i, $event)"
                            @transitionend="transitionEnd(i)"
                            ref="innerList"
                        >
                            <ul
                                class="oc-lunar-list"
                                :style="{
                                    'margin-top': `${sideLineCount * lineHeight}px`,
                                    [transform]: `translateY(${translationList[i]}px)`,
                                    [transition]: `transform ${durationList[i]}s ease-out 0s`
                                }"
                            >
                                <li
                                    v-for="(item, j) in list"
                                    :class="{'oc-lunar-item-selected': j === indices[i]}"
                                    :key="`${i}-${j}`"
                                    :style="{height: `${lineHeight}px`}"
                                >
                                    {{ item instanceof Object ? item.text : item }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {FIRST_YEAR, getYears, getMonths, getDays, getHours, getLeapMonth, solar2lunar, lunar2solar} from './lib/date';

const init = (function() {
    const date = new Date();
    return [date.getFullYear(), date.getMonth() + 1, date.getDate(), 0];
})();

export default {
    name: 'OcLunarPicker',
    props: {
        // initDate
        initDate: {
            type: Array,
            default: () => init
        },
        topicColor: {
            type: String,
            default: '#3097fd'
        },
        startYear: {
            type: Number,
            default: FIRST_YEAR
        },
        endYear: {
            type: Number,
            default: init[0]
        },
        lineCount: {
            type: Number,
            default: 5,
            validator(num) {
                return num >= 3 && num % 2 === 1;
            }
        }
    },

    data() {
        this.isLocked = false;
        this.today = new Date();

        return {
            isLunar: false, // false公历 true农历
            selectedIndex: 0, // 当前选中的列表下标

            dataList: (() => {
                // 列表
                const [year, month] = this.initDate;
                return [getYears(this.startYear, this.endYear), getMonths(year), getDays(year, month), getHours()];
            })(),
            indices: (() => {
                const [year, month, day, hour] = this.initDate;
                return [year - this.startYear, month - 1, day - 1, hour || 0];
            })(), // 各列表当前选中的下标 Array.prototype.fill在目前版本的兼容要求下无法使用
            translationList: this.initDate.map(() => 0), // 各列表的translateY值
            durationList: this.initDate.map(() => 0), // 各列表的transition-duration值

            direction: 0, // 上次滑动的方向 负数向上 正数向下
            touched: this.initDate.map(() => false), // 是否开始滑动
            originList: new Array(this.initDate.length), // 上一个滑动时的信息
            inTransition: new Array(this.initDate.length), // 各列表是否处于滑动中

            transform: document.body.style.transform !== undefined ? 'transform' : '-webkit-transform', // style key←↓
            transition: document.body.style.transition !== undefined ? 'transition' : '-webkit-transition'
        };
    },

    computed: {
        lineHeight() {
            return 36;
        },
        sideLineCount() {
            return this.lineCount >> 1;
        }
    },

    watch: {
        isLunar(lunar) {
            const [{val: year}, {val: month}, {val: day}, {val: hour}] = this.pickerValue();
            let date;
            const indices = this.indices;

            // 日期互转
            if (lunar) {
                const lunar = solar2lunar(year, month, day);
                date = [lunar.lYear, lunar.lMonth * (lunar.isLeap ? -1 : 1), lunar.lDay, hour];
            } else {
                const solar = lunar2solar(year, month, day);
                date = [solar.cYear, solar.cMonth, solar.cDay, hour];
            }
            // 超过年份列表时，容错处理
            if (date[0] > this.endYear || date[0] < this.startYear) {
                date = [this.startYear, 1, 1, 0];
            }

            // 重新设置月列表、日列表
            this.$set(this.dataList, 1, getMonths(date[0], lunar));
            this.$set(this.dataList, 2, getDays(date[0], date[1], lunar));

            // 重新设置年份下标
            this.$set(indices, 0, date[0] - this.startYear);
            // 重新设置月份下标
            if (lunar) {
                // 闰月在date.js当中采用的是负数处理
                // 农历年存在闰月时，闰月后的下标需要向后移
                const leapMonth = getLeapMonth(date[0]);
                this.$set(
                    indices,
                    1,
                    date[1] < 0 ? -date[1] : date[1] - (leapMonth > 0 && date[1] > leapMonth ? 0 : 1)
                );
            } else {
                this.$set(indices, 1, date[1] - 1);
            }
            // 重新设置日次下标
            this.$set(indices, 2, date[2] - 1);

            const lineHeight = this.lineHeight;
            const translationList = this.translationList;
            const len = translationList.length;
            for (let i = 0; i < len; i += 1) {
                this.$set(translationList, i, -lineHeight * indices[i]);
            }
        }
    },

    mounted() {
        const lineHeight = this.lineHeight;
        const len = this.translationList.length;
        const indices = this.indices;
        for (let i = 0; i < len; i += 1) {
            this.$set(this.translationList, i, -lineHeight * indices[i]);
        }
    },

    methods: {
        // 隐藏
        cancel() {
            this.$emit('cancel');
        },
        // 提交数据
        submit() {
            if (this.isLocked) {
                return;
            }
            const pickerValue = this.pickerValue();
            let data;
            if (this.isLunar) {
                const date = lunar2solar(pickerValue[0].val, pickerValue[1].val, pickerValue[2].val);
                data = {
                    lunar: pickerValue,
                    solar: [
                        {text: date.cYear + '年', val: date.cYear},
                        {text: date.cMonth + '月', val: date.cMonth},
                        {text: date.cDay + '日', val: date.cDay},
                        pickerValue[3]
                    ]
                };
            } else {
                const date = solar2lunar(pickerValue[0].val, pickerValue[1].val, pickerValue[2].val);
                data = {
                    lunar: [
                        {text: date.lYear + '年', val: date.lYear},
                        {text: date.IMonthCn, val: date.lMonth},
                        {text: date.IDayCn, val: date.lDay},
                        pickerValue[3]
                    ],
                    solar: pickerValue
                };
            }
            this.$emit('confirm', data, this.isLunar);
        },
        pickerValue() {
            const dataList = this.dataList;
            const indices = this.indices;
            return dataList
                .map((list, index) => {
                    return list[indices[index]];
                })
                .map((item) => {
                    return {
                        text: item.text,
                        val: item.val
                    };
                });
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
            const translateLimit = -lineHeight * (currentList.length - 1);
            if (fixedY < translateLimit) {
                fixedY = translateLimit;
            } else if (translateY > 0) {
                fixedY = 0;
            }
            return fixedY;
        },
        // 设置数组下标
        setIndex(optionIndex, duration) {
            duration = duration || 0.3;
            const index = this.selectedIndex;
            this.$set(this.durationList, index, duration);
            if (optionIndex === this.indices[index]) {
                return;
            }
            this.inTransition[index] = true;
            this.indices[index] = optionIndex;
            this.dataListMutation(index);
        },
        // 调整列表数据
        dataListMutation(listIndex) {
            const dataList = this.dataList;
            const indices = this.indices;
            const translationList = this.translationList;
            const lineHeight = this.lineHeight;
            const len = dataList.length;
            for (let index = listIndex + 1; index < len; index += 1) {
                if (index === 1) {
                    const monthList = getMonths(dataList[0][indices[0]].val, this.isLunar);
                    const preMonthList = dataList[1];
                    // data.js当中对数组作了缓存处理，相同的数组会返回相同的指针
                    if (preMonthList !== monthList) {
                        this.$set(dataList, 1, monthList);
                        const currentMonth = preMonthList[indices[index]].val;
                        let searched = false;
                        const monthLen = monthList.length;
                        for (let i = 0; i < monthLen; i += 1) {
                            if (monthList[i].val === currentMonth) {
                                searched = true;
                                this.$set(indices, index, i);
                                break;
                            }
                        }
                        if (!searched) {
                            this.$set(indices, index, 0);
                        }
                    }
                } else if (index === 2) {
                    // 日列表调整
                    const dayList = getDays(dataList[0][indices[0]].val, dataList[1][indices[1]].val, this.isLunar);
                    const preDayList = dataList[2];
                    if (preDayList !== dayList) {
                        this.$set(dataList, index, dayList);
                        const currentDay = preDayList[indices[index]].val;
                        let searched = false;
                        const dayLen = dayList.length;
                        for (let i = 0; i < dayLen; i += 1) {
                            if (dayList[i].val === currentDay) {
                                searched = true;
                                this.$set(indices, index, i);
                                break;
                            }
                        }
                        if (!searched) {
                            this.$set(indices, index, 0);
                        }
                    }
                }
                this.$set(translationList, index, -lineHeight * indices[index]);
            }
        },
        // 列表滑动结束事件
        transitionEnd(index) {
            this.$set(this.durationList, index, 0);
            this.inTransition[index] = false;
        },
        // 鼠标点击选择
        selectItem(index, e) {
            if (this.isLocked) {
                return;
            }
            this.isLocked = true;
            const currentList = this.dataList[index];
            const lineHeight = this.lineHeight;
            // 判断点在哪一行，正中间为0，中间上面一行则为-1，依次类推
            const step = -(Math.floor(e.offsetY / this.lineHeight) - this.sideLineCount);
            if (this.inTransition[index]) {
                // 处于动画过程中则暂停动画
                const innerList = this.$refs.innerList[index];
                const ul = innerList.querySelector('ul');
                const transform = getComputedStyle(ul).transform;
                // 匹配出当前的滑动列表的translateY值
                let translateY = Number(transform.match(/^matrix\(.*,\s?(.*)\)$/)[1]);
                translateY += step * lineHeight;
                if (translateY) {
                    // 边界问题处理
                    translateY = this.getFixedTranslateY(translateY);
                    const targetIndex = Math.round(-translateY / lineHeight);
                    this.$set(this.translationList, index, translateY);
                    this.setIndex(targetIndex, 0.02);
                }
            } else {
                const targetIndex = this.indices[index] - step;
                // 边界合法性处理
                if ((step < 0 && targetIndex < currentList.length) || (step > 0 && targetIndex >= 0)) {
                    const translationList = this.translationList;
                    this.$set(translationList, index, translationList[index] + this.lineHeight * step);
                    this.setIndex(targetIndex);
                }
            }
            this.selectedIndex = index;
            this.isLocked = false;
        },
        // 滚轮处理
        // mousewheel(index, e) {
        //     if (this.isLocked) {
        //         return;
        //     }
        //     this.isLocked = true;
        //     this.selectedIndex = index;
        //     const currentList = this.dataList[index];
        //     // 方向、边界处理
        //     const deltaY = e.deltaY === undefined ? (e.wheelDelta !== undefined ? 'wheelDelta' : 'detail') : 'deltaY';
        //     const currentIndex = this.indices[index];
        //     if (e[deltaY] * (deltaY === 'wheelDelta' ? -1 : 1) < 0) {
        //         if (currentIndex > 0) {
        //             this.setIndex(currentIndex - 1);
        //             const translationList = this.translationList;
        //             this.$set(translationList, index, translationList[index] + this.lineHeight);
        //         }
        //     } else {
        //         if (currentIndex < currentList.length - 1) {
        //             this.setIndex(currentIndex + 1);
        //             const translationList = this.translationList;
        //             this.$set(translationList, index, translationList[index] - this.lineHeight);
        //         }
        //     }
        //     this.isLocked = false;
        // },
        // 滑动/点击开始
        touchstart(index) {
            this.selectedIndex = index;
            this.touched[index] = 1;
        },
        // 松开手指/鼠标
        touchend() {
            const index = this.selectedIndex;
            if (!this.touched[index]) {
                return;
            }
            this.isLocked = true;
            // 对准基准线
            const lineHeight = this.lineHeight;
            // 加速度
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
                        const limit = speed < 0 ? -lineHeight * (this.dataList[index].length - 1) : 0;
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
            this.setIndex(targetIndex, duration);

            // 状态置空
            this.touched[index] = false;
            this.originList[index] = null;
            this.isLocked = false;
        },
        // 滑动处理
        moveHandler(e) {
            if (this.isLocked) {
                return;
            }
            const index = this.selectedIndex;
            if (this.touched[index]) {
                this.isLocked = true;
                // on Mobile(touchmove)
                const clientY = e.touches[0].clientY;
                let originY = this.originList[index];
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
        }
    }
};
</script>
