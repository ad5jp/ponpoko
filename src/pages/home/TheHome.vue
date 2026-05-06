<script lang="ts">
  export default {
    name: "TheHome"
  };
</script>

<script setup lang="ts">
  import { computed, Ref, ref } from "vue";
  import { store } from "@/store";
  import {
    Action,
    newDecision,
    Decision,
    MarketingMedia,
    RecruitSkill,
    ProduceAttitude,
    marketingMediaCost
  } from "@/models/Decision";
  import makeDecisions from "@/logics/makeDecisions";
  import { dialogs } from "@/presentations/Dialogs";
  import { hasTutorial, nextTutorial } from "@/presentations/Tutorial";
  import { settleMonthly } from "@/logics/settle";
  import fireEvents from "@/logics/fireEvents";

  // 入力用ref
  const newPlayerName = ref("ぽん");
  const dialog_step = ref(0);
  const decisions: Ref<Decision[]> = ref([]);
  const decision_step = ref(0);
  const decision_action: Ref<Action | null> = ref(null);
  const decision_purchase_count = ref(5);
  const decision_sale_price = ref(30);
  const decision_produce_count = ref(5);

  // サブウィンドウ表示用ref
  const show_staff_window = ref(false);

  const gameState = computed(() => {
    return store.state.gameState;
  });

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

  const decideProduce = (attitude: ProduceAttitude) => {
    decisions.value.push(
      newDecision({
        action: "produce",
        produce_attitude: attitude
      })
    );

    nextDecision();
  };

  const decideDevelop = () => {
    decisions.value.push(
      newDecision({
        action: "develop"
      })
    );

    nextDecision();
  };

  const decideMarketing = (media: MarketingMedia) => {
    decisions.value.push(
      newDecision({
        action: "marketing",
        marketing_media: media
      })
    );

    nextDecision();
  };

  const decideRecruit = (skill: RecruitSkill) => {
    decisions.value.push(
      newDecision({
        action: "recruit",
        recruit_skill: skill
      })
    );

    nextDecision();
  };

  const nextDecision = () => {
    decision_step.value++;
    decision_action.value = null;

    if (decision_step.value === gameState.value.staffs.length) {
      makeDecisions(decisions.value);
      settleMonthly();

      decision_step.value = 0;
      decisions.value = [];
      dialog_step.value = 0;
      store.commit("gameState/toScene", "result");
    }
  };

  const nextMonth = () => {
    fireEvents();
    dialog_step.value = 0;
    store.commit("gameState/nextMonth");
    store.commit("gameState/toScene", "decision");
  };

  const nextDialog = () => {
    dialog_step.value++;
  };

  const newGame = () => {
    dialog_step.value = 0;
    store.commit("gameState/toScene", "start");
  };

  // 画像
  const import_images = import.meta.glob("@/assets/*.png", {
    eager: true,
    import: "default"
  });

  const images: Record<string, string> = {};

  for (const path in import_images) {
    const fileName = path.split("/").pop()!.replace(".png", "");
    images[fileName] = import_images[path] as string;
  }
</script>

