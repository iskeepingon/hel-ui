import Radio from './Radio.vue';
import '@/assets/css/theme/OcRadio.scss';

Radio.install = function (Vue) {
    Vue.component(Radio.name, Radio);
};

export default Radio;