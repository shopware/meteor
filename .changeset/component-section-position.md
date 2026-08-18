---
"@shopware-ag/meteor-admin-sdk": minor
---

Add optional `priority` to `ui.componentSection.add` to control the render order when multiple extensions register a component at the same `positionId`. Lower values render first (`1` = topmost); omitted or invalid values render after prioritized entries.
