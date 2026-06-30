---
title: Entity Select
description: A repository-backed select that loads its options from an Admin SDK entity repository.
---

::component-example{name="entity-select-basic-example" fullWidth}
::

## Usage

**Entity Select** is a repository-backed select that loads its options from an Admin SDK entity repository. Use it when options should come from a repository and you want built-in search and pagination for the results, or when an existing `modelValue` should be hydrated to a visible selected label.

```ts
import { MtEntitySelect } from "@shopware-ag/meteor-component-library";
```

## Examples

### With initial value

::component-example{name="entity-select-with-initial-value-example" fullWidth}
::

### Multi-selection

::component-example{name="entity-select-multi-selection-example" fullWidth}
::

### Disabled

::component-example{name="entity-select-disabled-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Pass `entity` for the default repository lookup.
- Use `repository` only when you need custom fetching behavior.
- Keep `labelProperty` and `valueProperty` aligned with the entity shape you want to show and store.

#dont

- Do not use it when options are already available locally.
- Do not duplicate search or pagination in the parent component.
- Do not assume `modelValue` stores the whole entity by default.

::

## Behavior

- The first page loads on mount.
- Search is handled through repository term lookups.
- `modelValue` stores the selected `valueProperty`, which defaults to `id`.

## Accessibility

- Use a clear visible field label so users understand what entity they are selecting.
- Keep result labels distinct so search results stay easy to understand.

## Related components

- [**Select**](/components/select): when options come from local or externally managed lists.
