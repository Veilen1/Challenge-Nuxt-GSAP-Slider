<template>
  <div class="slider" :style="backgroundStyle">
    <div class="slides">
      <div v-for="(slide, index) in localSlides" :key="index" class="slide" :class="{ active: index === activeSlide }">
        <div v-if="slide.media && slide.media.type === 'image'" class="media">
          <img :src="slide.media.src" :alt="slide.title" />
        </div>
        <div v-else-if="slide.media && slide.media.type === 'video'" class="media">
          <video :src="slide.media.src" autoplay loop muted></video>
        </div>
        <h2 class="slide-title">{{ slide.title }}</h2>
      </div>
    </div>
    <button class="prev" @click="prevSlide">
      <img :src="prevSlideImage" alt="Previous" />
    </button>
    <button class="next" @click="nextSlide">
      <img :src="nextSlideImage" alt="Next" />
    </button>
  </div>
</template>

<script>
import { gsap } from 'gsap';

export default {
  props: {
    slidesData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeSlide: 0,
      autoplayInterval: null,
      localSlides: [],
      loop: true,
      autoplay: true,
      autoplayDelay: 3000,
    };
  },
  computed: {
    backgroundStyle() {
      const activeSlide = this.localSlides[this.activeSlide];
      if (activeSlide && activeSlide.media && activeSlide.media.type === 'image') {
        return {
          backgroundImage: `url(${activeSlide.media.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      } else {
        return {
          background: '#000', // Default background for videos
        };
      }
    },
    prevSlideImage() {
      const prevIndex = (this.activeSlide - 1 + this.localSlides.length) % this.localSlides.length;
      return this.localSlides[prevIndex].media.src;
    },
    nextSlideImage() {
      const nextIndex = (this.activeSlide + 1) % this.localSlides.length;
      return this.localSlides[nextIndex].media.src;
    },
  },
  methods: {
    isImage(media) {
      return media && media.type === 'image';
    },
    prevSlide() {
      const previousSlide = this.activeSlide;
      this.activeSlide = (this.activeSlide - 1 + this.localSlides.length) % this.localSlides.length;
      this.animateSlide(previousSlide, this.activeSlide);
    },
    nextSlide() {
      const previousSlide = this.activeSlide;
      this.activeSlide = (this.activeSlide + 1) % this.localSlides.length;
      this.animateSlide(previousSlide, this.activeSlide);
    },
    animateSlide(fromIndex, toIndex) {
      const slides = this.$el.querySelectorAll('.slide');
      const fromSlide = slides[fromIndex];
      const toSlide = slides[toIndex];

      gsap.timeline()
        .set(toSlide, { opacity: 0, display: 'block' })
        .to(fromSlide, { opacity: 0, duration: 0.25 })
        .to(toSlide, { opacity: 1, duration: 0.25 })
        .set(fromSlide, { display: 'none' });
    },
    ensureMinimumSlides() {
      while (this.localSlides.length < 3) {
        this.localSlides = [...this.localSlides, ...this.localSlides].slice(0, 3);
      }
    },
    startAutoplay() {
      if (this.autoplay) {
        this.autoplayInterval = setInterval(() => {
          this.nextSlide();
        }, this.autoplayDelay);
      }
    },
    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    },
  },
  created() {
    this.localSlides = [...this.slidesData];
    this.ensureMinimumSlides();
  },
  mounted() {
    const slides = this.$el.querySelectorAll('.slide');
    slides[this.activeSlide].style.display = 'block';
    this.startAutoplay();
  },
  beforeDestroy() {
    this.stopAutoplay();
  },
  watch: {
    autoplay(newVal) {
      if (newVal) {
        this.startAutoplay();
      } else {
        this.stopAutoplay();
      }
    },
  },
};
</script>

<style scoped>
.slider {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #121212;
  color: #ffffff;
}

.slides {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.slide {
  min-width: 100%;
  box-sizing: border-box;
  display: none;
  text-align: center;
}

.media {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.media img,
.media video {
  max-width: 100%;
  max-height: 100%;
}

.slide-title {
  margin-top: 20px;
  font-size: 24px;
  color: #ffffff;
}

button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

button.prev {
  left: 10px;
}

button.next {
  right: 10px;
}

button img {
  width: 200px;
  height: auto;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .media {
    height: 300px;
  }

  .slide-title {
    font-size: 20px;
  }

  button {
    padding: 5px;
  }

  button img {
    width: 30px;
  }
}

@media (max-width: 480px) {
  .media {
    height: 200px;
  }

  .slide-title {
    font-size: 16px;
  }

  button {
    padding: 3px;
  }

  button img {
    width: 20px;
  }
}
</style>