<template>
	<div
		class="oc-swiper"
		@touchstart="handleTouchstart"
		@touchmove="handleTouchmove"
		@touchend="handleTouchend"
		@touchcancel="handleTouchend"
	>
		<div ref="wrapper" class="oc-swiper-wrapper">
			<slot></slot>
		</div>
		<div v-if="pagination" class="oc-swiper-pagination">
			<!-- 自定义分页器展示 -->
			<slot name="pagination">
				<div class="oc-swiper-pagination-bar">
					<i
						v-for="item in length"
						:key="item"
						:class="['oc-swiper-pagination-item', item - 1 === realIndex ? 'active' : '']"
					></i>
				</div>
			</slot>
		</div>
	</div>
</template>
<script>
export default {
	name: 'OcSwiper',
	props: {
		value: { // 默认展示第N个，N从0开始
			type: Number,
			default: 0,
		},
		pagination: { // 默认分页导航器
			type: Boolean,
			default: true,
		},
		autoplayTime: { // 自动轮播时间间隔
			type: Number,
			default: 2500,
		},
		loop: { // 循环滑动
			type: Boolean,
			default: true,
		},
		minMoveDistance: { // 成功触发切换 item 的最小滑动距离。支持格式: 20(20px)/20px/20%
			type: String,
			default: '20%',
		},
		quickTouchTime: { // 快速滑动时只要距离大于 10px 便可以触发滑动
			type: Number,
			default: 150,
		},
		speed: { // 切换速度，即slider自动滑动开始到结束的时间（单位ms），也是触摸滑动时释放至贴合的时间。
			type: Number,
			default: 300,
		},
	},
	data() {
		return {
			width: 0, // 组件宽度
			hasMounted: false,
			realIndex: this.value, // 当前活动块的索引，从0开始
			isRealIndexChange: false, // 滑动后当前活动块的索引是否改变
			pages: [],  // swiperSlide dom list
			length: 0,
			touchStartTime: 0, // 滑动开始时间
			startx: 0, // 滑动开始位置X
			starty: 0, // 滑动开始位置Y
			moveDistance: 0, // 滑动距离
			animating: false, // 组件正在过渡（自由滑动）
			isTouching: true, // 用户正在操作（touch事件未结束）
			horizontalMove: true,
			copyNum: 2, // 复制数量
			autoplayTimer: null,
		};
	},
	computed: {
		ocMinMoveDistance() {
			let value = this.minMoveDistance;
			let mode = '';
			if (/px$/.test(value)) {
				mode = 'pixel';
			} else if (/^\d+$/.test(value)) {
				mode = 'pixel';
			} else if (/%$/.test(value)) {
				mode = 'percent';
			} else {
				value = '20%';
				mode = 'percent';
			}
			const stgy = {
				pixel() {
					const parsedValue = parseInt(value, 10);
					return `${value}px`;
				},
				percent() {
					const parsedValue = parseInt(value, 10) / 100;
					return this.width * parsedValue;
				},
			};
			return stgy[mode].apply(this);
		},
		// 滑动结束后 translatex 的值
		ocTranslatex() {
			return -this.width * this.realIndex;
		},
		ocIsEnd() {
			return this.realIndex === this.length - 1;
		},
		ocIsBegin() {
			return this.realIndex === 0;
		},
	},
	watch: {
		realIndex(val) {
			if (val !== this.value) {
				this.$emit('input', val);
			}
			this.valueChangeHandler(val);
		},
		value(val) {
			this.realIndex = val;
		},
		autoplayTime() {
			this.autoChange();
		},
	},
	mounted() {
		this.hasMounted = true;
		this.init();
		this.initOnce();
	},
	destroyed() {
		this.autoplayTimer && clearTimeout(this.autoplayTimer);
	},
	methods: {
		reset() {
			this.init();
			this.initOnce();
		},
		init() {
			// 如果组件 mounted 前 init 方法被调用，则会引起报错。
			// 因此使用 hasMounted 变量来保证不会报错。
			if (!this.hasMounted) return;
			// 设置部分 datas 的值
			const success = this.initDatas();
			if (!success) {
				// Failed to init datas
				return;
			}
			// 为 wrapper 定宽
			this.$refs.wrapper.style.width = `${this.width}px`;
			// 复制首尾 dom
			this.clearCopies();
			this.addCopies();
			// 自动轮播
			if (this.autoplayTime > 0) {
				this.autoChange();
			}
		},
		initOnce() {
			this.setTranslate(this.ocTranslatex);
		},
		initDatas() {
			const style = getComputedStyle(this.$el, false).width;
			this.width = parseInt(style, 10);
			if (!this.$slots.default) {
				// console.warn('No child nodes in swipe component', this.$el);
				return false;
			}
			this.pages = this.$slots.default
				.filter(vnode => vnode.tag && vnode.elm.classList.contains('oc-swiper-item'))
				.map(vnode => vnode.elm);
			if (!this.pages.length) {
				// console.warn('The swipe component not contained swipe-item component', this.$el);
				return false;
			}
			this.length = this.pages.length;
			return true;
		},
		// 清除复制的首尾dom
		clearCopies() {
			const children = this.$refs.wrapper.querySelectorAll('.oc-swiper-item-copy');
			[...children].forEach(el => {
				this.$refs.wrapper.removeChild(el);
			}, this);
			this.$refs.wrapper.style.marginLeft = '0';
		},
		// 复制首尾dom
		addCopies() {
			// if(!this.loop) return
			const fronts = [];
			const ends = [];
			// copy 前两个和最后两个元素
			const pages = this.pages;
			pages.forEach((item, index) => {
				if (index < 2) {
					const copy = item.cloneNode(true);
					copy.classList.remove('oc-swiper-item');
					copy.classList.add('oc-swiper-item-copy');
					fronts.push(copy);
				}
				if (index > pages.length - 3) {
					const copy = item.cloneNode(true);
					copy.classList.remove('oc-swiper-item');
					copy.classList.add('oc-swiper-item-copy');
					ends.push(copy);
				}
			}, this);
			this.copyNum = ends.length;
			// insert node
			while (ends.length) {
				const item = ends.shift();
				const firstNode = this.$refs.wrapper.querySelector('.oc-swiper-item');
				this.$refs.wrapper.insertBefore(item, firstNode);
			}
			while (fronts.length) {
				const item = fronts.shift();
				this.$refs.wrapper.appendChild(item);
			}
			this.$refs.wrapper.style.marginLeft = `-${this.width * this.copyNum}px`;
		},
		handleTouchstart(e) {
			this.$emit('onTouchStart');
			if (this.length <= 1 || this.animating) return;
			this.startx = e.touches[0].pageX;
			this.starty = e.touches[0].pageY;
			this.touchStartTime = new Date().getTime();
			// 滑动开始时，清除自动轮播的计时器
			this.autoplayTimer && clearTimeout(this.autoplayTimer);
			// if (this.autoChange) {
			// 	this.autoChange();  // 重置自动轮播的计时器
			// }
			this.isTouching = true;
		},
		handleTouchmove(e) {
			// if (this.length <= 1 || this.animating) return;
			if (this.length <= 1) return;
			if (this.animating) {
				e.preventDefault();
				return;
			}
			e.preventDefault();
			let moveDistance = e.touches[0].pageX - this.startx;
			this.moveDistance = moveDistance;
			// 判断用户是横向滑动还是纵向滑动，以此来避免误滑
			if (this.isTouching) {
				this.isTouching = false;
				const moveY = e.touches[0].pageY - this.starty;
				this.horizontalMove = Math.abs(moveDistance) >= Math.abs(moveY);
			}
			// 用户非水平滑动屏幕
			if (!this.horizontalMove) {
				return;
			}
			const translate = this.ocTranslatex + moveDistance;
			// 正常触摸应该移动的距离
			let finalTranslate = translate;
			// 考虑 loop 的取值时
			if (!this.loop) {
				const leftBoundary = 0;
				const rightBoundary = -this.width * (this.length - 1);
				if (translate > leftBoundary) { // 左边界
					finalTranslate = leftBoundary;
				} else if (translate < rightBoundary) { // 右边界
					finalTranslate = rightBoundary;
				}
			}
			this.setTranslate(finalTranslate);
		},
		handleTouchend(e) {
			this.$emit('onTouchEnd');
			if (this.length <= 1 || this.animating) return;
			if (!this.horizontalMove) return;
			const isQuick = new Date().getTime() - this.touchStartTime < this.quickTouchTime;
			if (this.loop) {
				// 如果是 loop 的话，有很多地方需要特殊处理
				this.handleTouchend_loop(this.cartChange(this.moveDistance, isQuick));
			} else {
				// 根据轮播图滑动的方向来改变 realIndex
				this.updateInsideValue(this.cartChange(this.moveDistance, isQuick));
			}
			// reset some data
			this.moveDistance = 0;
			// 滑动结束，开启自动轮播
			this.autoChange();
		},
		// 考虑 this.loop 的取值对 translate 的影响
		handleTouchend_loop(deviation) {
			if (!this.loop) return;
			const newValue = this.realIndex + deviation;
			// left boundary
			if (this.realIndex === 0 && newValue < this.realIndex) {
				this.setTranslate((-this.width * this.length) + this.moveDistance);
				setTimeout(() => {
					this.updateInsideValue(deviation);
				}, 40);
				return;
			}
			// right boundary
			if (this.realIndex === this.length - 1 && newValue > this.realIndex) {
				this.setTranslate(this.width + this.moveDistance);
				setTimeout(() => {
					this.updateInsideValue(deviation);
				}, 40);
				return;
			}
			this.updateInsideValue(deviation);
		},
		/**
		 *  根据传入的差值来正确的更新 realIndex
		 *  @param  {number} deviation value 改变的差值
		 */
		updateInsideValue(deviation) {
			// 因为滑动后如果没有翻页成功，是无法改变 realIndex 的值的，所以需要手动触发 handler
			if (deviation === 0) {
				this.isRealIndexChange = false;
				this.valueChangeHandler(deviation);
				return;
			}
			// 新的 insidevalue 值应该是现在 realIndex 的值 和 改变的差值的和
			const newValue = this.realIndex + deviation;
			this.isRealIndexChange = true;
			// 按顺序查看是否满足处理数据的要求，如果不满足则交给下一个函数处理
			const chain = this.chain(
				// 是否是 loop
				this.updateInsideValue_loop,
				// 什么特殊的设置都没有
				this.updateInsideValue_normal,
				// 通过更新 realIndex 来触发 valueChangeHandler
				newValue => { this.realIndex = newValue; },
			);
			chain(newValue);
		},
		// 当考虑到 loop 的情况时
		updateInsideValue_loop(newValue) {
			if (!this.loop) return false;
			this.isRealIndexChange = true;
			if (newValue < 0) {
				this.realIndex = this.length - 1;
				return 'done';
			}
			if (newValue > this.length - 1) {
				this.realIndex = 0;
				return 'done';
			}
			return false;
		},
		// 普通状态下， loop === false
		updateInsideValue_normal(newValue) {
			if (newValue < 0) {
				this.realIndex = 0;
				this.isRealIndexChange = false;
				// 因为这时候 realIndex 的值其实没变，所以需要手动触发 valueChangeHandler
				this.valueChangeHandler(0);
				return 'done';
			}
			if (newValue > this.length - 1) {
				this.realIndex = this.length - 1;
				this.isRealIndexChange = false;
				// 因为这时候 realIndex 的值其实没变，所以需要手动触发 valueChangeHandler
				this.valueChangeHandler(this.length - 1);
				return 'done';
			}
			this.isRealIndexChange = true;
			return false;
		},
		cartChange(moveDistance, quick) {
			const absMove = Math.abs(moveDistance);
			const absMin = Math.abs(this.ocMinMoveDistance);
			// 策略组
			const strategies = {
				// 普通滑动
				normal() {
					if (absMove < absMin) return 0;
					if (moveDistance > 0) return -1;
					if (moveDistance < 0) return 1;
					return 0;
				},
				// 快速滑动
				quick() {
					if (absMove < 10) return 0;
					if (moveDistance > 0) return -1;
					if (moveDistance < 0) return 1;
					return 0;
				},
			};
			let stgy = 'normal';
			// 当前策略
			switch (true) {
				case (quick === true):
					stgy = 'quick';
					break;
				default:
					stgy = 'normal';
					break;
			}
			return strategies[stgy].apply(this);
		},
		valueChangeHandler(value) {
			// 添加过渡效果
			this.duration();
			this.setTranslate(this.ocTranslatex);
		},
		// 自动轮播
		autoChange() {
			this.autoplayTimer && clearTimeout(this.autoplayTimer);
			const timer = () => {
				if (typeof this.autoplayTime !== 'number' || this.autoplayTime <= 0 || this.length <= 1) return;
				this.autoplayTimer = setTimeout(() => {
					this.autoChangeHandler();
					timer();
				}, this.autoplayTime);
			};
			timer();
		},
		autoChangeHandler() {
			this.isRealIndexChange = true;
			// 如果是右边界，则先移动到左边被 copy 的相同的元素
			if (this.ocIsEnd) {
				this.setTranslate(this.width);
			}
			// 如果不延迟 40 ms 的话，在 setTranslate 的时候，就会触发 transition 效果，这是不想要的。
			setTimeout(() => {
				this.realIndex = this.realIndex < this.length - 1 ?
					this.realIndex + 1 :
					0;
			}, 40);
		},
		/**
		 *  惰性函数，设置 dom 的 translate 值
		 *  @param  {dom}            el       进行变换的元素
		 *  @param  {number|string}  trans    进行变换的值
		 */
		setTranslate(d) {
			let transform = `translate3d(${d}px, 0, 0)`;
			this.$refs.wrapper.style.webkitTransform = transform;
			this.$refs.wrapper.style.transform = transform;
		},
		/**
		 *  添加和删除过渡效果
		 *  @param  {Array} args 需要添加过渡动画的元素数组
		 */
		duration() {
			this.animating = true;
			// 回调函数，swiper从当前slide开始过渡到另一个slide时执行。
			if (this.isRealIndexChange) {
				this.$emit('slideChangeTransitionStart', this.realIndex);
			}
			const el = this.$refs.wrapper;
			const speed = this.speed;
			el.style.webkitTransitionDuration = `${speed}ms`;
			el.style.transitionDuration = `${speed}ms`;
			el.style.webkitTransitionTimingFunction = 'ease-out';
			el.style.transitionTimingFunction = 'ease-out';
			// 添加过渡效果
			this.durationTimer && clearTimeout(this.durationTimer);
			this.durationTimer = setTimeout(() => {
				el.style.transitionDuration = '';
				el.style.webkitTransitionDuration = '';
				this.animating = false;
				// 回调函数，swiper从一个slide过渡到另一个slide结束时执行。
				if (this.isRealIndexChange) {
					this.$emit('slideChangeTransitionEnd', this.realIndex);
				}
			}, speed);
		},
		// 职责链，函数 return false 则终止传递
		chain(...fns) {
			return (...args) => {
				for (let index = 0; index < fns.length; index += 1) {
					const result = fns[index](...args);
					if (result === 'done') break;
				}
			};
		},
	},
};
</script>
