import OcOverlay from './Overlay.vue';
import '@/assets/css/theme/OcOverlay.scss';

OcOverlay.install = (Vue) => {
	Vue.component(OcOverlay.name, OcOverlay);
};

export default OcOverlay;