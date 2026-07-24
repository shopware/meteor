<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtText from "@shopware-ag/meteor-component-library/MtText";
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";
import MtTextField from "@shopware-ag/meteor-component-library/MtTextField";
import MtPasswordField from "@shopware-ag/meteor-component-library/MtPasswordField";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtLink from "@shopware-ag/meteor-component-library/MtLink";

const email = ref("mia.chen@example.com");
const password = ref("peekaboo");
const muted = "color-text-secondary-default";

// Require both fields before the sign-in can be attempted.
const canSubmit = computed(
  () => email.value.trim() !== "" && password.value.trim() !== "",
);

// Fake a sign-in: show the button loading for a moment, then shake the card as
// if the attempt was rejected.
const loggingIn = ref(false);
const shake = ref(false);

function attemptLogin() {
  if (loggingIn.value || !canSubmit.value) return;
  shake.value = false;
  loggingIn.value = true;
  window.setTimeout(() => {
    loggingIn.value = false;
    shake.value = true;
    window.setTimeout(() => {
      shake.value = false;
    }, 500);
  }, 1200);
}

// The email/password fields don't forward an autocomplete attribute to their
// inputs, so disable browser autofill on the rendered inputs directly.
const formRef = ref<HTMLElement | null>(null);
onMounted(() => {
  formRef.value?.querySelectorAll("input").forEach((input) => {
    input.setAttribute(
      "autocomplete",
      input.type === "email" ? "off" : "new-password",
    );
  });
});
</script>

<template>
  <div>
    <div :class="{ 'connect-shake': shake }">
      <mt-card>
        <div class="connect">
          <div class="connect__logos">
            <span class="connect__logo connect__logo--sw">
              <mt-icon
                name="solid-shopware"
                size="20"
                color="var(--color-static-white)"
              />
            </span>
            <span class="connect__logo connect__logo--nx">
              <mt-icon
                name="solid-shopware-nexus"
                size="20"
                color="var(--color-icon-brand-default)"
              />
            </span>
          </div>
          <div ref="formRef" class="connect__body">
            <div class="connect__head">
              <mt-text size="l" weight="bold">Connect to Nexus</mt-text>
              <mt-text size="xs" :color="muted">
                Sign in with your Shopware Account to connect Nexus and turn
                every store event into an automated workflow, the moment it
                happens.
              </mt-text>
            </div>
            <mt-text-field v-model="email" label="Email" />
            <mt-password-field v-model="password" label="Password" />
            <mt-button
              variant="primary"
              size="default"
              block
              :is-loading="loggingIn"
              :disabled="!canSubmit"
              @click="attemptLogin"
              >Continue</mt-button
            >
            <div class="connect__footer">
              <mt-text size="xs" :color="muted">
                Don't have an account?
              </mt-text>
              <!-- Decorative demo link: prevent the href="#" scroll-to-top jump. -->
              <mt-link as="a" href="#" @click.prevent>Register now</mt-link>
            </div>
          </div>
        </div>
      </mt-card>
    </div>
  </div>
</template>

<style scoped>
/* Top logos section, then the form content; 24px between the two. */
.connect {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-24);
}
/* Two overlapping brand circles, each ringed in the card surface so the overlap
   reads cleanly against the raised card. */
.connect__logos {
  display: flex;
  align-items: center;
}
.connect__logo {
  display: grid;
  place-items: center;
  width: var(--scale-size-48);
  height: var(--scale-size-48);
  border-radius: var(--border-radius-round);
  border: 2px solid var(--color-elevation-surface-raised);
  flex-shrink: 0;
}
.connect__logo--sw {
  background: var(--color-icon-brand-default);
}
.connect__logo--nx {
  background: var(--color-background-tertiary-default);
  margin-left: calc(var(--scale-size-8) * -1);
}
/* Headline + description, the two fields, and the Continue button. */
.connect__body {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
}
.connect__head {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-4);
  /* +8px beyond the body's 16px gap → 24px down to the first field. */
  margin-bottom: var(--scale-size-8);
}
/* +16px beyond the body's 16px gap → 32px up from the last field to the button. */
.connect__body :deep(.mt-button) {
  margin-top: var(--scale-size-16);
}
.connect__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--scale-size-4);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-xs);
}

/* Rejected-login shake. Lives on a nested wrapper (not the card-rise root) so
   toggling it doesn't restart the showcase entrance animation. */
.connect-shake {
  animation: connect-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
@keyframes connect-shake {
  10%,
  90% {
    transform: translateX(-2px);
  }
  20%,
  80% {
    transform: translateX(4px);
  }
  30%,
  50%,
  70% {
    transform: translateX(-8px);
  }
  40%,
  60% {
    transform: translateX(8px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .connect-shake {
    animation: none;
  }
}
</style>
