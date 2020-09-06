import Picker from './Picker.vue';
import '@/assets/css/theme/OcPicker.scss';

Picker.install = function (Vue) {
    Vue.component(Picker.name, Picker);
};

export default Picker;