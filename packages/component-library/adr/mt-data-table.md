# Technical concept for new grid

## General goal of this component:

The `mt-data-table` is just a dumb component which does not contain any data logic. It just renders the UI based on
the given properties. All user interactions will just emit a corresponding event and the outside component need to
react to these events and also update the properties specific to the interaction.

The big benefit of this is that it supports every possible data source and logic because it just renders the view. This
allows the possibility to create intelligent components for data handling which are using this component just as the
view and everything else is handled inside the intelligent wrapper component.

## Component properties

The component properties contain everything to control the whole UI of the table. The table itself doesn't have any
internal data. It just renders the table based of the properties.

```ts
interface DataGridProperties {
  // general
  dataSource: dataSource;
  columns: ColumnProperty;
  search?: boolean; // default "true"
  sort?: boolean; // default "true"
  filter?: FilterProperty; // default "undefined" because filter can only be rendered with definition
  isLoading?: boolean; // default "false" - show loading skeleton of table

  // actions
  // TODO: discuss this property names because behaviour happens via events
  hideEditAction?: boolean; // default "false"
  hideDeleteAction?: boolean; // default "false"
  hideDuplicateAction?: boolean; // default "true" because duplication can be more difficult
  hideReloadAction?: boolean; // default "true" because reload can be more difficult

  // for pagination
  currentPage: number;
  limit: number;
  total: number;
  steps?: Array<number>;

  // for filter
  filters: FilteProperty;
}
```

## Data structure of column definition:

The columns will be rendered based on a column definition. This is an array with configuration objects for each
column. With this approach we provide very opinionated options which makes the rendering process very stable. Also
it can be easily extended because it just expects a simple structure.

```ts
interface ColumnDefinition {
	label: string; // the label for the column
	property: string; // the value for each entry
	renderer: 'text'|'number'|'price'; // define how each column entry should be rendered
	position: number; // the initial position of the column. Should be defined in 100 steps
	sortable?: boolean; // enable or disable sortability for this column (default=true)
	width?/flex?: number; // define the width/flex value for this column (TODO: find out which works better)
	allowResize?: boolean; // you can disable the possibility for the user to resize this column
}

type ColumnProperty = ColumnDefinition[]
```

## Data structure of table data source:

The data structure is just an array with objects inside. So almost every data structure can be represented in the table.
The developer can define the needed properties in the column definition. Only at least one unique property is needed for keying the loop to improve the Vue rendering process.

```ts
// Each data entry needs to have a unique ID otherwise Vue don't have any key value and this decreases the render performance massive.
interface dataSourceEntry {
  id: string; // TODO: check if this needs to be flexible
}

/**
 * The data source of the table is just an Array with any data. This allows a very flexible way to use data.
 * Each column get's the property which is defined in the ColumnDefinition, e.g. `dataSource[column.property]`
 * */
type dataSource = Array<dataSourceEntry>;
```

## Data structure of filter definition:

The filters are also based on a definition file to support many use cases. It just renders the needed filters and the
logic happens outside the component. All interactions and changes will also be emitted via events.

```ts
interface NumberRangeFilterDefinition {
	type: 'numberRange' /* number (from -> to )*/;
	property: string;
	position: number;
	currentFrom: number; // the active value from user input which gets emitted
	currentTo: number; // the active value from user input which gets emitted
	min?: number;
	max?: number;
}
interface SwitchFilterDefinition {
	type: 'switch';
	property: string;
	position: number;
	currentValue: boolean;
}
interface SelectionFilterDefinition {
	type: 'selection';
	property: string;
	position: number;
	currentSelections: Array<string>;
	availableSelections: Array<any>;
	selectionKey: string;
	selectionLabel: string;
}

type FilterDefinition = NumberRangeFilterDefinition|;
type FilteProperty = FilterDefinition[]
```

## Handling user inputs:

The main table component is a dumb component without logic. So every user input just emits an event and the parent component is responsible for reacting to the inputs and updating the data. The table don't directly react to user interactions directly.

Example:

- User: clicks on page 2 in the pagination
- Table: throws an event like `page-change` with the new page
- Parent component: listen to this event
- Parent component: loads the data and set `isLoading` to `true`
- Parent component: updates the property `currentPage` of the grid with `2`
- Table: prop with `currentPage` was updated so that it switches to page 2
- Table: prop with `isLoading` gets updated and renders now a skeleton
- Parent component: updates the data to represent the page 2
- Parent component: set `isLoading` to `false`
- Table: prop with `isLoading` was updated
- Table: `dataSource` with new entries was updated
- Table: render new entries

## CSS implementation

In the following it will be explained why some things are implemented the way it is now.

### General use of CSS table

The main rendering of the data table will be handled with CSS tables. The reason for this was that CSS Grid is not performant enough and Flexbox has the problem that it can't have a correlation between rows and columns. And the table is perfectly suited for this use case. Also, researches of other data grids showed, that all are using CSS tables for the rendering.

### Cell height

The height of the cell is flexible and will be calculated based on the content size. This has the big benefit that the developer don't need to know how big the content is. Another benefit is that the content can be dynamic and everything
reacts to it dynamically. A future feature like toggling more information in cells could trigger this behavior.

### Cell behavior

The cell behavior depends on the `cellWrap` behavior of each column. By default, every column has the `nowrap` behavior.

It is possible that the behavior of cells can be adjusted depending on the renderer if this is needed.

#### `normal` cell wrap behavior:

The max-width of the cell is based on the width of its content. And the minimum size is the width defined in the column definition. If the content is only text then it wraps automatically based on words. If the content is not text then it does not get wrapped.

#### `nowrap` cell wrap behavior:

The max-width of the cell is based on the width which is defined in the column definition. And the minimum size is also the width defined in the column definition. If the content is only text then it gets truncated automatically. If the content is not text then everything which extends the size of the cell just hides like a `overflow: hidden` behavior.
