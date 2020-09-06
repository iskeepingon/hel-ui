import RadioGroup from './RadioGroup.vue';
import '@/assets/css/theme/OcRadioGroup.scss';

RadioGroup.install = function (Vue) {
    Vue.component(RadioGroup.name, RadioGroup);
};

export default RadioGroup;