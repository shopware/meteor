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

/* Override dark mode because toggling it to false in the config enables it for build... */
.dark {
  --vt-c-bg: #ffffff !important;
  --vt-c-bg-soft: #f9f9f9 !important;
  --vt-c-bg-mute: #f1f1f1 !important;
  --vt-c-divider: rgba(60, 60, 60, .29) !important;
  --vt-c-divider-light: rgba(60, 60, 60, .12) !important;
  --vt-c-divider-inverse: rgba(84, 84, 84, .65) !important;
  --vt-c-divider-inverse-light: rgba(84, 84, 84, .48) !important;
  --vt-c-text-1: #213547 !important;
  --vt-c-text-2: rgba(60, 60, 60, .7) !important;
  --vt-c-text-3: rgba(60, 60, 60, .33) !important;
  --vt-c-text-4: rgba(60, 60, 60, .18) !important;
  --vt-c-text-code: #476582 !important;
  --vt-c-text-inverse-1: rgba(255, 255, 255, .87) !important;
  --vt-c-text-inverse-2: rgba(235, 235, 235, .6) !important;
  --vt-c-text-inverse-3: rgba(235, 235, 235, .38) !important;
  --vt-c-text-inverse-4: rgba(235, 235, 235, .18) !important;
  --vt-c-brand-highlight: #3468a3 !important;
  --sw-nav-bg: #142432 !important;
  --sw-sidebar-bg: #f5f7f9 !important;
  --sw-sidebar-border: #d3dce4 !important;
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
