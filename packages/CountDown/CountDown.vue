<template>
    <div class="oc-count-down">
        <template v-if="$scopedSlots.default">
            <slot :timeData="timeData"></slot>
        </template>
        <template v-else>
            {{ formattedTime }}
        </template>
    </div>
</template>

<script>
import {raf, cancelRaf} from '../../common/util/raf';
import {isSameSecond, parseTimeData, parseFormat} from './utils';
export default {
    name: 'OcCountDown',
    props: {
        millisecond: Boolean,
        time: {
            type: Number,
            default: 0
        },
        format: {
            type: String,
            default: 'HH:mm:ss'
        },
        autoStart: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            remain: 0
        };
    },
    computed: {
        timeData() {
            return parseTimeData(this.remain);
        },

        formattedTime() {
            return parseFormat(this.format, this.timeData);
        }
    },
    watch: {
        time: {
            immediate: true,
            handler: 'reset'
        }
    },
    activated() {
        if (this.keepAlivePaused) {
            this.counting = true; // TODO: counting?
            this.keepAlivePaused = false;
            this.tick();
        }
    },
    deactivated() {
        if (this.counting) {
            this.pause();
            this.keepAlivePaused = true;
        }
    },
    beforeDestroy() {
        this.pause();
    },
    methods: {
        // 公开api
        start() {
            if (this.counting) {
                return;
            }

            this.counting = true;
            this.endTime = Date.now() + this.remain;
            this.tick();
        },

        // 公开api
        pause() {
            this.counting = false;
            cancelRaf(this.rafId);
        },

        // 公开api
        reset() {
            this.pause();
            this.remain = this.time;

            if (this.autoStart) {
                this.start();
            }
        },

        tick() {
            if (this.millisecond) {
                this.microTick();
            } else {
                this.macroTick();
            }
        },

        microTick() {
            this.rafId = raf(() => {
                if (!this.counting) {
                    return;
                }

                this.setRemain(this.getRemain());

                if (this.remain > 0) {
                    this.microTick();
                }
            });
        },

        macroTick() {
            this.rafId = raf(() => {
                if (!this.counting) {
                    return;
                }

                const remain = this.getRemain();

                if (!isSameSecond(remain, this.remain) || remain === 0) {
                    this.setRemain(remain);
                }

                if (this.remain > 0) {
                    this.macroTick();
                }
            });
        },

        getRemain() {
            return Math.max(this.endTime - Date.now(), 0);
        },

        setRemain(remain) {
            this.remain = remain;
            
            if (remain === 0) {
                this.pause();
                this.$emit('finish');
            }
        }
    }
};
</script>
