<script lang="ts">
  import { InjectionKey } from "vue";
  export default {
    name: "App"
  };

  // provider用のkey
  type ScreenLoaderType = () => void;
  export const startScreenLoadingKey: InjectionKey<ScreenLoaderType> = Symbol();
  export const endScreenLoadingKey: InjectionKey<ScreenLoaderType> = Symbol();
  export const quitScreenLoadingKey: InjectionKey<ScreenLoaderType> = Symbol();

  type ShowMessage = (message: string, title?: string) => void;
  export const showMessageKey: InjectionKey<ShowMessage> = Symbol();
  export const showErrorMessageKey: InjectionKey<ShowMessage> = Symbol();

  type ShowConfirm = (message: string, title?: string) => Promise<boolean>;
  export const showConfirmKey: InjectionKey<ShowConfirm> = Symbol();

  // ファイルダウンロード用ローディング
  type FileDownloadLoaderType = (message?: string) => void;
  export const startFileDownloadLoadingKey: InjectionKey<FileDownloadLoaderType> = Symbol();
  export const endFileDownloadLoadingKey: InjectionKey<FileDownloadLoaderType> = Symbol();
</script>

<script setup lang="ts">
  import { ref, provide, reactive, onMounted } from "vue";
  import { RouterView, useRouter } from "vue-router";
  import ScreenLoader from "@/components/loader/ScreenLoader.vue";
  import MessageDialog from "@/components/dialog/MessageDialog.vue";
  import ConfirmDialog from "@/components/dialog/ConfirmDialog.vue";
  import LoadingOverlay from "@/components/LoadingOverlay.vue";
  import fileDownloadAnimation from "@/assets/animation/fileDownloadLoading.json";
  import {
    startScreenLoadingKey as AppStartScreenLoadingKey,
    endScreenLoadingKey as AppEndScreenLoadingKey,
    quitScreenLoadingKey as AppQuitScreenLoadingKey,
    showMessageKey as AppShowMessageKey,
    showErrorMessageKey as AppShowErrorMessageKey,
    showConfirmKey as AppShowConfirmKey,
    startFileDownloadLoadingKey as AppStartFileDownloadLoadingKey,
    endFileDownloadLoadingKey as AppEndFileDownloadLoadingKey
  } from "@/App.vue";

  /**
   * screen loading
   */
  const screenLoading = ref(0);

  /**
   * file download loading
   */
  const fileDownloadLoading = ref(0);
  const fileDownloadMessage = ref<string>("ファイルをダウンロード中...");

  /**
   * ダイアログメッセージ
   */
  type Dialog = {
    title: string;
    message: string;
    icon: string;
    reguestId?: string;
  };
  const dialog: Dialog = reactive({
    title: "",
    message: "",
    icon: ""
  });

  const messageDialogRef = ref<InstanceType<typeof MessageDialog>>();
  const showMessage = (message: string, title = "完了") => {
    dialog.message = message;
    dialog.title = title;
    dialog.icon = "success";
    dialog.reguestId = undefined;

    messageDialogRef.value?.show();
  };
  const showErrorMessage = (message: string, title = "エラー", reguestId?: string) => {
    dialog.message = message;
    dialog.title = title;
    dialog.icon = "error";
    dialog.reguestId = reguestId;
    messageDialogRef.value?.show();
  };

  const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog>>();
  const confirmMessage = ref("");
  const confirmTitle = ref("");
  const confirmResolve = ref<((value: boolean) => void) | null>(null);

  const showConfirm = (message: string, title = "確認"): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmMessage.value = message;
      confirmTitle.value = title;
      confirmResolve.value = resolve;
      confirmDialogRef.value?.show();
    });
  };

  const onConfirmOk = () => {
    confirmResolve.value?.(true);
    confirmResolve.value = null;
  };

  const onConfirmCancel = () => {
    confirmResolve.value?.(false);
    confirmResolve.value = null;
  };

  // コンポーネントのセットアップフェーズにprovideすることで、子コンポーネントがマウントされる前に依存関係が確実に設定される
  provide(AppStartScreenLoadingKey, () => {
    screenLoading.value++;
  });
  provide(AppEndScreenLoadingKey, () => {
    screenLoading.value--;
  });
  provide(AppQuitScreenLoadingKey, () => {
    screenLoading.value = 0;
  });
  provide(AppStartFileDownloadLoadingKey, (message?: string) => {
    if (message) {
      fileDownloadMessage.value = message;
    } else {
      fileDownloadMessage.value = "ファイルをダウンロード中...";
    }
    fileDownloadLoading.value++;
  });
  provide(AppEndFileDownloadLoadingKey, () => {
    fileDownloadLoading.value--;
    if (fileDownloadLoading.value === 0) {
      fileDownloadMessage.value = "ファイルをダウンロード中...";
    }
  });
  provide(AppShowMessageKey, showMessage);
  provide(AppShowErrorMessageKey, showErrorMessage);
  provide(AppShowConfirmKey, showConfirm);

  onMounted(() => {
    window.addEventListener("show_message", (event) => {
      const customEvent = event as CustomEvent;
      showMessage(customEvent.detail.message, customEvent.detail.title);
    });
    window.addEventListener("show_error_message", (event) => {
      const customEvent = event as CustomEvent;
      showErrorMessage(customEvent.detail.message, customEvent.detail.title, customEvent.detail.requestId);
    });
  });
</script>

<template>
  <router-view />
</template>

<style scoped></style>
