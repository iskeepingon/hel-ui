<template>
    <div class="oc-sticky" ref="sticky" :style="styleObj">
        <slot></slot>
    </div>
</template>

<script>
import 'intersection-observer';
import Stickyfill from 'stickyfilljs';

export default {
    name: 'OcSticky',
    props: {
        zIndex: {
            type: [Number, String],
            default: ''
        },
        top: [Number, String],
        className: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            timer: null
        };
    },
    computed: {
        mixinTop() {
            return parseInt(this.top, 10) || 0;
        },
        styleObj() {
            if (this.mixinTop) {
                return {
                    top: `${this.mixinTop}px`,
                    zIndex: this.zIndex
                };
            }
            return {
                zIndex: this.zIndex
            };
        }
    },
    mounted() {
        this.timer = setTimeout(() => {
            Stickyfill.add(this.$refs.sticky);
            if (!window.Stickyfill) {
                window.Stickyfill = Stickyfill;
            }
            if (this.className) {
                this.observe();
            }
        }, 1000);
    },
    destroyed() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        if (this.observe.io) {
            this.observe.io.disconnect();
        }
    },
    methods: {
        observe() {
            const stickyEl = this.$refs.sticky;

            let Ratio = 1;
            // const mixinTop = Number.parseInt(this.mixinTop, 10);
            if (this.mixinTop < 0) {
                Ratio =
                    Math.floor(
                        ((this.$refs.sticky.offsetHeight + this.mixinTop) / this.$refs.sticky.offsetHeight) * 10
                    ) / 10;
            }
            this.observe.io = new IntersectionObserver(
                (entries) => {
                    const el = entries[0];
                    if (el.intersectionRatio >= Ratio) {
                        this.$nextTick(() => {
                            stickyEl.classList.add(this.className);
                        });
                    }
                    if (el.intersectionRatio < Ratio) {
                        this.$nextTick(() => {
                            stickyEl.classList.remove(this.className);
                        });
                    }
                },
                {
                    threshold: [0, 0.09, Ratio, 0.99, 1],
                    rootMargin: `0px 0px -${((window.innerHeight - stickyEl.offsetHeight - this.mixinTop) * 100) /
                        window.innerHeight}% 0px`
                }
            );
            this.observe.io.observe(stickyEl);
        }
    }
};
</script>
