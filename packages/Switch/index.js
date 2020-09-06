import OcSwitch from './Switch';
import '@/assets/css/theme/OcSwitch.scss';

OcSwitch.install = (Vue) => {
  Vue.component(OcSwitch.name, OcSwitch);
};
export default OcSwitch;