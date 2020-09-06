import OcSwiper from './Swiper';
import '@/assets/css/theme/OcSwiper.scss';

OcSwiper.install = (Vue) => {
  Vue.component(OcSwiper.name, OcSwiper);
};
export default OcSwiper;