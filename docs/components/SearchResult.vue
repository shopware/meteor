<template>
<div class="search-result">
  <div class="icon-list">
    <IconDisplay :icon="icon" v-for="icon in resultIcons" :key="icon" />
  </div>
</div>
</template>

<script setup>
import {ref, computed} from "vue";
import Fuse from 'fuse.js'

const icons = ref([]);
const regular = require.context('../public/icons/regular', true, /svg$/);
const solid = require.context('../public/icons/solid', true, /svg$/);

icons.value.push(...regular.keys().map(x => {
  return {
    path: x.replace('./', '/icons/regular/'),
    name: x.substring(2, x.length - 4),
    regular: true,
    solid: false,
  }
}));

icons.value.push(...solid.keys().map(x => {
  return {
    path: x.replace('./', '/icons/solid/'),
    name: x.substring(2, x.length - 4),
    regular: false,
    solid: true,
  }
}));

const props = defineProps({
  phrase: String,
  regular: Boolean,
  solid: Boolean,
})

const resultIcons = computed(() => {
  const filteredIcons = icons.value.filter(i => i.regular === props.regular && i.solid === props.solid);
  if (props.phrase.length <= 0) {
    return filteredIcons;
  }

  const fuse = new Fuse(filteredIcons, {
    keys: ['name']
  });

  const searchResult = fuse.search(props.phrase);

  return searchResult.map(r => r.item);
})
</script>

<script>
import IconDisplay from './IconDisplay.vue';

export default {
  name: 'SearchResult',

  components: {
    'IconDisplay': IconDisplay,
  }
}
</script>

<style lang="css" scoped>
.search-result {
  background: #F2F2F2;
  border-radius: 8px;
  padding: 21px 48px;
}

.icon-list {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: stretch;
  gap: 32px;
  flex-wrap: wrap;
}
</style>
