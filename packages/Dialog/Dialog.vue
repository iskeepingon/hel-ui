<template>
    <oc-popup
        :visible.sync="isVisible"
        :align="align"
        :z-index="zIndex"
        :close-icon-name="closeIconName"
        :has-mask="hasMask"
        :mask-opacity="maskOpacity"
        :has-close-icon="hasCloseIcon"
        :maskTransitionName="maskTransitionName"
        :mainTransitionName="mainTransitionName"
        :mainTransitionType="mainTransitionType"
        :is-lock-scroll="isLockScroll"
        :can-close-by-mask="canCloseByMask"
        :dialog-class-name="dialogClass"
        @show="showHandler"
        @hide="hideHandler"
        @close="closeHandler"
        @mask="maskHandler"
        :class="[customClass ? customClass : '']"
    >
        <slot v-if="isCustom">
            <div :class="[contentAlign === 'left' ? 'alingLeft' : '']">{{ content }}</div>
        </slot>
        <template v-else>
            <div class="oc-dialog-hd">
                <slot name="title">{{ title }}</slot>
            </div>
            <div class="oc-dialog-bd">
                <slot>
                    <div :class="[contentAlign === 'left' ? 'alingLeft' : '']">{{ content }}</div>
                </slot>
            </div>
            <div class="oc-dialog-ft">
                <a
                    href="javascript:;"
                    v-if="type === 'confirm'"
                    @click="cancelHandler"
                >
                    {{ cancelText || t('dialog.cancel') }}
                </a>
                <a
                    href="javascript:;"
                    :class="{active: isLight ? true : false}"
                    :style="styleObject"
                    @click="confirmHandler"
                >
                    {{ confirmText || t('dialog.confirm') }}
                </a>
            </div>
        </template>
    </oc-popup>
</template>

<script>
import OcPopup from '../Popup';
import Locale from '../Locale/locale.js';
import _ from 'lodash';

export default {
    name: 'OcDialog',
    components: {
        OcPopup
    },
    mixins: [Locale],
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'custom',
        },
        title: {
            type: [String, Function],
            default: ''
        },
        customClass: {
            type: String,
            default: ''
        },
        zIndex: [Number, String],
        content: {
            type: [String, Function],
            default: ''
        },
        align: {
            type: String,
            default: 'center'
        },
        contentAlign: {
            type: String,
            default: ''
        },
        cancelText: String,
        confirmText: String,
        closeIconName: {
            type: String,
            default: 'cross'
        },
        confirmTextLight: {
            type: [Boolean, String],
            default: false
        },
        hasMask: {
            type: Boolean,
            default: true
        },
        maskOpacity: [Number, String],
        isFunctional: {
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
        onShow: {
            type: [Function, Object],
            default: null
        },
        onHide: {
            type: [Function, Object],
            default: null
        },
        onConfirm: {
            type: [Function, Object],
            default: null
        },
        onCancel: {
            type: [Function, Object],
            default: null
        },
        onClose: {
            type: [Function, Object],
            default: null
        },
        onMask: {
            type: [Function, Object],
            default: null
        },
        canCloseByMask: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isVisible: false
        };
    },
    computed: {
        isLight() {
            if (typeof this.confirmTextLight === 'boolean') {
                return true;
            }
            return false;
        },
        styleObject() {
            if (!this.isLight) {
                return {
                    color: this.confirmTextLight
                };
            }
            return {};
        },
        isCustom() {
            return ['alert', 'confirm'].indexOf(this.type.toLowerCase()) < 0;
        },
        dialogClass() {
            if (this.isCustom) {
                return 'oc-dialog-custom';
            }
            return `oc-dialog-${this.type.toLowerCase()}`;
        },
        hasCloseIcon() {
            if (this.isCustom) {
                return true;
            }
            return false;
        }
    },
    watch: {
        visible: {
            handler(val) {
                this.isVisible = val;
            },
            immediate: true
        }
    },
    methods: {
        confirmHandler: _.throttle(
            function(e) {
                this._onHide();
                if (this.isFunctional) {
                    typeof this.onConfirm === 'function' && this.onConfirm();
                } else {
                    this.$emit('confirm', e);
                }
            }, 500, { trailing: false }
        ),
        cancelHandler: _.throttle(
            function(e) {
                this._onHide();
                if (this.isFunctional) {
                    typeof this.onCancel === 'function' && this.onCancel();
                } else {
                    this.$emit('cancel', e);
                }
            }, 500, { trailing: false }
        ),
        closeHandler: _.throttle(
            function(e) {
                if (this.isFunctional) {
                    typeof this.onClose === 'function' && this.onClose();
                } else {
                    this._onHide(); // 同步更新 dialog 的 visible
                    this.$emit('close', e);
                }
            }, 500, { trailing: false }
        ),
        maskHandler: _.throttle(
            function(e) {
                if (this.isFunctional) {
                    typeof this.onMask === 'function' && this.onMask();
                } else {
                    this._onHide(); // 同步更新 dialog 的 visible
                    this.$emit('mask', e);
                }
            }, 500, { trailing: false }
        ),
        showHandler() {
            if (this.isFunctional) {
                typeof this.onShow === 'function' && this.onShow();
            } else {
                this.$emit('show');
            }
        },
        hideHandler() {
            if (this.isFunctional) {
                typeof this.onHide === 'function' && this.onHide();
            } else {
                this.$emit('hide');
            }
        },
        _onHide() {
            if (this.isFunctional) {
                this.visible = false;
            } else {
                this.$emit('update:visible', false);
            }
        }
    }
};
</script>
