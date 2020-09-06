import OcSwiperSlide from './SwiperSlide';
import '@/assets/css/theme/OcSwiperSlide.scss';

OcSwiperSlide.install = (Vue) => {
  Vue.component(OcSwiperSlide.name, OcSwiperSlide);
};
export default OcSwiperSlide;