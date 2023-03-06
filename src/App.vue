<script setup>
import PexesoCard from "@/PexesoCard.vue";
import { computed, onMounted, ref } from "vue";
import { useWindowSize } from "@vueuse/core";

const { width, height } = useWindowSize();
const adjustedWidth = computed(
  () => Math.min(width.value - 20, height.value - 120) + "px"
);

const cards = ref([]);

function reset() {
  const pictureKeys = [
    "bagr",
    "brouk",
    "dum",
    "dvere",
    "flaska",
    "hrnicek",
    "kondom",
    "kouzelnik",
    "lod",
    "pes",
    "pivo",
    "pocitac",
    "ryba",
    "strom",
    "vitr",
    "vlasy",
    "wc",
    "zidle",
  ];

  const shuffleArray = (arr) =>
    arr
      .map((i) => ({ val: i, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map((i) => i.val);
  const generatedCards = [];
  for (let pictureKey of pictureKeys) {
    // add first picture from set
    let pictureCard = {
      key: crypto.randomUUID(),
      pictureKey: pictureKey,
      pictureId: pictureKey + "_1",
      solved: false,
      peek: false,
    };
    // add matching second picture
    generatedCards.push(pictureCard, {
      ...pictureCard,
      pictureId: pictureKey + "_2",
      key: crypto.randomUUID(),
    });
  }
  cards.value = shuffleArray(generatedCards);
}
const peekedCards = computed(() => cards.value.filter((i) => i.peek));

function peek(card) {
  if (card.peek || card.solved) {
    return;
  }

  // when we are already showing two cards then next peek will hide them
  if (peekedCards.value.length >= 2) {
    cards.value.forEach((i) => (i.peek = false));
  }

  card.peek = true;

  // if we peek two matching cards by pictureKey then mark them as solved
  if (
    peekedCards.value.length === 2 &&
    peekedCards.value[0].pictureKey === peekedCards.value[1].pictureKey
  ) {
    peekedCards.value.forEach((i) => (i.solved = true));
  }
}

onMounted(() => reset());
</script>

<template>
  <div class="app">
    <div class="control">
      <button @click="reset" style="text-align: right">Reset</button>
    </div>
    <div class="main">
      <pexeso-card
        v-for="card in cards"
        :key="card.key"
        :card="card"
        @click="() => peek(card)"
      >
      </pexeso-card>
    </div>
    <div class="footer">
      <hr />
      © 2023 LinkSoft
    </div>
  </div>
</template>

<style scoped>
.app {
  width: v-bind(adjustedWidth);
  /** centering */
  margin: 0 auto;
}

.main {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 6px;
}

.control {
  margin-bottom: 10px;
  text-align: right;
}

.footer {
  text-align: center;
}

.control button {
  cursor: pointer;
  outline: 0;
  color: #fff;
  background-color: #123054;
  border-color: #123054;
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  border: 1px solid transparent;
  padding: 6px 12px;
  font-size: 16px;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.control button:hover {
  color: #fff;
  background-color: #0b5ed7;
  border-color: #0a58ca;
}
</style>
