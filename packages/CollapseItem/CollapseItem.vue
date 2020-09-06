<template>
    <oc-cell
        :class="['oc-collapse-item', {'oc-collapse-opened': expanded}]"
        :disabled="disabled"
        :title="title"
        :desc="label"
        :clickCb="clickHandler"
    >
        <template v-for="(slotItem, key) in titleSlots" :slot="key">
            <slot :name="key"></slot>
        </template>
        <div
            slot="next"
            v-show="contentDisplay"
            ref="contentWrapper"
            class="oc-collapse-item-inner"
            @transitionend="transitionEndHandler"
        >
            <div class="oc-collapse-item-content">
                <slot></slot>
            </div>
        </div>
    </oc-cell>
</template>

<script>
const CELL_SLOTS = ['title', 'sub-title', 'desc', 'icon'];
export default {
    name: 'OcCollapseItem',

    props: {
        value: {
            type: [Number, String, Boolean]
        },
        // 暂时处理为必填项，后续参考有赞引入一个公共的Mixin解决此类cell/cell-group默认关系问题。
        name: {
            type: [Number, String],
            required: true
        },
        size: {
            type: [Number, String],
            default: '44px'
        },
        title: {
            type: String
        },
        label: {
            type: [Number, String]
        },
        // isLink: {
        //     type: Boolean,
        //     default: true
        // },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    inject: {
        parentCollapse: {
            from: 'collapseWrapper',
            default: null
        }
    },

    data() {
        this.isLocked = false;
        return {
            contentDisplay: (() => {
                const parentCollapse = this.parentCollapse;
                if (parentCollapse) {
                    if (parentCollapse.accordion) {
                        return parentCollapse.value === this.name;
                    } else {
                        return parentCollapse.value.indexOf(this.name) >= 0;
                    }
                } else {
                    return this.value === this.name;
                }
            })(),
            titleSlots: null
        };
    },

    computed: {
        computedSize() {
            const size = this.size;
            if (typeof size === 'string') {
                return size;
            }
            return `${size}px`;
        },
        // 是否属于展开状态 boolean
        expanded() {
            if (this.parentCollapse) {
                if (this.parentCollapse.accordion) {
                    return this.parentCollapse.value === this.name;
                } else {
                    return this.parentCollapse.value.indexOf(this.name) >= 0;
                }
            } else {
                return this.value === this.name;
            }
        }
    },

    watch: {
        expanded(expanded) {
            const wrapper = this._wrapper;
            // 需要展示内容则立即展示，反之等动画结束再隐藏
            if (expanded) {
                this.contentDisplay = expanded;
            }
            this.$nextTick(() => {
                const height = `${wrapper.clientHeight}px`;
                wrapper.style.height = expanded ? '0' : height;
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        wrapper.style.height = expanded ? height : '0';
                    });
                    // wrapper.style.height = expanded ? height : '0';
                });
            });
        }
    },
    beforeMount() {
        this.titleSlots = CELL_SLOTS.reduce((slots, name) => {
            if (this.$slots[name]) {
                slots[name] = () => this.$slots[name];
            }

            return slots;
        }, {});
    },
    mounted() {
        this._wrapper = this.$refs.contentWrapper;
    },

    methods: {
        clickHandler() {
            if (this.isLocked || this.disabled) {
                return;
            }
            this.isLocked = true;
            if (this.parentCollapse) {
                this.parentCollapse.update(this.name);
            } else {
                this.$emit('input', this.value === this.name ? null : this.name);
            }
        },
        transitionEndHandler() {
            if (!this._wrapper.clientHeight) {
                this.contentDisplay = false;
            }
            this._wrapper.style.height = '';
            this.isLocked = false;
        }
    }
};
</script>
