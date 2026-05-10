<script lang="ts">
  export default {
    name: "TheHomeResult"
  };
</script>

<script setup lang="ts">
  import { store } from "@/store";
  import { computed } from "vue";
  import fireEvents from "@/logics/fireEvents";
  import SettlementTable from "./SettlementTable.vue";

  const emit = defineEmits(["close"]);

  const gameState = computed(() => {
    return store.state.gameState;
  });

  const nextMonth = () => {
    if (gameState.value.cash < 0) {
      // 現金がマイナスになったらゲームオーバー
      store.commit("gameState/toScene", "game_over");
      emit("close");
    } else if (gameState.value.month === 3) {
      // 3月なら決算へ
      store.commit("gameState/toScene", "settlement");
      emit("close");
    } else {
      // 3月以外は次の月へ
      fireEvents();
      store.commit("gameState/nextMonth");
      store.commit("gameState/toScene", "decision");
      emit("close");
    }
  };
</script>

<template>
  <main class="scene-result">
    <h2 class="result-title">今月の結果</h2>

    <SettlementTable :settlement="gameState.monthly_settlement" />

    <button @click="nextMonth" class="result-button">確認</button>
  </main>
</template>
