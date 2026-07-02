---
title: Inset
description: A layout utility that lets content break out to the edges of a padded container, such as a Card, by consuming the container's inset spacing variables.
---

## Usage

**Inset** lets content break out to the edges of a padded container by consuming that container's inset spacing variables. Use it inside a padded surface such as [**Card**](/components/card), for example in a `footer` slot that needs its own full-width background, when an inner block should align to the container's outer edges instead of the content padding. Use it only inside components that define the inset spacing variables it consumes.

```ts
import { MtInset } from "@shopware-ag/meteor-component-library";
```

## Example

**Inset** has no visual style of its own. It reads the inset spacing variables from its container and applies matching negative margins so its content reaches the container edges:

```vue
<mt-card title="Card title">
  Regular padded content.

  <mt-inset>
    <!-- Aligns to the card edges instead of the content padding -->
    Full-bleed block inside the card.
  </mt-inset>
</mt-card>
```

## CSS variables

**Inset** pulls each edge outward by the amount its container sets on these variables. A container that does not define them (the default) leaves the content in place.

| Variable | Effect |
| --- | --- |
| `--mt-inset-block-start` | Pulls the top edge out |
| `--mt-inset-inline-end` | Pulls the right edge out |
| `--mt-inset-block-end` | Pulls the bottom edge out |
| `--mt-inset-inline-start` | Pulls the left edge out |

## Related components

- [**Card**](/components/card): when you need the full bordered surface with a header, content, and footer that defines the inset spacing for you.
