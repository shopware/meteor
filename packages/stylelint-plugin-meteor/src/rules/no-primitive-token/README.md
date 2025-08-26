# meteor/no-primitive-token

Forbid primitive tokens.

To enable propert theming of applications, like light and dark mode, you need to use
semantic tokens.

## Examples

### Incorrect

```css
a {
  color: var(--gray-800);
}
```

```css
a {
  --link-color: var(--gray-800);

  color: var(--link-color);
}
```

### Correct

```css
a {
  color: var(--color-text-primary-default);
}
```

```css
a {
  --link-color: var(--color-text-primary-default);

  color: var(--link-color);
}
```

## Resources

- [Rule source](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/no-primitive-token/index.ts)
- [Test source](https://github.com/shopware/meteor/blob/main/packages/stylelint-plugin-meteor/src/rules/no-primitive-token/no-primitive-token.test.ts)
