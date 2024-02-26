---
title: Circular dependencies
date: 26.02.2024
---

## Context
The project has suffered from circular import dependencies. What is a circular dependency?
Take this for example:

```javascript
import { findExtensionByBaseUrl } from '../../channel';

// ...
```
*_internals/validator/index.ts*

```javascript
import validate from './_internals/validator';

// ...
```
*channel.ts*

In the above example the `_internals/validator/index.ts` file imports something from `channel.ts`. The channel file on the other hand imports something from the validator.
Typescript, or to be more precise `tsc` is able to resolve these kind of imports. Jest + Typescript is not able to resolve circular imports.

## Decision
We don't allow circular dependencies in this project. We see them as programmatic errors and introduced a npm script to check for such circular dependencies.
You can call the script with `npm run circular-dependencies`. This script was also added as the first step to `npm run test:unit:watch` as the errors Jest produces don't suggest circular dependencies.
This way it's assured that a developer notices the errors. The pipeline also executes the `npm run circular-dependencies` script so these don't go unnoticed.
