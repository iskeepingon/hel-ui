<template>
    <div class="oc-progress oc-progress_line" ref="progress" :style="{minHeight: `${maxWidth}px`}">
        <div class="oc-progress-track" :style="trackStyle" >
            <div class="oc-progress-portion" :style="portionStyle"></div>
        </div>
        <div class="oc-progress-slot" v-if="isPercentageSlot">
            <template v-for="(slotItem, key) in percentageSlot">
                <div :key="key" :class="['progress-step', `is-${getStatus(key)}`]" :style="stepStyle(key)">
                    <slot :name="key" :status="getStatus(key)"></slot>
                </div>
            </template>
        </div>
        <div class="progress-center-text" v-if="$scopedSlots['center-text']">
            <slot name="center-text" :percentage="percentage"></slot>
        </div>
        <div class="progress-current-text" ref="currentText" :style="currentTextStyle" v-if="$scopedSlots['current-text']">
            <slot name="current-text" :percentage="percentage"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OcProgressLine',
    props: {
        trackColor: {
            type: String,
            default: '#ebedf0'
        },
        strokeWidth: {
            type: Number,
            default: 2
        },
        trackWidth: {
            type: Number,
            default: 0
        },
        percentage: {
            type: Number,
            default: 0
        },
        color: {
            type: String,
            default: '#1989fa'
        },
        round: {
            type: Boolean,
            default: false
        },
        duration: {
            type: Number,
            default: 0
        },
        portionNoRound: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        percentage(val) {
            this.betterPercent = val;
        },
        betterPercent: {
            handler(val) {
                setTimeout(() => {
                    const curTextLeft = this.$refs.currentText && this.$refs.currentText.offsetLeft;
                    const curTextMarginLeft = this.$refs.currentText && getComputedStyle(this.$refs.currentText).marginLeft;
                    const curMarginLeftNum = parseFloat(curTextMarginLeft) || 0;
                    const curTextWidth = this.$refs.currentText && getComputedStyle(this.$refs.currentText).width;
                    const curTextWidthNum = parseFloat(curTextWidth) || 0;
                    const progressWidth = this.$refs.progress && getComputedStyle(this.$refs.progress).width;
                    const progressWidthNum = parseFloat(progressWidth) || 0;
                    const progressPaddingRight = this.$refs.progress && getComputedStyle(this.$refs.progress).paddingRight;
                    const progressPaddingRightNum = parseFloat(progressPaddingRight) || 0;
                    const progressPaddingLeft = this.$refs.progress && getComputedStyle(this.$refs.progress).paddingLeft;
                    const progressPaddingLeftNum = parseFloat(progressPaddingLeft) || 0;
                    const progressContentWidth = progressWidthNum - progressPaddingRightNum - progressPaddingLeftNum;
                    const isBeyond = curMarginLeftNum  + curTextWidthNum / 2 >= (100 - val)/100 * progressContentWidth + progressPaddingRightNum;
                    const isLess = val/100 * progressContentWidth + curMarginLeftNum + progressPaddingLeftNum < curTextWidthNum / 2;
                    if(isLess) {
                        this.currentTextStyle =  {
                            transition: `left ${this.duration}ms ease`,
                            left: `${curTextWidthNum / 2 - curMarginLeftNum}px`
                        };
                    } else if(isBeyond) {
                        this.currentTextStyle =  {
                            transition: `left ${this.duration}ms ease`,
                            left: `${progressWidthNum - curMarginLeftNum - curTextWidthNum / 2}px`
                        };
                    } else {
                        this.currentTextStyle =   {
                            transition: `left ${this.duration}ms ease`,
                            left: `${val * progressContentWidth / 100 + progressPaddingLeftNum}px`,
                        };
                    }
                }, 0);
            }
        }
    },
    data() {
        return {
            stepComplete: {},
            nextStep: null,
            betterPercent: null,
            currentTextStyle: {
                left: 0,
                transition: 'none'
            }
        };
    },
    mounted() {
        setTimeout(() => { this.betterPercent = this.percentage; }, 0);
    },
    computed: {
        trackStyle() {
            return {
                background: this.trackColor,
                height: `${this.maxWidth}px`,
                borderRadius: `${this.round ? this.maxWidth / 2 : 0}px`,
                padding: `0 ${(this.trackWidth - this.strokeWidth) / 2}px`
            };
        },
        undos() {
            return Object.keys(this.$scopedSlots).filter((key) => parseFloat(key) > this.percentage);
        },
        portionStyle() {
            return {
                background: this.color,
                width: `${this.betterPercent}%`,
                height: `${this.strokeWidth}px`,
                borderRadius: `${this.round && !this.portionNoRound ? this.strokeWidth / 2 : 0}px`,
                transition: `width ${this.duration}ms ease`
            };
        },
        // currentTextStyle() {
        // },
        maxWidth() {
            return this.trackWidth || this.strokeWidth;
        },
        percentageSlot() {
            let pSlot = {};
            for (let key in this.$scopedSlots) {
                if (/\d+%/.test(key)) {
                    pSlot[key] = this.$scopedSlots[key];
                }
            }
            return pSlot;
        },
        isPercentageSlot() {
            return Object.keys(this.percentageSlot).length;
        }
    },
    methods: {
        stepStyle(percent) {
            return {
                position: 'absolute',
                left: percent,
                transform: `translateX(-50%)`
            };
        },
        getStatus(percent) {
            const idx = this.undos.indexOf(percent);
            return idx === -1 ? 'finish' : idx === 0 ? 'process' : 'wait';
        }
    }
};
</script>
