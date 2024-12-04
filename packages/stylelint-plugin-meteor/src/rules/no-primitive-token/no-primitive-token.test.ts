import { testRule } from "stylelint-test-rule-node";
import stylelint from "stylelint";
import { makeNoPrimitiveRule } from "./index.js";
import { InMemoryTokenGateway } from "./infrastructure/InMemoryTokenGateway.js";

const { createPlugin } = stylelint;

const rule = makeNoPrimitiveRule({
  tokenGateway: new InMemoryTokenGateway([
    "green-500",
    "slate-300",
    "scale-size-4",
  ]),
});

const plugin = createPlugin(rule.ruleName, rule);

testRule({
  plugins: [plugin],
  ruleName: rule.ruleName,
  config: true,

  accept: [
    {
      code: "a { background-color: var(--color-interaction-primary-default); }",
    },
    {
      code: "a { background-color: currentcolor; }",
    },
    {
      code: "a { background-color: unset; }",
    },
    {
      code: "a { background-color: initial; }",
    },
    {
      code: "a { background-color: transparent; }",
    },
    {
      code: "a { background-color: red; }",
    },
    {
      code: "a { background-color: #fff; }",
    },
    {
      code: "a { background-color: rgb(1, 56, 56); }",
    },
    {
      code: "a { background-color: hsl(254, 45%, 60%); }",
    },
    {
      code: "a { background-color: var(--some-custom-property); }",
    },
    {
      code: "a { background-color: var(--scale-size-4); }",
    },
    {
      code: "a { margin: var(--scale-size-4) var(--scale-size-8); }",
    },
    {
      code: "a { border: 1px solid var(--color-border-brand-selected); }",
    },
    {
      code: "a { --foo: var(--scale-size-4); }",
    },
  ],

  reject: [
    {
      code: "a { background: var(--green-500); }",
      message:
        'Unexpected primitve token "green-500" for background, use a semantic token instead (meteor/no-primitive-token)',
      line: 1,
      endLine: 1,
      column: 5,
      endColumn: 34,
    },
    {
      code: "a { color: var(--slate-300); }",
      message:
        'Unexpected primitve token "slate-300" for color, use a semantic token instead (meteor/no-primitive-token)',
      line: 1,
      endLine: 1,
      column: 5,
      endColumn: 29,
    },
    {
      code: "a { border: 1px solid var(--green-500); }",
      message:
        'Unexpected primitve token "green-500" for border, use a semantic token instead (meteor/no-primitive-token)',
      line: 1,
      endLine: 1,
      column: 5,
      endColumn: 40,
    },
    {
      code: "a { margin: var(--scale-size-4) var(--green-500); }",
      message:
        'Unexpected primitve token "green-500" for margin, use a semantic token instead (meteor/no-primitive-token)',
      line: 1,
      endLine: 1,
      column: 5,
      endColumn: 50,
    },
    {
      code: "a { padding: var(--slate-300) var(--green-500); }",
      warnings: [
        {
          message:
            'Unexpected primitve token "slate-300" for padding, use a semantic token instead (meteor/no-primitive-token)',
          line: 1,
          column: 5,
          endLine: 1,
          endColumn: 48,
        },
        {
          message:
            'Unexpected primitve token "green-500" for padding, use a semantic token instead (meteor/no-primitive-token)',
          line: 1,
          column: 5,
          endLine: 1,
          endColumn: 48,
        },
      ],
    },
    {
      code: "a { --foo: var(--green-500); }",
      message:
        'Unexpected primitve token "green-500" for --foo, use a semantic token instead (meteor/no-primitive-token)',
      line: 1,
      endLine: 1,
      column: 5,
      endColumn: 29,
    },
  ],
});
