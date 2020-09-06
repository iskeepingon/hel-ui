<template>
    <div :class="['oc-cell', {'oc-cell-link': url || to, 'oc-cell-disabled': disabled, 'is-multiple': subTitle}]">
        <div class="oc-cell-box" @click="clickHandler">
            <slot>
                <oc-icon v-if="icon" :name="icon" class="oc-cell-icon"></oc-icon>
                <div class="oc-cell-left">
                    <span class="oc-cell-title" v-if="title || $slots.title">
                        <slot name="title">{{ title }}</slot>
                    </span>
                    <span class="oc-cell-sub-title" v-if="subTitle || $slots.subTitle">
                        <slot name="sub-title">{{ subTitle }}</slot>
                    </span>
                </div>
                <div class="oc-cell-right">
                    <div class="oc-cell-desc">
                        <slot name="desc">{{ desc }}</slot>
                    </div>
                    <div class="oc-cell-arrow" v-if="url || to || clickCb">
                        <slot name="icon">
                            <oc-icon name="right"></oc-icon>
                        </slot>
                    </div>
                </div>
            </slot>
        </div>
        <slot name="next"></slot>
    </div>
</template>
<script>
// import OcIcon from '../Icon';

export default {
    name: 'OcCell',
    components: {
        // OcIcon
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        subTitle: {
            type: String,
            default: ''
        },
        desc: {
            type: String,
            default: ''
        },
        url: {
            type: String,
            default: null
        },
        to: {
            type: [String, Object],
            default: null
        },
        clickCb: {
            type: [Function, Object],
            default: null
        },
        icon: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    methods: {
        clickHandler() {
            if (this.disabled) return;
            if (this.clickCb) {
                typeof this.clickCb === 'function' && this.clickCb();
                return;
            }
            if (this.to && this.$router) {
                const promise = this.$router.push(this.to);
                if (promise && promise.catch) {
                    promise.catch((err) => {
                        if (err && err.name !== 'NavigationDuplicated') {
                            throw err;
                        }
                    });
                }
            } else if (this.url) {
                location.href = this.url;
            }
        }
    }
};
</script>
