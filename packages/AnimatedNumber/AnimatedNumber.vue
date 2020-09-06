<template>
	<div>
		<template v-if="$scopedSlots.default">
            <slot :displayNumber="displayNumber"></slot>
        </template>
        <template v-else>
            {{ displayNumber }}
        </template>
	</div>
</template>
<script>
import {animation} from '../../common/util/animation';
import {raf, cancelRaf} from '../../common/util/raf';

export default {
	name: 'OcAnimatedNumber',
	props: {
		// 持续时间（毫秒）
		duration: {
			required: false,
			type: [Number, String],
			default: 500
		},
		// 初始值
		initialValue: {
			required: false,
			type: [Number, String],
			default: 0
		},
		// 目标值
		targetValue: {
			required: true,
			type: [Number, String],
			default: 0
		},
		// 保留的小数位个数
		decimalPlaces: {
			required: false,
			type: [Number, String],
			default: 2
		},
		// 自定义格式化方法
		customFormat: {
			type: Function,
			default: null
		},
		// 动画的速度曲线
        // 支持的所有动画类型：linear,easeInSine,easeOutSine,easeInOutSine,easeInCirc,easeOutCirc,easeInOutCirc,easeInBack,easeOutBack,easeInOutBack,easeInBounce,easeOutBounce,easeInOutBounce,easeInElastic,easeOutElastic,easeInOutElastic,easeInQuad,easeOutQuad,easeInOutQuad,easeInCubic,easeOutCubic,easeInOutCubic,easeInQuart,easeOutQuart,easeInOutQuart,easeInQuint,easeOutQuint,easeInOutQuint,easeInExpo,easeOutExpo,easeInOutExpo
		easing: {
			required: false,
			type: String,
			default: 'linear'
		}
	},
	data() {
		return {
			currentNumber: 0
		};
	},
	computed: {
		// 显示数字
		displayNumber() {
			const _displayNumber = Number(this.currentNumber);
			if (this.customFormat) {
				return this.customFormat(_displayNumber);
			}
			return _displayNumber.toFixed(this.decimalPlaces);
		},
	},
	watch: {
		targetValue(cur, old) {
			this.initParameters(old);
			this.start();
		}
	},
	created() {
		this.initParameters();
	},
	mounted(){
		this.start();
	},
	methods: {
		// 初始化参数
		initParameters(value) {
			this.rafId = 0;
			this._initValue = value ? value : this.initialValue;
			this.diff = Number(this.targetValue) - Number(this._initValue);
		},
		// 开始
		start() {
			this.$emit('start');
			cancelRaf(this.rafId);
			this.startTime = Date.now();
			this.update();
		},
		// 更新
		update() {
			var progress = (Date.now()- this.startTime) / Number(this.duration);
			if (progress > 1) {
				this.complete();
				return;
			}
			this.currentNumber = Number(this._initValue) + this.easingsFunctions(progress);
			this.rafId = raf(this.update);
			this.$emit('update', this.currentNumber);
		},
		// 完成
		complete() {
			this.currentNumber = this.targetValue;
			this.$emit('complete', this.currentNumber);
			cancelRaf(this.rafId);
		},
		// 重新开始
		restart() {
			this.initParameters(0);
			this.$nextTick(() => {
				this.start();
			});
		},
		// 执行动画
		easingsFunctions(progress) {
			return this.diff * animation(this.easing, this.duration, progress);
		}
	},
};
</script>

<style>
</style>
