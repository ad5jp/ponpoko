<script lang="ts">
  export default {
    name: "TheHomeSettlement"
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

  // 次の年度へ
  const nextYear = () => {
    if (
      (gameState.value.mode === "real" && gameState.value.year === 5) ||
      (gameState.value.mode === "easy" && gameState.value.year === 3) ||
      (gameState.value.mode === "practice" && gameState.value.year === 2)
    ) {
      // 5年目で終了（EASYは3年・PRACTICEは2年）
      store.commit("gameState/toScene", "finish");
      emit("close");
    } else {
      fireEvents();
      store.commit("gameState/nextMonth");
      store.commit("gameState/toScene", "decision");
      emit("close");
    }
  };
</script>

<template>
  <main class="scene-result">
    <h2 class="result-title">決算（{{ gameState.year }}年目）</h2>

    <SettlementTable :settlement="gameState.yearly_settlement" />

    <button @click="nextYear" class="result-button">確認</button>
  </main>
</template>
