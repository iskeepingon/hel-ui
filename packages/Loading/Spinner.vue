<template functional>
    <div class="oc-loading-inner" :style="{ color: props.color}">
        <svg viewBox="0 0 100 100">
            <rect
                width="7"
                height="20"
                x="46.5"
                y="40"
                fill="currentColor"
                style="opacity: 1"
                rx="5"
                ry="5"
                transform="translate(0 -30)"
            />
            <rect
                width="7"
                height="20"
                x="46.5"
                y="40"
                fill="currentColor"
                style="opacity: .95"
                rx="5"
                ry="5"
                transform="rotate(30 105.98 65)"
            />
            <rect
                width="7"
                height="20"
                x="46.5"
                y="40"
                fill="currentColor"
                style="opacity: .90"
                rx="5"
                ry="5"
                transform="rotate(60 75.98 65)"
            />
            <rect
                width="7"
                height="20"
                x="46.5"
                y="40"
                fill="currentColor"
                style="opacity: .85"
                rx="5"
                ry="5"
                transform="rotate(90 65 65)"
            />
            <rect
                width="7"
                height="20"
                x="46.5"
                y="40"
                fill="currentColor"
                style="opacity: .80"
                rx="5"
                ry="5"
                transform="rotate(120 58.66 65)"
            />
            <rect
                width="7"
                height="20"
                x="46.5"
                y="40"
                fill="currentColor"
                style="opacity: .75"
                rx="5"
                ry="5"
                transform="rotate(150 54.02 65)"
            />
            <rect
                width="7"
                height="20"
                x="46.5"
                y="40"
                fill="currentColor"
                style="opacity: .70"
                rx="5"
                ry="5"
                transform="rotate(180 50 65)"
            />
            <rect
                width="7"
                height="20"
                x="46.5"
                y="40"
                fill="currentColor"
                style="opacity: .65"
                rx="5"
                ry="5"
                transform="rotate(-150 45.98 65)"
            />
            <rect
                width="7"
                height="20"
                x="46.5"
                y="40"
                fill="currentColor"
                style="opacity: .60"
                rx="5"
                ry="5"
                transform="rotate(-120 41.34 65)"
            />
            <rect
                width="7"
                height="20"
                x="46.5"
                y="40"
                fill="currentColor"
                style="opacity: .55"
                rx="5"
                ry="5"
                transform="rotate(-90 35 65)"
            />
            <rect
                width="7"
                height="20"
                x="46.5"
                y="40"
                fill="currentColor"
                style="opacity: .50"
                rx="5"
                ry="5"
                transform="rotate(-60 24.02 65)"
            />
            <rect
                width="7"
                height="20"
                x="46.5"
                y="40"
                fill="currentColor"
                style="opacity: .45"
                rx="5"
                ry="5"
                transform="rotate(-30 -5.98 65)"
            />
        </svg>
    </div>
</template>

<script>
export default {
    name: 'Spinner',
    props: {
        color: String,
    }
};
</script>
