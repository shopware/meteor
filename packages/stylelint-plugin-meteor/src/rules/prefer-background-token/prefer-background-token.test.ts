import { testRule } from "stylelint-test-rule-node";

import plugin from "./index.js";

const {
  rule: { ruleName },
} = plugin;

testRule({
  plugins: [plugin],
  ruleName,
  config: true,

  accept: [
    {
      code: "a { background-color: var(--color-interaction-primary-default); }",
    },
    {
      code: "a { background-color: currentcolor; }",
    },
    {
      code: "a { background-color: currentColor; }",
    },
    {
      code: "a { background-color: transparent; }",
    },
    {
      code: "a { background-color: inherit; }",
    },
    {
      code: "a { background-color: initial; }",
    },
    {
      code: "a { background-color: revert; }",
    },
    {
      code: "a { background-color: revert-layer; }",
    },
    {
      code: "a { background-color: unset; }",
    },
    {
      code: "a { background-color: none; }",
    },
    {
      code: 'a { background: url("test.jpg") repeat-y; }',
    },
    {
      code: "a { background: url('test.jpg'); }",
    },
    {
      code: "a { background: linear-gradient(#e66465, #9198e5); }",
    },
    {
      code: "a { background: radial-gradient(#e66465, #9198e5); }",
    },
    {
      code: "a { background: transparent var(--bs-btn-close-bg) center / 1em auto no-repeat; }",
    },
    {
      code: "a { background-color: linear-gradient(#e66465, #9198e5); }",
    },
    {
      code: "a { background-color: radial-gradient(#e66465, #9198e5); }",
    },
  ],

  reject: [
    {
      code: "a { background-color: #f00; }",
      message:
        'Unexpected non-token value for background-color "#f00", use a color token instead (meteor/prefer-background-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 28,
    },
    {
      code: "a { background-color: red; }",
      message:
        'Unexpected non-token value for background-color "red", use a color token instead (meteor/prefer-background-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 27,
    },
    {
      code: "a { background: #f00; }",
      message:
        'Unexpected non-token value for background "#f00", use a color token instead (meteor/prefer-background-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 22,
    },
    {
      code: "a { background: red; }",
      message:
        'Unexpected non-token value for background "red", use a color token instead (meteor/prefer-background-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 21,
    },
    {
      code: "a { background: $green-500; }",
      message:
        'Unexpected non-token value for background "$green-500", use a color token instead (meteor/prefer-background-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 28,
    },
    {
      code: "a { background-color: rgb(255, 0, 0); }",
      message:
        'Unexpected non-token value for background-color "rgb(255, 0, 0)", use a color token instead (meteor/prefer-background-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 38,
    },
    {
      code: "a { background-color: rgba(255, 0, 0 / 30%); }",
      message:
        'Unexpected non-token value for background-color "rgba(255, 0, 0 / 30%)", use a color token instead (meteor/prefer-background-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 45,
    },
    {
      code: "a { background-color: hsl(0, 100%, 50%); }",
      message:
        'Unexpected non-token value for background-color "hsl(0, 100%, 50%)", use a color token instead (meteor/prefer-background-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 41,
    },
    {
      code: "a { background-color: $green-800; }",
      message:
        'Unexpected non-token value for background-color "$green-800", use a color token instead (meteor/prefer-background-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 34,
    },
    {
      code: "a { background-color: grayscale(50%); }",
      message:
        'Unexpected scss color function for background-color "grayscale(50%)", use a color token instead (meteor/prefer-background-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 38,
    },
    {
      code: "a { background-color: lighten(#6b717f, 20%); }",
      message:
        'Unexpected scss color function for background-color "lighten(#6b717f, 20%)", use a color token instead (meteor/prefer-background-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 45,
    },
    {
      code: "a { background-color: darken(#6b717f, 20%); }",
      message:
        'Unexpected scss color function for background-color "darken(#6b717f, 20%)", use a color token instead (meteor/prefer-background-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 44,
    },
  ],
});
