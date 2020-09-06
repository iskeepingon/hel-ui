import OcLoading from './Loading.vue';
import '@/assets/css/theme/OcLoading.scss';

OcLoading.install = (Vue) => {
	Vue.component(OcLoading.name, OcLoading);
};

export default OcLoading;