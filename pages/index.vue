<template>
  <Slider :autoplay="true" :autoplayDelay="5000" />
</template>

<script>
import Slider from '@/components/Slider.vue';

export default {
  components: {
    Slider,
  },
};
</script>