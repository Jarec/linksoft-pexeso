<script setup>
import { computed } from "vue";

const props = defineProps({
  peek: {
    type: Boolean,
    required: true,
  },
  solved: {
    type: Boolean,
    required: true,
  },
  pictureId: {
    type: String,
    required: true,
  },
});

// style override for solved or peeked cards
const styleOverride = computed(() => {
  if (props.solved) {
    return {
      "background-image": `url("${props.pictureId}m.jpg")`,
      "border-color": "green",
      transform: "rotateY(180deg)",
    };
  } else if (props.peek) {
    return {
      "background-image": `url("${props.pictureId}m.jpg")`,
      "border-color": "red",
      transition: "all 0.4s ease",
      transform: "rotateY(180deg)",
    };
  } else {
    return {};
  }
});
</script>

<template>
  <div class="card" :style="styleOverride" />
</template>

<style scoped>
.card {
  width: 100%;
  aspect-ratio: 1;
  border: 2px solid black;
  border-radius: 5px;
  background-image: url("/linksoft-pexeso/background.jpg");
  background-size: cover;
}
</style>
