<template>
  <div class="slider" @click="handleSliderClick">
    <div class="slider-title" ref="sliderTitle">
      <h1 v-if="activeSlide">{{ activeSlide.name }}</h1>
    </div>
    <div class="slider-counter">
      <p><span>{{ activeSlideIndex }}</span> / {{ totalSlides }}</p>
    </div>
    <div class="slider-items">
      <p v-for="(item, index) in sliderContent" :key="index" :class="{ activeItem: index + 1 === activeSlideIndex }" @click="handleNumberClick(index + 1)">
        {{ index + 1 }}
      </p>
    </div>
    <div class="slider-preview" ref="sliderPreview"></div>
    <div class="slider-items-container">
      <div
        v-for="(content, index) in sliderContent"
        :key="index"
        :class="['slide-container', { active: index + 1 === activeSlideIndex, prev: index + 1 === getSlideIndex(-1), next: index + 1 === getSlideIndex(1) }]"
        ref="el => slides.value[index] = el"
      >
        <div class="slide-img">
          <img :src="content.img" :alt="content.name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, nextTick } from 'vue';
import { gsap } from 'gsap';
import CustomEase from 'gsap/CustomEase';

// Importa las imágenes
import img1 from '@/static/images/img1.jpg';
import img2 from '@/static/images/img2.jpg';
import img3 from '@/static/images/img3.jpg';
import img4 from '@/static/images/img4.jpg';
import img5 from '@/static/images/img5.jpg';
import img6 from '@/static/images/img6.jpg';
import img7 from '@/static/images/img7.jpg';

