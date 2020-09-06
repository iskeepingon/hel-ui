<template>
    <div :class="['oc-step', `is-${internalStatus}`, `oc-step_${direction}`, {'is-center': isCenter}]" :style="style">
        <div class="oc-step-prefix" v-if="$scopedSlots.prefix || prefix">
            <slot name="prefix" :status="internalStatus">{{ prefix }}</slot>
        </div>
        <div class="oc-step-header">
            <OcStepLine
                :lineThick="lineThick"
                :isSuccess="isSuccess"
                :lineActiveColor="lineActiveColor"
                :lineColor="lineColor"
                :direction="direction"
                v-if="!isLast"
            ></OcStepLine>
            <div class="oc-step-icon" v-if="$scopedSlots.icon || icon">
                <slot name="icon" :status="internalStatus"><OcIcon :name="icon"/></slot>
            </div>
        </div>
        <div class="oc-step-main" v-if="$scopedSlots.main || main">
            <slot name="main" :status="internalStatus">{{ main }}</slot>
        </div>
    </div>
</template>

<script>
import OcStepLine from './StepLine';
export default {
    name: 'OcStep',
    components: {
        OcStepLine
    },
    props: {
        prefix: {
            type: String
        },
        main: {
            type: String
        },
        icon: {
            type: String
        }
    },
    data() {
        return {
            index: -1,
            internalStatus: ''
        };
    },
    methods: {
        updateStatus(val) {
            this.internalStatus = val > this.index ? 'finish' : val === this.index ? 'process' : 'wait';
        }
    },
    beforeCreate() {
        this.$parent.steps.push(this);
    },
    beforeDestroy() {
        const steps = this.$parent.steps;
        const index = steps.indexOf(this);
        if (index >= 0) {
            steps.splice(index, 1);
        }
    },
    computed: {
        isLast() {
            const parent = this.$parent;
            return parent.steps[parent.steps.length - 1] === this;
        },
        isCenter() {
            return this.$parent.alignCenter;
        },
        lineThick() {
            return this.$parent.lineThick;
        },
        stepsCount() {
            return this.$parent.steps.length;
        },
        lineActiveColor() {
            return this.$parent.lineActiveColor;
        },
        lineColor() {
            return this.$parent.lineColor;
        },
        tailLength() {
            return this.$parent.tailLength;
        },
        prefixLength() {
            return this.$parent.prefixLength;
        },
        style() {
            const style = {};
            if (this.isCenter) {
                style.flexBasis = `${100 / this.stepsCount}%`;
                !this.isVertical && (style.justifyContent = `center`);
            } else {
                style.flexBasis = `${100 / (this.stepsCount - 1)}%`;
                if (this.isLast) {
                    style.flexBasis = `auto!important`;
                    style.flexShrink = 0;
                    style.flexGrow = 0;
                }
            }
            return style;
        },
        direction() {
            return this.$parent.direction;
        },
        isVertical() {
            return this.direction === 'vertical';
        },
        isSuccess() {
            return this.internalStatus === 'finish';
        }
    },
    mounted() {
        const unwatch = this.$watch('index', () => {
            this.$watch('$parent.active', this.updateStatus, {immediate: true});
            unwatch();
        });
    }
};
</script>

<style></style>
