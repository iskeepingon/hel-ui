import OcScroll from './Scroll.vue';
import '@/assets/css/theme/OcScroll.scss';

OcScroll.install = (Vue) => {
  Vue.component(OcScroll.name, OcScroll);
};
export default OcScroll;