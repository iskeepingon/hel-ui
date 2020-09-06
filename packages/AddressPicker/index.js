import AddressPicker from './AddressPicker.vue';
import '@/assets/css/theme/OcAddressPicker.scss';

AddressPicker.install = function (Vue) {
    Vue.component(AddressPicker.name, AddressPicker);
};

export default AddressPicker;