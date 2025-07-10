<template>
  <transition name="modal">
    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="modalRef"
        :class="['mt-modal', `mt-modal--width-${width}`]"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="id"
      >
        <div class="mt-modal__header">
          <div class="mt-modal__header-content">
            <mt-text as="h2" class="mt-modal__title" size="m" weight="semibold" :id="id">
              {{ title }}
            </mt-text>

            <slot name="title-after" />
          </div>

          <mt-modal-close class="mt-modal__close-button" aria-label="Close">
            <mt-icon aria-hidden name="regular-times-xs" />
          </mt-modal-close>
        </div>

        <div class="mt-modal__content" ref="modalContentRef">
          <transition name="shadow-fade">
            <div
              v-if="['bottom', 'middle'].includes(showShadows)"
              class="mt-modal__scroll-shadow mt-modal__scroll-shadow--top"
            />
          </transition>

          <div
            :class="{
              'mt-modal__content-inner': true,
              'mt-modal__content-inner--no-padding': inset,
            }"
          >
            <slot name="default" />
          </div>

          <transition name="shadow-fade">
            <div
              v-if="['top', 'middle'].includes(showShadows)"
              class="mt-modal__scroll-shadow mt-modal__scroll-shadow--bottom"
            />
          </transition>
        </div>

        <div class="mt-modal__footer"><slot name="footer" /></div>
      </div>
    </Teleport>
  </transition>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch, type PropType } from "vue";
import { useModalContext } from "./composables/useModalContext";
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
import MtModalClose from "./sub-components/mt-modal-close.vue";
import MtText from "@/components/content/mt-text/mt-text.vue";
import { createId } from "@/utils/id";
import * as focusTrap from "focus-trap";

