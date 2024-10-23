import figma, { html } from "@figma/code-connect/html"

/**
 * -- This file was auto-generated by `figma connect create` --
 * `props` includes a mapping from Figma properties and variants to
 * suggested values. You should update this to match the props of your
 * code component, and update the `example` function to return the
 * code example you'd like to see in Figma
 */

figma.connect(
  "https://www.figma.com/design/Krub3xbG0vMUdoL8vzEZ7l/%E2%98%84%EF%B8%8F-Meteor-Admin-Foundations-%E2%80%93-6.0.0?node-id=6793-395952&m=dev",
  {
    props: {
      iconBack: figma.instance("↳ IconBack"),
      splitOption: figma.boolean("Split option"),
      iconFront: figma.boolean("IconFront"),
      iconFront: figma.instance("↳ IconFront"),
      iconBack: figma.boolean("IconBack"),
      label: figma.string("↳ ✍️ Label"),
      label: figma.boolean("Label"),
      size: figma.enum("size", {
        Default: "default",
        Small: "small",
      }),
      state: figma.enum("state", {
        Default: "default",
        ":hover": "-hover",
        ":focus": "-focus",
      }),
      disabled: figma.boolean("disabled"),
      ghost: figma.boolean("ghost"),
    },
    example: (props) => html`<button-primary />`,
  },
)
