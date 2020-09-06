<template>
    <div :class="['oc-steps', direction === 'vertical' ? 'oc-steps_vertical' : 'oc-steps_horizontal']">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'OcSteps',
    components: {},
    props: {
        active: {
            type: Number,
            default: -1
        },
        lineThick: {
            type: Number
        },
        lineColor: {
            type: String,
            default: '#ebedf0'
        },
        direction: {
            type: String,
            default: 'horizontal'
        },
        alignCenter: {
            type: Boolean,
            default: false
        },
        lineActiveColor: {
            type: String,
            default: '#1989fa'
        }
    },
    data() {
        return {
            steps: []
        };
    },
    watch: {
        steps(steps) {
            steps.forEach((child, index) => {
                child.index = index;
            });
        }
    }
};
</script>
