<template>
    <div class="oc-notice-bar" :style="{color: textColor}">
        <div class="oc-notice-bar-background" :style="{background: backgroundColor, opacity: backgroundOpacity}"></div>

        <slot name="left-icon" :color="iconColor">
            <div class="oc-notice-bar-icon">
                <svg width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <path
                            d="M16,0 C24.8227604,0 32,7.17723961 32,15.9997003 C32,24.8224607 24.8230601,32 16,32 C7.17753929,32 0,24.8224607 0,15.9997003 C0,7.17723961 7.17753929,0 16,0 Z M15.9998469,2 C8.28032233,2 2,8.28001618 2,15.9998469 C2,23.7187592 8.28032233,30 15.9998469,30 C23.7184531,30 30,23.7187592 30,15.9998469 C30,8.28001618 23.7184531,2 15.9998469,2 Z M16.0001311,21 C16.82873,21 17.5,21.67127 17.5,22.4998689 C17.5,23.3284678 16.82873,24 16.0001311,24 C15.1717944,24 14.5,23.3282056 14.5,22.4998689 C14.5,21.6715322 15.1717944,21 16.0001311,21 Z M16,7.5 C16.5523104,7.5 17,8.00694429 17,8.63235657 L17,8.63235657 L17,17.3676434 C17,17.9930557 16.5523104,18.5 16,18.5 C15.4476896,18.5 15,17.9930557 15,17.3676434 L15,17.3676434 L15,8.63235657 C15,8.00694429 15.4476896,7.5 16,7.5 Z"
                            :fill="iconColor || textColor"
                        ></path>
                    </g>
                </svg>
            </div>
        </slot>

        <div v-if="type === 'vertical'" class="oc-notice-bar-list-wrapper " :key="'vertical'" ref="noticeWrapper">
            <ul class="oc-notice-bar-list" ref="noticeList">
                <li
                    v-for="(html, index) in computedList"
                    v-html="html"
                    :key="index"
                    class="oc-notice-bar-list-item"
                    @click="clickHandler(index)"
                ></li>
            </ul>
        </div>
        <div v-else-if="type === 'horizon'" class="oc-notice-bar-horizon-wrapper" :key="'horizon'" ref="textWrapper">
            <ul
                ref="textList"
                :class="['oc-notice-bar-text-list', noticeBarTextAnimationClass]"
                :style="textListStyle"
                @animationend="horizonAnimationEnd"
                @webkitAnimationEnd="horizonAnimationEnd"
                @transitionend="horizonTransitionEnd"
            >
                <li
                    v-for="(item, index) in computedList"
                    v-html="item"
                    class="oc-notice-bar-list-item"
                    :style="{marginRight: gutter}"
                    :key="index"
                    @click="clickHandler(index)"
                ></li>
            </ul>
        </div>

        <slot name="right-icon" :color="iconColor">
            <div v-if="isLink" class="oc-notice-bar-arrow">
                <svg width="6px" height="21px" viewBox="0 0 12 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <rect x="-6" y="-2" width="24" height="24"></rect>
                        <polyline
                            :stroke="iconColor || textColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            transform="translate(1.538737, 10.037342) scale(-1, 1) rotate(45.000000) translate(-1.538737, -10.037342) "
                            points="-4.52185687 3.76808126 -4.516025 16.269336 7.59933059 16.3066031"
                        ></polyline>
                    </g>
                </svg>
            </div>
        </slot>
    </div>
</template>

