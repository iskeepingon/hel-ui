import Field from './Input.vue';
import '@/assets/css/theme/OcInput.scss';

Field.install = function (Vue) {
    Vue.component(Field.name, Field);
};

export default Field;