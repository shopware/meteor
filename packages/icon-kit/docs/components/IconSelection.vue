<template>
  <div class="IconSelection_bg" @click.prevent="$emit('switch', null)" />
  <div class="IconSelection" v-bind="$attrs">
    <div class="IconSelection_sidebar-bg">
      <!--<a class="IconSelection_close" href="#"
         @click.prevent="$emit('switch', null)">Close</a>-->

      <!--<a :href="`${embedPoint}${icon.mode}/${icon.name}.svg`" class="btn --secondary" download>Download .svg</a>-->
      <div class="flex flex-col gap-4">
        <div class="flex gap-4 items-center">
          <SwagIcon class="--medium" :icon="icon.name" :type="icon.mode" />
          <SwagIcon class="--small" :icon="icon.name" :type="icon.mode" />
        </div>

        <div class="flex gap-4 justify-center">
          <SwagIcon class="--large" :icon="icon.name" :type="icon.mode" />
        </div>
      </div>
    </div>

    <h1 @click.prevent="copyIconName">{{ icon.name }}</h1>
    <div class="IconSelection_tags" v-if="icon.tags.length">
      <span
        class="IconSelection_tag btn --subtle --xs --with-border"
        v-for="tag in icon.tags"
        >{{ tag }}</span
      >
    </div>

    <!--<div>
      <h4>Sizes</h4>
      <p v-if="false && icon.sizes.length === 1">The icon is available in one size.</p>
      <div v-else class="flex gap-2">
        <button v-for="size in icon.sizes"
                type="button"
                @click.prevent="$emit('switch', {mode: icon.mode, basename: icon.basename, size})"
                :class="size === icon.size ? '--secondary' : '--subtle'"
                class="btn --secondary --xs">{{ size || 'default' }}
        </button>
      </div>
    </div>

    <div>
      <h4>Styles</h4>
      <p v-if="false && icon.modes.length === 1">The icon is available in one style.</p>
      <div v-else class="flex gap-2">
        <button v-for="mode in icon.modes"
                type="button"
                @click.prevent="$emit('switch', {mode, basename: icon.basename, size: icon.size})"
                :class="mode === icon.mode ? '--secondary' : '--subtle'"
                class="btn --secondary --xs">{{ mode }}
        </button>
      </div>
    </div>-->

    <div>
      <!--<h4>Examples</h4>-->
      <textarea class="form-control" v-model="exampleHTML"></textarea>
    </div>

    <div>
      <h2>Related icons</h2>
      <div class="IconSelection_list">
        <IconDisplay
          v-for="icon in icons.slice(0, 4)"
          :key="icon"
          :icon="icon"
          mode="inline"
          @select="$emit('switch', icon)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.IconSelection {
  @apply grid gap-6;
  &_tags {
    @apply flex flex-row gap-2;
  }

  &_tag {
    @apply bg-[var(--sw-c-gray-100)] text-[var(--sw-c-gray-dark-500)] text-sm px-2 py-1;
  }

  &_close {
    @apply absolute right-0 top-0 mr-8 mt-8;
  }

  &_list {
    @apply grid gap-6;
    grid-template-columns: repeat(2, 1fr);
  }

  &_sidebar-bg {
    @apply p-6 bg-[var(--sw-c-gray-50)];
    .dark & {
      @apply bg-[var(--sw-c-gray-dark-700)];
    }
  }

  .SwagIcon {
    &.--small {
      --icon-size: 1rem;
    }
    &.--medium {
      --icon-size: 1.725rem;
    }
    &.--large {
      --icon-size: 8rem;
    }
  }

  @media (max-width: 960.5px) {
    position: fixed;
    left: 50%;
    transform: translate(-50%, -50%);
    top: 50%;
    max-height: 75vh;
    max-width: 75vw;
    overflow: auto;
    z-index: 101;

    &_bg {
      position: fixed;
      content: "";
      display: block;
      background: rgba(0, 0, 0, 0.333);
      inset: 0;
      z-index: 100;
    }
  }

  @media (min-width: 960.5px) {
    position: sticky;
    top: calc(var(--vp-nav-height) + 1rem);
    &_bg {
      display: none;
    }
  }
}
</style>

<script setup>
import { computed } from "vue";
import IconDisplay from "./IconDisplay.vue";

const props = defineProps({
  icon: {},
  icons: {},
});

const exampleHTML = computed(() =>
  props.icon ? `<sw-icon name="${props.icon.mode}-${props.icon.name}" />` : null
);
const exampleVue2 = computed(() =>
  props.icon ? `<sw-icon name="${props.icon.mode}-${props.icon.name}" />` : null
);
const exampleVue3 = computed(() =>
  props.icon ? `<sw-icon name="${props.icon.mode}-${props.icon.name}" />` : null
);
const exampleReact = computed(() =>
  props.icon ? `<sw-icon name="${props.icon.mode}-${props.icon.name}" />` : null
);

const copyIconName = () => {
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = `${props.icon.regular ? "regular-" : "solid-"}${props.icon.name}`;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);
};

const embedPoint = "/resources/meteor-icon-kit/public/icons/";
</script>
