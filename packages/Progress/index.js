import Progress from './Progress.vue';
import '@/assets/css/theme/OcProgress.scss';

Progress.install = function (Vue) {
    Vue.component(Progress.name, Progress);
};

export default Progress;