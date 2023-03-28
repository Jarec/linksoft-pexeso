import axios from "axios";

export const url = "https://api.linksoft-pexeso.click";

axios.defaults.baseURL = url;

export function startNewGame(player) {
  return axios.post("/pexeso", player);
}

export function joinGame(player, pexesoId) {
  return axios.post(`/pexeso/${encodeURIComponent(pexesoId)}/player`, player);
}

export function move(pexesoId, move, player) {
  return axios.post(`/pexeso/${encodeURIComponent(pexesoId)}/move`, {
    ...move,
    player,
  });
}
