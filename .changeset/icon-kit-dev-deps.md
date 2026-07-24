---
"@shopware-ag/meteor-icon-kit": patch
---

Move the Figma sync tooling (`@t3-oss/env-core`, `dotenv`, `ora`, `winston`, `zod`) to `devDependencies`. It is only used by the unpublished icon sync script — installs get ~10 MB smaller. If you imported one of these packages without declaring it, add it to your own `dependencies`.
