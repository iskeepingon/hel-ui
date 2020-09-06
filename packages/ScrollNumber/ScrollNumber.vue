<template>
	<div class="oc-scroll-number">
		<template v-for="(item,index) in numbers" >
			<ScrollNumberItem
				:key="`scroll_number_${index}`"
				:speedMode="speedMode"
				:preNum="item.preNum"
				:duration="duration"
				:singleLasting="singleLasting"
				:firstScroll="firstScroll"
				:singleDirection="singleDirection"
				:from="item.from"
				:to="item.to" />
		</template>
	</div>
</template>

<script>
import ScrollNumberItem from './ScrollNumberItem.vue';

export default {
	name: 'OcScrollNumber',
	components: {
		ScrollNumberItem
	},
	props: {
		original: {
			default: '0',
			type: [String, Number]
		},
		current: {
			required: true,
			default: 0,
			type: [Number, String]
		},
		speedMode: {
			type: String,
			default: 'duration'
		},
		singleLasting: {
			type: Number
		},
		duration: {
			type: Number
		},
		// 是否为一个整体
		// 一个整体当十位改变个位就算没变也会滚动
		isWhole: {
			type: Boolean,
			default: true
		},
		firstScroll: {
			type: Boolean,
			default: true
		},
		// 初始化滚动时是否都向下滚动
		singleDirection: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			numbers: []
		};
	},
	computed: {
		toArr() {
			return (this.current + '').split('');
		}
	},
	watch: {
		toArr: {
			handler(val, oldVal) {
				let preNum = '';
				let newNum = val.map((to, index) => {
					const fromArr = this.original ? this.original.toString().split('') : [];
					const lenGap = val.length - fromArr.length > 0 ? val.length - fromArr.length : 0;
					const from = oldVal ? (Number(oldVal[index]) || 0) : (fromArr[index - lenGap] ? (Number(fromArr[index - lenGap]) || 0) : 0);
					let item;
					if(this.isWhole) {
						item =  {
							from,
							to,
							preNum
						};
					} else {
						item = {
							from,
							to
						};
					}
					preNum += to;
					return item;
				});
				this.numbers.splice(0);
				this.numbers.push(...newNum);
			},
			immediate: true
		}
	},
	methods: {
		startScroll() {
			this.$children.forEach(item => {
				item.restartScroll();
			});
		}
	}
};
</script>
