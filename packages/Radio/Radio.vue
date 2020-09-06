<template>
    <div
        class="oc-radio"
        :class="labelPosition === 'left' ? 'oc-radio-label-left' : 'oc-radio-label-right'"
        @click="clickHandler"
    >
        <slot name="icon" :checked="isChecked" :disabled="isDisabled">
            <div
                class="oc-radio-inner-icon"
                :class="{
                    'oc-radio-is-checked': isChecked,
                    'oc-radio-is-disabled': isDisabled,
                    'oc-radio-has-animation': isAnimated
                }"
                :style="{width: computedSize, height: computedSize}"
            ></div>
        </slot>
        <div class="oc-radio-label"><slot :checked="isChecked" :disabled="isDisabled"></slot></div>
    </div>
</template>

<script>
export default {
    name: 'OcRadio',
    props: {
        value: {
            type: [String, Number, Boolean],
            default: false
        },
        label: {
            type: [String, Number, Boolean],
            required: true
        },
        labelPosition: {
            type: String,
            default: 'right'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        size: {
            type: [String, Number],
            default: '20px'
        },
        animated: {
            type: Boolean,
            default: true
        }
    },
    inject: {
        parentGroup: {
            from: 'parentRadioGroup',
            default: null
        }
    },
    computed: {
        isChecked() {
            if (this.parentGroup) {
                return this.parentGroup.value === this.label;
            } else {
                return this.value === this.label;
            }
        },
        computedSize() {
            const size = this.size;
            if (typeof size === 'number') {
                return size + 'px';
            }
            return size;
        },
        currentValue: {
            get() {
                return (this.parentGroup || this).value;
            },
            set(val) {
                (this.parentGroup || this).$emit('input', val);
            }
        },
        isDisabled() {
            return this.parentGroup ? this.parentGroup.disabled || this.disabled : this.disabled;
        },
        isAnimated() {
            return this.parentGroup ? this.parentGroup.animated || this.animated : this.animated;
        }
    },
    methods: {
        clickHandler() {
            if (this.isDisabled) {
                return;
            }
            (this.parentGroup || this).$emit('input', this.label);
        }
    }
};
</script>
