<template>
    <div class="oc-step-line" :style="lineStyle">
        <div class="step-line-inner" :style="innerLineStyle"></div>
    </div>
</template>

<script>
export default {
    name: 'OcStepLine',
    props: {
        lineColor: {
            type: String,
            default: '#ebedf0'
        },
        lineActiveColor: {
            type: String,
            default: '#1989fa'
        },
        isSuccess: {
            type: Boolean,
            default: false
        },
        lineThick: {
            type: Number,
            default: 4
        },
        length: {
            type: Number
        },
        direction: {
            type: String,
            default: 'horizontal'
        }
    },
    computed: {
        lineStyle() {
            const style = {};
            this.lineColor && (style.backgroundColor = this.lineColor);
            if (this.isHorizontal) {
                style.height = `${this.lineThick}px`;
                this.length && (style.width = `${this.length}px`);
            } else {
                style.width = `${this.lineThick}px`;
                this.length && (style.height = `${this.length}px`);
            }
            return style;
        },
        innerLineStyle() {
            const style = {};
            style.background = this.lineActiveColor;
            this.isHorizontal
                ? (style.width = this.isSuccess ? '100%' : 0)
                : (style.height = this.isSuccess ? '100%' : 0);
            return style;
        },
        isHorizontal() {
            return this.direction === 'horizontal';
        }
    }
};
</script>

<style></style>
