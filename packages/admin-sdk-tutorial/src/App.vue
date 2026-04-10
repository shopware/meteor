<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import CodeMirror from "vue-codemirror6";

import { formatLessonProse } from "./workspace/lessonProse";
import { useTutorialWorkspace } from "./workspace/useTutorialWorkspace";
import WorkspaceConfirmDialog from "./workspace/WorkspaceConfirmDialog.vue";

type MobileShellTab = "guide" | "lessons" | "workspace";
type MobileWorkspaceTab = "solution" | "your-code";

const workspace = useTutorialWorkspace();
const isDesktop = ref(typeof window === "undefined" ? true : window.innerWidth >= 1024);
const activeMobileSection = ref<MobileShellTab>("guide");
const activeMobileWorkspaceTab = ref<MobileWorkspaceTab>("your-code");
const activeLesson = computed(() => workspace.activeLesson.value);
const activeLessonId = computed(() => workspace.activeLessonId.value);
const currentDraft = computed(() => workspace.currentDraft.value);
const isDirty = computed(() => workspace.isDirty.value);
const isLessonSwitchConfirmOpen = computed(() => workspace.isLessonSwitchConfirmOpen.value);
const isRestoreStarterConfirmOpen = computed(() => workspace.isRestoreStarterConfirmOpen.value);
const isSolutionVisible = computed(() => workspace.isSolutionVisible.value);

const activeLessonProse = computed(() =>
  activeLesson.value ? formatLessonProse(activeLesson.value.prose) : []
);

const activeLessonSupportSummary = computed(() => {
  const supportFileCount = activeLesson.value?.supportFiles.length ?? 0;

  if (supportFileCount === 1) {
    return "1 read-only support file";
  }

  return `${supportFileCount} read-only support files`;
});

const saveStatusText = computed(() =>
  workspace.isSaving.value ? "Saving..." : "Saved on this device"
);

const hasLessons = computed(() => workspace.flatLessons.length > 0);

function updateDesktopState(): void {
  isDesktop.value = window.innerWidth >= 1024;

  if (isDesktop.value) {
    activeMobileSection.value = "guide";
  }
}

function openLesson(nextLessonId: string): void {
  workspace.requestLessonOpen(nextLessonId);
}

function showSolution(): void {
  workspace.showSolution();
}

function hideSolution(): void {
  workspace.hideSolution();
  activeMobileWorkspaceTab.value = "your-code";
}

function handleDraftUpdate(nextDraft: string | { toString(): string } | undefined): void {
  workspace.updateDraft(typeof nextDraft === "string" ? nextDraft : nextDraft?.toString() ?? "");
}

watch(
  () => workspace.activeLessonId.value,
  (nextLessonId, previousLessonId) => {
    if (!isDesktop.value && nextLessonId && nextLessonId !== previousLessonId) {
      activeMobileSection.value = "guide";
    }
  }
);

watch(
  () => workspace.isSolutionVisible.value,
  (isVisible) => {
    if (!isVisible) {
      activeMobileWorkspaceTab.value = "your-code";
    }
  }
);

onMounted(() => {
  updateDesktopState();
  window.addEventListener("resize", updateDesktopState);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateDesktopState);
});
</script>

