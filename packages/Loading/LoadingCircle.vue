<template>
    <div class="oc-loading-inner" :style="styleObject">
        <svg viewBox="0 0 64 64">
            <defs>
                <linearGradient x1="100%" y1="100%" x2="13.4031169%" y2="100%" :id="`${linearId}1`">
                    <stop stop-color="currentColor"></stop>
                    <stop stop-color="currentColor" stop-opacity=".5" offset="100%"></stop>
                </linearGradient>
                <linearGradient x1="100%" y1="100%" x2="13.0704753%" y2="100%" :id="`${linearId}2`">
                    <stop stop-color="currentColor" stop-opacity="0"></stop>
                    <stop stop-color="currentColor" stop-opacity=".5" offset="100%"></stop>
                </linearGradient>
            </defs>
            <g>
                <path
                    d="M32,2 C48.5685425,2 62,15.4314575 62,32 L54,32 L54,32 C54,19.8497355 44.1502645,10 32,10 C19.8497355,10 10,19.8497355 10,32 L2,32 C2,15.4314575 15.4314575,2 32,2 Z"
                    :fill="`url(#${linearId}1)`"
                ></path>
                <path
                    d="M32,32 C48.5685425,32 62,45.4314575 62,62 L54,62 L54,62 C54,49.8497355 44.1502645,40 32,40 C19.8497355,40 10,49.8497355 10,62 L2,62 C2,45.4314575 15.4314575,32 32,32 Z"
                    :fill="`url(#${linearId}2)`"
                    transform="translate(32.000000, 47.000000) scale(1, -1) translate(-32.000000, -47.000000)"
                ></path>
            </g>
        </svg>
    </div>
</template>

<script>
export default {
    name: 'LoadingCircle',
    props: {
        color: String,
    },
    computed: {
        styleObject() {
            if (this.color) {
                return {
                    color: this.color
                };
            }
            return {};
        },
        linearId() {
            return Math.random().toString(36).slice(-8);
        }
    }
};
</script>
