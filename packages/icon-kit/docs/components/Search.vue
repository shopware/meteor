<template>
  <SwagLanding>
    <template #title>Meteor icon kit</template>
    <template #description
      >An icon library and toolkit that follows a minimal, yet highly expressive
      style perfectly aligned with Shopware's product language.
    </template>
  </SwagLanding>

  <div class="search-container">
    <div class="search-bar">
      <input
        class="form-control"
        name="searchbar"
        type="text"
        @input="debounceInput"
        placeholder="Search icons..."
      />

      <div class="flex gap-4">
        <button
          id="regular"
          class="btn --with-border"
          :class="[mode === 'regular' ? '--subtle-2' : '--subtle']"
          aria-label="Regular"
          @click="mode = 'regular'"
        >
          <SwagIcon icon="bell" />
          Regular
        </button>
        <button
          id="solid"
          class="btn --with-border"
          :class="[mode === 'solid' ? '--subtle-2' : '--subtle']"
          aria-label="Solid"
          @click="mode = 'solid'"
        >
          <SwagIcon icon="bell" type="solid" />
          Solid
        </button>
      </div>
    </div>

    <SearchResult :phrase="phrase" :mode="mode" />
  </div>
</template>

<script setup>
import SearchResult from "./SearchResult.vue";
import { ref } from "vue";

const phrase = ref("");
const debounce = ref(null);
const mode = ref("regular");

const debounceInput = (event) => {
  clearTimeout(debounce.value);

  debounce.value = setTimeout(() => {
    phrase.value = event.target.value;
  }, 600);
};
</script>

<style lang="scss">
@import "../public/icons/meteor-icon-kit.scss";

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
  margin: 48px auto;
  background-size: 15px 15px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  flex-wrap: wrap;
  gap: 48px;

  @media (min-width: 960.5px) {
    .btn {
      @apply justify-center;
      width: 11.5rem;
    }
  }
}

.search-bar input {
  flex: 1;
  background: transparent
    url("/resources/meteor-icon-kit/public/icons/regular/search.svg") no-repeat
    calc(100% - 15px) center;
  background-size: 1rem;
}
</style>
