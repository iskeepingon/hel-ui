import LunarPicker from './LunarPicker.vue';
import '@/assets/css/theme/OcLunarPicker.scss';

LunarPicker.install = function (Vue) {
    Vue.component(LunarPicker.name, LunarPicker);
};

export default LunarPicker;