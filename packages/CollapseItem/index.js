import CollapseItem from './CollapseItem.vue';
import '@/assets/css/theme/OcCollapseItem.scss';

CollapseItem.install = function (Vue) {
    Vue.component(CollapseItem.name, CollapseItem);
};

export default CollapseItem;