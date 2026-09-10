---
"@shopware-ag/meteor-component-library": patch
---

mt-datepicker: fix the `locale` prop not applying in production builds. The date-fns locale was loaded through a runtime-constructed dynamic import that bundlers cannot statically analyze, so the import failed in consumer builds and the datepicker silently fell back to English month and weekday names. Locales are now loaded through statically analyzable imports, so every date-fns locale works in Vite, webpack and Rollup builds. Locale lookup is also case-insensitive now (e.g. `DE` or `en-gb` work).
