<template>
  <slot />
</template>

<script setup lang="ts">
import { provideI18n } from "@/composables/useI18n";
import { type FutureFlags, provideFutureFlags } from "../../composables/useFutureFlags";

const props = defineProps<{
  future?: FutureFlags;
  locale?: string;
}>();

provideFutureFlags(props.future);
provideI18n(props.locale);
</script>
