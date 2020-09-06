<template>
    <div :class="['oc-cellgroup', {'oc-cellgroup-border': border}]">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'OcCellGroup',
    props: {
        border: {
            type: Boolean,
            default: false
        }
    }
};
</script>
