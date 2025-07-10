# meteor/prefer-border-token

This rules only allows using border tokens for border colors.

## Examples

### Incorrect

```css
button {
  border: 1px solid red;
}
```

```css
button {
  border-color: #df5dcf;
}
```

### Correct

```css
button {
  border: 1px solid var(--color-border-brand-selected);
}
```

```css
button {
  border-color: var(--color-border-primary-default);
}
```

## Resources

- [Rule source](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/prefer-border-token/index.ts)
- [Test source](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/prefer-border-token/prefer-border-token.test.ts)
