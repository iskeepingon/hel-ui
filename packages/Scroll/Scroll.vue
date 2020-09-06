<template>
    <div class="oc-scroll" ref="wrapper">
        <div class="inner" ref="inner">
            <div v-if="pullDownRefresh" class="cube-pulldown" ref="pulldown">
                <slot name="pulldown">
                    <div class="cube-pulldown-wrapper" :style="pullDownStyle">
                        <div class="before-trigger" v-show="beforePullDown">
                            下拉刷新
                        </div>
                        <div class="after-trigger" v-show="!beforePullDown">
                            <div v-show="isPullingDown" class="loading">
                                正在刷新…
                                <!-- 松开立即刷新 -->
                            </div>
                            <div v-show="!isPullingDown" class="cube-pulldown-loaded">
                                <span>刷新成功</span>
                            </div>
                        </div>
                    </div>
                </slot>
            </div>
            <div ref="listWrapper">
                <slot :data="data"></slot>
            </div>

            <slot name="pullup">
                <div class="cube-pullup-wrapper" v-if="pullUpLoad">
                    <div class="before-trigger" v-if="!isPullUpLoad">
                        <span>1234566</span>
                        <!-- 没有更多了 -->
                    </div>
                    <div class="after-trigger" v-else>
                        正在加载…
                    </div>
                </div>
            </slot>
        </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll';

const DEFAULT_OPTIONS = {
    observeDOM: true,
    click: true,
    probeType: 1,
    scrollbar: false,
    pullDownRefresh: false,
    pullUpLoad: false
};

