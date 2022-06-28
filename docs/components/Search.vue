<template>
    <div class="search-container">
      <h1>Meteor icon kit</h1>

      <p>An icon library and toolkit that follows a minimal, yet highly expressive style perfectly aligned with Shopware's product language.</p>

      <div class="search-bar">
        <input name="searchbar" type="text" @input="debounceInput" placeholder="Search icons..." />

        <div class="button-group">
          <button id="regular" :class="{ active: regular }" aria-label="Regular" @click="switchIconModeToRegular">Regular</button>
          <button id="solid" :class="{ active: solid }" aria-label="Solid" @click="switchIconModeToSolid">Solid</button>
        </div>
      </div>

      <p id="copy-hint">Click on any Icon to copy the full icon name to clipboard.</p>

      <SearchResult :phrase="phrase" :regular="regular" :solid="solid" />
    </div>
</template>

<script setup>
import { ref } from 'vue'

const phrase = ref('');
const debounce = ref(null);
const regular = ref(true);
const solid = ref(false);

const debounceInput = (event) => {
  clearTimeout(debounce.value);

  debounce.value = setTimeout(() => {
    phrase.value = event.target.value;
  }, 600)
}

const switchIconModeToRegular = () => {
  regular.value = true;
  solid.value = false;
}

const switchIconModeToSolid = () => {
  regular.value = false;
  solid.value = true;
}
</script>

<script>
import SearchResult from './SearchResult.vue';

export default {
  name: 'Search',

  components: {
    'SearchResult': SearchResult,
  },
}
</script>

<style lang="css">
/* Begin vitepress overrides */
.VPContentDoc {
  padding: 64px !important;
}

.content {
  max-width: none !important;
}

.container {
  max-width: none !important;
}
/* End vitepress overrides */

.search-container {
  display: flex;
  align-content: center;
  flex-direction: column;
  width: 100%;
  max-width: none;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 20px auto;
  padding: 10px 45px;
  background: white url("/icons/regular/search.svg") no-repeat 15px center;
  background-size: 15px 15px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 8%)) drop-shadow(0 2px 1px rgba(0, 0, 0, 6%)) drop-shadow(0 1px 3px rgba(0, 0, 0, 10%));
  flex-wrap: wrap;
  gap: 8px;
}

.search-bar input {
  flex: 1;
}

.button-group button {
  width: 120px;
  height: 32px;
  font-size: 12px;
  background-color: #FBFBFB;
}

button.active {
  background-color: #0E1014;
  color: #fff;
}

button#regular {
  border-radius: 4px 0 0 4px;
}

button#solid {
  border-radius: 0 4px 4px 0;
}

p#copy-hint {
  font-size: 12px;
}
</style>
