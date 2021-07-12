# AUTO GENERATED FILE - DO NOT EDIT

export dash_datatable

"""
    dash_datatable(;kwargs...)

A DataTable component.
Dash DataTable is an interactive table component designed for
designed for viewing, editing, and exploring large datasets.
DataTable is rendered with standard, semantic HTML <table/> markup,
which makes it accessible, responsive, and easy to style. This
component was written from scratch in React.js specifically for the
Dash community. Its API was designed to be ergonomic and its behavior
is completely customizable through its properties.
Keyword arguments:
- `id` (String; optional): The ID of the table.
- `active_cell` (optional): The row and column indices and IDs of the currently active cell.
`row_id` is only returned if the data rows have an `id` key.. active_cell has the following type: lists containing elements 'row', 'column', 'row_id', 'column_id'.
Those elements have the following types:
  - `row` (Real; optional)
  - `column` (Real; optional)
  - `row_id` (String | Real; optional)
  - `column_id` (String; optional)
- `cell_selectable` (Bool; optional): If True (default), then it is possible to click and navigate
table cells.
- `column_selectable` (a value equal to: 'single', 'multi', false; optional): If `single`, then the user can select a single column or group
of merged columns via the radio button that will appear in the
header rows.
If `multi`, then the user can select multiple columns or groups
of merged columns via the checkbox that will appear in the header
rows.
If false, then the user will not be able to select columns and no
input will appear in the header rows.
When a column is selected, its id will be contained in `selected_columns`
and `derived_viewport_selected_columns`.
- `columns` (optional): Columns describes various aspects about each individual column.
`name` and `id` are the only required parameters.. columns has the following type: Array of lists containing elements 'clearable', 'deletable', 'editable', 'filter_options', 'hideable', 'renamable', 'selectable', 'format', 'id', 'name', 'presentation', 'on_change', 'sort_as_null', 'validation', 'type'.
Those elements have the following types:
  - `clearable` (a value equal to: 'first', 'last' | Bool | Array of Bools; optional): If true, the user can clear the column by clicking on the `clear`
action button on the column. If there are multiple header rows, true
will display the action button on each row.
If `last`, the `clear` action button will only appear on the last header
row. If `first` it will only appear on the first header row. These
are respectively shortcut equivalents to `[false, ..., false, true]` and
`[true, false, ..., false]`.
If there are merged, multi-header columns then you can choose
which column header row to display the `clear` action button in by
supplying an array of booleans.
For example, `[true, false]` will display the `clear` action button
on the first row, but not the second row.
If the `clear` action button appears on a merged column, then clicking
on that button will clear *all* of the merged columns associated with it.
Unlike `column.deletable`, this action does not remove the column(s)
from the table. It only removed the associated entries from `data`.
  - `deletable` (a value equal to: 'first', 'last' | Bool | Array of Bools; optional): If true, the user can remove the column by clicking on the `delete`
action button on the column. If there are multiple header rows, true
will display the action button on each row.
If `last`, the `delete` action button will only appear on the last header
row. If `first` it will only appear on the first header row. These
are respectively shortcut equivalents to `[false, ..., false, true]` and
`[true, false, ..., false]`.
If there are merged, multi-header columns then you can choose
which column header row to display the `delete` action button in by
supplying an array of booleans.
For example, `[true, false]` will display the `delete` action button
on the first row, but not the second row.
If the `delete` action button appears on a merged column, then clicking
on that button will remove *all* of the merged columns associated with it.
  - `editable` (Bool; optional): There are two `editable` flags in the table.
This is the  column-level editable flag and there is
also the table-level `editable` flag.
These flags determine whether the contents of the table
are editable or not.
If the column-level `editable` flag is set it overrides
the table-level `editable` flag for that column.
  - `filter_options` (optional): There are two `filter_options` props in the table.
This is the column-level filter_options prop and there is
also the table-level `filter_options` prop.
These props determine whether the applicable filter relational
operators will default to `sensitive` or `insensitive` comparison.
If the column-level `filter_options` prop is set it overrides
the table-level `filter_options` prop for that column.. filter_options has the following type: lists containing elements 'case'.
Those elements have the following types:
  - `case` (a value equal to: 'sensitive', 'insensitive'; optional)
  - `hideable` (a value equal to: 'first', 'last' | Bool | Array of Bools; optional): If true, the user can hide the column by clicking on the `hide`
action button on the column. If there are multiple header rows, true
will display the action button on each row.
If `last`, the `hide` action button will only appear on the last header
row. If `first` it will only appear on the first header row. These
are respectively shortcut equivalents to `[false, ..., false, true]` and
`[true, false, ..., false]`.
If there are merged, multi-header columns then you can choose
which column header row to display the `hide` action button in by
supplying an array of booleans.
For example, `[true, false]` will display the `hide` action button
on the first row, but not the second row.
If the `hide` action button appears on a merged column, then clicking
on that button will hide *all* of the merged columns associated with it.
  - `renamable` (a value equal to: 'first', 'last' | Bool | Array of Bools; optional): If true, the user can rename the column by clicking on the `rename`
action button on the column. If there are multiple header rows, true
will display the action button on each row.
If `last`, the `rename` action button will only appear on the last header
row. If `first` it will only appear on the first header row. These
are respectively shortcut equivalents to `[false, ..., false, true]` and
`[true, false, ..., false]`.
If there are merged, multi-header columns then you can choose
which column header row to display the `rename` action button in by
supplying an array of booleans.
For example, `[true, false]` will display the `rename` action button
on the first row, but not the second row.
If the `rename` action button appears on a merged column, then clicking
on that button will rename *all* of the merged columns associated with it.
  - `selectable` (a value equal to: 'first', 'last' | Bool | Array of Bools; optional): If true, the user can select the column by clicking on the checkbox or radio button
in the column. If there are multiple header rows, true will display the input
on each row.
If `last`, the input will only appear on the last header row. If `first` it will only
appear on the first header row. These are respectively shortcut equivalents to
`[false, ..., false, true]` and `[true, false, ..., false]`.
If there are merged, multi-header columns then you can choose which column header
row to display the input in by supplying an array of booleans.
For example, `[true, false]` will display the `selectable` input on the first row,
but now on the second row.
If the `selectable` input appears on a merged columns, then clicking on that input
will select *all* of the merged columns associated with it.
The table-level prop `column_selectable` is used to determine the type of column
selection to use.
  - `format` (optional): The formatting applied to the column's data.
This prop is derived from the [d3-format](https://github.com/d3/d3-format) library specification. Apart from
being structured slightly differently (under a single prop), the usage is the same.
See also dash_table.FormatTemplate.  It contains helper functions for typical number formats.. format has the following type: lists containing elements 'locale', 'nully', 'prefix', 'specifier'.
Those elements have the following types:
  - `locale` (optional): Represents localization specific formatting information.
When left unspecified, will use the default value provided by d3-format.. locale has the following type: lists containing elements 'symbol', 'decimal', 'group', 'grouping', 'numerals', 'percent', 'separate_4digits'.
Those elements have the following types:
  - `symbol` (Array of Strings; optional): (default: ['\$', '']).  A list of two strings representing the
 prefix and suffix symbols. Typically used for currency, and implemented using d3's
 currency format, but you can use this for other symbols such as measurement units
  - `decimal` (String; optional): (default: '.').  The string used for the decimal separator
  - `group` (String; optional): (default: ',').  The string used for the groups separator
  - `grouping` (Array of Reals; optional): (default: [3]).  A list of integers representing the grouping pattern. The default is
3 for thousands.
  - `numerals` (Array of Strings; optional): A list of ten strings used as replacements for numbers 0-9
  - `percent` (String; optional): (default: '%').  The string used for the percentage symbol
  - `separate_4digits` (Bool; optional): (default: True). Separates integers with 4-digits or less
  - `nully` (Bool | Real | String | Dict | Array; optional): A value that will be used in place of the nully value during formatting.
  If the value type matches the column type, it will be formatted normally.
  - `prefix` (Real; optional): A number representing the SI unit to use during formatting.
  See `dash_table.Format.Prefix` enumeration for the list of valid values
  - `specifier` (String; optional): (default: '').  Represents the d3 rules to apply when formatting the number.
  - `id` (String; required): The `id` of the column.
The column `id` is used to match cells in data with particular columns.
The `id` is not visible in the table.
  - `name` (String | Array of Strings; required): The `name` of the column, as it appears in the column header.
If `name` is a list of strings, then the columns
will render with multiple headers rows.
  - `presentation` (a value equal to: 'input', 'dropdown', 'markdown'; optional): The `presentation` to use to display data. Markdown can be used on
columns with type 'text'.  See 'dropdown' for more info.
Defaults to 'input' for ['datetime', 'numeric', 'text', 'any'].
  - `on_change` (optional): The `on_change` behavior of the column for user-initiated modifications.. on_change has the following type: lists containing elements 'action', 'failure'.
Those elements have the following types:
  - `action` (a value equal to: 'coerce', 'none', 'validate'; optional): (default 'coerce'):  'none': do not validate data;
 'coerce': check if the data corresponds to the destination type and
 attempts to coerce it into the destination type if not;
 'validate': check if the data corresponds to the destination type (no coercion).
  - `failure` (a value equal to: 'accept', 'default', 'reject'; optional): (default 'reject'):  What to do with the value if the action fails.
 'accept': use the invalid value;
 'default': replace the provided value with `validation.default`;
 'reject': do not modify the existing value.
  - `sort_as_null` (Array of String | Real | Bools; optional): An array of string, number and boolean values that are treated as `null`
(i.e. ignored and always displayed last) when sorting.
This value overrides the table-level `sort_as_null`.
  - `validation` (optional): The `validation` options for user input processing that can accept, reject or apply a
default value.. validation has the following type: lists containing elements 'allow_null', 'default', 'allow_YY'.
Those elements have the following types:
  - `allow_null` (Bool; optional): Allow the use of nully values. (undefined, null, NaN) (default: False)
  - `default` (Bool | Real | String | Dict | Array; optional): The default value to apply with on_change.failure = 'default'. (default: None)
  - `allow_YY` (Bool; optional): This is for `datetime` columns only.  Allow 2-digit years (default: False).
  If True, we interpret years as ranging from now-70 to now+29 - in 2019
  this is 1949 to 2048 but in 2020 it will be different. If used with
  `action: 'coerce'`, will convert user input to a 4-digit year.
  - `type` (a value equal to: 'any', 'numeric', 'text', 'datetime'; optional): The data-type provides support for per column typing and allows for data
validation and coercion.
'numeric': represents both floats and ints.
'text': represents a string.
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
'any': represents any type of data.
Defaults to 'any' if undefined.s
- `css` (optional): The `css` property is a way to embed CSS selectors and rules
onto the page.
We recommend starting with the `style_*` properties
before using this `css` property.
Example:
[
    {"selector": ".dash-spreadsheet", "rule": 'font-family: "monospace"'}
]. css has the following type: Array of lists containing elements 'selector', 'rule'.
Those elements have the following types:
  - `selector` (String; required)
  - `rule` (String; required)s
- `data` (Array of Dicts; optional): The contents of the table.
The keys of each item in data should match the column IDs.
Each item can also have an 'id' key, whose value is its row ID. If there
is a column with ID='id' this will display the row ID, otherwise it is
just used to reference the row for selections, filtering, etc.
Example:
[
     {'column-1': 4.5, 'column-2': 'montreal', 'column-3': 'canada'},
     {'column-1': 8, 'column-2': 'boston', 'column-3': 'america'}
]
- `data_previous` (Array of Dicts; optional): The previous state of `data`. `data_previous`
has the same structure as `data` and it will be updated
whenever `data` changes, either through a callback or
by editing the table.
This is a read-only property: setting this property will not
have any impact on the table.
- `data_timestamp` (Real; optional): The unix timestamp when the data was last edited.
Use this property with other timestamp properties
(such as `n_clicks_timestamp` in `dash_html_components`)
to determine which property has changed within a callback.
- `derived_filter_query_structure` (Dict; optional): This property represents the current structure of
`filter_query` as a tree structure. Each node of the
query structure has:
type (string; required):
  'open-block',
  'logical-operator',
  'relational-operator',
  'unary-operator', or
  'expression';
subType (string; optional):
  'open-block': '()',
  'logical-operator': '&&', '||',
  'relational-operator': '=', '>=', '>', '<=', '<', '!=', 'contains',
  'unary-operator': '!', 'is bool', 'is even', 'is nil', 'is num', 'is object', 'is odd', 'is prime', 'is str',
  'expression': 'value', 'field';
value (any):
  'expression, value': passed value,
  'expression, field': the field/prop name.
block (nested query structure; optional).
left (nested query structure; optional).
right (nested query structure; optional).
If the query is invalid or empty, the `derived_filter_query_structure` will
be `None`.
- `derived_viewport_data` (Array of Dicts; optional): This property represents the current state of `data`
on the current page. This property will be updated
on paging, sorting, and filtering.
- `derived_viewport_indices` (Array of Reals; optional): `derived_viewport_indices` indicates the order in which the original
rows appear after being filtered, sorted, and/or paged.
`derived_viewport_indices` contains indices for the current page,
while `derived_virtual_indices` contains indices across all pages.
- `derived_viewport_row_ids` (Array of String | Reals; optional): `derived_viewport_row_ids` lists row IDs in the order they appear
after being filtered, sorted, and/or paged.
`derived_viewport_row_ids` contains IDs for the current page,
while `derived_virtual_row_ids` contains IDs across all pages.
- `derived_viewport_selected_columns` (Array of Strings; optional): `derived_viewport_selected_columns` contains the ids of the
`selected_columns` that are not currently hidden.
- `derived_viewport_selected_row_ids` (Array of String | Reals; optional): `derived_viewport_selected_row_ids` represents the IDs of the
`selected_rows` on the currently visible page.
- `derived_viewport_selected_rows` (Array of Reals; optional): `derived_viewport_selected_rows` represents the indices of the
`selected_rows` from the perspective of the `derived_viewport_indices`.
- `derived_virtual_data` (Array of Dicts; optional): This property represents the visible state of `data`
across all pages after the front-end sorting and filtering
as been applied.
- `derived_virtual_indices` (Array of Reals; optional): `derived_virtual_indices` indicates the order in which the original
rows appear after being filtered and sorted.
`derived_viewport_indices` contains indices for the current page,
while `derived_virtual_indices` contains indices across all pages.
- `derived_virtual_row_ids` (Array of String | Reals; optional): `derived_virtual_row_ids` indicates the row IDs in the order in which
they appear after being filtered and sorted.
`derived_viewport_row_ids` contains IDs for the current page,
while `derived_virtual_row_ids` contains IDs across all pages.
- `derived_virtual_selected_row_ids` (Array of String | Reals; optional): `derived_virtual_selected_row_ids` represents the IDs of the
`selected_rows` as they appear after filtering and sorting,
across all pages.
- `derived_virtual_selected_rows` (Array of Reals; optional): `derived_virtual_selected_rows` represents the indices of the
 `selected_rows` from the perspective of the `derived_virtual_indices`.
- `dropdown` (optional): `dropdown` specifies dropdown options for different columns.
Each entry refers to the column ID.
The `clearable` property defines whether the value can be deleted.
The `options` property refers to the `options` of the dropdown.. dropdown has the following type: Dict with Strings as keys and values of type lists containing elements 'clearable', 'options'.
Those elements have the following types:
  - `clearable` (Bool; optional)
  - `options` (required): . options has the following type: Array of lists containing elements 'label', 'value'.
Those elements have the following types:
  - `label` (String; required)
  - `value` (Real | String | Bool; required)s
- `dropdown_conditional` (optional): `dropdown_conditional` specifies dropdown options in various columns and cells.
This property allows you to specify different dropdowns
depending on certain conditions. For example, you may
render different "city" dropdowns in a row depending on the
current value in the "state" column.. dropdown_conditional has the following type: Array of lists containing elements 'clearable', 'if', 'options'.
Those elements have the following types:
  - `clearable` (Bool; optional)
  - `if` (optional): . if has the following type: lists containing elements 'column_id', 'filter_query'.
Those elements have the following types:
  - `column_id` (String; optional)
  - `filter_query` (String; optional)
  - `options` (required): . options has the following type: Array of lists containing elements 'label', 'value'.
Those elements have the following types:
  - `label` (String; required)
  - `value` (Real | String | Bool; required)ss
- `dropdown_data` (optional): `dropdown_data` specifies dropdown options on a row-by-row, column-by-column basis.
Each item in the array corresponds to the corresponding dropdowns for the `data` item
at the same index. Each entry in the item refers to the Column ID.. dropdown_data has the following type: Array of Dict with Strings as keys and values of type lists containing elements 'clearable', 'options'.
Those elements have the following types:
  - `clearable` (Bool; optional)
  - `options` (required): . options has the following type: Array of lists containing elements 'label', 'value'.
Those elements have the following types:
  - `label` (String; required)
  - `value` (Real | String | Bool; required)ss
- `editable` (Bool; optional): If True, then the data in all of the cells is editable.
When `editable` is True, particular columns can be made
uneditable by setting `editable` to `False` inside the `columns`
property.
If False, then the data in all of the cells is uneditable.
When `editable` is False, particular columns can be made
editable by setting `editable` to `True` inside the `columns`
property.
- `end_cell` (optional): When selecting multiple cells
(via clicking on a cell and then shift-clicking on another cell),
`end_cell` represents the row / column coordinates and IDs of the cell
in one of the corners of the region.
`start_cell` represents the coordinates of the other corner.. end_cell has the following type: lists containing elements 'row', 'column', 'row_id', 'column_id'.
Those elements have the following types:
  - `row` (Real; optional)
  - `column` (Real; optional)
  - `row_id` (String | Real; optional)
  - `column_id` (String; optional)
- `export_columns` (a value equal to: 'all', 'visible'; optional): Denotes the columns that will be used in the export data file.
If `all`, all columns will be used (visible + hidden). If `visible`,
only the visible columns will be used. Defaults to `visible`.
- `export_format` (a value equal to: 'csv', 'xlsx', 'none'; optional): Denotes the type of the export data file,
Defaults to `'none'`
- `export_headers` (a value equal to: 'none', 'ids', 'names', 'display'; optional): Denotes the format of the headers in the export data file.
If `'none'`, there will be no header. If `'display'`, then the header
of the data file will be be how it is currently displayed. Note that
`'display'` is only supported for `'xlsx'` export_format and will behave
like `'names'` for `'csv'` export format. If `'ids'` or `'names'`,
then the headers of data file will be the column id or the column
names, respectively
- `fill_width` (Bool; optional): `fill_width` toggles between a set of CSS for two common behaviors:
True: The table container's width will grow to fill the available space;
False: The table container's width will equal the width of its content.
- `filter_action` (optional): The `filter_action` property controls the behavior of the `filtering` UI.
If `'none'`, then the filtering UI is not displayed.
If `'native'`, then the filtering UI is displayed and the filtering
logic is handled by the table. That is, it is performed on the data
that exists in the `data` property.
If `'custom'`, then the filtering UI is displayed but it is the
responsibility of the developer to program the filtering
through a callback (where `filter_query` or `derived_filter_query_structure` would be the input
and `data` would be the output).. filter_action has the following type: a value equal to: 'custom', 'native', 'none' | lists containing elements 'type', 'operator'.
Those elements have the following types:
  - `type` (a value equal to: 'custom', 'native'; required)
  - `operator` (a value equal to: 'and', 'or'; optional)
- `filter_options` (optional): There are two `filter_options` props in the table.
This is the table-level filter_options prop and there is
also the column-level `filter_options` prop.
These props determine whether the applicable filter relational
operators will default to `sensitive` or `insensitive` comparison.
If the column-level `filter_options` prop is set it overrides
the table-level `filter_options` prop for that column.. filter_options has the following type: lists containing elements 'case'.
Those elements have the following types:
  - `case` (a value equal to: 'sensitive', 'insensitive'; optional)
- `filter_query` (String; optional): If `filter_action` is enabled, then the current filtering
string is represented in this `filter_query`
property.
- `fixed_columns` (optional): `fixed_columns` will "fix" the set of columns so that
they remain visible when scrolling horizontally across
the unfixed columns. `fixed_columns` fixes columns
from left-to-right.
If `headers` is False, no columns are fixed.
If `headers` is True, all operation columns (see `row_deletable` and `row_selectable`)
are fixed. Additional data columns can be fixed by
assigning a number to `data`.

Note that fixing columns introduces some changes to the
underlying markup of the table and may impact the
way that your columns are rendered or sized.
View the documentation examples to learn more.. fixed_columns has the following type: lists containing elements 'data', 'headers'.
Those elements have the following types:
  - `data` (a value equal to: 0; optional): Example `{'headers':False, 'data':0}` No columns are fixed (the default)
  - `headers` (a value equal to: false; optional) | lists containing elements 'data', 'headers'.
Those elements have the following types:
  - `data` (Real; optional): Example `{'headers':True, 'data':1}` one column is fixed.
  - `headers` (a value equal to: true; required)
- `fixed_rows` (optional): `fixed_rows` will "fix" the set of rows so that
they remain visible when scrolling vertically down
the table. `fixed_rows` fixes rows
from top-to-bottom, starting from the headers.
If `headers` is False, no rows are fixed.
If `headers` is True, all header and filter rows (see `filter_action`) are
fixed. Additional data rows can be fixed by assigning
a number to `data`.  Note that fixing rows introduces some changes to the
underlying markup of the table and may impact the
way that your columns are rendered or sized.
View the documentation examples to learn more.. fixed_rows has the following type: lists containing elements 'data', 'headers'.
Those elements have the following types:
  - `data` (a value equal to: 0; optional): Example `{'headers':False, 'data':0}` No rows are fixed (the default)
  - `headers` (a value equal to: false; optional) | lists containing elements 'data', 'headers'.
Those elements have the following types:
  - `data` (Real; optional): Example `{'headers':True, 'data':1}` one row is fixed.
  - `headers` (a value equal to: true; required)
- `hidden_columns` (Array of Strings; optional): List of columns ids of the columns that are currently hidden.
See the associated nested prop `columns.hideable`.
- `include_headers_on_copy_paste` (Bool; optional): If true, headers are included when copying from the table to different
tabs and elsewhere. Note that headers are ignored when copying from the table onto itself and
between two tables within the same tab.
- `is_focused` (Bool; optional): If True, then the `active_cell` is in a focused state.
- `loading_state` (optional): Object that holds the loading state object coming from dash-renderer. loading_state has the following type: lists containing elements 'is_loading', 'prop_name', 'component_name'.
Those elements have the following types:
  - `is_loading` (Bool; optional): Determines if the component is loading or not
  - `prop_name` (String; optional): Holds which property is loading
  - `component_name` (String; optional): Holds the name of the component that is loading
- `locale_format` (optional): The localization specific formatting information applied to all columns in the table.
This prop is derived from the [d3.formatLocale](https://github.com/d3/d3-format#formatLocale) data structure specification.
When left unspecified, each individual nested prop will default to a pre-determined value.. locale_format has the following type: lists containing elements 'symbol', 'decimal', 'group', 'grouping', 'numerals', 'percent', 'separate_4digits'.
Those elements have the following types:
  - `symbol` (Array of Strings; optional): (default: ['\$', '']). A  list of two strings representing the
  prefix and suffix symbols. Typically used for currency, and implemented using d3's
  currency format, but you can use this for other symbols such as measurement units.
  - `decimal` (String; optional): (default: '.'). The string used for the decimal separator.
  - `group` (String; optional): (default: ','). The string used for the groups separator.
  - `grouping` (Array of Reals; optional): (default: [3]). A  list of integers representing the grouping pattern.
  - `numerals` (Array of Strings; optional): A list of ten strings used as replacements for numbers 0-9.
  - `percent` (String; optional): (default: '%'). The string used for the percentage symbol.
  - `separate_4digits` (Bool; optional): (default: True). Separate integers with 4-digits or less.
- `markdown_options` (optional): The `markdown_options` property allows customization of the markdown cells behavior.. markdown_options has the following type: lists containing elements 'link_target', 'html'.
Those elements have the following types:
  - `link_target` (String | a value equal to: '_blank', '_parent', '_self', '_top'; optional): (default: '_blank').  The link's behavior (_blank opens the link in a
new tab, _parent opens the link in the parent frame, _self opens the link in the
current tab, and _top opens the link in the top frame) or a string
  - `html` (Bool; optional): (default: False)  If True, html may be used in markdown cells
Be careful enabling html if the content being rendered can come
from an untrusted user, as this may create an XSS vulnerability.
- `merge_duplicate_headers` (Bool; optional): If True, then column headers that have neighbors with duplicate names
will be merged into a single cell.
This will be applied for single column headers and multi-column
headers.
- `page_action` (a value equal to: 'custom', 'native', 'none'; optional): `page_action` refers to a mode of the table where
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
`'native'`: all data is passed to the table up-front, paging logic is
handled by the table;
`'custom'`: data is passed to the table one page at a time, paging logic
is handled via callbacks;
`'none'`: disables paging, render all of the data at once.
- `page_count` (Real; optional): `page_count` represents the number of the pages in the
paginated table. This is really only useful when performing
backend pagination, since the front end is able to use the
full size of the table to calculate the number of pages.
- `page_current` (Real; optional): `page_current` represents which page the user is on.
Use this property to index through data in your callbacks with
backend paging.
- `page_size` (Real; optional): `page_size` represents the number of rows that will be
displayed on a particular page when `page_action` is `'custom'` or `'native'`
- `persisted_props` (Array of a value equal to: 'columns.name', 'data', 'filter_query', 'hidden_columns', 'selected_columns', 'selected_rows', 'sort_by's; optional): Properties whose user interactions will persist after refreshing the
component or the page.
- `persistence` (Bool | String | Real; optional): Used to allow user interactions in this component to be persisted when
the component - or the page - is refreshed. If `persisted` is truthy and
hasn't changed from its previous value, any `persisted_props` that the
user has changed while using the app will keep those changes, as long as
the new prop value also matches what was given originally.
Used in conjunction with `persistence_type` and `persisted_props`.
- `persistence_type` (a value equal to: 'local', 'session', 'memory'; optional): Where persisted user changes will be stored:
memory: only kept in memory, reset on page refresh.
local: window.localStorage, data is kept after the browser quit.
session: window.sessionStorage, data is cleared once the browser quit.
- `row_deletable` (Bool; optional): If True, then a `x` will appear next to each `row`
and the user can delete the row.
- `row_selectable` (a value equal to: 'single', 'multi', false; optional): If `single`, then the user can select a single row
via a radio button that will appear next to each row.
If `multi`, then the user can select multiple rows
via a checkbox that will appear next to each row.
If false, then the user will not be able to select rows
and no additional UI elements will appear.
When a row is selected, its index will be contained
in `selected_rows`.
- `selected_cells` (optional): `selected_cells` represents the set of cells that are selected,
as an array of objects, each item similar to `active_cell`.
Multiple cells can be selected by holding down shift and
clicking on a different cell or holding down shift and navigating
with the arrow keys.. selected_cells has the following type: Array of lists containing elements 'row', 'column', 'row_id', 'column_id'.
Those elements have the following types:
  - `row` (Real; optional)
  - `column` (Real; optional)
  - `row_id` (String | Real; optional)
  - `column_id` (String; optional)s
- `selected_columns` (Array of Strings; optional): `selected_columns` contains the ids of columns that
are selected via the UI elements that appear when
`column_selectable` is `'single' or 'multi'`.
- `selected_row_ids` (Array of String | Reals; optional): `selected_row_ids` contains the ids of rows that
are selected via the UI elements that appear when
`row_selectable` is `'single'` or `'multi'`.
- `selected_rows` (Array of Reals; optional): `selected_rows` contains the indices of rows that
are selected via the UI elements that appear when
`row_selectable` is `'single'` or `'multi'`.
- `sort_action` (a value equal to: 'custom', 'native', 'none'; optional): The `sort_action` property enables data to be
sorted on a per-column basis.
If `'none'`, then the sorting UI is not displayed.
If `'native'`, then the sorting UI is displayed and the sorting
logic is handled by the table. That is, it is performed on the data
that exists in the `data` property.
If `'custom'`, the the sorting UI is displayed but it is the
responsibility of the developer to program the sorting
through a callback (where `sort_by` would be the input and `data`
would be the output).
Clicking on the sort arrows will update the
`sort_by` property.
- `sort_as_null` (Array of String | Real | Bools; optional): An array of string, number and boolean values that are treated as `None`
(i.e. ignored and always displayed last) when sorting.
This value will be used by columns without `sort_as_null`.
Defaults to `[]`.
- `sort_by` (optional): `sort_by` describes the current state
of the sorting UI.
That is, if the user clicked on the sort arrow
of a column, then this property will be updated
with the column ID and the direction
(`asc` or `desc`) of the sort.
For multi-column sorting, this will be a list of
sorting parameters, in the order in which they were
clicked.. sort_by has the following type: Array of lists containing elements 'column_id', 'direction'.
Those elements have the following types:
  - `column_id` (String; required)
  - `direction` (a value equal to: 'asc', 'desc'; required)s
- `sort_mode` (a value equal to: 'single', 'multi'; optional): Sorting can be performed across multiple columns
(e.g. sort by country, sort within each country,
 sort by year) or by a single column.
NOTE - With multi-column sort, it's currently
not possible to determine the order in which
the columns were sorted through the UI.
See [https://github.com/plotly/dash-table/issues/170](https://github.com/plotly/dash-table/issues/170)
- `start_cell` (optional): When selecting multiple cells
(via clicking on a cell and then shift-clicking on another cell),
`start_cell` represents the [row, column] coordinates of the cell
in one of the corners of the region.
`end_cell` represents the coordinates of the other corner.. start_cell has the following type: lists containing elements 'row', 'column', 'row_id', 'column_id'.
Those elements have the following types:
  - `row` (Real; optional)
  - `column` (Real; optional)
  - `row_id` (String | Real; optional)
  - `column_id` (String; optional)
- `style_as_list_view` (Bool; optional): If True, then the table will be styled like a list view
and not have borders between the columns.
- `style_cell` (Dict; optional): CSS styles to be applied to each individual cell of the table.
This includes the header cells, the `data` cells, and the filter
cells.
- `style_cell_conditional` (optional): Conditional CSS styles for the cells.
This can be used to apply styles to cells on a per-column basis.. style_cell_conditional has the following type: Array of lists containing elements 'if'.
Those elements have the following types:
  - `if` (optional): . if has the following type: lists containing elements 'column_id', 'column_type'.
Those elements have the following types:
  - `column_id` (String | Array of Strings; optional)
  - `column_type` (a value equal to: 'any', 'numeric', 'text', 'datetime'; optional)s
- `style_data` (Dict; optional): CSS styles to be applied to each individual data cell.
That is, unlike `style_cell`, it excludes the header and filter cells.
- `style_data_conditional` (optional): Conditional CSS styles for the data cells.
This can be used to apply styles to data cells on a per-column basis.. style_data_conditional has the following type: Array of lists containing elements 'if'.
Those elements have the following types:
  - `if` (optional): . if has the following type: lists containing elements 'column_id', 'column_type', 'filter_query', 'state', 'row_index', 'column_editable'.
Those elements have the following types:
  - `column_id` (String | Array of Strings; optional)
  - `column_type` (a value equal to: 'any', 'numeric', 'text', 'datetime'; optional)
  - `filter_query` (String; optional)
  - `state` (a value equal to: 'active', 'selected'; optional)
  - `row_index` (Real | a value equal to: 'odd', 'even' | Array of Reals; optional)
  - `column_editable` (Bool; optional)s
- `style_filter` (Dict; optional): CSS styles to be applied to the filter cells.
Note that this may change in the future as we build out a
more complex filtering UI.
- `style_filter_conditional` (optional): Conditional CSS styles for the filter cells.
This can be used to apply styles to filter cells on a per-column basis.. style_filter_conditional has the following type: Array of lists containing elements 'if'.
Those elements have the following types:
  - `if` (optional): . if has the following type: lists containing elements 'column_id', 'column_type', 'column_editable'.
Those elements have the following types:
  - `column_id` (String | Array of Strings; optional)
  - `column_type` (a value equal to: 'any', 'numeric', 'text', 'datetime'; optional)
  - `column_editable` (Bool; optional)s
- `style_header` (Dict; optional): CSS styles to be applied to each individual header cell.
That is, unlike `style_cell`, it excludes the `data` and filter cells.
- `style_header_conditional` (optional): Conditional CSS styles for the header cells.
This can be used to apply styles to header cells on a per-column basis.. style_header_conditional has the following type: Array of lists containing elements 'if'.
Those elements have the following types:
  - `if` (optional): . if has the following type: lists containing elements 'column_id', 'column_type', 'header_index', 'column_editable'.
Those elements have the following types:
  - `column_id` (String | Array of Strings; optional)
  - `column_type` (a value equal to: 'any', 'numeric', 'text', 'datetime'; optional)
  - `header_index` (Real | Array of Reals | a value equal to: 'odd', 'even'; optional)
  - `column_editable` (Bool; optional)s
- `style_table` (Dict; optional): CSS styles to be applied to the outer `table` container.
This is commonly used for setting properties like the
width or the height of the table.
- `tooltip` (optional): `tooltip` is the column based tooltip configuration applied to all rows. The key is the column
 id and the value is a tooltip configuration.
Example: {i: {'value': i, 'use_with: 'both'} for i in df.columns}. tooltip has the following type: Dict with Strings as keys and values of type String | lists containing elements 'delay', 'duration', 'type', 'use_with', 'value'.
Those elements have the following types:
  - `delay` (Real; optional): Represents the delay in milliseconds before
the tooltip is shown when hovering a cell. This overrides
the table's `tooltip_delay` property. If set to `None`,
the tooltip will be shown immediately.
  - `duration` (Real; optional): represents the duration in milliseconds
during which the tooltip is shown when hovering a cell.
This overrides the table's `tooltip_duration` property.
If set to `None`, the tooltip will not disappear.
  - `type` (a value equal to: 'text', 'markdown'; optional): refers to the type of tooltip syntax used
for the tooltip generation. Can either be `markdown`
or `text`. Defaults to `text`.
  - `use_with` (a value equal to: 'both', 'data', 'header'; optional): Refers to whether the tooltip will be shown
only on data or headers. Can be `both`, `data`, `header`.
Defaults to `both`.
  - `value` (String; required): refers to the syntax-based content of
the tooltip. This value is required. Alternatively, the value of the
property can also be  a plain string. The `text` syntax will be used in
that case.
- `tooltip_conditional` (optional): `tooltip_conditional` represents the tooltip shown
for different columns and cells.
This property allows you to specify different tooltips
depending on certain conditions. For example, you may have
different tooltips in the same column based on the value
of a certain data property.
Priority is from first to last defined conditional tooltip
in the list. Higher priority (more specific) conditional
tooltips should be put at the beginning of the list.. tooltip_conditional has the following type: Array of lists containing elements 'delay', 'duration', 'if', 'type', 'value'.
Those elements have the following types:
  - `delay` (Real; optional): The `delay` represents the delay in milliseconds before
the tooltip is shown when hovering a cell. This overrides
the table's `tooltip_delay` property. If set to `None`,
the tooltip will be shown immediately.
  - `duration` (Real; optional): The `duration` represents the duration in milliseconds
during which the tooltip is shown when hovering a cell.
This overrides the table's `tooltip_duration` property.
If set to `None`, the tooltip will not disappear.
  - `if` (required): The `if` refers to the condition that needs to be fulfilled
in order for the associated tooltip configuration to be
used. If multiple conditions are defined, all conditions
must be met for the tooltip to be used by a cell.. if has the following type: lists containing elements 'column_id', 'filter_query', 'row_index'.
Those elements have the following types:
  - `column_id` (String; optional): `column_id` refers to the column ID that must be matched.
  - `filter_query` (String; optional): `filter_query` refers to the query that must evaluate to True.
  - `row_index` (Real | a value equal to: 'odd', 'even'; optional): `row_index` refers to the index of the row in the source `data`.
  - `type` (a value equal to: 'text', 'markdown'; optional): The `type` refers to the type of tooltip syntax used
for the tooltip generation. Can either be `markdown`
or `text`. Defaults to `text`.
  - `value` (String; required): The `value` refers to the syntax-based content of the tooltip. This value is required.s
- `tooltip_data` (optional): `tooltip_data` represents the tooltip shown
for different columns and cells.
A list of dicts for which each key is
a column id and the value is a tooltip configuration.. tooltip_data has the following type: Array of Dict with Strings as keys and values of type String | lists containing elements 'delay', 'duration', 'type', 'value'.
Those elements have the following types:
  - `delay` (Real; optional): The `delay` represents the delay in milliseconds before
the tooltip is shown when hovering a cell. This overrides
the table's `tooltip_delay` property. If set to `None`,
the tooltip will be shown immediately.
  - `duration` (Real; optional): The `duration` represents the duration in milliseconds
during which the tooltip is shown when hovering a cell.
This overrides the table's `tooltip_duration` property.
If set to `None`, the tooltip will not disappear.
Alternatively, the value of the property can also be
a plain string. The `text` syntax will be used in
that case.
  - `type` (a value equal to: 'text', 'markdown'; optional): For each tooltip configuration,
The `type` refers to the type of tooltip syntax used
for the tooltip generation. Can either be `markdown`
or `text`. Defaults to `text`.
  - `value` (String; required): The `value` refers to the syntax-based content of the tooltip. This value is required.s
- `tooltip_delay` (Real; optional): `tooltip_delay` represents the table-wide delay in milliseconds before
the tooltip is shown when hovering a cell. If set to `None`, the tooltip
will be shown immediately.
Defaults to 350.
- `tooltip_duration` (Real; optional): `tooltip_duration` represents the table-wide duration in milliseconds
during which the tooltip will be displayed when hovering a cell. If
set to `None`, the tooltip will not disappear.
Defaults to 2000.
- `tooltip_header` (optional): `tooltip_header` represents the tooltip shown
for each header column and optionally each header row.
Example to show long column names in a tooltip: {i: i for i in df.columns}.
Example to show different column names in a tooltip: {'Rep': 'Republican', 'Dem': 'Democrat'}.
If the table has multiple rows of headers, then use a list as the value of the
`tooltip_header` items.. tooltip_header has the following type: Dict with Strings as keys and values of type String | lists containing elements 'delay', 'duration', 'type', 'value'.
Those elements have the following types:
  - `delay` (Real; optional): The `delay` represents the delay in milliseconds before
the tooltip is shown when hovering a cell. This overrides
the table's `tooltip_delay` property. If set to `None`,
the tooltip will be shown immediately.
  - `duration` (Real; optional): The `duration` represents the duration in milliseconds
during which the tooltip is shown when hovering a cell.
This overrides the table's `tooltip_duration` property.
If set to `None`, the tooltip will not disappear.
Alternatively, the value of the property can also be
a plain string. The `text` syntax will be used in
that case.
  - `type` (a value equal to: 'text', 'markdown'; optional): For each tooltip configuration,
The `type` refers to the type of tooltip syntax used
for the tooltip generation. Can either be `markdown`
or `text`. Defaults to `text`.
  - `value` (String; required): The `value` refers to the syntax-based content of the tooltip. This value is required. | Array of a value equal to: null | String | lists containing elements 'delay', 'duration', 'type', 'value'.
Those elements have the following types:
  - `delay` (Real; optional)
  - `duration` (Real; optional)
  - `type` (a value equal to: 'text', 'markdown'; optional)
  - `value` (String; required)s
- `virtualization` (Bool; optional): This property tells the table to use virtualization when rendering.
Assumptions are that:
the width of the columns is fixed;
the height of the rows is always the same; and
runtime styling changes will not affect width and height vs. first rendering
"""
function dash_datatable(; kwargs...)
        available_props = Symbol[:id, :active_cell, :cell_selectable, :column_selectable, :columns, :css, :data, :data_previous, :data_timestamp, :derived_filter_query_structure, :derived_viewport_data, :derived_viewport_indices, :derived_viewport_row_ids, :derived_viewport_selected_columns, :derived_viewport_selected_row_ids, :derived_viewport_selected_rows, :derived_virtual_data, :derived_virtual_indices, :derived_virtual_row_ids, :derived_virtual_selected_row_ids, :derived_virtual_selected_rows, :dropdown, :dropdown_conditional, :dropdown_data, :editable, :end_cell, :export_columns, :export_format, :export_headers, :fill_width, :filter_action, :filter_options, :filter_query, :fixed_columns, :fixed_rows, :hidden_columns, :include_headers_on_copy_paste, :is_focused, :loading_state, :locale_format, :markdown_options, :merge_duplicate_headers, :page_action, :page_count, :page_current, :page_size, :persisted_props, :persistence, :persistence_type, :row_deletable, :row_selectable, :selected_cells, :selected_columns, :selected_row_ids, :selected_rows, :sort_action, :sort_as_null, :sort_by, :sort_mode, :start_cell, :style_as_list_view, :style_cell, :style_cell_conditional, :style_data, :style_data_conditional, :style_filter, :style_filter_conditional, :style_header, :style_header_conditional, :style_table, :tooltip, :tooltip_conditional, :tooltip_data, :tooltip_delay, :tooltip_duration, :tooltip_header, :virtualization]
        wild_props = Symbol[]
        return Component("dash_datatable", "DataTable", "dash_table", available_props, wild_props; kwargs...)
end

