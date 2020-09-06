<template>
    <transition :name="maskTransitionName">
        <div v-show="visible" class="oc-mask" @click="maskHandler" :style="styleObject"></div>
    </transition>
</template>

<script>
const lockMaskScroll = ((bodyCls) => {
    let scrollTop;
    let scrollingElement = document.scrollingElement || document.body;
    return {
        afterOpen() {
            scrollTop = scrollingElement.scrollTop;
            document.body.classList.add(bodyCls);
            document.body.style.top = -scrollTop + 'px';
        },
        beforeClose() {
            if (document.body.classList.contains(bodyCls)) {
                document.body.classList.remove(bodyCls);
                document.body.style.top = '';
                scrollingElement.scrollTop = scrollTop;
            }
        }
    };
})('mask-open');

export default {
    name: 'OcOverlay',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        opacity: [Number, String],
        zIndex: [Number, String],
        maskTransitionName: {
            type: String,
            default: 'fade'
        },
        isLockScroll: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {};
    },
    computed: {
        // zIndexMixin() {
        //     return this.zIndex || (this.$UICONFIG || {}).zIndex;
        // },
        opacityNum() {
            const num = Math.abs(this.opacity);
            if (isNaN(num) || num === 0) {
                return false;
            } else {
                return num / 100;
            }
        },
        styleObject() {
            if (this.opacityNum) {
                return {
                    background: `rgba(0, 0, 0, ${this.opacityNum})`,
                    zIndex: this.zIndex
                };
            }
            return {
                zIndex: this.zIndex
            };
        }
    },
    watch: {
        visible(val) {
            if (this.isLockScroll) {
                //锁定|解锁页面滚动
                lockMaskScroll[val ? 'afterOpen' : 'beforeClose']();
            }
        }
    },
    methods: {
        maskHandler(e) {
            this.$emit('mask', e);
        }
    }
};
</script>
