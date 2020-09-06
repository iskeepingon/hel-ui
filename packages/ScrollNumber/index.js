import ScrollNumber from './ScrollNumber.vue';
import '@/assets/css/theme/OcScrollNumber.scss';

ScrollNumber.install = (Vue) => {
  Vue.component(ScrollNumber.name, ScrollNumber);
};
export default ScrollNumber;