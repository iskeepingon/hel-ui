<template functional>
    <oc-icon class="oc-loading-inner" :name="name"></oc-icon>
</template>

<script>
export default {
    name: 'LoadingIcon',
    props: {
        name: {
            type: String,
            default: ''
        },
    }
};
</script>
