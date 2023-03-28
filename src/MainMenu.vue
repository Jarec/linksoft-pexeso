<template>
  <div class="main">
    <div class="header">
      <a
        href="https://www.linksoft.eu/?utm_source=referral&utm_medium=logo&utm_campaign=pexeso"
      >
        <img src="/linksoft_logo.png" alt="LinkSoft" class="logo" />
      </a>
    </div>
    <div class="controls">
      <input type="text" placeholder="Enter your name" v-model="name" />
      <button :disabled="startDisabled" @click="startGame">
        Start New Game
      </button>
      <input type="text" placeholder="Enter game code" v-model="gameCode" />
      <button :disabled="joinDisabled" @click="joinGame">Join Game</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const playerId = ref(null);
const name = ref("");
const gameCode = ref("");
const startDisabled = computed(() => !name.value || gameCode.value);
const joinDisabled = computed(() => !gameCode.value || !name.value);

const props = defineProps({
  pexesoId: { type: String, default: null },
});

const savePlayer = () => {
  if (!playerId.value) {
    playerId.value = Math.random().toString(36).substring(2, 9);
  }
  localStorage.setItem(
    "player",
    JSON.stringify({ name: name.value, playerId: playerId.value })
  );
};

const router = useRouter();
const startGame = () => {
  savePlayer();
  router.push("/pexeso");
};

const joinGame = () => {
  savePlayer();
  router.push(`/pexeso/${gameCode.value}`);
};

onMounted(() => {
  const player = localStorage.getItem("player");
  gameCode.value = props.pexesoId;
  if (player) {
    const playerObj = JSON.parse(player);
    name.value = playerObj.name;
    playerId.value = playerObj.playerId;
  }
});
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.controls > * {
  width: 200px;
  padding: 10px;
  margin: 10px;
}

.logo {
  height: 50px;
}
</style>