<template>
  <main
    class="workspace-shell"
    data-testid="workspace-shell"
  >
    <template v-if="hasLessons && activeLesson">
      <header class="workspace-shell__header">
        <div>
          <p class="workspace-shell__eyebrow">Meteor Admin SDK Tutorial</p>
          <h1>{{ activeLesson.lesson.title }}</h1>
          <p class="workspace-shell__summary">
            {{ activeLesson.lesson.summary }}
          </p>
        </div>
        <div class="workspace-shell__status">
          <span>{{ saveStatusText }}</span>
          <span
            v-if="isDirty"
            class="workspace-shell__dirty-pill"
          >
            Draft changed
          </span>
        </div>
      </header>

      <nav
        v-if="!isDesktop"
        class="workspace-shell__mobile-tabs"
      >
        <button
          class="workspace-shell__mobile-tab"
          :class="{ 'workspace-shell__mobile-tab--active': activeMobileSection === 'lessons' }"
          data-testid="mobile-shell-tab"
          type="button"
          @click="activeMobileSection = 'lessons'"
        >
          Lessons
        </button>
        <button
          class="workspace-shell__mobile-tab"
          :class="{ 'workspace-shell__mobile-tab--active': activeMobileSection === 'guide' }"
          data-testid="mobile-shell-tab"
          type="button"
          @click="activeMobileSection = 'guide'"
        >
          Guide
        </button>
        <button
          class="workspace-shell__mobile-tab"
          :class="{ 'workspace-shell__mobile-tab--active': activeMobileSection === 'workspace' }"
          data-testid="mobile-shell-tab"
          type="button"
          @click="activeMobileSection = 'workspace'"
        >
          Workspace
        </button>
      </nav>

      <div class="workspace-shell__body">
        <aside
          v-show="isDesktop || activeMobileSection === 'lessons' || activeMobileSection === 'guide'"
          class="workspace-shell__guide-pane"
        >
          <section
            class="workspace-card workspace-card--rail"
            data-testid="lesson-tree"
          >
            <div
              v-for="part in workspace.catalog"
              :key="part.id"
              class="workspace-rail__part"
            >
              <h2>{{ part.order }}. {{ part.title }}</h2>

              <div
                v-for="chapter in part.chapters"
                :key="chapter.id"
                class="workspace-rail__chapter"
              >
                <h3>{{ chapter.order }}. {{ chapter.title }}</h3>

                <button
                  v-for="lessonEntry in chapter.lessons"
                  :key="lessonEntry.lesson.id"
                  :aria-current="
                    activeLessonId === lessonEntry.lesson.id ? 'page' : undefined
                  "
                  :class="[
                    'workspace-rail__lesson-row',
                    {
                      'workspace-rail__lesson-row--active':
                        activeLessonId === lessonEntry.lesson.id,
                    },
                  ]"
                  data-testid="lesson-nav-row"
                  type="button"
                  @click="openLesson(lessonEntry.lesson.id)"
                >
                  <span class="workspace-rail__lesson-copy">
                    <span>{{ lessonEntry.lesson.order }}. {{ lessonEntry.lesson.title }}</span>
                    <span
                      v-if="
                        activeLessonId === lessonEntry.lesson.id && isDirty
                      "
                      class="workspace-rail__dirty-dot"
                    />
                  </span>
                  <span class="workspace-rail__lesson-action">
                    {{
                      activeLessonId === lessonEntry.lesson.id
                        ? "Editing now"
                        : "Open lesson"
                    }}
                  </span>
                </button>
              </div>
            </div>
          </section>

          <section
            v-show="isDesktop || activeMobileSection === 'guide'"
            class="workspace-card workspace-card--guide"
            data-testid="lesson-guide"
          >
            <div class="workspace-guide__meta">
              <span>{{ activeLessonSupportSummary }}</span>
              <span>{{ saveStatusText }}</span>
            </div>

            <div class="workspace-guide__actions">
              <button
                v-if="!isSolutionVisible"
                class="workspace-button workspace-button--primary"
                data-testid="show-solution-button"
                type="button"
                @click="showSolution"
              >
                Show solution
              </button>
              <button
                v-else
                class="workspace-button workspace-button--secondary"
                data-testid="hide-solution-button"
                type="button"
                @click="hideSolution"
              >
                Hide solution
              </button>
              <button
                class="workspace-button workspace-button--destructive"
                data-testid="restore-starter-button"
                type="button"
                @click="workspace.requestRestoreStarter"
              >
                Restore starter
              </button>
            </div>

            <div class="workspace-guide__copy">
              <p class="workspace-guide__summary">
                {{ activeLesson.lesson.summary }}
              </p>

              <template
                v-for="(block, blockIndex) in activeLessonProse"
                :key="`${block.type}-${blockIndex}`"
              >
                <h2
                  v-if="block.type === 'heading'"
                  class="workspace-guide__heading"
                >
                  {{ block.value }}
                </h2>

                <p
                  v-else-if="block.type === 'paragraph'"
                  class="workspace-guide__paragraph"
                >
                  <template
                    v-for="(token, tokenIndex) in block.paragraphs"
                    :key="`${blockIndex}-${token.type}-${tokenIndex}`"
                  >
                    <code v-if="token.type === 'code'">{{ token.value }}</code>
                    <a
                      v-else-if="token.type === 'link'"
                      :href="token.href"
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      {{ token.value }}
                    </a>
                    <span v-else>{{ token.value }}</span>
                  </template>
                </p>

                <ul
                  v-else
                  class="workspace-guide__list"
                >
                  <li
                    v-for="(bulletLine, bulletIndex) in block.bullets"
                    :key="`${blockIndex}-bullet-${bulletIndex}`"
                  >
                    <template
                      v-for="(token, tokenIndex) in bulletLine"
                      :key="`${bulletIndex}-${token.type}-${tokenIndex}`"
                    >
                      <code v-if="token.type === 'code'">{{ token.value }}</code>
                      <a
                        v-else-if="token.type === 'link'"
                        :href="token.href"
                        rel="noreferrer noopener"
                        target="_blank"
                      >
                        {{ token.value }}
                      </a>
                      <span v-else>{{ token.value }}</span>
                    </template>
                  </li>
                </ul>
              </template>
            </div>

            <section class="workspace-guide__docs">
              <h3>Reference links</h3>
              <ul>
                <li
                  v-for="docsLink in activeLesson.docsLinks"
                  :key="docsLink.href"
                >
                  <a
                    :href="docsLink.href"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {{ docsLink.label }}
                  </a>
                </li>
              </ul>
            </section>

            <section class="workspace-guide__support-files">
              <h3>Support files</h3>
              <ul>
                <li
                  v-for="supportFile in activeLesson.supportFiles"
                  :key="supportFile.path"
                >
                  <code>{{ supportFile.path }}</code>
                </li>
              </ul>
            </section>
          </section>
        </aside>

        <section
          v-show="isDesktop || activeMobileSection === 'workspace'"
          class="workspace-shell__workspace-pane"
        >
          <article class="workspace-card workspace-card--editor">
            <header class="workspace-editor__header">
              <div>
                <p class="workspace-editor__eyebrow">Editable file</p>
                <strong>{{ activeLesson.primaryEditableFile }}</strong>
              </div>
              <span class="workspace-editor__save-state">
                {{ saveStatusText }}
              </span>
            </header>

            <div
              v-if="!isDesktop && isSolutionVisible"
              class="workspace-editor__mobile-tabs"
            >
              <button
                class="workspace-editor__mobile-tab"
                :class="{
                  'workspace-editor__mobile-tab--active':
                    activeMobileWorkspaceTab === 'your-code',
                }"
                type="button"
                @click="activeMobileWorkspaceTab = 'your-code'"
              >
                Your code
              </button>
              <button
                class="workspace-editor__mobile-tab"
                :class="{
                  'workspace-editor__mobile-tab--active':
                    activeMobileWorkspaceTab === 'solution',
                }"
                type="button"
                @click="activeMobileWorkspaceTab = 'solution'"
              >
                Solution
              </button>
            </div>

            <div
              class="workspace-editor__panels"
              :class="{ 'workspace-editor__panels--compare': isDesktop && isSolutionVisible }"
            >
              <section
                v-show="isDesktop || activeMobileWorkspaceTab === 'your-code' || !isSolutionVisible"
                class="workspace-editor__panel"
                data-testid="lesson-editor"
                @blur.capture="workspace.flushPendingPersistence"
              >
                <CodeMirror
                  :model-value="currentDraft"
                  basic
                  class="workspace-editor__codemirror"
                  @update:model-value="handleDraftUpdate"
                />
              </section>

              <section
                v-if="isSolutionVisible"
                v-show="isDesktop || activeMobileWorkspaceTab === 'solution'"
                class="workspace-editor__panel workspace-editor__panel--solution"
                data-testid="solution-panel"
              >
                <header class="workspace-editor__solution-header">
                  <span>Solution</span>
                  <span>Read-only compare</span>
                </header>
                <CodeMirror
                  :model-value="activeLesson.solutionCode"
                  basic
                  class="workspace-editor__codemirror workspace-editor__codemirror--readonly"
                  readonly
                />
              </section>
            </div>
          </article>

          <article
            class="workspace-card workspace-card--preview"
            data-testid="lesson-preview"
          >
            <header class="workspace-preview__header">
              <h2>Preview</h2>
            </header>
            <p>
              Interactive output arrives in Phase 3. For now, focus on reading, editing, and
              comparing code.
            </p>
          </article>
        </section>
      </div>
    </template>

    <section
      v-else
      class="workspace-card workspace-card--empty"
    >
      <h1>No lessons available yet</h1>
      <p>
        Add or restore a lesson bundle to load guidance, starter code, and the preview
        placeholder.
      </p>
    </section>

    <WorkspaceConfirmDialog
      confirm-label="Open lesson"
      :open="isLessonSwitchConfirmOpen"
      test-id="lesson-switch-confirm-dialog"
      @cancel="workspace.cancelLessonOpen"
      @confirm="workspace.confirmLessonOpen"
    >
      <template #title>
        <h2>Leave this lesson?</h2>
      </template>
      <p>
        Your draft stays saved on this device. Open the next lesson or keep editing here?
      </p>
    </WorkspaceConfirmDialog>

    <WorkspaceConfirmDialog
      confirm-label="Restore starter"
      destructive
      :open="isRestoreStarterConfirmOpen"
      test-id="restore-confirm-dialog"
      @cancel="workspace.cancelRestoreStarter"
      @confirm="workspace.confirmRestoreStarter"
    >
      <template #title>
        <h2>Restore starter</h2>
      </template>
      <p>
        Restore the starter code for this lesson? Your current draft on this device will be
        replaced.
      </p>
    </WorkspaceConfirmDialog>
  </main>
