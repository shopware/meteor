/**
 * Controls for the `hint` prop and the `#hint` slot. Shared by every form field
 * that supports hints, including the ones not using `baseFieldArgTypes`.
 */
export const hintArgTypes = {
  hint: {
    control: { type: "text" as const },
  },
  hintSlot: {
    control: { type: "text" as const },
    description:
      "Content for the `#hint` slot. Takes precedence over the `hint` prop and replaces the default info icon.",
    table: {
      category: "Slots",
    },
  },
};

export default {
  change: {
    action: "change",
    table: {
      category: "Events",
    },
  },
  updateModelValue: {
    action: "updateModelValue",
    table: {
      category: "Events",
    },
  },
  inheritanceRemove: {
    action: "inheritance-remove",
    table: {
      category: "Events",
    },
  },
  inheritanceRestore: {
    action: "inheritance-restore",
    table: {
      category: "Events",
    },
  },
  label: {
    control: { type: "text" },
  },
  prefix: {
    control: { type: "text" },
  },
  suffix: {
    control: { type: "text" },
  },
  ...hintArgTypes,
};
