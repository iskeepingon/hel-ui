import OcSticky from './Sticky.vue';
import '@/assets/css/theme/OcSticky.scss';

OcSticky.install = (Vue) => {
  Vue.component(OcSticky.name, OcSticky);
};
export default OcSticky;