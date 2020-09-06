import OcIcon from './Icon.vue';
import '@/assets/css/theme/OcIcon.scss';

OcIcon.install = (Vue) => {
  Vue.component(OcIcon.name, OcIcon);
};
export default OcIcon;