<script setup>
import { computed, toRefs } from "vue";

const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
});

const { peek, pictureId, solved } = toRefs(props.card);

const styleOverride = computed(() => {
  if (solved.value) {
    return {
      "background-image": `url("${pictureId.value}.jpg")`,
      "background-size": "cover",
      "border-color": "green",
    };
  } else if (peek.value) {
    return {
      "background-image": `url("${pictureId.value}m.jpg")`,
      "background-size": "cover",
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
  background-image: url("./linksoft-pexeso/background.jpg");
  background-size: cover;
}
</style>
