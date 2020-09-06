<template>
    <div class="oc-radio-group">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'OcRadioGroup',
    props: {
        value: {
            type: [String, Number, Boolean],
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        animated: {
            type: Boolean,
            default: false
        }
    },
    provide() {
        return {
            parentRadioGroup: this
        };
    }
};
</script>

<style lang="scss" scoped>
@import './RadioGroup.scss';
</style>
