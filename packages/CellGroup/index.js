import OcCellGroup from './CellGroup';
import '@/assets/css/theme/OcCellGroup.scss';

OcCellGroup.install = (Vue) => {
  Vue.component(OcCellGroup.name, OcCellGroup);
};
export default OcCellGroup;