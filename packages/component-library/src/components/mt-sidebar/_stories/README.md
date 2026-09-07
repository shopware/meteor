# Story helpers

UI components and sample data used only by `mt-sidebar.stories.ts` in this folder. They are written as `.ts`
render-function components on purpose: every `.vue` file below `src/` becomes a build entry of the
library (see `getAllComponents` in `build/helper.ts`), and these must not ship.
