import { newEvent } from "@/models/Event";
import { store } from "@/store";
import { random_float, random_int } from "@/utilities/random";

// ライバル商品の値下げ
const eventRivalPriceDown = () => {
  // 材料価格の2倍以下ならもう下げない
  if (store.state.gameState.rival_price <= store.state.gameState.material_price * 2) {
    return null;
  }

  const down = random_int(1, 3);
  store.commit("gameState/decreaseRivalPrice", down);

  return newEvent({
    event_type: "rival_price_down",
    rival_price_down_amount: down
  });
};

// ライバル商品の値上げ
const eventRivalPriceUp = () => {
  // 材料価格の2.25倍以上なら上げない
  if (store.state.gameState.rival_price > store.state.gameState.material_price * 2.25) {
    return null;
  }

  const up = random_int(1, 3);
  store.commit("gameState/increaseRivalPrice", up);

  return newEvent({
    event_type: "rival_price_up",
    rival_price_up_amount: up
  });
};

// ライバルの新商品
const eventRivalNewProduct = () => {
  // 6以上ならもう上げない
  if (store.state.gameState.rival_strength >= 6) {
    return null;
  }

  store.commit("gameState/increaseRivalStrength", 1);

  return newEvent({
    event_type: "rival_new_product"
  });
};

// 材料価格の上昇
const eventMaterialPriceUp = () => {
  // 15以上ならもう上げない
  if (store.state.gameState.material_price >= 15) {
    return null;
  }

  store.commit("gameState/increaseMaterialPrice", random_int(1, 4));

  return newEvent({
    event_type: "material_price_up"
  });
};

// 材料価格の下落
const eventMaterialPriceDown = () => {
  // 8以下ならもう下げない
  if (store.state.gameState.material_price <= 8) {
    return null;
  }

  store.commit("gameState/decreaseMaterialPrice", random_int(1, 2));

  return newEvent({
    event_type: "material_price_down"
  });
};

// 商品が盗まれる
const eventProductStolen = () => {
  // 3個以下ならスルー
  if (store.state.gameState.product <= 3) {
    return null;
  }

  const stolen = Math.min(store.state.gameState.product, random_int(10, 20));

  store.commit("gameState/decreaseProduct", stolen);

  return newEvent({
    event_type: "product_stolen",
    product_stolen_amount: stolen
  });
};

// 材料が火事で燃える
const eventMaterialBurned = () => {
  // 0個ならスルー
  if (store.state.gameState.product <= 3) {
    return null;
  }

  const burned = Math.floor(store.state.gameState.material * random_float(0.4, 0.9));

  store.commit("gameState/decreaseMaterial", burned);

  return newEvent({
    event_type: "material_burned",
    material_burned_amount: burned
  });
};

// SNSで話題になる
const eventSocialMediaBuzzed = () => {
  store.commit("gameState/increasePopularity", random_int(4, 7));

  return newEvent({
    event_type: "social_media_buzzed"
  });
};

// 抽選箱
const lottery = (() => {
  let lots: Function[] = [];

  lots = lots.concat(new Array(10).fill(eventRivalPriceDown));
  lots = lots.concat(new Array(10).fill(eventRivalPriceUp));
  lots = lots.concat(new Array(5).fill(eventRivalNewProduct));
  lots = lots.concat(new Array(10).fill(eventMaterialPriceUp));
  lots = lots.concat(new Array(10).fill(eventMaterialPriceDown));
  lots = lots.concat(new Array(5).fill(eventProductStolen));
  lots = lots.concat(new Array(5).fill(eventMaterialBurned));
  lots = lots.concat(new Array(5).fill(eventSocialMediaBuzzed));

  // 100個になるように null で埋める
  lots = lots.concat(new Array(100 - lots.length).fill(null));

  return lots;
})();

// イベント発火
const fireEvents = () => {
  // 初期化
  store.commit("gameState/clearEvents");

  // 最初の6ヶ月は何も起こらない
  if (store.state.gameState.year === 1 && store.state.gameState.month >= 4 && store.state.gameState.month <= 9) {
    return;
  }

  // ランダムイベント抽選
  const draw = random_int(0, lottery.length - 1);
  const createEvent = lottery[draw];
  console.log("event", createEvent);
  if (typeof createEvent === "function") {
    const event = createEvent();
    if (event) {
      store.commit("gameState/addEvent", event);
    }
  }

  // 知名度の低下処理（4以上なら毎月1ずつ下がる、2〜3なら2か月に1度（偶数月に）1ずつ下がる
  if (store.state.gameState.popularity > 3) {
    store.commit("gameState/decreasePopularity", 1);
  } else if (store.state.gameState.popularity > 2 && store.state.gameState.month % 2 === 0) {
    store.commit("gameState/decreasePopularity", 1);
  }
};

export default fireEvents;
