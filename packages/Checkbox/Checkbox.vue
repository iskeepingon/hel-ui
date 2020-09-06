<template>
    <div
        class="oc-checkbox"
        :class="labelPosition === 'left' ? 'oc-checkbox-label-left' : 'oc-checkbox-label-right'"
        @click="clickHandler"
    >
        <slot name="icon" :checked="isChecked">
            <div
                class="oc-checkbox-inner-icon"
                :class="{
                    'oc-checkbox-is-checked': isChecked,
                    'oc-checkbox-is-disabled': isDisabled,
                    'oc-checkbox-has-animation': isAnimated
                }"
                :style="{width: computedSize, height: computedSize}"
            ></div>
        </slot>
        <div class="oc-checkbox-label">
            <slot :checked="isChecked"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OcCheckbox',

    inject: {
        parentGroup: {
            from: 'parentCheckboxGroup',
            default: null
        }
    },

    props: {
        value: {
            type: [String, Number]
        },
        size: {
            type: [String, Number],
            default: '20px'
        },
        // 选中状态的值（只在CheckboxGroup中生效）
        label: {
            type: [String, Number, Boolean],
            default: true
        },
        // 选中时的值
        trueLabel: {
            type: [String, Number]
        },
        // 没有选中时的值
        falseLabel: {
            type: [String, Number]
        },
        // 选中时的动画
        animated: {
            type: Boolean,
            default: true
        },
        // 被禁用
        disabled: {
            type: Boolean,
            default: false
        },
        labelPosition: {
            type: String,
            default: 'right'
        }
    },

    computed: {
        computedSize() {
            const size = this.size;
            if (typeof size === 'number') {
                return size + 'px';
            }
            return size;
        },
        isDisabled() {
            const parentGroup = this.parentGroup;
            return parentGroup ? parentGroup.disabled || this.disabled : this.disabled;
        },
        isAnimated() {
            const parentGroup = this.parentGroup;
            return parentGroup ? parentGroup.animated || this.animated : this.animated;
        },
        isChecked() {
            if (this.parentGroup) {
                return this.parentGroup.value.indexOf(this.label) > -1;
            } else {
                return this.value === this.trueLabel;
            }
        }
    },

    methods: {
        clickHandler() {
            if (this.isDisabled) {
                return;
            }
            if (this.parentGroup) {
                this.parentGroup.update(this.label);
            } else {
                const value = this.trueLabel === this.value ? this.falseLabel : this.trueLabel;
                this.$emit('input', value);
            }
        }
    }
};
</script>
