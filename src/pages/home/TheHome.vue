<script lang="ts">
  export default {
    name: "TheHome"
  };
</script>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { store } from "@/store";
  import { dialogs } from "@/presentations/Dialogs";
  import TheHomeResult from "./parts/TheHomeResult.vue";
  import TheHomeDecision from "./parts/TheHomeDecision.vue";
  import { image, loadImageStore } from "@/utilities/image";

  // 入力用ref
  const newPlayerName = ref("ぽん");
  const dialog_step = ref(0);

  // サブウィンドウ表示用ref
  const show_staff_window = ref(false);
  const show_market_window = ref(false);
  const show_purchase_window = ref(false);

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

  const resetDialog = () => {
    dialog_step.value = 0;
  };

  const nextDialog = () => {
    dialog_step.value++;
  };

  const newGame = () => {
    dialog_step.value = 0;
    store.commit("gameState/toScene", "start");
  };

  // 画像
  loadImageStore();
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
      <img class="dialog-image" :src="image(dialogs[dialog_step].image)" />
      <div class="dialog-message">
        <div class="dialog-text">{{ dialogs[dialog_step].message }}<br />&nbsp;</div>
        <button class="dialog-button" @click="nextDialog">▼</button>
      </div>
    </main>

    <main v-else-if="gameState.scene === 'start'" class="scene-start">
      <img :src="image('chara01')" class="start-image" alt="" />
      <label class="start-label">お名前</label>
      <input v-model="newPlayerName" type="text" class="start-input" />
      <button class="start-button" @click="startNewGame">決定</button>
    </main>

    <TheHomeDecision v-else-if="gameState.scene === 'decision'" @close="resetDialog" />

    <TheHomeResult v-else-if="gameState.scene === 'result'" @close="resetDialog" />

    <footer v-if="gameState.scene !== 'start'" class="menu-bar">
      <button class="menu-item" @click="show_staff_window = true">スタッフ</button>
      <button class="menu-item" @click="show_market_window = true">販売市場</button>
      <button class="menu-item" @click="show_purchase_window = true">調達市場</button>
      <button class="menu-item" @click="newGame">NEW<br />GAME</button>
    </footer>

    <div v-if="show_staff_window" class="window window-staff">
      <div class="staff-list">
        <div v-for="(staff, i) of gameState.staffs" :key="i" class="staff-row">
          <img :src="image(staff.image)" alt="" class="staff-image" />
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

    <!-- TODO class振り直し 画像変更 -->
    <div v-if="show_market_window" class="window window-staff">
      <div class="staff-list">
        <div class="staff-row">
          <img :src="image('chara01')" alt="" class="staff-image" />
          <div class="staff-info">
            <div class="staff-name">ぽんぽこ商会</div>
            <div class="staff-skill">
              <span class="staff-skill-label">販売価格</span>
              <span>{{ gameState.sale_price }}</span>
            </div>
            <div class="staff-skill">
              <span class="staff-skill-label">商品力</span>
              <i v-for="n in gameState.strength" :key="n" class="staff-skill-star">★</i>
            </div>
            <div class="staff-skill">
              <span class="staff-skill-label">知名度</span>
              <i v-for="n in gameState.popularity" :key="n" class="staff-skill-star">★</i>
            </div>
          </div>
        </div>
        <div class="staff-row">
          <img :src="image('chara05')" alt="" class="staff-image" />
          <div class="staff-info">
            <div class="staff-name">カチカチ工業</div>
            <div class="staff-skill">
              <span class="staff-skill-label">販売価格</span>
              <span>{{ gameState.rival_price }}</span>
            </div>
            <div class="staff-skill">
              <span class="staff-skill-label">商品力</span>
              <i v-for="n in gameState.rival_strength" :key="n" class="staff-skill-star">★</i>
            </div>
            <div class="staff-skill">
              <span class="staff-skill-label">知名度</span>
              <i v-for="n in gameState.rival_popularity" :key="n" class="staff-skill-star">★</i>
            </div>
          </div>
        </div>
      </div>
      <button class="window-close" @click="show_market_window = false">閉じる</button>
    </div>

    <!-- TODO デザイン調整 -->
    <div v-if="show_purchase_window" class="window window-staff">
      <p>材料の価格: {{ gameState.material_price }}</p>
      <p>材料の供給: 通常</p>
      <button class="window-close" @click="show_purchase_window = false">閉じる</button>
    </div>
  </div>
</template>

<style scoped></style>
