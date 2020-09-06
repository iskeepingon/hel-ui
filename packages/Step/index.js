import OcStep from './Step.vue';
import '@/assets/css/theme/OcStep.scss';

OcStep.install = (Vue) => {
  Vue.component(OcStep.name, OcStep);
};
export default OcStep;