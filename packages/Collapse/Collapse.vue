<template>
    <oc-cell-group>
        <slot></slot>
    </oc-cell-group>
</template>

<script>
export default {
    name: 'OcCollapse',

    props: {
        value: {
            type: [Array, String]
        },
        // 有赞的手风琴模式
        accordion: {
            type: Boolean,
            default: false
        }
    },

    provide() {
        return {
            collapseWrapper: this
        };
    },

    methods: {
        update(name) {
            if (this.accordion) {
                this.$emit('input', this.value === name ? null : name);
            } else {
                const copy = this.value.concat();
                const index = copy.indexOf(name);
                if (index >= 0) {
                    copy.splice(index, 1);
                } else {
                    copy.push(name);
                }
                this.$emit('input', copy);
            }
        }
    }
};
</script>
