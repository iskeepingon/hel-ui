<template>
    <div>
        <oc-overlay
            v-if="hasMask"
            :visible="visible"
            :opacity="maskOpacity"
            mask-transition-name="fade"
            :style="styleObject"
        ></oc-overlay>
        <transition name="fade" @after-leave="afterLeave">
            <div
                v-show="visible"
                :class="['oc-toast', alignClass, customClass ? customClass : '']"
                :style="styleObject"
            >
                <div :class="['inner', typeClass]">
                    <oc-loading
                        :name="loadingIcon"
                        is-white
                        vertical
                        :has-text="false"
                        v-if="type === 'loading'"
                    ></oc-loading>
                    <oc-icon v-else-if="type !== 'text'" :name="iconName"></oc-icon>
                    <slot>
                        <p class="text" v-if="typeof msg !== 'function'">{{ msg }}</p>
                    </slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
// import OcIcon from '../Icon';
import OcOverlay from '../Overlay';

export default {
    name: 'OcToast',
    components: {
        // OcIcon,
        OcOverlay
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'text'
        },
        msg: {
            type: [String, Function],
            required: true
        },
        customClass: {
            type: String,
            default: ''
        },
        loadingIcon: {
            type: String,
            default: 'circle'
        },
        zIndex: [Number, String],
        hasMask: {
            type: Boolean,
            default: false
        },
        maskOpacity: [Number, String],
        duration: [Number, String],
        align: {
            type: String,
            default: 'center'
        },
        onShow: {
            type: Function,
            default: null
        },
        onHide: {
            type: Function,
            default: null
        },
        isFunctional: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isVisible: false,
            timer: null
        };
    },
    computed: {
        durationMixin() {
            if (this.duration || this.duration === 0) {
                return this.duration;
            }
            return (this.$UICONFIG || {}).toastDuration || 2000;
        },
        styleObject() {
            if (this.zIndex) {
                return {
                    zIndex: this.zIndex
                };
            }
            return {};
        },
        typeClass() {
            return {
                'oc-toast-success': this.type === 'success',
                'oc-toast-fail': this.type === 'fail',
                'oc-toast-warn': this.type === 'warn',
                'oc-toast-loading': this.type === 'loading'
            };
        },
        alignClass() {
            return {
                top: this.align === 'top',
                bottom: this.align === 'bottom'
            };
        },
        iconName() {
            if (this.type === 'success') {
                return 'tick-circle';
            } else if (this.type === 'fail') {
                return 'cross-circle';
            } else if (this.type === 'warn') {
                return 'tip-circle';
                // } else if (this.type === 'loading') {
                //     return 'loading';
            } else {
                return '';
            }
        },
        _duration() {
            const num_duration = parseInt(this.durationMixin, 10);
            if (Number.isNaN(num_duration)) {
                return (this.$UICONFIG || {}).toastDuration;
            } else {
                return num_duration;
            }
        }
    },
    watch: {
        visible(val) {
            if (val) {
                this._onShow();
            }
        }
    },
    destroyed() {
        clearTimeout(this.timer);
    },
    methods: {
        _onShow() {
            clearTimeout(this.timer);
            this.$emit('show');
            this.onShow && this.onShow();

            if (this._duration === 0) return;
            this.timer = setTimeout(() => {
                this._onHide();
            }, this._duration);
        },
        _onHide() {
            if (this.isFunctional) {
                this.visible = false;
            } else {
                this.$emit('update:visible', false);
            }
        },
        afterLeave() {
            if (this.isFunctional) {
                this.onHide && this.onHide();
            } else {
                this.$emit('hide');
            }
        }
    }
};
</script>
