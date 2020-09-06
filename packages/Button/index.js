import OcButton from './Button';
import '@/assets/css/theme/OcButton.scss';

OcButton.install = (Vue) => {
  Vue.component(OcButton.name, OcButton);
};
export default OcButton;