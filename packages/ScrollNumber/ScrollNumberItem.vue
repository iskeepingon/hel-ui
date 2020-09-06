<template>
    <div v-if="isTargetNum" class="scroll-number-item" :style="numberItemStyle">
        <div class="scroll-number-line" ref="numberItem" :style="style">
            <span class="scroll-number" v-for="item in 10" :key="`1-${item}`">
                {{item - 1}}
            </span>
            <span v-if="singleDirection" class="scroll-number">0</span>
        </div>
    </div>
    <span class="scroll-other-item" ref="numberItem" v-else>{{target}}</span>
</template>

<script>
    export default {
        name: 'OcScrollNumberItem',
        props: {
            from: {
                type: [Number, String],
                default: 0
            },
            to: {
                type: [Number, String],
                default: 0
            },
            duration: {
                type: Number,
                default: 2000
            },
            speedMode: {
                default: 'duration',
                type: String
            },
            singleLasting: {
                type: Number,
                default: 200
            },
            // 前面的数字
            preNum: {
                type: [Number, String]
            },
            firstScroll: {
                type: Boolean
            },
            singleDirection: {
                type: Boolean
            }
        },
        data() {
            return {
                numberItem: null,
                style: {},
                preNumChange: false,
            };
        },
        mounted() {
            this.numberItem = this.$refs.numberItem;
        },
        updated() {
            this.numberItem = this.$refs.numberItem;
        },
        computed: {
            numLen () {
                return this.singleDirection ? 11 : 10;
            },
            isTargetNum() {
                return typeof this.target === 'number';
            },
            target() {
                const targetNum = parseInt(this.to, 10);
                return !isNaN(targetNum)  ? targetNum : this.to;
            },
            isScrollRound () {
                return this.preNumChange && parseInt(this.from, 10) === parseInt(this.to, 10);
            },
            diff() {
                let d = this.target - this.from;
                if(d) {
                    return d;
                }
                if(this.isScrollRound) {
                    return this.singleDirection ? Math.abs(this.target - this.maxDisNum) : this.target - this.maxDisNum;
                }
                return 0;
            },
            maxDisNum() {
                if(this.singleDirection) {
                    return this.from === 0 ? 10 : 0;
                } else {
                    return Math.abs(0 - this.target) > Math.abs(9 - this.target) ? 0 : 9;
                }
            },
            initNum() {
                if(this.isScrollRound) {
                    return this.maxDisNum;
                }
                return  Number(this.from) || 0;
            },
            originOffset() {
                return (this.initNum % 10) * this.height / this.numLen;
            },
            height() {
                return this.numberItem && this.numberItem.offsetHeight;
            },
            numberItemStyle() {
                return {
                    height: this.isTargetNum ? `${this.height && this.height / this.numLen }px` : `${this.height || 0}px`
                };
            },
            animeDuration() {
                return this.speedMode === 'duration' ? this.duration : Math.abs(this.singleLasting * this.diff);
            }
        },
        watch: {
            target: {
                handler() {
                    this.startScroll();
                },
                immediate: true
            },
            preNum(val) {
                this.preNumChange = true;
                this.startScroll();
            },
            height(val) {
                this.startScroll();
            }
        },
        methods: {
            // 数字滚动动画
            startScroll() {
                if(this.firstScroll) {
                    this.preNumChange = true;
                }
                this.style = {
                    ...this.style,
                    ...{
                        transform: `translateY(0)`,
                        transitionProperty: `none`,
                        top: `-${this.originOffset}px`
                    }
                };
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.style = {
                            transform: `translateY(${-this.height * this.diff/this.numLen}px)`,
                            transitionProperty: `all`,
                            transitionTimingFunction: 'ease-in-out',
                            transitionDuration: `${this.animeDuration}ms`,
                            top: `-${this.originOffset}px`
                        };
                    }, 0);
                });
            },
            restartScroll() {
                this.preNumChange = true;
                this.startScroll();
            }
        }
    };
</script>
