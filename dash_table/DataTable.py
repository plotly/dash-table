# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class DataTable(Component):
    """A DataTable component.


Keyword arguments:
- active_cell (optional): The row and column indices and IDs of the currently active cell.. active_cell has the following type: dict containing keys 'row', 'column', 'row_id', 'column_id'.
Those keys have the following types:
  - row (number; optional)
  - column (number; optional)
  - row_id (string | number; optional)
  - column_id (string; optional)
- columns (optional): Columns describes various aspects about each individual column.
`name` and `id` are the only required parameters.. columns has the following type: list of dict containing keys 'deletable', 'editable', 'renamable', 'format', 'id', 'name', 'presentation', 'on_change', 'sort_as_null', 'validation', 'type'.
Those keys have the following types:
  - deletable (boolean | list of booleans; optional): If True, the user can delete the column by clicking on a little `x`
button on the column.
If there are merged, multi-header columns then you can choose
which column header row to display the "x" in by
supplying an array of booleans.
For example, `[true, false]` will display the "x" on the first row,
but not the second row.
If the "x" appears on a merged column, then clicking on that button
will delete *all* of the merged columns associated with it.
  - editable (boolean; optional): There are two `editable` flags in the table.
This is the  column-level editable flag and there is
also the table-level `editable` flag.

These flags determine whether the contents of the table
are editable or not.

If the column-level `editable` flag is set it overrides
the table-level `editable` flag for that column.
  - renamable (boolean | list of booleans; optional): If True, then the name of this column is editable.
If there are multiple column headers (if `name` is a list of strings),
then `renamable` can refer to _which_ column header should be
editable by defining an array of booleans.
For example, `[true, false]` will make the first row's name editable,
but not the second row.
Also, updating the name in a merged column header cell will
update the name of each column.
  - format (optional): The formatting applied to the column's data.

This prop is derived from the [d3-format](https://github.com/d3/d3-format) library specification. Apart from
being structured slightly differently (under a single prop), the usage
is the same.

'locale': represents localization specific formatting information
  When left unspecified, will use the default value provided by d3-format.

  'symbol': (default: ['$', '']) a list of two strings representing the
  prefix and suffix symbols. Typically used for currency, and implemented using d3's
  currency format, but you can use this for other symbols such as measurement units.
  'decimal': (default: '.') the string used for the decimal separator
  'group': (default: ',') the string used for the groups separator
  'grouping': (default: [3]) a list of integers representing the grouping pattern
  'numerals': a list of ten strings used as replacements for numbers 0-9
  'percent': (default: '%') the string used for the percentage symbol
  'separate_4digits': (default: True) separate integers with 4-digits or less

'nully': a value that will be used in place of the nully value during formatting
  If the value type matches the column type, it will be formatted normally
'prefix': a number representing the SI unit to use during formatting
  See `dash_table.Format.Prefix` enumeration for the list of valid values
'specifier': (default: '') represents the rules to apply when formatting the number

dash_table.FormatTemplate contains helper functions to rapidly use certain
typical number formats.. format has the following type: dict containing keys 'locale', 'nully', 'prefix', 'specifier'.
Those keys have the following types:
  - locale (optional): . locale has the following type: dict containing keys 'symbol', 'decimal', 'group', 'grouping', 'numerals', 'percent', 'separate_4digits'.
Those keys have the following types:
  - symbol (list of strings; optional)
  - decimal (string; optional)
  - group (string; optional)
  - grouping (list of numbers; optional)
  - numerals (list of strings; optional)
  - percent (string; optional)
  - separate_4digits (boolean; optional)
  - nully (boolean | number | string | dict | list; optional)
  - prefix (number; optional)
  - specifier (string; optional)
  - id (string; required): The `id` of the column.
The column `id` is used to match cells in data
with particular columns.
The `id` is not visible in the table.
  - name (string | list of strings; required): The `name` of the column,
as it appears in the column header.
If `name` is a list of strings, then the columns
will render with multiple headers rows.
  - presentation (a value equal to: 'input', 'dropdown'; optional): The `presentation` to use to display the value.
Defaults to 'input' for ['numeric', 'text', 'any'].
  - on_change (optional): The `on_change` behavior of the column for user-initiated modifications.
'action' (default 'coerce'):
 none: do not validate data
 coerce: check if the data corresponds to the destination type and
 attempts to coerce it into the destination type if not
 validate: check if the data corresponds to the destination type (no coercion)

'failure' (default 'reject'): what to do with the value if the action fails
 accept: use the invalid value
 default: replace the provided value with `validation.default`
 reject: do not modify the existing value. on_change has the following type: dict containing keys 'action', 'failure'.
Those keys have the following types:
  - action (a value equal to: 'coerce', 'none', 'validate'; optional)
  - failure (a value equal to: 'accept', 'default', 'reject'; optional)
  - sort_as_null (list of string | number | booleans; optional): An array of string, number and boolean values that are treated as `null`
(i.e. ignored and always displayed last) when sorting.
This value overrides the table-level `sort_as_null`.
  - validation (optional): The `validation` options.
'allow_null': Allow the use of nully values (undefined, null, NaN) (default: false)
'default': The default value to apply with on_change.failure = 'default' (default: null)
'allow_YY': `datetime` columns only, allow 2-digit years (default: false).
  If true, we interpret years as ranging from now-70 to now+29 - in 2019
  this is 1949 to 2048 but in 2020 it will be different. If used with
  `action: 'coerce'`, will convert user input to a 4-digit year.. validation has the following type: dict containing keys 'allow_null', 'default', 'allow_YY'.
Those keys have the following types:
  - allow_null (boolean; optional)
  - default (boolean | number | string | dict | list; optional)
  - allow_YY (boolean; optional)
  - type (a value equal to: 'any', 'numeric', 'text', 'datetime'; optional): The data-type of the column's data.
'numeric': represents both floats and ints
'text': represents a string
'datetime': a string representing a date or date-time, in the form:
  'YYYY-MM-DD HH:MM:SS.ssssss' or some truncation thereof. Years must
  have 4 digits, unless you use `validation.allow_YY: true`. Also
  accepts 'T' or 't' between date and time, and allows timezone info
  at the end. To convert these strings to Python `datetime` objects,
  use `dateutil.parser.isoparse`. In R use `parse_iso_8601` from the
  `parsedate` library.
  WARNING: these parsers do not work with 2-digit years, if you use
  `validation.allow_YY: true` and do not coerce to 4-digit years.
  And parsers that do work with 2-digit years may make a different
  guess about the century than we make on the front end.
'any': represents any type of data

Defaults to 'any' if undefined.

NOTE: This feature has not been fully implemented.
In the future, it's data types will impact things like
text formatting options in the cell (e.g. display 2 decimals
for a number), filtering options and behavior, and editing
behavior.
Stay tuned by following [https://github.com/plotly/dash-table/issues/166](https://github.com/plotly/dash-table/issues/166)s
- locale_format (optional): The localization specific formatting information applied to all columns in the table.

This prop is derived from the [d3.formatLocale](https://github.com/d3/d3-format#formatLocale) data structure specification.

When left unspecified, each individual nested prop will default to a pre-determined value.

  'symbol': (default: ['$', '']) a list of two strings representing the
  prefix and suffix symbols. Typically used for currency, and implemented using d3's
  currency format, but you can use this for other symbols such as measurement units.
  'decimal': (default: '.') the string used for the decimal separator
  'group': (default: ',') the string used for the groups separator
  'grouping': (default: [3]) a list of integers representing the grouping pattern
  'numerals': a list of ten strings used as replacements for numbers 0-9
  'percent': (default: '%') the string used for the percentage symbol
  'separate_4digits': (default: True) separate integers with 4-digits or less. locale_format has the following type: dict containing keys 'symbol', 'decimal', 'group', 'grouping', 'numerals', 'percent', 'separate_4digits'.
Those keys have the following types:
  - symbol (list of strings; optional)
  - decimal (string; optional)
  - group (string; optional)
  - grouping (list of numbers; optional)
  - numerals (list of strings; optional)
  - percent (string; optional)
  - separate_4digits (boolean; optional)
- css (optional): The `css` property is a way to embed CSS selectors and rules
onto the page.
We recommend starting with the `style_*` properties
before using this `css` property.

Example:
[
    {"selector": ".dash-spreadsheet", "rule": 'font-family: "monospace"'}
]. css has the following type: list of dict containing keys 'selector', 'rule'.
Those keys have the following types:
  - selector (string; required)
  - rule (string; required)s
- data (list of dicts; optional): The contents of the table.
The keys of each item in data should match the column IDs.
Each item can also have an 'id' key, whose value is its row ID. If there
is a column with ID='id' this will display the row ID, otherwise it is
just used to reference the row for selections, filtering, etc.

Example:

[
     {'column-1': 4.5, 'column-2': 'montreal', 'column-3': 'canada'},
     {'column-1': 8, 'column-2': 'boston', 'column-3': 'america'}
]
- data_previous (list of dicts; optional): The previous state of `data`. `data_previous`
has the same structure as `data` and it will be updated
whenever `data` changes, either through a callback or
by editing the table.
This is a read-only property: setting this property will not
have any impact on the table.
- data_timestamp (number; optional): The unix timestamp when the data was last edited.
Use this property with other timestamp properties
(such as `n_clicks_timestamp` in `dash_html_components`)
to determine which property has changed within a callback.
- editable (boolean; optional): If True, then the data in all of the cells is editable.
When `editable` is True, particular columns can be made
uneditable by setting `editable` to `False` inside the `columns`
property.

If False, then the data in all of the cells is uneditable.
When `editable` is False, particular columns can be made
editable by setting `editable` to `True` inside the `columns`
property.
- end_cell (optional): When selecting multiple cells
(via clicking on a cell and then shift-clicking on another cell),
`end_cell` represents the row / column coordinates and IDs of the cell
in one of the corners of the region.
`start_cell` represents the coordinates of the other corner.. end_cell has the following type: dict containing keys 'row', 'column', 'row_id', 'column_id'.
Those keys have the following types:
  - row (number; optional)
  - column (number; optional)
  - row_id (string | number; optional)
  - column_id (string; optional)
- id (string; optional): The ID of the table.
- is_focused (boolean; optional): If True, then the `active_cell` is in a focused state.
- merge_duplicate_headers (boolean; optional): If True, then column headers that have neighbors with duplicate names
will be merged into a single cell.
This will be applied for single column headers and multi-column
headers.
- fixed_columns (optional): `fixed_columns` will "fix" the set of columns so that
they remain visible when scrolling horizontally across
the unfixed columns. `fixed_columns` fixes columns
from left-to-right.

If `headers` is False, no columns are fixed.
If `headers` is True, all operation columns (see `row_deletable` and `row_selectable`)
are fixed. Additional data columns can be fixed by
assigning a number to `data`.

Defaults to `{ headers: False }`.

Note that fixing columns introduces some changes to the
underlying markup of the table and may impact the
way that your columns are rendered or sized.
View the documentation examples to learn more.. fixed_columns has the following type: dict containing keys 'headers', 'data'.
Those keys have the following types:
  - headers (a value equal to: false; optional)
  - data (a value equal to: 0; optional) | dict containing keys 'headers', 'data'.
Those keys have the following types:
  - headers (a value equal to: true; required)
  - data (number; optional)
- fixed_rows (optional): `fixed_rows` will "fix" the set of rows so that
they remain visible when scrolling vertically down
the table. `fixed_rows` fixes rows
from top-to-bottom, starting from the headers.

If `headers` is False, no rows are fixed.
If `headers` is True, all header and filter rows (see `filter_action`) are
fixed. Additional data rows can be fixed by assigning
a number to `data`.

Defaults to `{ headers: False }`.

Note that fixing rows introduces some changes to the
underlying markup of the table and may impact the
way that your columns are rendered or sized.
View the documentation examples to learn more.. fixed_rows has the following type: dict containing keys 'headers', 'data'.
Those keys have the following types:
  - headers (a value equal to: false; optional)
  - data (a value equal to: 0; optional) | dict containing keys 'headers', 'data'.
Those keys have the following types:
  - headers (a value equal to: true; required)
  - data (number; optional)
- row_deletable (boolean; optional): If True, then a `x` will appear next to each `row`
and the user can delete the row.
- row_selectable (a value equal to: 'single', 'multi', false; optional): If `single`, then the user can select a single row
via a radio button that will appear next to each row.
If `multi`, then the user can select multiple rows
via a checkbox that will appear next to each row.
If `False`, then the user will not be able to select rows
and no additional UI elements will appear.

When a row is selected, its index will be contained
in `selected_rows`.
- selected_cells (optional): `selected_cells` represents the set of cells that are selected,
as an array of objects, each item similar to `active_cell`.
Multiple cells can be selected by holding down shift and
clicking on a different cell or holding down shift and navigating
with the arrow keys.. selected_cells has the following type: list of dict containing keys 'row', 'column', 'row_id', 'column_id'.
Those keys have the following types:
  - row (number; optional)
  - column (number; optional)
  - row_id (string | number; optional)
  - column_id (string; optional)s
- selected_rows (list of numbers; optional): `selected_rows` contains the indices of rows that
are selected via the UI elements that appear when
`row_selectable` is `'single'` or `'multi'`.
- selected_row_ids (list of string | numbers; optional): `selected_row_ids` contains the ids of rows that
are selected via the UI elements that appear when
`row_selectable` is `'single'` or `'multi'`.
- start_cell (optional): When selecting multiple cells
(via clicking on a cell and then shift-clicking on another cell),
`start_cell` represents the [row, column] coordinates of the cell
in one of the corners of the region.
`end_cell` represents the coordinates of the other corner.. start_cell has the following type: dict containing keys 'row', 'column', 'row_id', 'column_id'.
Those keys have the following types:
  - row (number; optional)
  - column (number; optional)
  - row_id (string | number; optional)
  - column_id (string; optional)
- style_as_list_view (boolean; optional): If True, then the table will be styled like a list view
and not have borders between the columns.
- page_action (a value equal to: 'custom', 'native', 'none'; optional): `page_action` refers to a mode of the table where
not all of the rows are displayed at once: only a subset
are displayed (a "page") and the next subset of rows
can viewed by clicking "Next" or "Previous" buttons
at the bottom of the page.

Pagination is used to improve performance: instead of
rendering all of the rows at once (which can be expensive),
we only display a subset of them.

With pagination, we can either page through data that exists
in the table (e.g. page through `10,000` rows in `data` `100` rows at a time)
or we can update the data on-the-fly with callbacks
when the user clicks on the "Previous" or "Next" buttons.
These modes can be toggled with this `page_action` parameter:
- `'native'`: all data is passed to the table up-front, paging logic is
handled by the table
- `'custom'`: data is passed to the table one page at a time, paging logic
is handled via callbacks
- `none`: disables paging, render all of the data at once
- page_current (number; optional): `page_current` represents which page the user is on.
Use this property to index through data in your callbacks with
backend paging.
- page_size (number; optional): `page_size` represents the number of rows that will be
displayed on a particular page when `page_action` is `'custom'` or `'native'`
- dropdown (optional): `dropdown` specifies dropdown options for different columns.

Each entry refers to the column ID.
The `clearable` property defines whether the value can be deleted.
The `options` property refers to the `options` of the dropdown.. dropdown has the following type: dict with strings as keys and values of type dict containing keys 'clearable', 'options'.
Those keys have the following types:
  - clearable (boolean; optional)
  - options (required): . options has the following type: list of dict containing keys 'label', 'value'.
Those keys have the following types:
  - label (string; required)
  - value (number | string; required)s
- dropdown_conditional (optional): `dropdown_conditional` specifies dropdown options in various columns and cells.

This property allows you to specify different dropdowns
depending on certain conditions. For example, you may
render different "city" dropdowns in a row depending on the
current value in the "state" column.. dropdown_conditional has the following type: list of dict containing keys 'clearable', 'if', 'options'.
Those keys have the following types:
  - clearable (boolean; optional)
  - if (optional): . if has the following type: dict containing keys 'column_id', 'filter_query'.
Those keys have the following types:
  - column_id (string; optional)
  - filter_query (string; optional)
  - options (required): . options has the following type: list of dict containing keys 'label', 'value'.
Those keys have the following types:
  - label (string; required)
  - value (number | string; required)ss
- dropdown_data (optional): `dropdown_data` specifies dropdown options on a row-by-row, column-by-column basis.

Each item in the array corresponds to the corresponding dropdowns for the `data` item
at the same index. Each entry in the item refers to the Column ID.. dropdown_data has the following type: list of dict with strings as keys and values of type dict containing keys 'clearable', 'options'.
Those keys have the following types:
  - clearable (boolean; optional)
  - options (required): . options has the following type: list of dict containing keys 'label', 'value'.
Those keys have the following types:
  - label (string; required)
  - value (number | string; required)ss
- tooltip (optional): `tooltip` represents the tooltip shown
for different columns.
The `property` name refers to the column ID.
The `type` refers to the type of tooltip syntax used
for the tooltip generation. Can either be `markdown`
or `text`. Defaults to `text`.
The `value` refers to the syntax-based content of
the tooltip. This value is required.
The `delay` represents the delay in milliseconds before
the tooltip is shown when hovering a cell. This overrides
the table's `tooltip_delay` property. If set to `null`,
the tooltip will be shown immediately.
The `duration` represents the duration in milliseconds
during which the tooltip is shown when hovering a cell.
This overrides the table's `tooltip_duration` property.
If set to `null`, the tooltip will not disappear.

Alternatively, the value of the property can also be
a plain string. The `text` syntax will be used in
that case.. tooltip has the following type: dict with strings as keys and values of type dict containing keys 'delay', 'duration', 'type', 'value'.
Those keys have the following types:
  - delay (number; optional)
  - duration (number; optional)
  - type (a value equal to: 'text', 'markdown'; optional)
  - value (string; required) | string
- tooltip_conditional (optional): `tooltip_conditional` represents the tooltip shown
for different columns and cells.

This property allows you to specify different tooltips for
depending on certain conditions. For example, you may have
different tooltips in the same column based on the value
of a certain data property.

Priority is from first to last defined conditional tooltip
in the list. Higher priority (more specific) conditional
tooltips should be put at the beginning of the list.

The `if` refers to the condition that needs to be fulfilled
in order for the associated tooltip configuration to be
used. If multiple conditions are defined, all conditions
must be met for the tooltip to be used by a cell.

The `if` nested property `column_id` refers to the column
ID that must be matched.
The `if` nested property `row_index` refers to the index
of the row in the source `data`.
The `if` nested property `filter_query` refers to the query that
must evaluate to True.

The `type` refers to the type of tooltip syntax used
for the tooltip generation. Can either be `markdown`
or `text`. Defaults to `text`.
The `value` refers to the syntax-based content of
the tooltip. This value is required.
The `delay` represents the delay in milliseconds before
the tooltip is shown when hovering a cell. This overrides
the table's `tooltip_delay` property. If set to `null`,
the tooltip will be shown immediately.
The `duration` represents the duration in milliseconds
during which the tooltip is shown when hovering a cell.
This overrides the table's `tooltip_duration` property.
If set to `null`, the tooltip will not disappear.. tooltip_conditional has the following type: list of dict containing keys 'delay', 'duration', 'if', 'type', 'value'.
Those keys have the following types:
  - delay (number; optional)
  - duration (number; optional)
  - if (required): . if has the following type: dict containing keys 'column_id', 'filter_query', 'row_index'.
Those keys have the following types:
  - column_id (string; optional)
  - filter_query (string; optional)
  - row_index (number | a value equal to: 'odd', 'even'; optional)
  - type (a value equal to: 'text', 'markdown'; optional)
  - value (string; required)s
- tooltip_data (optional): `tooltip_data` represents the tooltip shown
for different columns and cells.
The `property` name refers to the column ID. Each property
contains a list of tooltips mapped to the source `data`
row index.

The `type` refers to the type of tooltip syntax used
for the tooltip generation. Can either be `markdown`
or `text`. Defaults to `text`.
The `value` refers to the syntax-based content of
the tooltip. This value is required.
The `delay` represents the delay in milliseconds before
the tooltip is shown when hovering a cell. This overrides
the table's `tooltip_delay` property. If set to `null`,
the tooltip will be shown immediately.
The `duration` represents the duration in milliseconds
during which the tooltip is shown when hovering a cell.
This overrides the table's `tooltip_duration` property.
If set to `null`, the tooltip will not disappear.

Alternatively, the value of the property can also be
a plain string. The `text` syntax will be used in
that case.. tooltip_data has the following type: list of dict with strings as keys and values of type string | dict containing keys 'delay', 'duration', 'type', 'value'.
Those keys have the following types:
  - delay (number; optional)
  - duration (number; optional)
  - type (a value equal to: 'text', 'markdown'; optional)
  - value (string; required)s
- tooltip_delay (number; optional): `tooltip_delay` represents the table-wide delay in milliseconds before
the tooltip is shown when hovering a cell. If set to `null`, the tooltip
will be shown immediately.

Defaults to 350.
- tooltip_duration (number; optional): `tooltip_duration` represents the table-wide duration in milliseconds
during which the tooltip will be displayed when hovering a cell. If
set to `null`, the tooltip will not disappear.

Defaults to 2000.
- filter_query (string; optional): If `filter_action` is enabled, then the current filtering
string is represented in this `filter_query`
property.
- filter_action (a value equal to: 'custom', 'native', 'none'; optional): The `filter_action` property controls the behavior of the `filtering` UI.

If `'none'`, then the filtering UI is not displayed
If `'native'`, then the filtering UI is displayed and the filtering
logic is handled by the table. That is, it is performed on the data
that exists in the `data` property.
If `'custom'`, then the filtering UI is displayed but it is the
responsibility of the developer to program the filtering
through a callback (where `filter_query` or `derived_filter_query_structure` would be the input
and `data` would be the output).
- sort_action (a value equal to: 'custom', 'native', 'none'; optional): The `sort_action` property enables data to be
sorted on a per-column basis.

If `'none'`, then the sorting UI is not displayed.
If `'native'`, then the sorting UI is displayed and the sorting
logic is hanled by the table. That is, it is performed on the data
that exists in the `data` property.
If `'custom'`, the the sorting UI is displayed but it is the
responsibility of the developer to program the sorting
through a callback (where `sort_by` would be the input and `data`
would be the output).

Clicking on the sort arrows will update the
`sort_by` property.
- sort_mode (a value equal to: 'single', 'multi'; optional): Sorting can be performed across multiple columns
(e.g. sort by country, sort within each country,
 sort by year) or by a single column.

NOTE - With multi-column sort, it's currently
not possible to determine the order in which
the columns were sorted through the UI.
See [https://github.com/plotly/dash-table/issues/170](https://github.com/plotly/dash-table/issues/170)
- sort_by (optional): `sort_by` describes the current state
of the sorting UI.
That is, if the user clicked on the sort arrow
of a column, then this property will be updated
with the column ID and the direction
(`asc` or `desc`) of the sort.
For multi-column sorting, this will be a list of
sorting parameters, in the order in which they were
clicked.. sort_by has the following type: list of dict containing keys 'column_id', 'direction'.
Those keys have the following types:
  - column_id (string; required)
  - direction (a value equal to: 'asc', 'desc'; required)s
- sort_as_null (list of string | number | booleans; optional): An array of string, number and boolean values that are treated as `null`
(i.e. ignored and always displayed last) when sorting.
This value will be used by columns without `sort_as_null`.

Defaults to `[]`.
- style_table (dict; optional): CSS styles to be applied to the outer `table` container.

This is commonly used for setting properties like the
width or the height of the table.
- style_cell (dict; optional): CSS styles to be applied to each individual cell of the table.

This includes the header cells, the `data` cells, and the filter
cells.
- style_data (dict; optional): CSS styles to be applied to each individual data cell.

That is, unlike `style_cell`, it excludes the header and filter cells.
- style_filter (dict; optional): CSS styles to be applied to the filter cells.

Note that this may change in the future as we build out a
more complex filtering UI.
- style_header (dict; optional): CSS styles to be applied to each individual header cell.

That is, unlike `style_cell`, it excludes the `data` and filter cells.
- style_cell_conditional (optional): Conditional CSS styles for the cells.

This can be used to apply styles to cells on a per-column basis.. style_cell_conditional has the following type: list of dict containing keys 'if'.
Those keys have the following types:
  - if (optional): . if has the following type: dict containing keys 'column_id', 'column_type'.
Those keys have the following types:
  - column_id (string; optional)
  - column_type (a value equal to: 'any', 'numeric', 'text', 'datetime'; optional)s
- style_data_conditional (optional): Conditional CSS styles for the data cells.

This can be used to apply styles to data cells on a per-column basis.. style_data_conditional has the following type: list of dict containing keys 'if'.
Those keys have the following types:
  - if (optional): . if has the following type: dict containing keys 'column_id', 'column_type', 'filter_query', 'row_index', 'column_editable'.
Those keys have the following types:
  - column_id (string; optional)
  - column_type (a value equal to: 'any', 'numeric', 'text', 'datetime'; optional)
  - filter_query (string; optional)
  - row_index (number | a value equal to: 'odd', 'even'; optional)
  - column_editable (boolean; optional)s
- style_filter_conditional (optional): Conditional CSS styles for the filter cells.

This can be used to apply styles to filter cells on a per-column basis.. style_filter_conditional has the following type: list of dict containing keys 'if'.
Those keys have the following types:
  - if (optional): . if has the following type: dict containing keys 'column_id', 'column_type', 'column_editable'.
Those keys have the following types:
  - column_id (string; optional)
  - column_type (a value equal to: 'any', 'numeric', 'text', 'datetime'; optional)
  - column_editable (boolean; optional)s
- style_header_conditional (optional): Conditional CSS styles for the header cells.

This can be used to apply styles to header cells on a per-column basis.. style_header_conditional has the following type: list of dict containing keys 'if'.
Those keys have the following types:
  - if (optional): . if has the following type: dict containing keys 'column_id', 'column_type', 'header_index', 'column_editable'.
Those keys have the following types:
  - column_id (string; optional)
  - column_type (a value equal to: 'any', 'numeric', 'text', 'datetime'; optional)
  - header_index (number | a value equal to: 'odd', 'even'; optional)
  - column_editable (boolean; optional)s
- virtualization (boolean; optional): This property tells the table to use virtualization when rendering.

Assumptions are that:
- the width of the columns is fixed
- the height of the rows is always the same
- runtime styling changes will not affect width and height vs. first rendering
- derived_filter_query_structure (dict; optional): This property represents the current structure of
`filter_query` as a tree structure. Each node of the
query structure have:
- type (string; required)
  - 'open-block'
  - 'logical-operator'
  - 'relational-operator'
  - 'unary-operator'
  - 'expression'
- subType (string; optional)
  - 'open-block': '()'
  - 'logical-operator': '&&', '||'
  - 'relational-operator': '=', '>=', '>', '<=', '<', '!=', 'contains'
  - 'unary-operator': '!', 'is bool', 'is even', 'is nil', 'is num', 'is object', 'is odd', 'is prime', 'is str'
  - 'expression': 'value', 'field'
- value (any)
  - 'expression, value': passed value
  - 'expression, field': the field/prop name

- block (nested query structure; optional)
- left (nested query structure; optional)
- right (nested query structure; optional)

If the query is invalid or empty, the `derived_filter_query_structure` will
be null.
- derived_viewport_data (list of dicts; optional): This property represents the current state of `data`
on the current page. This property will be updated
on paging, sorting, and filtering.
- derived_viewport_indices (list of numbers; optional): `derived_viewport_indices` indicates the order in which the original
rows appear after being filtered, sorted, and/or paged.
`derived_viewport_indices` contains indices for the current page,
while `derived_virtual_indices` contains indices across all pages.
- derived_viewport_row_ids (list of string | numbers; optional): `derived_viewport_row_ids` lists row IDs in the order they appear
after being filtered, sorted, and/or paged.
`derived_viewport_row_ids` contains IDs for the current page,
while `derived_virtual_row_ids` contains IDs across all pages.
- derived_viewport_selected_rows (list of numbers; optional): `derived_viewport_selected_rows` represents the indices of the
`selected_rows` from the perspective of the `derived_viewport_indices`.
- derived_viewport_selected_row_ids (list of string | numbers; optional): `derived_viewport_selected_row_ids` represents the IDs of the
`selected_rows` on the currently visible page.
- derived_virtual_data (list of dicts; optional): This property represents the visible state of `data`
across all pages after the front-end sorting and filtering
as been applied.
- derived_virtual_indices (list of numbers; optional): `derived_virtual_indices` indicates the order in which the original
rows appear after being filtered and sorted.
`derived_viewport_indices` contains indices for the current page,
while `derived_virtual_indices` contains indices across all pages.
- derived_virtual_row_ids (list of string | numbers; optional): `derived_virtual_row_ids` indicates the row IDs in the order in which
they appear after being filtered and sorted.
`derived_viewport_row_ids` contains IDs for the current page,
while `derived_virtual_row_ids` contains IDs across all pages.
- derived_virtual_selected_rows (list of numbers; optional): `derived_virtual_selected_rows` represents the indices of the
 `selected_rows` from the perspective of the `derived_virtual_indices`.
- derived_virtual_selected_row_ids (list of string | numbers; optional): `derived_virtual_selected_row_ids` represents the IDs of the
`selected_rows` as they appear after filtering and sorting,
across all pages."""
    @_explicitize_args
    def __init__(self, active_cell=Component.UNDEFINED, columns=Component.UNDEFINED, locale_format=Component.UNDEFINED, css=Component.UNDEFINED, data=Component.UNDEFINED, data_previous=Component.UNDEFINED, data_timestamp=Component.UNDEFINED, editable=Component.UNDEFINED, end_cell=Component.UNDEFINED, id=Component.UNDEFINED, is_focused=Component.UNDEFINED, merge_duplicate_headers=Component.UNDEFINED, fixed_columns=Component.UNDEFINED, fixed_rows=Component.UNDEFINED, row_deletable=Component.UNDEFINED, row_selectable=Component.UNDEFINED, selected_cells=Component.UNDEFINED, selected_rows=Component.UNDEFINED, selected_row_ids=Component.UNDEFINED, start_cell=Component.UNDEFINED, style_as_list_view=Component.UNDEFINED, page_action=Component.UNDEFINED, page_current=Component.UNDEFINED, page_size=Component.UNDEFINED, dropdown=Component.UNDEFINED, dropdown_conditional=Component.UNDEFINED, dropdown_data=Component.UNDEFINED, tooltip=Component.UNDEFINED, tooltip_conditional=Component.UNDEFINED, tooltip_data=Component.UNDEFINED, tooltip_delay=Component.UNDEFINED, tooltip_duration=Component.UNDEFINED, filter_query=Component.UNDEFINED, filter_action=Component.UNDEFINED, sort_action=Component.UNDEFINED, sort_mode=Component.UNDEFINED, sort_by=Component.UNDEFINED, sort_as_null=Component.UNDEFINED, style_table=Component.UNDEFINED, style_cell=Component.UNDEFINED, style_data=Component.UNDEFINED, style_filter=Component.UNDEFINED, style_header=Component.UNDEFINED, style_cell_conditional=Component.UNDEFINED, style_data_conditional=Component.UNDEFINED, style_filter_conditional=Component.UNDEFINED, style_header_conditional=Component.UNDEFINED, virtualization=Component.UNDEFINED, derived_filter_query_structure=Component.UNDEFINED, derived_viewport_data=Component.UNDEFINED, derived_viewport_indices=Component.UNDEFINED, derived_viewport_row_ids=Component.UNDEFINED, derived_viewport_selected_rows=Component.UNDEFINED, derived_viewport_selected_row_ids=Component.UNDEFINED, derived_virtual_data=Component.UNDEFINED, derived_virtual_indices=Component.UNDEFINED, derived_virtual_row_ids=Component.UNDEFINED, derived_virtual_selected_rows=Component.UNDEFINED, derived_virtual_selected_row_ids=Component.UNDEFINED, **kwargs):
        self._prop_names = ['active_cell', 'columns', 'locale_format', 'css', 'data', 'data_previous', 'data_timestamp', 'editable', 'end_cell', 'id', 'is_focused', 'merge_duplicate_headers', 'fixed_columns', 'fixed_rows', 'row_deletable', 'row_selectable', 'selected_cells', 'selected_rows', 'selected_row_ids', 'start_cell', 'style_as_list_view', 'page_action', 'page_current', 'page_size', 'dropdown', 'dropdown_conditional', 'dropdown_data', 'tooltip', 'tooltip_conditional', 'tooltip_data', 'tooltip_delay', 'tooltip_duration', 'filter_query', 'filter_action', 'sort_action', 'sort_mode', 'sort_by', 'sort_as_null', 'style_table', 'style_cell', 'style_data', 'style_filter', 'style_header', 'style_cell_conditional', 'style_data_conditional', 'style_filter_conditional', 'style_header_conditional', 'virtualization', 'derived_filter_query_structure', 'derived_viewport_data', 'derived_viewport_indices', 'derived_viewport_row_ids', 'derived_viewport_selected_rows', 'derived_viewport_selected_row_ids', 'derived_virtual_data', 'derived_virtual_indices', 'derived_virtual_row_ids', 'derived_virtual_selected_rows', 'derived_virtual_selected_row_ids']
        self._type = 'DataTable'
        self._namespace = 'dash_table'
        self._valid_wildcard_attributes =            []
        self.available_properties = ['active_cell', 'columns', 'locale_format', 'css', 'data', 'data_previous', 'data_timestamp', 'editable', 'end_cell', 'id', 'is_focused', 'merge_duplicate_headers', 'fixed_columns', 'fixed_rows', 'row_deletable', 'row_selectable', 'selected_cells', 'selected_rows', 'selected_row_ids', 'start_cell', 'style_as_list_view', 'page_action', 'page_current', 'page_size', 'dropdown', 'dropdown_conditional', 'dropdown_data', 'tooltip', 'tooltip_conditional', 'tooltip_data', 'tooltip_delay', 'tooltip_duration', 'filter_query', 'filter_action', 'sort_action', 'sort_mode', 'sort_by', 'sort_as_null', 'style_table', 'style_cell', 'style_data', 'style_filter', 'style_header', 'style_cell_conditional', 'style_data_conditional', 'style_filter_conditional', 'style_header_conditional', 'virtualization', 'derived_filter_query_structure', 'derived_viewport_data', 'derived_viewport_indices', 'derived_viewport_row_ids', 'derived_viewport_selected_rows', 'derived_viewport_selected_row_ids', 'derived_virtual_data', 'derived_virtual_indices', 'derived_virtual_row_ids', 'derived_virtual_selected_rows', 'derived_virtual_selected_row_ids']
        self.available_wildcard_properties =            []

        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs
        args = {k: _locals[k] for k in _explicit_args if k != 'children'}

        for k in []:
            if k not in args:
                raise TypeError(
                    'Required argument `' + k + '` was not specified.')
        super(DataTable, self).__init__(**args)