export default {
  name: 'Slider',
  setup() {
    const sliderTitle = ref(null);
    const sliderPreview = ref(null);
    const slides = ref([]);
    const totalSlides = 7;
    const activeSlideIndex = ref(1);
    const isAnimating = ref(false);

    const sliderContent = [
      { name: "Serene Space", img: img1 },
      { name: "Gentle Horizon", img: img2 },
      { name: "Quiet Flow", img: img3 },
      { name: "Ethereal Light", img: img4 },
      { name: "Calm Drift", img: img5 },
      { name: "Subtle Balance", img: img6 },
      { name: "Soft Whisper", img: img7 },
    ];

    const clipPath = {
      closed: "polygon(25% 30%, 75% 30%, 75% 70%, 25% 70%)",
      open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    };

    const slidePositions = {
      prev: { left: "15%", rotation: -90 },
      active: { left: "50%", rotation: 0 },
      next: { left: "85%", rotation: 90 },
    };

    const getSlideIndex = (increment) => {
      return ((activeSlideIndex.value + increment - 1 + totalSlides) % totalSlides) + 1;
    };

    const updateCounterAndHighlight = (index) => {
      activeSlideIndex.value = index;
      slides.value.forEach((item, i) => {
        item.classList.toggle("activeItem", i === index - 1);
      });
    };

    const updatePreviewImage = (content) => {
      const newImage = document.createElement("img");
      newImage.src = content.img;
      newImage.alt = content.name;
      sliderPreview.value.appendChild(newImage);

      gsap.fromTo(
        newImage,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.inOut",
          delay: 0.5,
          onComplete: () => sliderPreview.value.querySelector("img:not(:last-child)")?.remove(),
        }
      );
    };

    const animateSlide = (slide, props) => {
      gsap.to(slide, { ...props, duration: 2, ease: "hop" });
      gsap.to(slide.querySelector(".slide-img"), {
        rotation: -props.rotation,
        duration: 2,
        ease: "hop",
      });
    };

    const transitionSlides = (direction) => {
      if (isAnimating.value) return;
      isAnimating.value = true;

      const [outgoingPos, incomingPos] = direction === "next" ? ["prev", "next"] : ["next", "prev"];

      const outgoingSlide = slides.value.find(slide => slide.classList.contains(outgoingPos));
      const activeSlide = slides.value.find(slide => slide.classList.contains("active"));
      const incomingSlide = slides.value.find(slide => slide.classList.contains(incomingPos));

      animateSlide(incomingSlide, {
        ...slidePositions.active,
        clipPath: clipPath.open,
      });
      animateSlide(activeSlide, {
        ...slidePositions[outgoingPos],
        clipPath: clipPath.closed,
      });
      gsap.to(outgoingSlide, { scale: 0.5, opacity: 0.5, duration: 2, ease: "hop" });

      const newSlideIndex = getSlideIndex(direction === "next" ? 2 : -2);
      const newSlide = createSlide(sliderContent[newSlideIndex - 1], incomingPos);
      slides.value.push(newSlide);
      gsap.set(newSlide, {
        ...slidePositions[incomingPos],
        xPercent: -50,
        yPercent: -50,
        scale: 0.5,
        opacity: 0.5,
        clipPath: clipPath.closed,
      });
      gsap.to(newSlide, { scale: 1, opacity: 1, duration: 2, ease: "hop" });

      const nextActiveIndex = getSlideIndex(direction === "next" ? 1 : -1);
      createAndAnimateTitle(sliderContent[nextActiveIndex - 1], direction);
      updatePreviewImage(sliderContent[nextActiveIndex - 1]);

      setTimeout(() => updateCounterAndHighlight(nextActiveIndex), 1000);

      setTimeout(() => {
        activeSlide.className = `slide-container ${outgoingPos}`;
        incomingSlide.className = "slide-container active";
        activeSlideIndex.value = nextActiveIndex;
        isAnimating.value = false;
      }, 2000);
    };

    const handleSliderClick = (e) => {
      const clickedSlide = e.target.closest(".slide-container");
      if (clickedSlide && !isAnimating.value) {
        transitionSlides(clickedSlide.classList.contains("next") ? "next" : "prev");
      }
    };

    const handleNumberClick = (index) => {
      if (index !== activeSlideIndex.value && !isAnimating.value) {
        transitionSlides(index > activeSlideIndex.value ? "next" : "prev");
      }
    };

    const createSlide = (content, className) => {
      const slide = document.createElement("div");
      slide.className = `slide-container ${className}`;
      slide.innerHTML = `<div class="slide-img"><img src="${content.img}" alt="${content.name}"></div>`;
      return slide;
    };

    const createAndAnimateTitle = (content, direction) => {
      const newTitle = document.createElement("h1");
      newTitle.innerText = content.name;
      sliderTitle.value.appendChild(newTitle);
      splitTextIntoSpans(newTitle);

      const yOffset = direction === "next" ? 60 : -60;
      gsap.set(newTitle.querySelectorAll("span"), { y: yOffset });
      gsap.to(newTitle.querySelectorAll("span"), {
        y: 0,
        duration: 1.25,
        stagger: 0.02,
        ease: "hop",
        delay: 0.25,
      });

      const currentTitle = sliderTitle.value.querySelector("h1:not(:last-child)");
      if (currentTitle) {
        gsap.to(currentTitle.querySelectorAll("span"), {
          y: -yOffset,
          duration: 1.25,
          stagger: 0.02,
          ease: "hop",
          delay: 0.25,
          onComplete: () => currentTitle.remove(),
        });
      }
    };

    const splitTextIntoSpans = (element) => {
      element.innerHTML = element.innerText
        .split("")
        .map((char) => `<span>${char === " " ? "&nbsp;&nbsp;" : char}</span>`)
        .join("");
    };

    onMounted(async () => {
      console.log('Component mounted');
      console.log('Slider content:', sliderContent);
      console.log('Slider container:', document.querySelector('.slider'));
      gsap.registerPlugin(CustomEase);
      CustomEase.create(
        "hop",
        "M0,0 C0.488,0.02 0.467,0.286 0.5,0.5 0.532,0.712 0.58,1 1,1"
      );

      await nextTick();

      slides.value = Array.from(document.querySelectorAll('.slide-container'));

      Object.entries(slidePositions).forEach(([key, value]) => {
        gsap.set(`.slide-container.${key}`, {
          ...value,
          xPercent: -50,
          yPercent: -50,
          clipPath: key === "active" ? clipPath.open : clipPath.closed,
        });
        if (key !== "active") {
          gsap.set(`.slide-container.${key} .slide-img`, {
            rotation: -value.rotation,
          });
        }
      });

      if (sliderTitle.value) {
        const initialTitle = sliderTitle.value.querySelector("h1");
        splitTextIntoSpans(initialTitle);
        gsap.fromTo(
          initialTitle.querySelectorAll("span"),
          { y: 60 },
          { y: 0, duration: 1, stagger: 0.02, ease: "hop" }
        );
      }

      updateCounterAndHighlight(activeSlideIndex.value);

      slides.value.forEach((item, index) => {
        item.addEventListener("click", () => {
          if (index + 1 !== activeSlideIndex.value && !isAnimating.value) {
            transitionSlides(index + 1 > activeSlideIndex.value ? "next" : "prev");
          }
        });
      });
    });

    return {
      sliderTitle,
      sliderPreview,
      slides,
      totalSlides,
      activeSlideIndex,
      sliderContent,
      handleSliderClick,
      handleNumberClick,
      getSlideIndex,
    };
  },
  computed: {
    activeSlide() {
      return this.sliderContent[this.activeSlideIndex - 1];
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  font-family: "PP Neue Montreal", sans-serif;
  background-color: #000000;
  color: #fff;
}

p,
a {
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  color: #363636;
  text-transform: uppercase;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

nav {
  position: absolute;
  width: 100%;
  padding: 2em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
}

nav a#logo {
  font-family: "Timmons NY 2.005";
  font-size: 40px;
  color: #303030;
}

.slider {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.slide-container {
  position: absolute;
  width: 30%;
  height: 70%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #000;
  cursor: pointer;
  will-change: transform, opacity, clip-path;
  z-index: 2;
  opacity: 0; /* Opacidad para los sliders que no son previos, activos o siguientes */
}

.slide-container.prev{
  opacity: 1; /* Opacidad para los sliders previos y siguientes */
  left: 15%;
}
.slide-container.next {
  opacity: 1; /* Opacidad para los sliders previos y siguientes */
  left: 85%;
}

.slide-container.active {
  opacity: 1; /* Opacidad completa para el slider activo */
  z-index: 99;
}

.slide-img {
  position: absolute;
  width: 100%;
  height: 100%;
  will-change: transform;

}
.slide-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  will-change: transform;
  max-width: 1000px;
}

.slide-img img {
  transform: scale(1.5);
  will-change: transform;
  z-index: 10;
}

.slider-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 60px;
  text-align: center;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  z-index: 10;
  opacity: 1;
}

