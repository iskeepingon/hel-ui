import DatePicker from './DatePicker.vue';
import '@/assets/css/theme/OcDatePicker.scss';

DatePicker.install = function (Vue) {
    Vue.component(DatePicker.name, DatePicker);
};

export default DatePicker;