export default {
    name: 'OcScroll',
    props: {
        // height: {
        //     type: [Number, String],
        //     required: true
        // },
        options: {
            type: Object,
            default() {
                return {};
            }
        },
        threshold: {
            type: [Number, String],
            default: 1
        },
        /**
         * 1 滚动的时候会派发scroll事件，会截流。
         * 2 滚动的时候实时派发scroll事件，不会截流。
         * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
         */
        // probeType: {
        //     type: Number,
        //     default: 1
        // },
        /**
         * 点击列表是否派发click事件
         */
        click: {
            type: Boolean,
            default: true
        },
        direction: {
            type: String,
            default: 'y' // 'x'
        },
        /**
         * 是否开启横向滚动
         */
        scrollX: {
            type: Boolean,
            default: false
        },
        /**
         * 是否派发滚动事件
         */
        listenScroll: {
            type: Boolean,
            default: false
        },
        /**
         * 列表的数据
         */
        data: {
            type: [Array, String],
            default: null
        },
        /**
         * 是否派发滚动到底部的事件，用于上拉加载
         */
        pullup: {
            type: Boolean,
            default: false
        },
        /**
         * 是否派发顶部下拉的事件，用于下拉刷新
         */
        pulldown: {
            type: Boolean,
            default: false
        },
        /**
         * 是否派发列表滚动开始的事件
         */
        beforeScroll: {
            type: Boolean,
            default: false
        },
        /**
         * 当数据更新后，刷新scroll的延时。
         */
        refreshDelay: {
            type: Number,
            default: 20
        }
    },
    data() {
        return {
            beforePullDown: true,
            isPullingDown: false,
            isPullUpLoad: false,
            pullUpNoMore: false,
            bubbleY: 0,
            pullDownStyle: '',
            pullDownStop: 60,
            pullDownHeight: 60,
            pullUpHeight: 0
        };
    },
    mounted() {
        // 保证在DOM渲染完毕后初始化better-scroll
        setTimeout(() => {
            this._initScroll();
        }, 20);
    },
    computed: {
        // isScrollX() {
        //     return this.direction === 'x';
        // },
        isScrollY() {
            return this.direction === 'y';
        },
        pullUpLoad() {
            return this.options.pullUpLoad;
        },
        pullDownRefresh() {
            let pullDownRefresh = this.options.pullDownRefresh;
            if (!pullDownRefresh) {
                return pullDownRefresh;
            }
            if (pullDownRefresh === true) {
                pullDownRefresh = {};
            }
            return Object.assign({stop: this.pullDownStop}, pullDownRefresh);
        }
    },
    watch: {
        // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
        data() {
            setTimeout(() => {
                this.forceUpdate(true);
            }, this.refreshDelay);
        },
        pullDownRefresh: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.scroll.openPullDown(newVal);
                    if (!oldVal) {
                        this._onPullDownRefresh();
                        // this._pullDownRefreshChangeHandler()
                    }
                }
                if (!newVal && oldVal) {
                    this.scroll.closePullDown();
                    this._offPullDownRefresh();
                    // this._pullDownRefreshChangeHandler()
                }
            },
            deep: true
        }
    },
    methods: {
        _initScroll() {
            if (!this.$refs.wrapper) {
                return;
            }

            let options = Object.assign(
                {},
                DEFAULT_OPTIONS,
                {
                    scrollY: this.isScrollY,
                    scrollX: !this.isScrollY
                },
                this.options
            );

            console.log(options, 1);
            // better-scroll的初始化
            this.scroll = new BScroll(this.$refs.wrapper, options);
            this.refresh();
            // 是否派发滚动事件
            if (this.listenScroll) {
                this.scroll.on('scroll', (pos) => {
                    this.$emit('scroll', pos);
                });
            }

            if (this.pullDownRefresh) {
                this._onPullDownRefresh();
                //   this._pullDownRefreshChangeHandler()
            }
            if (this.pullUpLoad) {
                this._onPullUpLoad();
                //   this._pullUpLoadChangeHandler()
            }

            // 是否派发滚动到底部事件，用于上拉加载
            // if (this.pullup) {
            //     this.scroll.on('touchEnd', (pos) => {
            //         console.log(pos, this.scroll.y, this.scroll.maxScrollX);
            //         // 滚动到底部
            //         if (this.scroll.y < this.scroll.maxScrollY || this.scroll.x < this.scroll.maxScrollX) {
            //             this.isPullUpLoad = true;
            //             this.$emit('pullup', this);
            //         }

            //     });
            // }

            // // 是否派发顶部下拉事件，用于下拉刷新
            // if (this.pulldown) {
            //     this.scroll.on('touchEnd', (pos) => {
            //         console.log(pos);
            //         // 下拉动作
            //         if (pos.y > 50 || pos.x > 50) {
            //             this.$emit('pullDown', this);
            //         }

            //     });
            // }

            // 是否派发列表滚动开始的事件
            if (this.beforeScroll) {
                this.scroll.on('beforeScrollStart', () => {
                    this.$emit('beforeScroll');
                });
            }
        },
        _onPullDownRefresh() {
            this.scroll.on('pullingDown', this._pullDownHandle);
            this.scroll.on('scroll', this._pullDownScrollHandle);
        },
        _offPullDownRefresh() {
            this.scroll.off('pullingDown', this._pullDownHandle);
            this.scroll.off('scroll', this._pullDownScrollHandle);
        },
        _pullDownScrollHandle(pos) {
            if (this.beforePullDown) {
                // this.bubbleY = Math.max(0, pos.y - this.pullDownHeight)
                this.pullDownStyle = `transform: translateY(${Math.min(pos.y - this.pullDownHeight, 0)}px)`;
            } else {
                // this.bubbleY = 0
                this.pullDownStyle = `transform: translateY(${Math.min(pos.y - this.pullDownStop, 0)}px)`;
            }
        },
        _onPullUpLoad() {
            //   this._pullDownScrollHandle();
            this.scroll.on('pullingUp', this._pullUpHandle);
        },
        _offPullUpLoad() {
            this.scroll.off('pullingUp', this._pullUpHandle);
        },
        _pullUpHandle() {
            this.isPullUpLoad = true;
            this.$emit('pulling-up', this);
        },
        _pullDownHandle() {
            if (this.resetPullDownTimer) {
                clearTimeout(this.resetPullDownTimer);
            }
            this.beforePullDown = false;
            this.isPullingDown = true;
            this.$emit('pulling-down', this);
        },
        _waitFinishPullDown() {
            const {stopTime = 600} = this.pullDownRefresh;
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.scroll.finishPullDown();
                    resolve();
                }, stopTime);
            });
        },
        _waitResetPullDown() {
            return new Promise((resolve) => {
                this.resetPullDownTimer = setTimeout(() => {
                    this.pullDownStyle = `top: -${this.pullDownHeight}px`;
                    this.beforePullDown = true;
                    resolve();
                }, this.scroll.options.bounceTime);
            });
        },
        disable() {
            // 代理better-scroll的disable方法
            this.scroll && this.scroll.disable();
        },
        enable() {
            // 代理better-scroll的enable方法
            this.scroll && this.scroll.enable();
        },
        // refresh() {
        //     // 代理better-scroll的refresh方法
        //     this.scroll && this.scroll.refresh();
        // },
        scrollTo() {
            // 代理better-scroll的scrollTo方法
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
        },
        scrollToElement() {
            // 代理better-scroll的scrollToElement方法
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
        },
        finishPullUp() {
            console.log('finishPullUp');
            this.scroll && this.scroll.finishPullUp();
        },
        finishPullDown() {
            console.log('finishPullDown');
            this.scroll && this.scroll.finishPullDown();
        },
        async forceUpdate(dirty = false, nomore = false) {
            if (this.isPullDownUpdating) {
                return;
            }
            if (this.pullDownRefresh && this.isPullingDown) {
                this.isPullingDown = false;
                this.isPullDownUpdating = true;
                await this._waitFinishPullDown();
                await this._waitResetPullDown(dirty);
                this.isPullDownUpdating = false;
            } else if (this.pullUpLoad && this.isPullUpLoad) {
                this.isPullUpLoad = false;
                this.scroll.finishPullUp();
                this.pullUpNoMore = !dirty || nomore;
            }
            dirty && this.refresh();
        },
        refresh() {
            this._calculateMinHeight();
            this.scroll && this.scroll.refresh();
        },
        _calculateMinHeight() {
            const {wrapper, listWrapper} = this.$refs;
            const pullUpLoad = this.pullUpLoad;
            const pullDownRefresh = this.pullDownRefresh;

            if (this.isScrollY) {
                let minHeight = 0;
                if (pullDownRefresh || pullUpLoad) {
                    const wrapperHeight = this.getRect(wrapper).height;
                    minHeight = wrapperHeight + 1;
                    if (pullUpLoad && pullUpLoad.visible) {
                        // minHeight = wrapperHeight + 1 - pullUpHeight, then pullUpLoad text is visible
                        // when content's height is not larger than wrapper height
                        minHeight -= this.pullUpHeight;
                    }
                }
                listWrapper.style.minHeight = `${minHeight}px`;
            } else {
                listWrapper.style.minWidth = `400px`;
            }
        },
        getRect(el) {
            return {
                top: el.offsetTop,
                left: el.offsetLeft,
                width: el.offsetWidth,
                height: el.offsetHeight
            };
        }
    }
};
</script>