</template>

<style scoped>
.workspace-shell {
  --workspace-accent: #0870ff;
  --workspace-background: #fafbfe;
  --workspace-border: rgba(15, 23, 42, 0.08);
  --workspace-card: #ffffff;
  --workspace-copy: #0f172a;
  --workspace-copy-muted: #475569;
  --workspace-destructive: #e2262a;
  background:
    radial-gradient(circle at top right, rgba(8, 112, 255, 0.08), transparent 28%),
    linear-gradient(180deg, #ffffff 0%, var(--workspace-background) 26%);
  color: var(--workspace-copy);
  font-family: Inter, "Segoe UI", sans-serif;
  min-height: 100vh;
  padding: 32px;
}

.workspace-shell__header {
  align-items: flex-start;
  display: flex;
  gap: 24px;
  justify-content: space-between;
  margin: 0 auto 24px;
  max-width: 1440px;
}

.workspace-shell__eyebrow,
.workspace-editor__eyebrow {
  color: var(--workspace-accent);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin: 0 0 8px;
  text-transform: uppercase;
}

.workspace-shell h1 {
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
}

.workspace-shell__summary {
  color: var(--workspace-copy-muted);
  margin: 12px 0 0;
  max-width: 720px;
}

.workspace-shell__status {
  align-items: center;
  display: flex;
  gap: 12px;
  white-space: nowrap;
}

.workspace-shell__dirty-pill {
  background: rgba(8, 112, 255, 0.1);
  border-radius: 999px;
  color: var(--workspace-accent);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 8px 12px;
}

.workspace-shell__mobile-tabs {
  display: none;
}

.workspace-shell__body {
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(320px, 380px) minmax(0, 1fr);
  margin: 0 auto;
  max-width: 1440px;
}

.workspace-shell__guide-pane,
.workspace-shell__workspace-pane {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.workspace-card {
  background: var(--workspace-card);
  border: 1px solid var(--workspace-border);
  border-radius: 24px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.06);
}

.workspace-card--rail,
.workspace-card--guide,
.workspace-card--editor,
.workspace-card--preview,
.workspace-card--empty {
  padding: 24px;
}

.workspace-rail__part + .workspace-rail__part,
.workspace-rail__chapter + .workspace-rail__chapter {
  margin-top: 20px;
}

.workspace-rail__part h2,
.workspace-rail__chapter h3,
.workspace-guide__docs h3,
.workspace-guide__support-files h3 {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 12px;
}

.workspace-rail__chapter h3,
.workspace-guide__docs h3,
.workspace-guide__support-files h3 {
  color: var(--workspace-copy-muted);
}

.workspace-rail__lesson-row {
  align-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 18px;
  color: inherit;
  cursor: pointer;
  display: flex;
  font: inherit;
  justify-content: space-between;
  margin-top: 8px;
  min-height: 44px;
  padding: 14px 16px;
  text-align: left;
  width: 100%;
}

.workspace-rail__lesson-row--active {
  background: rgba(8, 112, 255, 0.08);
  border-color: rgba(8, 112, 255, 0.2);
}

.workspace-rail__lesson-copy {
  align-items: center;
  display: inline-flex;
  gap: 8px;
}

.workspace-rail__lesson-action {
  color: var(--workspace-copy-muted);
  font-size: 0.875rem;
}

.workspace-rail__dirty-dot {
  background: var(--workspace-accent);
  border-radius: 999px;
  display: inline-block;
  height: 8px;
  width: 8px;
}

.workspace-guide__meta,
.workspace-guide__actions,
.workspace-guide__docs ul,
.workspace-guide__support-files ul {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.workspace-guide__meta {
  color: var(--workspace-copy-muted);
  font-size: 0.875rem;
  margin-bottom: 20px;
}

.workspace-guide__actions {
  margin-bottom: 24px;
}

.workspace-button {
  align-items: center;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-weight: 600;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
}

.workspace-button--primary {
  background: var(--workspace-accent);
  color: #ffffff;
}

.workspace-button--secondary {
  background: rgba(8, 112, 255, 0.08);
  color: var(--workspace-accent);
}

.workspace-button--destructive {
  background: rgba(226, 38, 42, 0.08);
  color: var(--workspace-destructive);
}

.workspace-guide__copy {
  display: grid;
  gap: 16px;
}

.workspace-guide__summary,
.workspace-guide__paragraph,
.workspace-card--preview p,
.workspace-card--empty p {
  color: var(--workspace-copy-muted);
  line-height: 1.6;
  margin: 0;
}

.workspace-guide__heading {
  font-size: 1rem;
  font-weight: 600;
  margin: 8px 0 0;
}

.workspace-guide__list {
  color: var(--workspace-copy-muted);
  display: grid;
  gap: 8px;
  line-height: 1.6;
  margin: 0;
  padding-left: 20px;
}

.workspace-guide__copy code,
.workspace-guide__support-files code {
  background: rgba(15, 23, 42, 0.06);
  border-radius: 8px;
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 0.92em;
  padding: 2px 6px;
}

.workspace-guide__copy a,
.workspace-guide__docs a {
  color: var(--workspace-accent);
  text-decoration: none;
}

.workspace-guide__docs,
.workspace-guide__support-files {
  border-top: 1px solid var(--workspace-border);
  margin-top: 24px;
  padding-top: 24px;
}

.workspace-guide__docs ul,
.workspace-guide__support-files ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.workspace-editor__header,
.workspace-preview__header,
.workspace-editor__solution-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.workspace-editor__header strong,
.workspace-preview__header h2,
.workspace-card--empty h1 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.workspace-editor__save-state,
.workspace-editor__solution-header {
  color: var(--workspace-copy-muted);
  font-size: 0.875rem;
}

.workspace-editor__mobile-tabs {
  display: none;
}

.workspace-editor__panels {
  display: grid;
  gap: 16px;
  margin-top: 20px;
}

.workspace-editor__panels--compare {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.workspace-editor__panel {
  min-width: 0;
}

.workspace-editor__solution-header {
  margin-bottom: 12px;
}

.workspace-editor__codemirror :deep(.cm-editor) {
  border: 1px solid var(--workspace-border);
  border-radius: 18px;
  min-height: 320px;
  overflow: hidden;
}

.workspace-editor__codemirror :deep(.cm-scroller) {
  font-family: "SFMono-Regular", Consolas, monospace;
  min-height: 320px;
}

.workspace-editor__codemirror--readonly :deep(.cm-editor) {
  background: rgba(15, 23, 42, 0.03);
}

.workspace-card--preview {
  min-height: 192px;
}

.workspace-card--empty {
  margin: 72px auto;
  max-width: 720px;
  text-align: center;
}

@media (max-width: 1023px) {
  .workspace-shell {
    padding: 20px 16px 32px;
  }

  .workspace-shell__header {
    flex-direction: column;
    margin-bottom: 20px;
  }

  .workspace-shell__mobile-tabs {
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid var(--workspace-border);
    border-radius: 999px;
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin: 0 auto 20px;
    max-width: 1440px;
    padding: 8px;
    position: sticky;
    top: 16px;
    z-index: 10;
  }

  .workspace-shell__mobile-tab,
  .workspace-editor__mobile-tab {
    background: transparent;
    border: 0;
    border-radius: 999px;
    color: var(--workspace-copy-muted);
    cursor: pointer;
    font: inherit;
    font-weight: 600;
    min-height: 44px;
  }

  .workspace-shell__mobile-tab--active,
  .workspace-editor__mobile-tab--active {
    background: rgba(8, 112, 255, 0.1);
    color: var(--workspace-accent);
  }

  .workspace-shell__body {
    display: block;
  }

  .workspace-shell__guide-pane,
  .workspace-shell__workspace-pane {
    gap: 16px;
  }

  .workspace-card--guide,
  .workspace-card--editor,
  .workspace-card--preview,
  .workspace-card--rail {
    padding: 20px;
  }

  .workspace-editor__mobile-tabs {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: 16px;
  }

  .workspace-editor__panels--compare {
    grid-template-columns: minmax(0, 1fr);
  }

  .workspace-card--preview {
    min-height: 160px;
  }
}
</style>
