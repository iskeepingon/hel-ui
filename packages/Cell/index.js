import OcCell from './Cell';
import '@/assets/css/theme/OcCell.scss';

OcCell.install = (Vue) => {
  Vue.component(OcCell.name, OcCell);
};
export default OcCell;