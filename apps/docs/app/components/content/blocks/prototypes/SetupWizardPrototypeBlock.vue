<script setup lang="ts">
import { computed, ref } from "vue";
import {
  MtApp,
  MtButton,
  MtCard,
  MtCheckbox,
  MtContentHeader,
  MtIcon,
  MtPage,
  MtRadioGroupCardItem,
  MtRadioGroupList,
  MtRadioGroupRoot,
  MtSelect,
  MtSwitch,
  MtText,
  MtTextField,
  useSnackbar,
  type BreadcrumbItem,
} from "@shopware-ag/meteor-component-library";

// The shell as a full-screen route shows it. In your application, keep the shell with its
// navigation in the root component and hide its regions in the meta of the route.
const breadcrumb: BreadcrumbItem[] = [{ label: "Set up your shop", icon: "rocket" }];

const steps = [
  { name: "shop", label: "Your shop" },
  { name: "payment", label: "Payment" },
  { name: "shipping", label: "Shipping" },
  { name: "summary", label: "Summary" },
];
const step = ref(0);
const current = computed(() => steps[step.value]!);

// Sample data. Replace it with the settings your page loads and saves.
const setup = ref({
  shopName: "",
  email: "",
  country: "DE",
  payment: "paypal",
  invoice: true,
  shipping: "standard",
  freeShipping: false,
});

const countryOptions = [
  { value: "DE", label: "Germany" },
  { value: "AT", label: "Austria" },
  { value: "CH", label: "Switzerland" },
];

const canContinue = computed(
  () => step.value !== 0 || (setup.value.shopName.trim() !== "" && setup.value.email.includes("@")),
);

const { addSnackbar } = useSnackbar();

// Replace it with the request that saves the settings, and lead people into the shop.
function finish() {
  addSnackbar({ message: `${setup.value.shopName} is ready` });
  step.value = 0;
}
</script>

