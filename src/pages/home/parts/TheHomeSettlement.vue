<script lang="ts">
  export default {
    name: "TheHomeSettlement"
  };
</script>

<script setup lang="ts">
  import { store } from "@/store";
  import { computed } from "vue";
  import { general_expense, gross_profit, net_assets, ordinary_income } from "@/logics/settle";
  import fireEvents from "@/logics/fireEvents";

  const emit = defineEmits(["close"]);

  const gameState = computed(() => {
    return store.state.gameState;
  });

  // 次の年度へ
  const nextMonth = () => {
    if (gameState.value.year === 5) {
      // 5年目で終了
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
    <h3 class="result-subtitle">売上・費用・利益（PL）</h3>
    <table class="result-table">
      <tbody>
        <tr class="highlight">
          <th>売上高</th>
          <td>{{ gameState.yearly_settlement.sales }}</td>
        </tr>
        <tr>
          <th>売上原価</th>
          <td>{{ gameState.yearly_settlement.sales_cost }}</td>
        </tr>
        <tr class="highlight">
          <th>粗利益</th>
          <td>{{ gross_profit(gameState.yearly_settlement) }}</td>
        </tr>
        <tr>
          <th>販管費</th>
          <td>{{ general_expense(gameState.yearly_settlement) }}</td>
        </tr>
        <tr>
          <th>特別損失</th>
          <td>{{ gameState.yearly_settlement.special_expense }}</td>
        </tr>
        <tr class="highlight">
          <th>経常利益</th>
          <td>{{ ordinary_income(gameState.yearly_settlement) }}</td>
        </tr>
      </tbody>
    </table>

    <h3 class="result-subtitle">販管費の内訳</h3>
    <table class="result-table">
      <tbody>
        <tr>
          <th>広告宣伝費</th>
          <td>{{ gameState.yearly_settlement.advertising }}</td>
        </tr>
        <tr>
          <th>人件費</th>
          <td>{{ gameState.yearly_settlement.labor_cost }}</td>
        </tr>
        <tr>
          <th>地代家賃</th>
          <td>{{ gameState.yearly_settlement.rent }}</td>
        </tr>
      </tbody>
    </table>

    <h3 class="result-subtitle">資産（BS）</h3>
    <table class="result-table">
      <tbody>
        <tr>
          <th>現金</th>
          <td>{{ gameState.yearly_settlement.cash }}</td>
        </tr>
        <tr>
          <th>原材料</th>
          <td>{{ gameState.yearly_settlement.material }}</td>
        </tr>
        <tr>
          <th>商品</th>
          <td>{{ gameState.yearly_settlement.product }}</td>
        </tr>
        <tr class="highlight">
          <th>純資産</th>
          <td>{{ net_assets(gameState.yearly_settlement) }}</td>
        </tr>
      </tbody>
    </table>

    <button @click="nextMonth" class="result-button">確認</button>
  </main>
</template>
