<template>
  <p>
    {{ t('example-meteor-app.dashboardCard.description') }}
  </p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
