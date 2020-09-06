<template>
    <div v-show="isParentVisible" :class="['oc-popup', alignClass]" :style="styleObject">
        <oc-overlay
            v-if="hasMask"
            :visible="visible"
            :opacity="maskOpacity"
            :mask-transition-name="maskTransitionName"
            z-index="-1"
            :is-lock-scroll="isLockScroll"
            @mask="maskHandler"
        ></oc-overlay>
        <transition :type="mainTransitionType" :name="mainTransitionName || animationName" @after-enter="afterEnter" @after-leave="afterLeave">
            <div
                v-show="visible"
                :class="['oc-popup-inner', dialogClassName]"
                :style="hasCloseIcon ? 'position: relative' : ''"
            >
                <slot></slot>
                <div v-if="hasCloseIcon" class="oc-popup-close" @click="closeHandler">
                    <oc-icon :name="closeIconName"></oc-icon>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import OcOverlay from '../Overlay';
import _ from 'lodash';

const preClass = 'oc-popup';

export default {
    name: 'OcPopup',
    components: {
        OcOverlay
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        zIndex: [Number, String],
        align: {
            type: String,
            default: 'center',
            validator(str) {
                return ['top', 'right', 'bottom', 'left', 'center'].indexOf(str) !== -1;
            }
        },
        closeIconName: {
            type: String,
            default: 'cross'
        },
        hasMask: {
            type: Boolean,
            default: true
        },
        maskOpacity: [Number, String],
        hasCloseIcon: {
            type: Boolean,
            default: false
        },
        maskTransitionName: {
            type: String,
            default: 'fade'
        },
        mainTransitionName: {
            type: String,
            default: ''
        },
        mainTransitionType: {
            type: String,
            default: 'animation'
        },
        isLockScroll: {
            type: Boolean,
            default: true
        },
        canCloseByMask: {
            type: Boolean,
            default: false
        },
        dialogClassName: [String, Object]
    },
    data() {
        return {
            isParentVisible: false // 顶层v-if控制变量
        };
    },
    computed: {
        styleObject() {
            if (this.zIndex) {
                return {
                    zIndex: this.zIndex
                };
            }
            return {};
        },
        alignClass() {
            const align = this.align.toLowerCase();
            return `${preClass}-${align}`;
        },
        animationName() {
            let direction;
            if (this.align === 'center') {
                direction = '';
            } else {
                direction = this.align.slice(0, 1).toUpperCase() + this.align.slice(1);
            }
            return `ocBounceIn${direction}`;
        }
    },
    watch: {
        visible: {
            handler(val) {
                if (val) {
                    this.isParentVisible = val;
                }
            },
            immediate: true
        }
    },
    methods: {
        closeHandler: _.throttle(
            function(e) {
                this._onHide();
                this.$emit('close', e);
            }, 500, { trailing: false }
        ),
        maskHandler: _.throttle(
            function(e) {
                if (this.canCloseByMask) {
                    this._onHide();
                }
                this.$emit('mask', e);
            }, 500, { trailing: false }
        ),
        _onHide() {
            this.$emit('update:visible', false);
        },
        afterEnter() {
            this.$emit('show');
        },
        afterLeave() {
            this.isParentVisible = false;
            this.$emit('hide');
        }
    }
};
</script>
