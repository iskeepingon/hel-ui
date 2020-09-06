<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'OcCheckboxGroup',
    provide() {
        return {
            parentCheckboxGroup: this
        };
    },
    props: {
        value: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
        },
        animated: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        update(labelVal) {
            const index = this.value.indexOf(labelVal);
            const values = this.value.concat();
            if (index > -1) {
                values.splice(index, 1);
            } else {
                values.push(labelVal);
            }
            this.$emit('input', values);
        }
    }
};
</script>