.slider-title h1 {
  position: absolute;
  width: 100%;
  height: 50px;
  text-align: center;
  color: #fff;
  font-size: 50px;
  font-weight: 500;
}

.slider-title h1 span {
  position: relative;
  display: inline-block;
  transform: translateY(50px);
  will-change: transform;
}

.slider-counter {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 2.5em;
  text-align: center;
  z-index: 2;
}

slider-counter p {
  display: flex;
  gap: 1em;
  justify-content: center;
  color: #fff;
}

.slider-items {
  position: absolute;
  left: 2.5em;
  bottom: 2.5em;
  z-index: 2;
}

.slider-items p {
  transition: 0.5s color;
}

.slider-items p.activeItem {
  color: #fff;
}

.slider-preview {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 75%;
  margin: 0 auto;
  height: 100%;
  z-index: 0;
  opacity: 0.5;
  overflow: hidden;
}

.slider-preview img {
  position: absolute;
  top: 0;
  animation: pan 20s infinite linear;
  max-width: 50%;
  max-height: 50%;
}

@keyframes pan {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

footer {
  position: absolute;
  right: 2em;
  bottom: 2em;
  z-index: 10;
  text-align: right;
}

@media (max-width: 900px) {
  .slide-container {
    top: 75%;
    width: 70%;
    height: 50%;
  }

  .slider-preview {
    top: 0;
    left: 0;
    transform: translateX(0%);
    width: 100%;
    height: 100%;
  }
}
</style>