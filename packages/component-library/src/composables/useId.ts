import { onMounted, ref } from "vue";
import { createId } from "@/utils/id";

export function useId() {
  const id = ref();
  onMounted(() => (id.value = createId()));

  return id;
}
