import OcCountDown from './CountDown';
import '@/assets/css/theme/OcCountDown.scss';

OcCountDown.install = (Vue) => {
  Vue.component(OcCountDown.name, OcCountDown);
};
export default OcCountDown;