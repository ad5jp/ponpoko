<script lang="ts">
  export default {
    name: "TheHomeSettlement"
  };
</script>

<script setup lang="ts">
  import { general_expense, gross_profit, net_assets, net_income, Settlement } from "@/logics/settle";

  interface Props {
    settlement: Settlement;
  }

  defineProps<Props>();
</script>

<template>
  <h3 class="result-subtitle">売上・費用・利益（PL）</h3>
  <table class="result-table">
    <tbody>
      <tr class="highlight">
        <th>売上高</th>
        <td>{{ settlement.sales }}</td>
      </tr>
      <tr>
        <th>売上原価</th>
        <td>{{ settlement.sales_cost }}</td>
      </tr>
      <tr class="highlight">
        <th>粗利益</th>
        <td>{{ gross_profit(settlement) }}</td>
      </tr>
      <tr>
        <th>販管費</th>
        <td>{{ general_expense(settlement) }}</td>
      </tr>
      <tr>
        <th>特別損失</th>
        <td>{{ settlement.special_expense }}</td>
      </tr>
      <tr class="highlight">
        <th>純利益</th>
        <td>{{ net_income(settlement) }}</td>
      </tr>
    </tbody>
  </table>

  <h3 class="result-subtitle">販管費の内訳</h3>
  <table class="result-table">
    <tbody>
      <tr>
        <th>広告宣伝費</th>
        <td>{{ settlement.advertising }}</td>
      </tr>
      <tr>
        <th>人件費</th>
        <td>{{ settlement.labor_cost }}</td>
      </tr>
      <tr>
        <th>地代家賃</th>
        <td>{{ settlement.rent }}</td>
      </tr>
    </tbody>
  </table>

  <h3 class="result-subtitle">資産（BS）</h3>
  <table class="result-table">
    <tbody>
      <tr>
        <th>現金</th>
        <td>{{ settlement.cash }}</td>
      </tr>
      <tr>
        <th>原材料</th>
        <td>{{ settlement.material }}</td>
      </tr>
      <tr>
        <th>商品</th>
        <td>{{ settlement.product }}</td>
      </tr>
      <tr class="highlight">
        <th>純資産</th>
        <td>{{ net_assets(settlement) }}</td>
      </tr>
    </tbody>
  </table>
</template>
