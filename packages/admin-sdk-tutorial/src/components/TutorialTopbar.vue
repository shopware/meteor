<script setup lang="ts">
import { computed } from 'vue';

import type { TutorialLesson } from '@/types/lesson';

const props = defineProps<{
  lessons: TutorialLesson[];
  activeLessonId: string;
}>();

const emit = defineEmits<{
  selectLesson: [lessonId: string];
}>();

const activeLesson = computed(
  () => props.lessons.find((lesson) => lesson.id === props.activeLessonId) ?? props.lessons[0],
);

function selectLesson(lessonId: string) {
  emit('selectLesson', lessonId);
}
</script>

<template>
  <header class="topbar">
    <div class="topbar__intro">
      <div>
        <p class="topbar__eyebrow">Meteor Admin SDK</p>
        <div class="topbar__title-row">
          <h1 class="topbar__title">Interactive tutorial prototype</h1>
          <span class="topbar__badge">{{ activeLesson.order }} / {{ lessons.length }}</span>
        </div>
      </div>

      <p class="topbar__description">
        Edit real SDK calls, run the hidden extension runtime, and inspect the dummy admin result.
      </p>
    </div>

    <nav class="topbar__nav" aria-label="Tutorial lessons">
      <button
        v-for="lesson in lessons"
        :key="lesson.id"
        type="button"
        class="topbar__lesson"
        :class="{ 'topbar__lesson--active': lesson.id === activeLessonId }"
        :aria-current="lesson.id === activeLessonId ? 'step' : undefined"
        @click="selectLesson(lesson.id)"
      >
        <span class="topbar__lesson-index">{{ String(lesson.order).padStart(2, '0') }}</span>
        <span class="topbar__lesson-copy">
          <strong>{{ lesson.title }}</strong>
          <span>{{ lesson.summary }}</span>
        </span>
      </button>
    </nav>
  </header>
</template>

<style scoped>
.topbar {
  display: grid;
  gap: 16px;
  padding: 20px 22px 18px;
  border: 1px solid #dce5f0;
  border-radius: 24px;
  background: rgb(255 255 255 / 0.94);
  box-shadow: 0 14px 36px rgb(15 23 42 / 0.05);
  backdrop-filter: blur(10px);
}

.topbar__intro {
  display: grid;
  gap: 10px;
}

.topbar__eyebrow {
  margin: 0 0 6px;
  color: #4f46e5;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.topbar__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.topbar__title {
  margin: 0;
  font-size: clamp(24px, 3vw, 32px);
  line-height: 1.05;
}

.topbar__badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: #eef2ff;
  color: #4f46e5;
  font-size: 12px;
  font-weight: 700;
}

.topbar__description {
  margin: 0;
  max-width: 72ch;
  color: #526072;
  font-size: 14px;
  line-height: 1.55;
}

.topbar__nav {
  position: relative;
  display: flex;
  gap: 12px;
  padding-bottom: 4px;
  overflow-x: auto;
  scrollbar-width: thin;
  scroll-snap-type: x proximity;
}

.topbar__nav::after {
  content: '';
  position: sticky;
  right: 0;
  width: 22px;
  flex: 0 0 22px;
  pointer-events: none;
  background: linear-gradient(90deg, rgb(255 255 255 / 0), rgb(255 255 255 / 0.94) 72%);
}

.topbar__lesson {
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  min-width: 220px;
  max-width: 280px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #f9fbfd;
  color: inherit;
  text-align: left;
  cursor: pointer;
  font: inherit;
  scroll-snap-align: start;
  transition:
    border-color 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease,
    background 160ms ease;
}

.topbar__lesson:hover {
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgb(15 23 42 / 0.05);
}

.topbar__lesson--active {
  border-color: #c7d2fe;
  background: linear-gradient(180deg, #eef2ff 0%, #f8fbff 100%);
  box-shadow: inset 0 0 0 1px rgb(99 102 241 / 0.16);
}

.topbar__lesson-index {
  display: inline-grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 14px;
  background: #111827;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
}

.topbar__lesson-copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.topbar__lesson-copy strong {
  font-size: 14px;
}

.topbar__lesson-copy span {
  color: #526072;
  font-size: 13px;
  line-height: 1.45;
}

@media (max-width: 720px) {
  .topbar {
    gap: 10px;
    padding: 13px 13px 11px;
    border-radius: 18px;
  }

  .topbar__intro {
    gap: 8px;
  }

  .topbar__eyebrow {
    margin-bottom: 4px;
    font-size: 11px;
  }

  .topbar__title-row {
    gap: 8px;
  }

  .topbar__title {
    font-size: 21px;
  }

  .topbar__badge {
    padding: 4px 8px;
    font-size: 11px;
  }

  .topbar__description {
    font-size: 13px;
    line-height: 1.45;
  }

  .topbar__nav {
    gap: 8px;
    margin-inline: -1px;
    padding: 0 8px 2px 1px;
    scroll-padding-inline: 1px;
  }

  .topbar__lesson {
    align-items: center;
    gap: 8px;
    min-width: 154px;
    max-width: none;
    padding: 10px 11px;
    border-radius: 14px;
  }

  .topbar__lesson-index {
    width: 28px;
    height: 28px;
    border-radius: 10px;
    font-size: 11px;
  }

  .topbar__lesson-copy {
    gap: 0;
  }

  .topbar__lesson-copy strong {
    font-size: 13px;
    line-height: 1.2;
  }

  .topbar__lesson-copy span {
    display: none;
  }
}
</style>
