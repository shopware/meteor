import figma, { html } from "@figma/code-connect/html";

figma.connect(
  "https://www.figma.com/design/Krub3xbG0vMUdoL8vzEZ7l/%E2%98%84%EF%B8%8F-Meteor-Admin-Foundations-%E2%80%93-6.0.0?node-id=6793-395952",
  {
    props: {
      text: figma.textContent("Button text"),
      size: figma.enum("size", {
        Default: "default",
        Small: "small",
      }),
      disabled: figma.boolean("disabled"),
      ghost: figma.boolean("ghost"),
    },
    example: ({ text, size, disabled, ghost }) =>
      html`<mt-button
        variant="primary"
        ghost="${ghost}"
        size="${size}"
        disabled="${disabled}"
        @click="() => {}"
        >${text}</mt-button
      >`,
    imports: ["import { MtButton } from '@shopware-ag/meteor-component-library';"],
  },
);

figma.connect(
  "https://www.figma.com/design/Krub3xbG0vMUdoL8vzEZ7l/%E2%98%84%EF%B8%8F-Meteor-Admin-Foundations-%E2%80%93-6.0.0?node-id=6793-396743",
  {
    props: {
      text: figma.textContent("Button text"),
      size: figma.enum("size", {
        Default: "default",
        Small: "small",
      }),
      disabled: figma.boolean("disabled"),
    },
    example: ({ text, size, disabled }) =>
      html`<mt-button variant="secondary" size="${size}" disabled="${disabled}" @click="() => {}"
        >${text}</mt-button
      >`,
    imports: ["import { MtButton } from '@shopware-ag/meteor-component-library';"],
  },
);

figma.connect(
  "https://www.figma.com/design/Krub3xbG0vMUdoL8vzEZ7l/%E2%98%84%EF%B8%8F-Meteor-Admin-Foundations-%E2%80%93-6.0.0?node-id=6793-396984",
  {
    props: {
      text: figma.textContent("Button text"),
      size: figma.enum("size", {
        Default: "default",
        Small: "small",
      }),
      disabled: figma.boolean("disabled"),
      ghost: figma.boolean("ghost"),
    },
    example: ({ text, size, disabled, ghost }) =>
      html`<mt-button
        variant="critical"
        ghost="${ghost}"
        size="${size}"
        disabled="${disabled}"
        @click="() => {}"
        >${text}</mt-button
      >`,
    imports: ["import { MtButton } from '@shopware-ag/meteor-component-library';"],
  },
);
