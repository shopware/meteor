<script setup lang="ts">
import type { TutorialLesson } from '@/types/lesson';

const props = defineProps<{
  lessons: TutorialLesson[];
  activeLessonId: string;
}>();

const emit = defineEmits<{
  selectLesson: [lessonId: string];
}>();

function selectLesson(lessonId: string) {
  emit('selectLesson', lessonId);
}

function getActiveLesson() {
  return props.lessons.find((lesson) => lesson.id === props.activeLessonId) ?? props.lessons[0];
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__header">
      <p class="sidebar__eyebrow">Meteor Admin SDK</p>
      <h1 class="sidebar__title">Interactive tutorial prototype</h1>
      <p class="sidebar__description">
        A browser-based learning experience with editable code and a minimal dummy admin.
      </p>
    </div>

    <section class="panel">
      <div class="panel__header">
        <h2>Prototype steps</h2>
        <span>{{ getActiveLesson().order }} / {{ lessons.length }}</span>
      </div>

      <ol class="step-list">
        <li v-for="lesson in lessons" :key="lesson.id">
          <button
            type="button"
            class="step-list__item"
            :class="{ 'step-list__item--active': lesson.id === activeLessonId }"
            @click="selectLesson(lesson.id)"
          >
            <span class="step-list__index">{{ String(lesson.order).padStart(2, '0') }}</span>
            <div>
              <strong>{{ lesson.title }}</strong>
              <p>{{ lesson.summary }}</p>
            </div>
          </button>
        </li>
      </ol>
    </section>

  </aside>
</template>

<style scoped>
.sidebar {
  display: grid;
  gap: 18px;
  align-content: start;
}

.sidebar__header,
.panel {
  padding: 26px;
  border: 1px solid #dce5f0;
  border-radius: 24px;
  background: rgb(255 255 255 / 0.92);
  box-shadow: 0 18px 48px rgb(15 23 42 / 0.06);
  backdrop-filter: blur(10px);
}

.sidebar__eyebrow {
  margin: 0 0 10px;
  color: #4f46e5;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sidebar__title {
  margin: 0 0 12px;
  font-size: 40px;
  line-height: 1;
}

.sidebar__description,
.panel p {
  margin: 0;
  color: #526072;
  font-size: 15px;
  line-height: 1.6;
}

.panel {
  display: grid;
  gap: 18px;
}

.panel h2 {
  margin: 0;
  font-size: 18px;
}

.panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.panel__header span {
  padding: 6px 10px;
  border-radius: 999px;
  background: #eef2ff;
  color: #4f46e5;
  font-size: 12px;
  font-weight: 700;
}

.step-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.step-list__item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  width: 100%;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #f9fbfd;
  text-align: left;
  cursor: pointer;
  font: inherit;
  transition:
    border-color 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease,
    background 160ms ease;
}

.step-list__item:hover {
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgb(15 23 42 / 0.05);
}

.step-list__item--active {
  border-color: #c7d2fe;
  background: linear-gradient(180deg, #eef2ff 0%, #f8fbff 100%);
  box-shadow: inset 0 0 0 1px rgb(99 102 241 / 0.16);
}

.step-list__item strong {
  display: block;
  margin-bottom: 4px;
  font-size: 15px;
}

.step-list__item p {
  font-size: 14px;
}

.step-list__index {
  display: inline-grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: #111827;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
}

</style>
