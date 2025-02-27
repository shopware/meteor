# meteor/prefer-color-token

This rules only allows using sizing tokens for spacing i.e. margin, padding, gap, etc.

## Examples

### Incorrect

```css
a {
  color: red;
}
```

```css
a {
  color: #df5dcf;
}
```

### Correct

```css
a {
  margin: var(--color-text-brand-default);
}
```

## Resources

- [Rule source](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/prefer-color-token/index.ts)
- [Test source](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/prefer-color-token/prefer-color-token.test.ts)
