<template functional>
    <div class="oc-loading-inner" :style="{ color: props.color}">
        <svg viewBox="25 25 50 50">
            <circle cx="50" cy="50" r="20" fill="none"></circle>
        </svg>
    </div>
</template>

<script>
export default {
    name: 'GoogleCircle',
    props: {
        color: String,
    }
};
</script>
