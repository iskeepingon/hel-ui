<template>
    <div class="oc-tab" ref="ocTab">
        <div class="oc-tab-title" :class="isScroll ? 'isScroll' : ''">
            <div class="oc-tab-title-inner" ref="ocTabTitle">
                <span
                    v-for="(it, idx) in tabTitleList"
                    :key="idx"
                    :class="['oc-tab-link', {'is-disable': it.disabled}, {'is-active': activeIndex === idx}]"
                    :style="styleObj"
                    @click="switchTab(idx, $event, it)"
                >
                    <oc-icon :name="it.icon" v-if="it.icon" class="oc-tab-icon"></oc-icon>
                    {{ it.title }}
                </span>
            </div>
            <b
                v-if="!isScroll"
                class="nav-bar"
                :style="[{transform: 'translateX(' + initX + 'px)'}, {width: navWidth + 'px'}]"
            ></b>
        </div>
        <div class="oc-tab-item" ref="ocTabItem" v-show="contentShow">
            <slot></slot>
        </div>
    </div>
</template>
<script>
// import OcIcon from '../Icon';
window.Factor = 0.5;
import {doAnimate} from '../../common/util/animation';


export default {
    name: 'OcTabs',
    components: {
        // OcIcon
    },
    props: {
        type: {
            type: String,
            default: 'based'
        },
        index: {
            type: Number,
            default: 0
        },
        threshold: {
            type: [String, Number],
            default: 4
        },
        contentShow: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            tabTitleList: [],
            navWidth: 0,
            activeIndex: this.getActiveIndex()
        };
    },
    watch: {},
    computed: {
        isScroll() {
            return this.tabTitleList.length > this.threshold;
        },
        initX() {
            const x = this.navWidth * this.activeIndex;
            if (this.isScroll) {
                return x - this.$refs.ocTabTitle.scrollLeft;
            }
            return x;
        },
        fixThreshold() {
            if (this.isScroll) {
                return this.threshold + window.Factor;
            } else {
                return this.tabTitleList.length;
            }
        },
        styleObj() {
            if (!this.isScroll) {
                return {
                    'min-width': `${100 / this.fixThreshold}%`
                };
            }
            return {};
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$slots.default && this.initTab(this.$slots.default);
        });
    },
    methods: {
        getActiveIndex() {
            const initIndex = parseInt(this.index, 10);
            if (Number.isNaN(initIndex)) {
                return 0;
            } else {
                return initIndex;
            }
        },
        initTab: function(params) {
            let slot = params;
            for (let i = 0; i < slot.length; i++) {
                let slotTag = slot[i].tag;
                if (typeof slotTag === 'string') {
                    if (slotTag.indexOf('OcTabPanel') !== -1) {
                        let item = {
                            title: slot[i].data.attrs.title,
                            icon: slot[i].data.attrs.icon,
                            disabled: slot[i].data.attrs.disabled,
                            href: slot[i].data.attrs.href ? slot[i].data.attrs.href : ''
                        };
                        this.tabTitleList.push(item);
                        const slotElm = slot[i].elm;
                        if (slotElm) {
                            if (this.activeIndex === i) {
                                slotElm.classList.remove('hide');
                            }
                        }
                    }
                }
            }
            setTimeout(() => {
                this.getTabWidth();
            });
        },
        getTabWidth: function() {
            let tabTitleRect = this.$refs.ocTabTitle.getBoundingClientRect();
            this.navWidth = tabTitleRect.width / this.fixThreshold;
        },
        switchTab: function(index, e, item) {
            if (!item.disabled) {
                if (this.isScroll) {
                    this.scrollIntoView(e);
                }
                this.activeIndex = index;
                let items = this.$refs.ocTabItem.children;
                for (let i = 0; i < items.length; i++) {
                    if (i === index) {
                        items[i].classList.remove('hide');
                    } else {
                        items[i].classList.add('hide');
                    }
                }
            }
            this.$emit('tab-switch', index, e, item.disabled, item);
            // 如果存在href参数 先执行回调tab-switch，在进行href跳转
            if (!item.disabled && item.href) {
                window.location.href = item.href;
            }
        },
        scrollIntoView(e) {
            const box = this.$refs.ocTabTitle;
            const boxRect = box.getBoundingClientRect();
            const targetRect = e.target.getBoundingClientRect();
            const boxMiddleLine = boxRect.left + boxRect.width / 2;
            const targetMiddleLine = targetRect.left + targetRect.width / 2;
            if (targetMiddleLine === boxMiddleLine) return;
            // 使当前tab尽可能滑动到屏幕中间
            doAnimate({
                initValue: box.scrollLeft,
                targetValue: box.scrollLeft + (targetMiddleLine - boxMiddleLine),
                duration: 300,
                easing: 'easeInOutSine',
                update: (val) => {
                    box.scrollLeft = val;
                }
            });
        }
    }
};
</script>
