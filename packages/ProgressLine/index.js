import ProgressLine from './ProgressLine.vue';
import '@/assets/css/theme/OcProgress.scss';

ProgressLine.install = function (Vue) {
    Vue.component(ProgressLine.name, ProgressLine);
};

export default ProgressLine;