<template>
  <div class="screen">
    <header v-if="gameState.scene !== 'start'" class="status-bar">
      <div class="status-item"><label>所持金</label>{{ gameState.cash }} <small>ドングリ</small></div>
      <div class="status-item"><label>商品</label>{{ gameState.product }} <small>個</small></div>
      <div class="status-item"><label>材料</label>{{ gameState.material }} <small>個</small></div>
      <div class="status-month">
        {{ gameState.month }}月 <small>({{ gameState.year }}年目)</small>
      </div>
    </header>

    <main v-if="dialog_step < dialogs.length" class="scene-dialog">
      <img
        class="dialog-image"
        :src="dialogs[dialog_step].image ? images[dialogs[dialog_step].image!] : images.chara00"
      />
      <div class="dialog-message">
        <div class="dialog-text">{{ dialogs[dialog_step].message }}<br />&nbsp;</div>
        <button class="dialog-button" @click="nextDialog">▼</button>
      </div>
    </main>

    <main v-else-if="gameState.scene === 'start'" class="scene-start">
      <img :src="images.chara01" class="start-image" alt="" />
      <label class="start-label">お名前</label>
      <input v-model="newPlayerName" type="text" class="start-input" />
      <button class="start-button" @click="startNewGame">決定</button>
    </main>

    <main v-else-if="gameState.scene === 'decision'" class="scene-decision">
      <img class="decision-image" :src="images[gameState.staffs[decision_step]?.image]" />
      <template v-if="decision_action === null">
        <p>{{ gameState.staffs[decision_step]?.name }}さんは、今月は何をしますか？</p>
        <div class="decision-buttons">
          <button
            @click="decision_action = 'purchase'"
            :disabled="hasTutorial && nextTutorial !== 'purchase'"
            class="decision-button"
          >
            材料を買う
          </button>
          <button
            @click="decision_action = 'produce'"
            :disabled="gameState.material === 0 || (hasTutorial && nextTutorial !== 'produce')"
            class="decision-button"
          >
            商品を生産する
          </button>
          <button
            @click="decision_action = 'sale'"
            :disabled="gameState.product === 0 || (hasTutorial && nextTutorial !== 'sale')"
            class="decision-button"
          >
            商品を売る
          </button>
          <button
            @click="decision_action = 'develop'"
            :disabled="hasTutorial && nextTutorial !== 'develop'"
            class="decision-button"
          >
            商品を改良する
          </button>
          <button
            @click="decision_action = 'marketing'"
            :disabled="hasTutorial && nextTutorial !== 'marketing'"
            class="decision-button"
          >
            宣伝をする
          </button>
          <!--社長限定アクション-->
          <button
            v-if="gameState.staffs[decision_step]?.isChief"
            @click="decision_action = 'recruit'"
            :disabled="hasTutorial && nextTutorial !== 'recruit'"
            class="decision-button"
          >
            スタッフを募集する
          </button>
        </div>
      </template>
      <template v-if="decision_action == 'purchase'">
        <p>現在の材料価格は 10ドングリです。何個買いますか？</p>
        <input type="number" v-model="decision_purchase_count" :disabled="nextTutorial === 'purchase'" />
        <button @click="decidePurchase">決定</button>
      </template>
      <template v-if="decision_action == 'produce'">
        <p>どのように作りますか？</p>
        <div class="decision-buttons">
          <button class="decision-button" @click="decideProduce('cautiously')">品質重視で丁寧に</button>
          <button class="decision-button" @click="decideProduce('speedy')" :disabled="nextTutorial === 'produce'">
            素早くたくさん
          </button>
        </div>
      </template>
      <template v-if="decision_action == 'sale'">
        <p>いくらで売りますか？</p>
        <input type="number" v-model="decision_sale_price" :disabled="nextTutorial === 'sale'" />
        <button @click="decideSale">決定</button>
      </template>
      <template v-if="decision_action == 'develop'">
        <p>どのように改良しますか？</p>
        <div class="decision-buttons">
          <button class="decision-button" @click="decideDevelop">もっと丈夫に</button>
          <button class="decision-button" @click="decideDevelop">もっと軽く</button>
          <button class="decision-button" @click="decideDevelop">もっとカッコよく</button>
        </div>
      </template>
      <template v-if="decision_action == 'marketing'">
        <p>何で宣伝しますか？</p>
        <div class="decision-buttons">
          <button class="decision-button" @click="decideMarketing('flyer')">
            チラシ<br /><small>（{{ marketingMediaCost("flyer") }}ドングリ）</small>
          </button>
          <button class="decision-button" @click="decideMarketing('web')">
            ネット広告<br /><small>（{{ marketingMediaCost("web") }}ドングリ）</small>
          </button>
          <button class="decision-button" @click="decideMarketing('tv')">
            テレビCM<br /><small>（{{ marketingMediaCost("tv") }}ドングリ）</small>
          </button>
        </div>
      </template>
      <template v-if="decision_action == 'recruit'">
        <p>どんな人を募集しますか？</p>
        <div class="decision-buttons">
          <button class="decision-button" @click="decideRecruit('purchase')">仕入が得意な人</button>
          <button class="decision-button" @click="decideRecruit('produce')">生産が得意な人</button>
          <button class="decision-button" @click="decideRecruit('sale')">販売が得意な人</button>
          <button class="decision-button" @click="decideRecruit('develop')">研究開発が得意な人</button>
          <button class="decision-button" @click="decideRecruit('marketing')">宣伝が得意な人</button>
        </div>
      </template>
    </main>

    <main v-else-if="gameState.scene === 'result'" class="scene-result">
      <h2 class="result-title">今月の成績</h2>
      <h3 class="result-subtitle">収益</h3>
      <table class="result-table">
        <tbody>
          <tr>
            <th>売上高</th>
            <td>{{ gameState.monthly_settlement.sales }}</td>
          </tr>
        </tbody>
      </table>
      <h3 class="result-subtitle">費用</h3>
      <table class="result-table">
        <tbody>
          <tr>
            <th>仕入高</th>
            <td>{{ gameState.monthly_settlement.purchase }}</td>
          </tr>
          <tr>
            <th>広告宣伝費</th>
            <td>{{ gameState.monthly_settlement.advertising }}</td>
          </tr>
          <tr>
            <th>人件費</th>
            <td>{{ gameState.monthly_settlement.labor_cost }}</td>
          </tr>
          <tr>
            <th>地代家賃</th>
            <td>{{ gameState.monthly_settlement.rent }}</td>
          </tr>
        </tbody>
      </table>
      <h3 class="result-subtitle">資産</h3>
      <table class="result-table">
        <tbody>
          <tr>
            <th>現預金</th>
            <td>{{ gameState.cash }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="nextMonth" class="result-button">確認</button>
    </main>

    <footer v-if="gameState.scene !== 'start'" class="menu-bar">
      <button class="menu-item" @click="show_staff_window = true">スタッフ</button>
      <button class="menu-item" @click="newGame">NEW<br />GAME</button>
    </footer>

    <div v-if="show_staff_window" class="window window-staff">
      <div class="staff-list">
        <div v-for="(staff, i) of gameState.staffs" :key="i" class="staff-row">
          <img :src="images[staff.image]" alt="" class="staff-image" />
          <div class="staff-info">
            <div class="staff-name">{{ staff.name }}</div>
            <div class="staff-skill">
              <span class="staff-skill-label">仕入</span>
              <i v-for="n in staff.purchase_skill" :key="n" class="staff-skill-star">★</i>
            </div>
            <div class="staff-skill">
              <span class="staff-skill-label">生産</span>
              <i v-for="n in staff.produce_skill" :key="n" class="staff-skill-star">★</i>
            </div>
            <div class="staff-skill">
              <span class="staff-skill-label">販売</span>
              <i v-for="n in staff.sale_skill" :key="n" class="staff-skill-star">★</i>
            </div>
            <div class="staff-skill">
              <span class="staff-skill-label">開発</span>
              <i v-for="n in staff.develop_skill" :key="n" class="staff-skill-star">★</i>
            </div>
            <div class="staff-skill">
              <span class="staff-skill-label">宣伝</span>
              <i v-for="n in staff.marketing_skill" :key="n" class="staff-skill-star">★</i>
            </div>
          </div>
        </div>
      </div>
      <button class="window-close" @click="show_staff_window = false">閉じる</button>
    </div>
  </div>
</template>

<style scoped></style>
