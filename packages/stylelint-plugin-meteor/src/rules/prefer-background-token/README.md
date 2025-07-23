# meteor/prefer-background-token

This rules only allows using semantic tokens for background colors.

## Examples

### Incorrect

```css
div {
  background: red;
}
```

```css
div {
  background-color: #ff9d49;
}
```

### Correct

```css
div {
  background: var(--color-background-primary-default);
}
```

```css
div {
  background-color: var(--color-elevation-surface-default);
}
```

## Resources

- [Rule source](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/prefer-background-token/index.ts)
- [Test source](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/prefer-background-token/prefer-background-token.test.ts)
