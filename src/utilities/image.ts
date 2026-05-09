import { createStore } from "vuex";

type ImageStore = Record<string, string>;

type ImageParam = {
  file_name: string;
  image: string;
};

export const imageStore = createStore<ImageStore>({
  state() {
    return {};
  },
  mutations: {
    push(imageStore: ImageStore, param: ImageParam) {
      imageStore[param.file_name] = param.image;
    }
  }
});

export const loadImageStore = () => {
  const import_images = import.meta.glob("@/assets/*.png", {
    eager: true,
    import: "default"
  });

  for (const path in import_images) {
    const file_name = path.split("/").pop()!.replace(".png", "");
    imageStore.commit("push", { file_name: file_name, image: import_images[path] as string });
  }
};

export const image = (file_name: string | null | undefined) => {
  return imageStore.state[file_name ?? "chara00"];
};
