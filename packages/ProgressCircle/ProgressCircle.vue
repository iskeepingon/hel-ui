<template>
    <div class="oc-progress oc-progress_circle">
        <svg
            :viewBox="`0 0 ${boxWidth} ${boxWidth}`"
            class="oc-progress_svg"
            :style="{width: `${boxWidth}px`, height: `${boxWidth}px`}"
        >
            <defs v-if="isGradientColor">
                <linearGradient x1="1" y1="1" x2="0" y2="0" :id="`gradient${_uid}`">
                    <stop offset="0%" :stop-color="gradientColor[0]" ref="stop1"></stop>
                    <stop offset="100%" :stop-color="gradientColor[1]" ref="stop2"></stop>
                </linearGradient>
            </defs>
            <g :transform="`matrix(0,-1,1,0,0,${boxWidth})`">
                <circle
                    :cx="`${radius + maxWidth / 2}`"
                    :cy="`${radius + maxWidth / 2}`"
                    :r="`${radius}`"
                    :style="`fill: transparent; stroke-width:${maxWidth}; stroke: ${trackColor}`"
                ></circle>
                <circle
                    :cx="`${radius + maxWidth / 2}`"
                    :cy="`${radius + maxWidth / 2}`"
                    :r="`${radius}`"
                    v-show="percentage > 0"
                    :style="
                        `stroke-linecap: ${
                            round ? 'round' : 'butt'
                        };transition: stroke-dasharray ${duration}ms ease;stroke-dasharray: ${(betterPercent * perimeter) /
                            100} ${perimeter};fill: transparent; stroke-width:${strokeWidth}; stroke: ${
                            isGradientColor ? urlId : color
                        }`
                    "
                ></circle>
            </g>
        </svg>
        <div class="oc-progress-text" :style="{padding: `${(1 - Math.cos(Math.PI / 4)) * innerWidth}px`}">
            <slot name="text" :percentage="percentage">
                {{ percentage }}
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OcProgressCircle',
    props: {
        trackColor: {
            type: String,
            default: '#ebedf0'
        },
        trackWidth: {
            type: Number,
            default: 0
        },
        color: {
            type: String,
            default: '#1989fa'
        },
        type: {
            type: String,
            default: 'line'
        },
        gradientColor: {
            type: Array,
            default: () => []
        },
        radius: {
            type: Number,
            default: 40
        },
        round: {
            type: Boolean,
            default: false
        },
        percentage: {
            type: Number,
            default: 99
        },
        strokeWidth: {
            type: Number,
            default: 2
        },
        duration: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            betterPercent: 0
        };
    },
    computed: {
        isGradientColor() {
            return this.gradientColor.length > 1;
        },
        boxWidth() {
            return this.radius * 2 + this.maxWidth;
        },
        maxWidth() {
            return this.trackWidth || this.strokeWidth;
        },
        innerWidth() {
            return this.radius - this.maxWidth / 2;
        },
        perimeter() {
            return Math.ceil(this.radius * 2 * Math.PI);
        },
        urlId() {
            return `url(#gradient${this._uid})`;
        }
    },
    mounted() {
        setTimeout(() => { this.betterPercent = this.percentage; }, 0);
    },
    watch: {
        percentage(val) {
            this.betterPercent = val;
        }
    },
    methods: {
        getCircleX(radians, radius) {
            return Math.sin(radians) * radius;
        },
        getCircleY(radians, radius) {
            return Math.cos(radians) * radius;
        }
    }
};
</script>
