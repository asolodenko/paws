import { defineStore } from "pinia";
import { ref } from "vue";

export const useSnackbarStore = defineStore("snackbar", () => {
  const show = ref(false);
  const text = ref("");
  const color = ref("success");

  function triggerSnackbar(message: string, type: "success" | "error" = "success") {
    text.value = message;
    color.value = type;
    show.value = true;
  }

  return { show, text, color, triggerSnackbar };
});