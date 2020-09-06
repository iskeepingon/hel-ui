import Tabs from './Tabs.vue';
import '@/assets/css/theme/OcTabs.scss';

Tabs.install = function (Vue) {
  Vue.component(Tabs.name, Tabs);
};

export default Tabs;