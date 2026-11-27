---
"@shopware-ag/meteor-admin-sdk": minor
---

`ui.modal.open()` now resolves to a handle with `closed`, `onClose()`, `update()`, `close()` and `supportsResult`. Modals can receive `props`, read in the modal location with the new `ui.modal.getProps()`, and report a result to the opener with `ui.modal.close({ result })`. Closing by the user reports `{ reason: 'dismissed' }`.

The Administration must handle the new `props`, `onResult` and `uiModalGetProps` messages and answer `uiModalOpen` with `{ supportsResult: true }`. Older Administrations ignore the new fields: `supportsResult` is then `false` and `getProps()` returns `null`.