defineProps({
  title: {
    type: String,
    required: true,
  },
  width: {
    type: String as PropType<"s" | "m" | "l" | "xl" | "full">,
    required: false,
    default: "m",
  },
  inset: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const id = `mt-modal--${createId()}`;

const { isOpen, setIsOpen } = useModalContext("mt-modal");

let closeOnEscapeEventListener: ((event: KeyboardEvent) => void) | undefined = undefined;

watch(
  isOpen,
  (value) => {
    if (value) {
      closeOnEscapeEventListener = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsOpen(false);
        }
      };

      document.addEventListener("keydown", closeOnEscapeEventListener);
    } else {
      if (closeOnEscapeEventListener) {
        document.removeEventListener("keydown", closeOnEscapeEventListener);
      }
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (closeOnEscapeEventListener) {
    document.removeEventListener("keydown", closeOnEscapeEventListener);
  }
});

const modalRef = ref<HTMLElement | null>(null);
let trap: ReturnType<typeof focusTrap.createFocusTrap> | undefined;

watch(
  isOpen,
  async () => {
    const isModalOpen = !!isOpen.value;
    if (isModalOpen) await nextTick();

    if (!modalRef.value) return;
    if (isModalOpen) {
      trap = focusTrap.createFocusTrap(modalRef.value as HTMLElement, {
        tabbableOptions: { displayCheck: "none" },
        allowOutsideClick: true,
      });

      trap.activate();

      return;
    }

    if (trap) trap.deactivate();
  },
  { immediate: true },
);

onUnmounted(() => {
  if (trap) trap.deactivate();
});

const modalContentRef = ref<HTMLElement | null>(null);
const showShadows = ref<"top" | "middle" | "bottom" | "none">("none");

const thresholdInPx = 24;

onMounted(async () => {
  const isModalClosed = !isOpen.value;
  if (isModalClosed || !modalContentRef.value) return;

  await nextTick();
  const hasScrollableContent =
    modalContentRef.value.scrollHeight > modalContentRef.value.clientHeight;

  if (hasScrollableContent) showShadows.value = "top";
});

function handleScroll(event: Event) {
  if (!(event.target instanceof Element)) return;

  const hasScrollableContent = event.target.scrollHeight > event.target.clientHeight;
  if (!hasScrollableContent) {
    showShadows.value = "none";
    return;
  }

  const reachedTop = event.target.scrollTop < thresholdInPx;
  if (reachedTop) {
    showShadows.value = "top";
    return;
  }

  const reachedBottom =
    Math.abs(event.target.scrollHeight - event.target.scrollTop - event.target.clientHeight) < 1;

  if (reachedBottom) {
    showShadows.value = "bottom";
    return;
  }

  showShadows.value = "middle";
}

watch(
  isOpen,
  async () => {
    const isModalClosed = !isOpen.value;
    if (isModalClosed) {
      showShadows.value = "none";

      if (!modalContentRef.value) return;
      modalContentRef.value.removeEventListener("scroll", handleScroll);

      return;
    }

    await nextTick();
    if (!modalContentRef.value) return;

    modalContentRef.value.addEventListener("scroll", handleScroll);
  },
  { immediate: true },
);

onUnmounted(() => {
  if (modalContentRef.value) modalContentRef.value.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.mt-modal {
  height: auto;
  position: fixed;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  z-index: 1001;
  background-color: var(--color-elevation-surface-raised);
  border-radius: var(--border-radius-card);
  overflow: hidden;
  width: min(var(--mt-modal-width), calc(100vw - 2rem));
  border: 1px solid var(--color-border-primary-default);
  max-height: calc(100dvh - 2rem);
  display: flex;
  flex-direction: column;
}

.mt-modal--width-s {
  --mt-modal-width: 27.5rem;
}

.mt-modal--width-m {
  --mt-modal-width: 45rem;
}

.mt-modal--width-l {
  --mt-modal-width: 64rem;
}

.mt-modal--width-xl {
  --mt-modal-width: 90rem;
}

.mt-modal--width-full {
  --mt-modal-width: 100%;
}

.modal-enter-active {
  transition: opacity 400ms cubic-bezier(0.05, 0.7, 0.1, 1);

  @media (prefers-reduced-motion: no-preference) {
    transition:
      opacity 400ms cubic-bezier(0.05, 0.7, 0.1, 1),
      scale 400ms cubic-bezier(0.05, 0.7, 0.1, 1);
  }
}

.modal-leave-active {
  transition: opacity 200ms cubic-bezier(0.3, 0, 0.8, 0.15);

  @media (prefers-reduced-motion: no-preference) {
    transition:
      opacity 200ms cubic-bezier(0.3, 0, 0.8, 0.15),
      scale 200ms cubic-bezier(0.3, 0, 0.8, 0.15);
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  @media (prefers-reduced-motion: no-preference) {
    scale: 0.9;
  }
}

.mt-modal__title {
  margin-block-end: 0;
}

.mt-modal__content {
  position: relative;
  overflow-y: auto;
}

.mt-modal__content-inner {
  padding: var(--scale-size-24);
}

.mt-modal__content-inner--no-padding {
  padding: 0;
}

.mt-modal__scroll-shadow {
  position: sticky;
  left: 0;
  right: 0;
  height: var(--scale-size-4);
  margin-top: -0.25rem;
  filter: blur(3px);
  background-color: var(--color-elevation-shadow-default);
}

.mt-modal__scroll-shadow--top {
  top: 0;
}

.mt-modal__scroll-shadow--bottom {
  bottom: 0;
}

.shadow-fade-enter-active {
  transition: opacity 400ms cubic-bezier(0.05, 0.7, 0.1, 1);

  @media (prefers-reduced-motion: no-preference) {
    transition: opacity 400ms cubic-bezier(0.05, 0.7, 0.1, 1);
  }
}

.shadow-fade-leave-active {
  transition: opacity 200ms cubic-bezier(0.3, 0, 0.8, 0.15);

  @media (prefers-reduced-motion: no-preference) {
    transition: opacity 200ms cubic-bezier(0.3, 0, 0.8, 0.15);
  }
}

.shadow-fade-enter-from,
.shadow-fade-leave-to {
  opacity: 0;

  @media (prefers-reduced-motion: no-preference) {
    scale: 0.9;
  }
}

.mt-modal__footer {
  padding: var(--scale-size-24);
  border-top: 1px solid var(--color-border-primary-default);
}

.mt-modal__header {
  padding: var(--scale-size-24);
  border-bottom: 1px solid var(--color-border-primary-default);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt-modal__header-content {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  column-gap: var(--scale-size-8);
}

.mt-modal__close-button {
  cursor: pointer;
  color: var(--color-icon-primary-default);
  border-radius: var(--border-radius-xs);
  width: var(--scale-size-32);
  height: var(--scale-size-32);

  /* prevents hover stlyes from being applied to non-hoverable devices */
  @media (hover: hover) {
    &:hover {
      background-color: var(--color-interaction-secondary-hover);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--color-border-brand-selected);
    box-shadow: 0 0 4px 0 rgba(24, 158, 255, 0.3);
  }
}
</style>
