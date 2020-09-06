<template>
    <ProgressLine
        v-if="isLinePorgress"
        :portionNoRound="portionNoRound"
        :color="color"
        :trackColor="trackColor"
        :gradientColor="gradientColor"
        :duration="duration"
        :round="round"
        :stroke-width="strokeWidth"
        :percentage="percentage"
        :trackWidth="trackWidth"
    >
        <template v-for="(slotItem, key) in $scopedSlots" v-slot:[key]="data">
            <slot :name="key" v-bind="data"></slot>
        </template>
    </ProgressLine>
    <ProgressCircle
        v-else
        :color="color"
        :trackWidth="trackWidth"
        :trackColor="trackColor"
        :duration="duration"
        :gradientColor="gradientColor"
        :stroke-width="strokeWidth"
        :percentage="percentage"
        :radius="radius"
        :round="round"
    >
        <template v-for="(slotItem, key) in $scopedSlots" v-slot:[key]="data">
            <slot :name="key" v-bind="data"></slot>
        </template>
    </ProgressCircle>
</template>

<script>
import ProgressCircle from '../ProgressCircle/ProgressCircle';
import ProgressLine from '../ProgressLine/ProgressLine';
export default {
    name: 'OcProgress',
    components: {
        ProgressCircle,
        ProgressLine
    },
    props: {
        trackColor: {
            type: String,
            default: '#ebedf0'
        },
        color: {
            type: String,
            default: '#1989fa'
        },
        strokeWidth: {
            type: Number,
            default: 2
        },
        trackWidth: {
            type: Number,
            default: 0
        },
        type: {
            type: String,
            default: 'line'
        },
        percentage: {
            type: Number,
            default: 0
        },
        gradientColor: {
            type: Array,
            default: () => []
        },
        radius: {
            type: Number,
            default: 10
        },
        round: {
            type: Boolean,
            default: false
        },
        portionNoRound: {
            type: Boolean,
            default: false
        },
        duration: {
            type: Number,
            default: 0
        }
    },
    computed: {
        isLinePorgress() {
            return this.type === 'line';
        }
    }
};
</script>
