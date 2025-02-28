<template>
  <div>
    <h1>Slider</h1>
    <Slider :slidesData="slides" />
  </div>
</template>

<script>
import Slider from '~/components/Slider.vue';

export default {
  components: {
    Slider,
  },
  data() {
    return {
      slides: [
        {
          title: "Slider Title 01",
          media: {
            type: "image",
            src: "https://plus.unsplash.com/premium_photo-1668017178993-4c8fc9f59872?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            w: "1080",
            h: "1920",
          }
        },
        {
          title: "Slider Title 02",
          media: {
            type: "image",
            src: "https://plus.unsplash.com/premium_photo-1669748161444-953a1fcf8ceb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHxManQ3LWNYRjNmOHx8ZW58MHx8fHx8",
            w: "1080",
            h: "1920",
          }
        },
        {
          title: "Slider Title 03",
          media: {
            type: "image",
            src: "https://plus.unsplash.com/premium_photo-1710363128278-c698c412deeb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            w: "1920",
            h: "1080",
          }
        }
      ],
    };
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>