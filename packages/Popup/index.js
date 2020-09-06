import OcPopup from './Popup.vue';
import '@/assets/css/theme/OcPopup.scss';

OcPopup.install = (Vue) => {
	Vue.component(OcPopup.name, OcPopup);
};

export default OcPopup;