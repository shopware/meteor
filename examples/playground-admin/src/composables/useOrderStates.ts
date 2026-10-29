import { useI18n } from "vue-i18n";
import type { MtStatusDot } from "@shopware-ag/meteor-component-library";
import type {
  DeliveryState,
  OrderState,
  PaymentState,
} from "../../shared/types";

type Variant = NonNullable<
  InstanceType<typeof MtStatusDot>["$props"]["variant"]
>;

/** The colors of the order, payment and delivery states, as the Administration shows them. */
const variants = {
  order: {
    open: "neutral",
    in_progress: "info",
    completed: "positive",
    cancelled: "critical",
  },
  payment: {
    open: "neutral",
    authorized: "info",
    paid: "positive",
    paid_partially: "attention",
    refunded: "positive",
    reminded: "attention",
    cancelled: "critical",
    failed: "critical",
  },
  delivery: {
    open: "neutral",
    shipped: "positive",
    shipped_partially: "attention",
    returned: "positive",
    cancelled: "critical",
  },
} satisfies {
  order: Record<OrderState, Variant>;
  payment: Record<PaymentState, Variant>;
  delivery: Record<DeliveryState, Variant>;
};

export type StateMachine = keyof typeof variants;

/** The variant, the translated label and the select options of the order states. */
export function useOrderStates() {
  const { t } = useI18n();

  function variant(machine: StateMachine, state: string): Variant {
    return (variants[machine] as Record<string, Variant>)[state] ?? "neutral";
  }

  function label(machine: StateMachine, state: string) {
    return t(`states.${machine}.${state}`);
  }

  function options(machine: StateMachine) {
    return Object.keys(variants[machine]).map((state) => ({
      value: state,
      label: label(machine, state),
    }));
  }

  return { variant, label, options };
}
