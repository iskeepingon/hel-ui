<template>
    <div class="oc-address-picker-view">
        <div class="oc-address-picker-before" @click="onCancel"></div>
        <div class="oc-address-picker-wrapper">
            <oc-picker
                :multi-array="mapList"
                :init-indices="initIndices"
                :line-count="lineCount"
                :title="title || t('addressPicker.areaEmpty')"
                :confirm-btn-text="confirmBtnText"
                :cancel-btn-text="cancelBtnText"
                :show-toolbar="showToolbar"
                :is-single-column="isSingleColumn"
                :list-align="isSingleColumn ? '' : 'center'"
                :class-name="isSingleColumn ? 'oc-picker-address-single-list' : 'oc-picker-address-list'"
                :selected-class-name="'oc-picker-selected-address'"
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
import mapList from '../../common/util/map';
import {getTargetIndices} from '../../common/util/multi-array';
import Locale from '../Locale/locale.js';

export default {
    name: 'OcAddressPicker',
    mixins: [Locale],
    components: {
        [Picker.name]: Picker
    },
    props: {
        title: String,
        cancelBtnText: {
            type: String
        },
        confirmBtnText: {
            type: String
        },
        initAddress: {
            type: Array
        },
        lineCount: {
            type: Number
        },
        showToolbar: {
            type: Boolean,
            default: true
        },
        isSingleColumn: {
            type: Boolean,
            default: false
        },
        selectedClassName: {
            type: String
        }
    },
    data() {
        return {
            mapList
        };
    },
    computed: {
        initIndices() {
            return getTargetIndices(this.mapList, this.initAddress);
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
