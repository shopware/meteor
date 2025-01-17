# meteor/prefer-sizing-token

This rules only allows using sizing tokens for spacing i.e. margin, padding, gap, etc.

## Examples

### Incorrect

```css
a {
  margin: 10px;
}
```

```css
.grid {
  row-gap: 0.5rem;
}
```

### Correct

```css
a {
  margin: var(--scale-size-10);
}
```

```css
.grid {
  row-gap: var(--scale-size-8);
}
```

## Resources

- [Rule source](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/prefer-sizing-token/index.ts)
- [Test source](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/prefer-sizing-token/prefer-sizing-token.test.ts)
