<script setup lang="ts">
import { loadLessonCatalog } from "./catalog";

const catalog = loadLessonCatalog();

function formatSupportFileCount(supportFileCount: number): string {
  if (supportFileCount === 1) {
    return "1 read-only support file";
  }

  return `${supportFileCount} read-only support files`;
}
</script>

<template>
  <main data-testid="lesson-catalog-app">
    <header>
      <p>Phase 1 catalog prototype</p>
      <h1>Meteor Admin SDK Tutorial</h1>
      <p>Browse the authored lesson order before editor, runtime, and fake-admin features land.</p>
    </header>

    <section
      v-for="part in catalog"
      :key="part.id"
      data-testid="tutorial-part"
    >
      <h2>{{ part.order }}. {{ part.title }}</h2>

      <section
        v-for="chapter in part.chapters"
        :key="chapter.id"
        data-testid="tutorial-chapter"
      >
        <h3>{{ chapter.order }}. {{ chapter.title }}</h3>

        <ol>
          <li
            v-for="lessonEntry in chapter.lessons"
            :key="lessonEntry.lesson.id"
            data-testid="lesson-list-item"
          >
            <article>
              <h4>{{ lessonEntry.lesson.order }}. {{ lessonEntry.lesson.title }}</h4>
              <p>{{ lessonEntry.lesson.summary }}</p>
              <dl>
                <div>
                  <dt>Scenario kind</dt>
                  <dd>{{ lessonEntry.scenario.kind }}</dd>
                </div>
                <div>
                  <dt>Primary editable file</dt>
                  <dd>{{ lessonEntry.primaryEditableFile }}</dd>
                </div>
                <div>
                  <dt>Support files</dt>
                  <dd>{{ formatSupportFileCount(lessonEntry.supportFiles.length) }}</dd>
                </div>
              </dl>

              <ul>
                <li
                  v-for="docsLink in lessonEntry.docsLinks"
                  :key="docsLink.href"
                >
                  <a
                    :href="docsLink.href"
                    data-testid="lesson-doc-link"
                  >
                    {{ docsLink.label }}
                  </a>
                </li>
              </ul>
            </article>
          </li>
        </ol>
      </section>
    </section>
  </main>
</template>
