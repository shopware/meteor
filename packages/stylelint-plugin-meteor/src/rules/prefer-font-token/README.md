# meteor/prefer-font-token

This rules only allows using font tokens for typograhpy related properties i.e. font-weight,
font-family, font-size, etc.

## Examples

### Incorrect

```css
a {
  font-size: 16px;
}
```

```css
a {
  font-family: Inter;
}
```

### Correct

```css
a {
  font-size: var(--font-size-s);
}
```

```css
a {
  font-family: var(--font-family-body);
}
```

## Resources

- [Rule source](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/prefer-font-token/index.ts)
- [Test source](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/prefer-font-token/prefer-font-token.test.ts)
