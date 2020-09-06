import OcOverlay from './Overlay';
import OcPopup from './Popup';
import OcDialog from './Dialog';
import OcToast from './Toast';
import OcLoading from './Loading';
import OcTabs from './Tabs';
import OcTabPanel from './TabPanel';
import OcButton from './Button';
import OcIcon from './Icon';
import OcScroll from './Scroll';
import OcCellGroup from './CellGroup';
import OcCell from './Cell';
import OcPicker from './Picker';
import OcDatePicker from './DatePicker';
import OcLunarPicker from './LunarPicker';
import OcAddressPicker from './AddressPicker';
import OcNoticeBar from './NoticeBar';
import OcInput from './Input';
import OcRadioGroup from './RadioGroup';
import OcRadio from './Radio';
import OcCheckboxGroup from './CheckboxGroup';
import OcCheckbox from './Checkbox';
import OcCollapse from './Collapse';
import OcCollapseItem from './CollapseItem';
import OcSwitch from './Switch';
import OcSticky from './Sticky';
import OcLocale from './Locale';
import OcScrollNumber from './ScrollNumber';
import OcProgress from './Progress';
import OcProgressLine from './ProgressLine';
import OcProgressCircle from './ProgressCircle';
import OcScrollTop from './ScrollTop';
import OcCountDown from './CountDown';
import OcAnimatedNumber from './AnimatedNumber';
import OcSteps from './Steps';
import OcStep from './Step';
import OcSwiper from './Swiper';
import OcSwiperSlide from './SwiperSlide';

// 所有组件列表
const components = [
	OcOverlay,
	OcPopup,
	OcDialog,
	OcToast,
	OcLoading,
	OcTabs,
	OcTabPanel,
	OcButton,
	OcIcon,
	OcScroll,
	OcCellGroup,
	OcCell,
	OcPicker,
	OcDatePicker,
	OcLunarPicker,
	OcAddressPicker,
	OcNoticeBar,
	OcInput,
	OcRadioGroup,
	OcRadio,
	OcCheckboxGroup,
	OcCheckbox,
	OcCollapse,
	OcCollapseItem,
	OcSwitch,
	OcSticky,
	OcScrollNumber,
	OcProgress,
	OcProgressLine,
	OcProgressCircle,
	OcCountDown,
	OcAnimatedNumber,
	OcSteps,
	OcStep,
	OcSwiper,
	OcSwiperSlide,
];

// 定义 install 方法，接收 Vue 作为参数
const install = function (Vue, opts = {}) {
	// 判断是否安装，安装过就不继续往下执行
	if (install.installed) return;
	install.installed = true;

	// locale.use(opts.locale);
	// locale.i18n(opts.i18n);

	components.forEach(component => {
		// Vue.component(component.name, component);
		Vue.use(component);
	});

	Vue.prototype.$UICONFIG = {
		toastDuration: opts.toastDuration || 2000
	};
};

if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue);
}

export default {
	install,
	OcScrollTop,
	OcLocale,
	...components,
};