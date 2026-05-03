<script lang="ts">
  export default {
    name: "TheHome"
  };
</script>

<script setup lang="ts">
  import { computed, Ref, ref } from "vue";
  import { store } from "@/store";
  import { Dialog } from "@/store/game-state";
  import { Action, newDecision, Decision } from "@/models/Decision";
  import makeDecisions from "@/logics/makeDecisions";

  const gameState = computed(() => {
    return store.state.gameState;
  });

  const dialogs: Ref<Dialog[]> = computed(() => {
    return store.getters["gameState/dialogs"] ?? [];
  });

  const newPlayerName = ref("ぽん");
  const dialog_step = ref(0);
  const decisions: Ref<Decision[]> = ref([]);
  const decision_step = ref(0);
  const decision_action: Ref<Action | null> = ref(null);
  const decision_purchase_count = ref(5);
  const decision_sale_price = ref(40);
  const decision_produce_count = ref(5);

  const startNewGame = () => {
    store.commit("gameState/startNewGame", {
      playerName: newPlayerName.value,
      mode: "easy"
    });
    dialog_step.value = 0;
  };

  const decidePurchase = () => {
    decisions.value.push(
      newDecision({
        action: "purchase",
        purchase_count: decision_purchase_count.value
      })
    );

    nextDecision();
  };

  const decideSale = () => {
    decisions.value.push(
      newDecision({
        action: "sale",
        sale_price: decision_sale_price.value
      })
    );

    nextDecision();
  };

  const decideProduce = () => {
    decisions.value.push(
      newDecision({
        action: "produce",
        produce_count: decision_produce_count.value
      })
    );

    nextDecision();
  };

  const nextDecision = () => {
    decision_step.value++;
    decision_action.value = null;

    if (decision_step.value === gameState.value.staffs.length) {
      makeDecisions(decisions.value);
      decision_step.value = 0;
      decisions.value = [];
      dialog_step.value = 0;
    }
  };

  const nextMonth = () => {
    // TODO イベントとか起こす
    store.commit("gameState/nextMonth");
    store.commit("gameState/toScene", "decision");
  };

  const nextDialog = () => {
    dialog_step.value++;
  };
</script>

<template>
  <header>ぽんぽこ</header>
  {{ gameState.month }}月 ({{ gameState.year }}年目)<br />
  材料: {{ gameState.material }}個<br />
  商品: {{ gameState.product }}個<br />
  お金: {{ gameState.cash }}ドングリ<br />

  <main v-if="dialog_step < dialogs.length">
    <p>「{{ dialogs[dialog_step].message }}」</p>
    <button @click="nextDialog">次へ</button>
  </main>

  <main v-else-if="gameState.scene === 'start'">
    <input type="text" v-model="newPlayerName" />
    <button @click="startNewGame">ゲーム開始</button>
  </main>

  <main v-else-if="gameState.scene === 'decision'">
    <template v-if="decision_action === null">
      <p>{{ gameState.staffs[decision_step]?.name }}さんは、今月は何をしますか？</p>
      <button @click="decision_action = 'purchase'">材料を買う</button>
      <button @click="decision_action = 'sale'" :disabled="gameState.product === 0">商品を売る</button>
      <button @click="decision_action = 'produce'" :disabled="gameState.material === 0">商品を作る</button>
    </template>
    <template v-if="decision_action == 'purchase'">
      <p>現在の材料価格は 10ドングリです。何個買いますか？</p>
      <input type="number" v-model="decision_purchase_count" />
      <button @click="decidePurchase">決定</button>
    </template>
    <template v-if="decision_action == 'sale'">
      <p>いくらで売りますか？</p>
      <input type="number" v-model="decision_sale_price" />
      <button @click="decideSale">決定</button>
    </template>
    <template v-if="decision_action == 'produce'">
      <p>何個作りますか？</p>
      <input type="number" v-model="decision_produce_count" />
      <button @click="decideProduce">決定</button>
    </template>
  </main>

  <main v-else-if="gameState.scene === 'result'">
    <p>りざると</p>
    {{ gameState.results }}
    <button @click="nextMonth">次へ</button>
  </main>
</template>

<style scoped></style>
