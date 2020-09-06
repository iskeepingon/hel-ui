<template>
	<div class="oc-swiper-item" @click="clickSlide">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'OcSwiperSlide',
	mounted() {
		this.$parent.init();
  },
  methods: {
    clickSlide() {
      this.$emit('click');
    }
  }
};
</script>
