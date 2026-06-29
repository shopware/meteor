---
title: Search
description: A lightweight input for filtering or finding content in a list, table, or page section.
---

::component-example{name="search-basic-example" fullWidth}
::

## Usage

**Search** is a lightweight input that narrows down visible content as users type or confirm a search term. Use it for list views, data tables, or page-level finding tools when a simple search input is enough and a full form field wrapper is not needed.

```ts
import { MtSearch } from "@shopware-ag/meteor-component-library";
```

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Place **Search** close to the content it affects.
- Use a placeholder or surrounding heading that makes the search scope clear.
- Keep search behavior responsive so users quickly see what changed.

#dont

- Do not use **Search** for values that should be stored as form data.
- Do not use it when a labeled form field is the better semantic choice.
- Do not leave the search scope ambiguous.

::

## Behavior

- **Search** uses a native `type="search"` input and emits both `update:modelValue` and `change`.
- The component is intentionally lightweight and does not include the shared field wrapper used by the form field family.
- `size` can make the control more compact in dense toolbars or filter areas.

## Accessibility

- Make sure the purpose of **Search** is clear from nearby visible context if the placeholder alone is not enough.
- Keep the filtering result predictable so users understand what content the search affects.
- Ensure keyboard users can reach the input in the same order as the content it controls.

## Related components

- [**Text Field**](/components/text-field): when the value should be entered and stored as regular form data.
