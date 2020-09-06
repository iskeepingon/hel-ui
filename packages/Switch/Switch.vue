<template>
    <span
        :class="['oc-switch', {'oc-switch-disabled': disabled}, checked ? 'oc-switch-active' : 'oc-switch-inactive']"
        :style="styleObject"
        @click.prevent="clickHandler"
        ref="switch"
    ></span>
</template>
<script>
export default {
    name: 'OcSwitch',
    props: {
        value: {
            type: [Boolean, String, Number],
            default: false
        },
        disabled: {
            // 是否禁用
            type: Boolean,
            default: false
        },
        activeValue: {
            // switch 打开时的值
            type: [Boolean, String, Number],
            default: true
        },
        inactiveValue: {
            // switch 关闭时的值
            type: [Boolean, String, Number],
            default: false
        },
        activeColor: {
            // switch 打开时的背景色（支持渐变色）
            type: String,
            default: ''
        },
        inactiveColor: {
            // switch 关闭时的背景色（支持渐变色）
            type: String,
            default: ''
        },
        width: {
            // 开关宽度，单位px
            type: Number
        },
        preventDefault: {
            // 阻止默认点击事件（用于异步切换开关状态）
            type: Boolean
        }
    },
    data() {
        return {};
    },
    created() {
        // 若缺省值不在可选范围内，则默认为关。
        if ([this.activeValue, this.inactiveValue].indexOf(this.value) === -1) {
            this.$emit('input', this.inactiveValue);
        }
    },
    computed: {
        checked() {
            return this.value === this.activeValue;
        },
        styleObject() {
            let styleObject = {};
            // 自定义背景色
            if (this.activeColor || this.inactiveColor) {
                let newColor = this.checked ? this.activeColor : this.inactiveColor;
                styleObject.background = newColor;
            }
            // 自定义宽度
            if (this.width) {
                styleObject.width = this.width + 'px';
            }
            return styleObject;
        }
    },
    methods: {
        clickHandler() {
            if (this.disabled) return;
            if (this.preventDefault) {
                this.$emit('onClick', this.value);
            } else {
                this.changeValue();
            }
        },
        changeValue() {
            const val = this.checked ? this.inactiveValue : this.activeValue;
            this.$emit('input', val); // 更新父组件值
            this.$emit('onChange', val); // 开关状态改变事件
        }
    }
};
</script>
