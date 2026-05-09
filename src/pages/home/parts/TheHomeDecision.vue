<script lang="ts">
  export default {
    name: "TheHomeDecision"
  };
</script>

<script setup lang="ts">
  import { store } from "@/store";
  import { computed, Ref, ref } from "vue";
  import { image, loadImageStore } from "@/utilities/image";
  import {
    Action,
    Decision,
    MarketingMedia,
    marketingMediaCost,
    newDecision,
    ProduceAttitude,
    RecruitSkill
  } from "@/models/Decision";
  import { hasTutorial, nextTutorial } from "@/presentations/Tutorial";
  import makeDecisions from "@/logics/makeDecisions";
  import { settleMonthly } from "@/logics/settle";

  const emit = defineEmits(["close"]);

  const gameState = computed(() => {
    return store.state.gameState;
  });

  // 入力用ref
  const decisions: Ref<Decision[]> = ref([]);
  const decision_step = ref(0);
  const decision_action: Ref<Action | null> = ref(null);
  const decision_purchase_count = ref(gameState.value.purchase_count);
  const decision_sale_price = ref(gameState.value.sale_price);

  const decidePurchase = () => {
    store.commit("gameState/setPurchaseCount", decision_purchase_count.value);

    decisions.value.push(
      newDecision({
        action: "purchase",
        purchase_count: decision_purchase_count.value
      })
    );

    nextDecision();
  };

  const decideSale = () => {
    store.commit("gameState/setSalePrice", decision_sale_price.value);

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
      store.commit("gameState/toScene", "result");
      emit("close");
    }
  };
</script>

<template>
  <main class="scene-decision">
    <img class="decision-image" :src="image(gameState.staffs[decision_step]?.image)" />
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
          :disabled="gameState.cash <= 0 || (hasTutorial && nextTutorial !== 'marketing')"
          class="decision-button"
        >
          宣伝をする
        </button>
        <!--社長限定アクション-->
        <button
          v-if="gameState.staffs[decision_step]?.isChief"
          @click="decision_action = 'recruit'"
          :disabled="gameState.cash <= 0 || (hasTutorial && nextTutorial !== 'recruit')"
          class="decision-button"
        >
          スタッフを募集する
        </button>
      </div>
    </template>
    <template v-if="decision_action == 'purchase'">
      <p>現在の材料価格は {{ gameState.material_price }}ドングリです。何個買いますか？</p>
      <div class="decision-input">
        <input type="number" v-model="decision_purchase_count" :disabled="nextTutorial === 'purchase'" />
        <button @click="decidePurchase">決定</button>
      </div>
      <div class="decision-cancel">
        <button @click="decision_action = null">やめる</button>
      </div>
    </template>
    <template v-if="decision_action == 'produce'">
      <p>どのように作りますか？</p>
      <div class="decision-buttons">
        <button class="decision-button" @click="decideProduce('cautiously')">品質重視で丁寧に</button>
        <button class="decision-button" @click="decideProduce('speedy')" :disabled="nextTutorial === 'produce'">
          素早くたくさん
        </button>
      </div>
      <div class="decision-cancel">
        <button @click="decision_action = null">やめる</button>
      </div>
    </template>
    <template v-if="decision_action == 'sale'">
      <p>いくらで売りますか？</p>
      <div class="decision-input">
        <input type="number" v-model="decision_sale_price" :disabled="nextTutorial === 'sale'" />
        <button @click="decideSale">決定</button>
      </div>
      <div class="decision-cancel">
        <button @click="decision_action = null">やめる</button>
      </div>
    </template>
    <template v-if="decision_action == 'develop'">
      <p>どのように改良しますか？</p>
      <div class="decision-buttons">
        <button class="decision-button" @click="decideDevelop">もっと丈夫に</button>
        <button class="decision-button" @click="decideDevelop">もっと軽く</button>
        <button class="decision-button" @click="decideDevelop">もっとカッコよく</button>
      </div>
      <div class="decision-cancel">
        <button @click="decision_action = null">やめる</button>
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
      <div class="decision-cancel">
        <button @click="decision_action = null">やめる</button>
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
      <div class="decision-cancel">
        <button @click="decision_action = null">やめる</button>
      </div>
    </template>
  </main>
</template>
