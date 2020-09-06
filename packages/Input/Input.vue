<template>
    <div
        class="oc-input"
        :class="{
            'oc-input-is-required': required,
            'oc-input-is-clickable': clickable,
            'oc-input-with-border': border,
            'oc-input-on-error': error
        }"
    >
        <div class="oc-input-main">
            <div class="oc-input-icon">
                <slot name="left-icon"></slot>
            </div>
            <slot name="label">
                <div class="oc-input-label" :class="labelClass" :style="labelStyle">{{ label }}</div>
            </slot>
            <div class="oc-input-value">
                <label class="oc-input-input-wrapper">
                    <input
                        v-if="type !== 'textarea'"
                        ref="input"
                        v-model="inputVal"
                        :type="nativeType"
                        :placeholder="placeholder"
                        :maxlength="maxlength"
                        :readonly="readonly"
                        :disabled="disabled"
                        class="oc-input-input"
                        @input="onInput"
                        @focus="onFocus"
                        @blur="onBlur"
                    />
                    <textarea
                        v-else
                        ref="textarea"
                        v-model="inputVal"
                        :placeholder="placeholder"
                        :maxlength="maxlength"
                        :readonly="readonly"
                        :disabled="disabled"
                        class="oc-input-input"
                        @input="onInput"
                        @focus="onFocus"
                        @blur="onBlur"
                    ></textarea>
                </label>
                <div class="oc-input-clear">
                    <i v-show="clearable && inputVal" class="oc-input-btn-clear" @click="onClear"></i>
                </div>
                <div class="oc-input-btn">
                    <slot name="button"></slot>
                </div>
                <div class="oc-input-icon">
                    <slot name="right-icon"></slot>
                </div>
            </div>
        </div>
        <div v-if="maxlength && showWordLimit" class="oc-input-word-limit">
            <span>{{ `${String(value).length}/${maxlength}` }}</span>
        </div>
        <div v-show="error && errorMessage" class="oc-input-error-message">
            <span :class="errorMessageClass">{{ errorMessage }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OcInput',
    props: {
        label: {
            type: String,
            default: ''
        },
        value: {
            type: [String, Number],
            default: ''
        },
        type: {
            // tel, number, textarea, password
            type: String,
            default: 'text'
        },
        maxlength: {
            type: Number,
            default: null
        },
        placeholder: {
            type: String,
            default: ''
        },
        border: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        },
        clearable: {
            type: Boolean,
            default: false
        },
        clickable: {
            type: Boolean,
            default: false
        },
        isLink: {
            type: Boolean,
            default: false
        },
        showWordLimit: {
            type: Boolean,
            default: false
        },
        error: {
            type: Boolean,
            default: false
        },
        errorMessage: {
            type: String,
            default: ''
        },
        errorMessageClass: {
            type: String,
            default: null
        },
        labelClass: {
            type: String,
            default: null
        },
        labelWidth: {
            type: [String, Number],
            default: null
        },
        autosize: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            inputVal: this.value
        };
    },

    computed: {
        nativeType() {
            const type = this.type;
            switch (type) {
                case 'tel':
                    return 'number';
                case 'number':
                case 'password':
                    return type;
                case 'textarea':
                    return null;
                default:
                    return null;
            }
        },
        labelStyle() {
            const labelWidth = this.labelWidth;
            let width;
            if (typeof labelWidth === 'number') {
                width = `${labelWidth}px`;
            }
            width = labelWidth;
            return {
                width
            };
        }
    },

    watch: {
        inputVal(val, oldVal) {
            if (val === oldVal) {
                return;
            }
            if (val) {
                const maxlength = this.maxlength;
                if (maxlength) {
                    if (this.type === 'number') {
                        const strNum = String(val);
                        if (strNum.length > maxlength) {
                            this.inputVal = Number(String(val).substr(0, maxlength));
                            return;
                        }
                    } else {
                        if (val.length > maxlength) {
                            this.inputVal = val.substr(0, maxlength);
                            return;
                        }
                    }
                }
            }
            if (this.autosize && this.type === 'textarea') {
                this.textareaHeightCalc();
            }
            this.$emit('input', val);
        }
    },

    methods: {
        onInput() {
            this.$emit('input', this.inputVal);
        },
        onFocus() {
            this.$emit('focus');
        },
        onBlur() {
            this.$emit('blur');
        },
        onClear() {
            this.inputVal = null;
            this.$emit('clear');
        },
        textareaHeightCalc() {
            const {textarea: target} = this.$refs;
            if (!target) {
                return;
            }
            const autosize = this.autosize;
            // 如果进行删除操作，scrollHeight会比文本内容高度更高，所以height先置成auto
            target.style.height = 'auto';
            let height = target.scrollHeight;
            if (autosize instanceof Object) {
                const {maxHeight, minHeight} = autosize;
                if (maxHeight) {
                    height = Math.min(height, maxHeight);
                }
                if (minHeight) {
                    height = Math.max(height, minHeight);
                }
            }
            if (height) {
                target.style.height = height + 'px';
            }
        },
        // 暴露给外部使用
        focus() {
            const {input, textarea} = this.$refs;
            (input || textarea).focus();
        },
        blur() {
            const {input, textarea} = this.$refs;
            (input || textarea).blur();
        }
    }
};
</script>
