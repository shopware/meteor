# stylelint-plugin-meteor

This stylelint plugin adds a handful of rules for the Meteor Design System.

## Installation

Add this package to your project:

```sh
npm i -D @shopware-ag/stylelint-plugin-meteor
```

Add this package to your stylelint config.

```json
{
  "plugins": ["@shopware-ag/stylelint-plugin-meteor"],
  "rules": {
    "meteor/prefer-sizing-token": [
      true,
      {
        "severity": "warning"
      }
    ]
  }
}
```

# Rules

- `meteor/no-primitive-token`
- `meteor/prefer-background-token`
- `meteor/prefer-border-token`
- `meteor/prefer-color-token`
- `meteor/prefer-font-token`
- `meteor/prefer-sizing-token`
