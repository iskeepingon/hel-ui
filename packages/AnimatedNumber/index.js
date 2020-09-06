import OcAnimatedNumber from './AnimatedNumber';
import '@/assets/css/theme/OcAnimatedNumber.scss';

OcAnimatedNumber.install = (Vue) => {
  Vue.component(OcAnimatedNumber.name, OcAnimatedNumber);
};
export default OcAnimatedNumber;