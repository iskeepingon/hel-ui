import OcSteps from './Steps.vue';
import '@/assets/css/theme/OcSteps.scss';

OcSteps.install = (Vue) => {
  Vue.component(OcSteps.name, OcSteps);
};
export default OcSteps;