<script>
export default {
    name: 'OcNoticeBar',

    props: {
        type: {
            type: String,
            default: 'horizon'
        },
        backgroundColor: {
            type: String,
            default: '#fff9ce'
        },
        backgroundOpacity: {
            type: String,
            default: '1'
        },
        iconColor: {
            type: String
        },
        textColor: {
            type: String,
            default: '#ff5040'
        },
        delay: {
            type: Number,
            default: 1000
        },
        speed: {
            type: Number,
            default: 5
        },
        gutter: {
            type: String,
            default: '50vw'
        },
        quiver: {
            type: Boolean,
            default: false
        },
        isLink: {
            type: Boolean,
            default: false
        },
        list: {
            type: Array,
            default: () => []
        },
        allowHtml: {
            type: Boolean,
            default: false
        },
        labelB: {
            type: String,
            default: '\\*\\*'
        },
        labelI: {
            type: String,
            default: '\\*'
        },
    },

    data() {
        return {
            firstRound: true, // animation
            wrapperWidth: 0, // animation
            listWidth: 0, // animation
            noticeBarTextAnimationClass: null, // animation

            offsetX: 0, // transition
            transitionDuration: 0 // transition
        };
    },

    computed: {
        isHorizonQuiver() {
            return this.horizonPerformance === 'quiver';
        },
        timeout() {
            return this.delay < 800 ? 3000 : this.delay;
        },
        computedList() {
            var regLabelB = new RegExp(`${this.labelB}(.+?)${this.labelB}`, 'g');
            var regLabelI = new RegExp(`${this.labelI}(.+?)${this.labelI}`, 'g');
            if (this.allowHtml) {
                return this.list;
            } else {
                return this.list.map((item) => {
                    // markdown **xx**粗体 *xx*斜体
                    return item
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(regLabelB, '<b>$1</b>')
                        .replace(regLabelI, '<i>$1</i>')
                        .replace(/(\\\*)/g, '*');
                });
            }
        },
        textListStyle() {
            return this.quiver
                ? {
                      transform: `translate3d(${this.offsetX}, 0, 0)`,
                      transitionDuration: this.transitionDuration
                  }
                : {
                      paddingLeft: `${this.firstRound ? 0 : this.wrapperWidth}px`,
                      animationDelay: `${(this.firstRound ? this.delay : 0) / 1000}s`,
                      animationDuration: `${(this.listWidth / window.innerWidth) * this.speed}s`
                  };
        },
        isVertical() {
            return this.type === 'vertical';
        }
    },

    watch: {
        list(list) {
            if (!list) {
                return;
            }
            this.resetAnimation();
        },
        type() {
            this.resetAnimation();
        }
    },

    created() {
        this._timeout = null;
        this._animation = null;
    },

    mounted() {
        window.addEventListener('resize', this.resetAnimation);
        this.listScroll();
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.resetAnimation);
        this.resetListStatus();
    },

    methods: {
        clickHandler(index) {
            this.$emit('item-click', index);
        },
        resetAnimation() {
            this.resetListStatus();
            this.$nextTick(this.listScroll);
        },
        listScroll() {
            if (this.isVertical) {
                if (this.list.length < 2) {
                    return;
                }
                // 数量超过1，则进行从下至上的轮播，每次滚动完毕把上方的一条放至最后
                const {noticeList: list, noticeWrapper: wrapper} = this.$refs;
                const timeout = this.timeout;
                // 一行的高度
                const height = wrapper.offsetHeight || getComputedStyle(wrapper).height.match(/\d+/)[0];
                let current = 0;
                const zero = '0';
                let setAnimation;
                const animation = () => {
                    if (current < height) {
                        current += 1;
                        this._animation = requestAnimationFrame(() => {
                            list.style.marginTop = `-${current}px`;
                            animation();
                        });
                    } else {
                        list.appendChild(list.firstElementChild);
                        list.style.marginTop = zero;
                        current = 0;
                        setAnimation();
                    }
                };
                (setAnimation = () => {
                    this._timeout = setTimeout(() => {
                        clearTimeout(this._timeout);
                        animation();
                    }, timeout);
                })();
            } else {
                const listLength = this.list.length;
                if (listLength === 0) {
                    return;
                }
                const {textList: list, textWrapper: wrapper} = this.$refs;
                const regExp = /\d+/;
                // 列表的宽度
                const listWidth = list.offsetWidth || getComputedStyle(list).width.match(regExp)[0];
                // 列表外层的宽度
                const wrapperWidth = wrapper.offsetWidth || getComputedStyle(wrapper).width.match(regExp)[0];
                this.listWidth = listWidth;
                this.wrapperWidth = wrapperWidth;
                if (listWidth > wrapperWidth) {
                    if (this.quiver) {
                        this.noticeBarTextAnimationClass = 'oc-notice-bar-quiver';
                        const offsetX = listWidth - wrapperWidth;
                        this.offsetX = `-${offsetX}px`;
                        this.transitionDuration = `${(offsetX / window.innerWidth) * this.speed}s`;
                    } else {
                        this.noticeBarTextAnimationClass = 'oc-notice-bar-list-ani';
                    }
                }
            }
        },
        horizonTransitionEnd() {
            this._timeout = setTimeout(() => {
                this.offsetX = this.offsetX === '0' ? this.wrapperWidth - this.listWidth + 'px' : '0';
            }, this.delay);
        },
        horizonAnimationEnd() {
            this.noticeBarTextAnimationClass = 'oc-notice-bar-list-ani-infinite';
            this.$nextTick(() => {
                this.firstRound = false;
                this.listWidth += this.wrapperWidth;
            });
        },
        resetListStatus() {
            clearTimeout(this._timeout);
            cancelAnimationFrame(this._animation);
            if (this.isVertical) {
                if (this.$refs.noticeList) {
                    this.$refs.noticeList.style.marginTop = '0';
                }
            }
        }
    }
};
</script>
