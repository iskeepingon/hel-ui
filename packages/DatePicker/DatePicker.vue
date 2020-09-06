<template>
    <div class="oc-date-picker-view">
        <div class="oc-date-picker-before" @click="onCancel"></div>
        <div class="oc-date-picker-wrapper">
            <oc-picker
                :is-linkage="!isClock"
                :multi-array="dateList"
                :init-indices="initIndices"
                :line-count="lineCount"
                :title="title"
                :confirm-btn-text="confirmBtnText"
                :cancel-btn-text="cancelBtnText"
                list-align="center"
                class-name="oc-picker-address-list"
                @cancel="onCancel"
                @change="onChange"
                @confirm="onConfirm"
            >
                <template #title="{ text }">
                    <slot name="title" :text="text"></slot>
                </template>
                <template #confirm-btn="{ text }">
                    <slot name="confirm-btn" :text="text"></slot>
                </template>
                <template #cancel-btn="{ text }">
                    <slot name="cancel-btn" :text="text"></slot>
                </template>
                <template #columns-top>
                    <slot name="columns-top"></slot>
                </template>
                <template #columns-bottom>
                    <slot name="columns-bottom"></slot>
                </template>
            </oc-picker>
        </div>
    </div>
</template>

<script>
import Picker from '../Picker/Picker.vue';
import {getClockList, getDateList} from '../../common/util/date-clock';
import {getTargetIndices} from '../../common/util/multi-array';

export default {
    name: 'OcDatePicker',
    components: {
        [Picker.name]: Picker
    },
    props: {
        title: {
            type: String,
            default: '请选择'
        },
        cancelBtnText: {
            type: String
        },
        confirmBtnText: {
            type: String
        },
        clockTextFilters: {
            type: [Array, Function]
        },
        dateTextFilters: {
            type: [Array, Function]
        },
        startDate: {
            type: Array,
            default: () => [1990, 1, 1]
        },
        endDate: {
            type: Array,
            default: () => [2020, 12, 31]
        },
        initDate: {
            type: Array
        },
        lineCount: {
            type: Number
        },
        isClock: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dateList: this.isClock
                ? getClockList(this.clockTextFilters)
                : getDateList(this.startDate, this.endDate, this.dateTextFilters)
        };
    },
    computed: {
        initIndices() {
            return getTargetIndices(this.dateList, this.initDate, !this.isClock);
        }
    },
    methods: {
        onCancel() {
            this.$emit('cancel');
        },
        onChange(data) {
            this.$emit('change', data);
        },
        onConfirm(data) {
            this.$emit('confirm', data);
        }
    }
};
</script>
