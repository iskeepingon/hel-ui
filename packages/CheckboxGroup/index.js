import CheckboxGroup from './CheckboxGroup.vue';
import '@/assets/css/theme/OcCheckboxGroup.scss';

CheckboxGroup.install = function (Vue) {
    Vue.component(CheckboxGroup.name, CheckboxGroup);
};

export default CheckboxGroup;