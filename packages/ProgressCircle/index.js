import ProgressCircle from './ProgressCircle.vue';
import '@/assets/css/theme/OcProgress.scss';

ProgressCircle.install = function (Vue) {
    Vue.component(ProgressCircle.name, ProgressCircle);
};

export default ProgressCircle;