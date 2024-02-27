<template>
  <div class="ex-meteor-admin-sdk-example-module">
    <ex-cms-card />
    <ex-context-card />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ExContextCard from './ex-context-card.vue';
import ExCmsCard from './ex-cms-card.vue';

export default Vue.extend({
components: {
  'ex-context-card': ExContextCard,
  'ex-cms-card': ExCmsCard,
},
data() {
    return {}
},
computed: {},
methods: {}
})
</script>

<style scoped>
.ex-meteor-admin-sdk-example-module {
  padding-top: 40px;
}
</style>