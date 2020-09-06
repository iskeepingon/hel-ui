// import Vue from 'vue';
import OcDialog from './Dialog.vue';
import '@/assets/css/theme/OcDialog.scss';

let instance;
const defaultOption = {
	visible: false,
	type: '',
	title: '',
	customClass: '',
	zIndex: '',
	content: '',
	align: 'center',
	contentAlign: '',
	cancelText: '',
	confirmText: '',
	closeIconName: 'cross',
	confirmTextLight: false,
	hasMask: true,
	maskOpacity: 0,
	isFunctional: false,
	maskTransitionName: 'fade',
	mainTransitionName: '',
	mainTransitionType: 'animation',
	isLockScroll: true,
	onShow: null,
	onHide: null,
	onConfirm: null,
	onCancel: null,
	onClose: null,
	onMask: null,
	canCloseByMask: false
};

OcDialog.install = (Vue) => {
	Vue.component(OcDialog.name, OcDialog);

	const OcDialogFn = (propsData, type) => {
		if (!propsData) return;

		type && (propsData.type = type);

		propsData = Object.assign(propsData, {
			isFunctional: true
		});

		if (!instance) {
			let DialogConstructor = Vue.extend(OcDialog);

			DialogConstructor.prototype.hide = function () {
				this.visible = false;
			};

			instance = new DialogConstructor({
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

		const h = instance.$createElement;
		if (typeof instance.content === 'function') {
			instance.$slots.default = [instance.content(h)];
		} else {
			instance.$slots.default = null;
		}

		if (typeof instance.title === 'function') {
			instance.$slots.title = [instance.title(h)];
		} else {
			instance.$slots.title = null;
		}

		Vue.nextTick(() => {
			instance.visible = true;
		});

		return instance;
	};

	['alert', 'confirm'].forEach((type) => {
		OcDialogFn[type] = (options) => {
			return OcDialogFn(options, type);
		};
	});

	Vue.prototype.$OcDialog = OcDialogFn;
};

export default OcDialog;