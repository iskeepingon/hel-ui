import Collapse from './Collapse.vue';
import '@/assets/css/theme/OcCollapse.scss';

Collapse.install = function (Vue) {
    Vue.component(Collapse.name, Collapse);
};

export default Collapse;