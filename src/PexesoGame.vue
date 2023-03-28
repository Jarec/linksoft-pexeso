<script setup>
import PexesoCard from "@/PexesoCard.vue";
import { computed, onMounted, ref, defineProps } from "vue";
import { useWindowSize } from "@vueuse/core";
import { joinGame, move, startNewGame, url } from "@/api";
import router from "@/router";

const props = defineProps({
  pexesoId: {
    type: String,
    required: false,
  },
});

const cards = ref([]);
const scores = ref([]);
const gameId = ref(null);
const currentPlayer = ref(null);

const peek = (card) => {
  const player = JSON.parse(localStorage.getItem("player"));
  if (player.playerId !== currentPlayer.value.playerId) {
    console.log("not your turn");
    return;
  }
  if (card.solved || card.peek) {
    console.log("card already solved or peeked");
    return;
  }
  move(gameId.value, { card: { ...card, peek: true } }, player);
};

const { width, height } = useWindowSize();
const adjustedWidth = computed(
  () => Math.min(width.value - 20, height.value - 100) + "px"
);

const updateCard = (card) => {
  const index = cards.value.findIndex((c) => c.key === card.key);
  if (index === -1) {
    cards.value = [...cards.value, card];
  } else {
    cards.value = [
      ...cards.value.slice(0, index),
      { ...card },
      ...cards.value.slice(index + 1),
    ];
  }
};

let initialCopyButton = " Copy ";
const copyButton = ref(initialCopyButton);

const copyGameId = () => {
  const { fullPath } = router.resolve({
    path: "/",
    query: { pexesoId: gameId.value },
  });
  let hashIndex = window.location.href.lastIndexOf("#");
  navigator.clipboard.writeText(
    window.location.href.substring(0, hashIndex) + "#" + fullPath
  );
  copyButton.value = "Copied";
  setTimeout(() => {
    copyButton.value = initialCopyButton;
  }, 1000);
};

onMounted(async () => {
  const player = JSON.parse(localStorage.getItem("player"));
  let gameData;

  // if pexesoId is not set, start new game, otherwise join existing game
  if (props.pexesoId == null) {
    let { data } = await startNewGame(player);
    gameData = data;
    gameId.value = data.pexesoId;
  } else {
    let { data } = await joinGame(player, props.pexesoId);
    gameData = data;
    gameId.value = props.pexesoId;
  }

  // set initial game data
  cards.value = gameData.cards;
  scores.value = gameData.players;
  currentPlayer.value = gameData.currentPlayer;

  // listen for updates
  new EventSource(`${url}/pexeso/${gameId.value}/move`).addEventListener(
    "message",
    (event) => {
      const data = JSON.parse(event.data);
      console.log("data", data);
      data.cardUpdates?.forEach((card) => updateCard(card));
      scores.value = data.scores;
      currentPlayer.value = data.nextPlayer;
    }
  );
});
</script>

<template>
  <div class="app">
    <div class="header">
      <div class="control">
        {{ gameId }}
        <button @click="copyGameId" style="text-align: center; width: 80px">
          {{ copyButton }}
        </button>
      </div>
      <div>
        <a
          href="https://www.linksoft.eu/?utm_source=referral&utm_medium=logo&utm_campaign=pexeso"
        >
          <img src="/linksoft_logo.png" alt="LinkSoft" class="logo" />
        </a>
      </div>
      <div class="score">
        <span class="attempts">Player: {{ currentPlayer?.name }}</span>
      </div>
    </div>
    <div class="main">
      <pexeso-card
        v-for="card in cards"
        :key="card.key"
        :peek="card.peek"
        :solved="card.solved"
        :picture-id="card.pictureId"
        @click="() => peek(card)"
      >
      </pexeso-card>
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

.logo {
  height: 50px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.score {
  font-family: "Open Sans", serif;
  color: #113359;
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 5px;
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
