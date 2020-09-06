import NoticeBar from './NoticeBar.vue';
import '@/assets/css/theme/OcNoticeBar.scss';

NoticeBar.install = function (Vue) {
    Vue.component(NoticeBar.name, NoticeBar);
};

export default NoticeBar;