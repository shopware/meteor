---
"@shopware-ag/meteor-icon-kit": patch
---

Move Figma sync tooling (`@t3-oss/env-core`, `dotenv`, `ora`, `winston`, `zod`) from `dependencies` to `devDependencies`. These are only used by the icon sync script in `src/`, which is not part of the published package — consumers no longer install ~10 MB of unused tooling.