<template>
  <mt-app>
    <mt-page width="s" :breadcrumb="breadcrumb" closable>
      <div class="stack">
        <mt-content-header :title="current.label">
          <mt-text size="xs" color="color-text-secondary-default" as="span">
            Step {{ step + 1 }} of {{ steps.length }}
          </mt-text>
        </mt-content-header>

        <missing-feature title="Stepper">
          No component shows the steps of a flow with the done, the current and the next steps.
          The list stands in for it.

          <template #stand-in>
            <ol class="steps">
              <li
                v-for="(item, index) in steps"
                :key="item.name"
                class="steps__item"
                :class="{
                  'steps__item--done': index < step,
                  'steps__item--current': index === step,
                }"
                :aria-current="index === step ? 'step' : undefined"
              >
                <span class="steps__marker">
                  <mt-icon
                    v-if="index < step"
                    name="regular-checkmark-xs"
                    size="var(--scale-size-10)"
                    decorative
                  />
                  <template v-else>{{ index + 1 }}</template>
                </span>
                <mt-text size="xs" as="span">{{ item.label }}</mt-text>
              </li>
            </ol>
          </template>
        </missing-feature>

        <mt-card v-if="current.name === 'shop'" title="Tell us about your shop">
          <div class="stack">
            <mt-text-field v-model="setup.shopName" label="Shop name" required />
            <mt-text-field v-model="setup.email" label="Email address for orders" required />
            <mt-select
              v-model="setup.country"
              label="Country"
              :options="countryOptions"
              :enable-search="false"
              hide-clearable-button
            />
          </div>
        </mt-card>

        <mt-card v-else-if="current.name === 'payment'" title="How do customers pay?">
          <div class="stack">
            <mt-radio-group-root v-model="setup.payment" label="Main payment method">
              <mt-radio-group-list>
                <mt-radio-group-card-item
                  id="payment-paypal"
                  value="paypal"
                  label="PayPal"
                  description="Customers pay with their PayPal account or a card."
                />
                <mt-radio-group-card-item
                  id="payment-card"
                  value="card"
                  label="Credit card"
                  description="Customers pay with Visa, Mastercard or American Express."
                />
              </mt-radio-group-list>
            </mt-radio-group-root>
            <mt-checkbox v-model="setup.invoice" label="Also offer payment by invoice" />
          </div>
        </mt-card>

        <mt-card v-else-if="current.name === 'shipping'" title="How do you ship?">
          <div class="stack">
            <mt-radio-group-root v-model="setup.shipping" label="Shipping method">
              <mt-radio-group-list>
                <mt-radio-group-card-item
                  id="shipping-standard"
                  value="standard"
                  label="Standard delivery"
                  description="Delivered within 3 to 5 business days."
                />
                <mt-radio-group-card-item
                  id="shipping-express"
                  value="express"
                  label="Express delivery"
                  description="Delivered on the next business day."
                />
              </mt-radio-group-list>
            </mt-radio-group-root>
            <mt-switch v-model="setup.freeShipping" label="Free shipping from €50" />
          </div>
        </mt-card>

        <mt-card v-else title="Check your settings">
          <div class="stack">
            <missing-feature title="Description list" inline>
              No component for label and value pairs, so the settings are a plain description
              list.
            </missing-feature>
            <dl class="facts">
              <mt-text as="dt" size="xs" color="color-text-secondary-default">Shop</mt-text>
              <mt-text as="dd" size="xs">{{ setup.shopName || "Not set" }}</mt-text>
              <mt-text as="dt" size="xs" color="color-text-secondary-default">Email address</mt-text>
              <mt-text as="dd" size="xs">{{ setup.email || "Not set" }}</mt-text>
              <mt-text as="dt" size="xs" color="color-text-secondary-default">Payment</mt-text>
              <mt-text as="dd" size="xs">
                {{ setup.payment === "paypal" ? "PayPal" : "Credit card" }}{{
                  setup.invoice ? ", invoice" : ""
                }}
              </mt-text>
              <mt-text as="dt" size="xs" color="color-text-secondary-default">Shipping</mt-text>
              <mt-text as="dd" size="xs">
                {{ setup.shipping === "standard" ? "Standard" : "Express"
                }}{{ setup.freeShipping ? ", free from €50" : "" }}
              </mt-text>
            </dl>
          </div>
        </mt-card>

        <div class="actions">
          <mt-button v-if="step > 0" variant="secondary" size="default" @click="step--">
            Back
          </mt-button>
          <mt-button
            v-if="step < steps.length - 1"
            variant="primary"
            size="default"
            :disabled="!canContinue"
            @click="step++"
          >
            Continue
          </mt-button>
          <mt-button v-else variant="primary" size="default" @click="finish">
            Open my shop
          </mt-button>
        </div>
      </div>
    </mt-page>
  </mt-app>
</template>

<style scoped>
.stack {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-16);
  align-content: start;
}

.steps {
  display: flex;
  flex-wrap: wrap;
  gap: var(--scale-size-16);
  margin: 0;
  padding: 0;
  list-style: none;
}

.steps__item {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
  color: var(--color-text-secondary-default);
}

.steps__marker {
  display: grid;
  place-items: center;
  width: var(--scale-size-24);
  height: var(--scale-size-24);
  font-size: var(--font-size-2xs);
  border: 1px solid var(--color-border-primary-default);
  border-radius: 50%;
}

.steps__item--current {
  color: var(--color-text-primary-default);
}

.steps__item--current .steps__marker {
  color: var(--color-text-static-default);
  background-color: var(--color-interaction-primary-default);
  border-color: var(--color-interaction-primary-default);
}

.steps__item--done .steps__marker {
  color: var(--color-icon-positive-default);
  border-color: var(--color-border-positive-default);
}

.facts {
  display: grid;
  grid-template-columns: 8rem minmax(0, 1fr);
  gap: var(--scale-size-8) var(--scale-size-12);
  margin: 0;
}

.facts dd {
  margin: 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--scale-size-8);
}
</style>
