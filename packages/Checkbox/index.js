import Checkbox from './Checkbox.vue';
import '@/assets/css/theme/OcCheckbox.scss';

Checkbox.install = function (Vue) {
    Vue.component(Checkbox.name, Checkbox);
};

export default Checkbox;