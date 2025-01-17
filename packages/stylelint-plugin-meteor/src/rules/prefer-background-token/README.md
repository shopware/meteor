# meteor/prefer-background-token

This rules only allows using semantic tokens for background colors.

## Examples

### Incorrect

```css
a {
  background: red;
}
```

```css
a {
  background-color: #ff9d49;
}
```

### Correct

```css
a {
  color: var(--color-elevation-surface-overlay);
}
```

## Resources

- [Rule source](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/prefer-background-token/index.ts)
- [Test source](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/prefer-background-token/prefer-background-token.test.ts)
