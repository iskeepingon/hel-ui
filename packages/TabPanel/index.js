import tabPanel from './TabPanel.vue';
import '@/assets/css/theme/OcTabPanel.scss';

tabPanel.install = function (Vue) {
    Vue.component(tabPanel.name, tabPanel);
};

export default tabPanel;