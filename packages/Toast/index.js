import Vue from 'vue';
import OcToast from './Toast.vue';
import '@/assets/css/theme/OcToast.scss';

let instance;
const defaultOption = {
	visible: false,
	type: 'text',
	customClass: '',
	loadingIcon: 'circle',
	msg: '',
	zIndex: '',
	maskOpacity: 0,
	hasMask: false,
	duration: '',
	align: 'center',
	onShow: null,
	onHide: null
};

const OcToastFn = (propsData, type) => {
	// 不传值则跳出函数
	if (!propsData) return;


	// 传的类型字符串，默认是msg
	if (typeof propsData === 'string') {
		propsData = {
			msg: propsData
		};
	}
	type && (propsData.type = type);
	// type是loading，不会自动消失
	if (propsData.type === 'loading') {
		propsData.mask = typeof (propsData.mask) !== 'undefined' ? propsData.mask : true;
		propsData.duration = propsData.duration || 0;
	}

	// 合并参数
	propsData = Object.assign(propsData, {
		isFunctional: true
	});

	if (!instance) {
		// 创建vue构造器
		const ToastConstructor = Vue.extend(OcToast);

		ToastConstructor.prototype.hide = function () {
			this.visible = false;
		};

		instance = OcToastFn._instance = new ToastConstructor({
			propsData
		});

		instance.vm = instance.$mount();
		document.body.appendChild(instance.$el);
	} else {
		propsData = Object.assign({}, defaultOption, propsData);
		Object.keys(propsData).forEach((it) => {
			if (instance[it] !== propsData[it]) {
				instance[it] = propsData[it];
			}
		});
	}

	if (typeof instance.msg === 'function') {
		const h = instance.$createElement;
		instance.$slots.default = [instance.msg(h)];
		// instance.msg = null;
	} else {
		instance.$slots.default = null;
	}

	Vue.nextTick(() => {
		instance.visible = true;
	});

	return instance;
};

['success', 'fail', 'warn', 'loading'].forEach((type) => {
	OcToastFn[type] = (options) => {
		return OcToastFn(options, type);
	};
});

export default {
	install(Vue){
		Vue.component(OcToast.name, OcToast);
		Vue.prototype.$OcToast = OcToastFn;
	},
	...OcToastFn
};