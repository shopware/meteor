---
title: Chart
description: A data visualization for showing how values change over time.
---

::component-example{name="chart-basic-example" fullWidth}
::

## Usage

**Chart** is a data visualization for showing how values change over time, used with `type="area"`. Use it when users should compare trends, peaks, and drops across one or more series, and when a visual trend is easier to understand than a table alone.

```ts
import { MtChart } from "@shopware-ag/meteor-component-library";
```

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Keep the time scale or sequence clear by providing meaningful x-axis labels.
- Use short series names so the legend and tooltip stay easy to scan.
- Pair the chart with nearby summary text when the data drives a decision.

#dont

- Do not use an area chart when exact individual values are the primary goal.
- Do not rely on color alone to explain the data series.
- Do not use the chart as the only presentation of critical information.

::

## Behavior

- **Chart** passes `series` and `options` through to ApexCharts and merges your `options` with Meteor's default chart options.
- Changing `series`, `options`, `type`, `width`, or `height` updates the rendered chart.

## Accessibility

- Provide the chart with nearby text that explains the main takeaway, because charts are not equally accessible for every user.
- Do not use the chart alone for critical information without an accessible text or table alternative.
- Keep labels and series names concise so tooltip and axis content stays readable.
