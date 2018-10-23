from collections import OrderedDict
from dash.dependencies import Input, Output
import dash_core_components as dcc
import dash_html_components as html
import pandas as pd
from textwrap import dedent

import dash_table

from index import app
from .utils import html_table, section_title


def layout():
    data = OrderedDict(
        [
            ("Date", ["2015-01-01", "2015-10-24", "2016-05-10"] * 2),
            ("Region", ["Montreal", "Vermont", "New York City"] * 2),
            ("Temperature", [1, -20, 3.512] * 2),
            ("Humidity", [10, 20, 30] * 2),
            ("Pressure", [2, 10924, 3912] * 2),
        ]
    )

    df = pd.DataFrame(data)

    return html.Div(
        style={"marginLeft": "auto", "marginRight": "auto", "width": "80%"},
        children=[
            html.H1("Styling the Table"),

            section_title("Default Styles"),

            html_table(
                df,
                cell_style={'border': 'thin lightgrey solid'},
                table_style={'width': '100%'},
                column_style={'width': '20%', 'paddingLeft': 20},
                header_style={'backgroundColor': 'rgb(235, 235, 235)'}
            ),
            dash_table.Table(
                id='default-style',
                data=df.to_dict('rows'),
                columns=[{'id': c, 'name': c} for c in df.columns]
            ),

            html.Hr(),

            section_title("Column Alignment and Column Fonts"),
            dcc.Markdown(dedent(
            """
            When displaying numerical data, it's a good practice to use
            monospaced fonts, to right-align the data, and to provide the same
            number of decimals throughout the column.

            Note that it's not possible to modify the number of decimal places
            in css. `dash-table` will provide formatting options in the future,
            until then you'll have to modify your data before displaying it.

            For textual data, left-aligning the data is usually easier to read.

            In both cases, the column headers should have the same alignment
            as the cell content.
            """
            )),
            html_table(
                df,
                table_style={'width': '100%'},
                column_style={'width': '20%', 'paddingLeft': 20},
                cell_style={"paddingLeft": 5, "paddingRight": 5, 'border': 'thin lightgrey solid'},
                header_style_by_column={
                    "Temperature": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Humidity": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Pressure": {"textAlign": "right", "fontFamily": "monospaced"},
                },
                cell_style_by_column={
                    "Temperature": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Humidity": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Pressure": {"textAlign": "right", "fontFamily": "monospaced"},
                },
                header_style={'backgroundColor': 'rgb(235, 235, 235)'}
            ),
            dash_table.Table(
                id='column-alignment',
                data=df.to_dict('rows'),
                columns=[{'id': c, 'name': c} for c in df.columns],

                # feels odd that I need to specify both of these
                content_style='grow',
                style_table={'width': '100%'},

                style_cell_conditional=[
                    {'if': {'column_id': 'Date'},
                     'textAlign': 'left', 'fontFamily': 'sans-serif',
                     'paddingLeft': '10px'},
                    {'if': {'column_id': 'Region'},
                     'textAlign': 'left', 'fontFamily': 'sans-serif', 'paddingLeft': '10px'},
                ]
            ),

            html.Hr(),

            section_title('Styling the Table as a List'),

            dcc.Markdown(dedent('''
            The gridded view is a good default view for an editable table, like a spreadsheet.
            If your table isn't editable, then in many cases it can look cleaner without the
            horizontal or vertical grid lines.
            ''')),

            html_table(
                df,
                table_style={'width': '100%'},
                column_style={'width': '20%', 'paddingLeft': 20},
                cell_style={"paddingLeft": 5, "paddingRight": 5},
                header_style={'backgroundColor': 'rgb(235, 235, 235)', 'borderTop': 'thin lightgrey solid', 'borderBottom': 'thin lightgrey solid'},
                header_style_by_column={
                    "Temperature": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Humidity": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Pressure": {"textAlign": "right", "fontFamily": "monospaced"},
                },
                cell_style_by_column={
                    "Temperature": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Humidity": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Pressure": {"textAlign": "right", "fontFamily": "monospaced"},
                },
            ),
            dash_table.Table(
                id='style-as-list',
                data=df.to_dict('rows'),
                columns=[{'id': c, 'name': c} for c in df.columns],

                content_style='grow',
                style_table={'width': '100%'},
                style_cell={
                    # TODO - this doesn't work?
                    'box-shadow': ', '.join([
                        'inset 0px 1px 0px 0px #CCC',
                        'inset 0px -1px 0px 0px #CCC'
                    ]),

                    # TODO - this doesn't work either:
                    # 'boxShadow': 'none',
                },
            ),

            html.Hr(),

            section_title('Row Padding'),

            dcc.Markdown(dedent('''
            By default, the gridded view is pretty tight. You can add some top and bottom row padding to
            the rows to give your data a little bit more room to breathe.
            ''')),

            html_table(
                df,
                table_style={'width': '100%'},
                column_style={'width': '20%', 'paddingLeft': 20},
                cell_style={"paddingLeft": 5, "paddingRight": 5},
                header_style={'backgroundColor': 'rgb(235, 235, 235)', 'borderTop': 'thin lightgrey solid', 'borderBottom': 'thin lightgrey solid'},
                header_style_by_column={
                    "Temperature": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Humidity": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Pressure": {"textAlign": "right", "fontFamily": "monospaced"},
                },
                cell_style_by_column={
                    "Temperature": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Humidity": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Pressure": {"textAlign": "right", "fontFamily": "monospaced"},
                },
                row_style={'paddingTop': 10, 'paddingBottom': 10}
            ),
            dash_table.Table(
                id='style-as-list-padding',
                data=df.to_dict('rows'),
                columns=[{'id': c, 'name': c} for c in df.columns],

                content_style='grow',
                style_table={'width': '100%'},
                style_cell={
                    # boxShadow doesn't work
                    'box-shadow': ', '.join([
                        'inset 0px 1px 0px 0px #CCC',
                        'inset 0px -1px 0px 0px #CCC'
                    ]),

                    # TODO - This only applies on the headers?
                    'paddingTop': '10px',
                    'paddingBottom': '10px',
                },
            ),

            html.Hr(),

            section_title('List Style with Minimal Headers'),

            dcc.Markdown(dedent('''
            In some contexts, the grey background can look a little heavy.
            You can lighten this up by giving it a white background and
            a thicker bottom border.
            ''')),

            html_table(
                df,
                table_style={'width': '100%'},
                column_style={'width': '20%', 'paddingLeft': 20},
                cell_style={"paddingLeft": 5, "paddingRight": 5},
                header_style={'borderBottom': '2px lightgrey solid'},
                header_style_by_column={
                    "Temperature": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Humidity": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Pressure": {"textAlign": "right", "fontFamily": "monospaced"},
                },
                cell_style_by_column={
                    "Temperature": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Humidity": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Pressure": {"textAlign": "right", "fontFamily": "monospaced"},
                },
                row_style={'paddingTop': 10, 'paddingBottom': 10}
            ),
            dash_table.Table(
                id='minimal-headers',
                data=df.to_dict('rows'),
                columns=[{'id': c, 'name': c} for c in df.columns],

                content_style='grow',
                style_table={'width': '100%'},
                style_header={
                    'backgroundColor': 'white',
                    'borderBottom': '1px lightgrey solid'
                },
                style_cell={
                    # boxShadow doesn't work
                    'box-shadow': ', '.join([
                        'inset 0px 1px 0px 0px #CCC',
                        'inset 0px -1px 0px 0px #CCC'
                    ]),

                    # only applies on the headers?
                    'paddingTop': '10px',
                    'paddingBottom': '10px',
                },
            ),

            html.Hr(),

            section_title('List Style with Understated Headers'),

            dcc.Markdown(dedent('''
            When the data is obvious, sometimes you can de-emphasize the headers
            as well, by giving them a lighter color than the cell text.
            ''')),

            html_table(
                df,
                table_style={'width': '100%'},
                column_style={'width': '20%', 'paddingLeft': 20},
                cell_style={"paddingLeft": 5, "paddingRight": 5},
                header_style={'color': 'rgb(100, 100, 100)'},
                header_style_by_column={
                    "Temperature": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Humidity": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Pressure": {"textAlign": "right", "fontFamily": "monospaced"},
                },
                cell_style_by_column={
                    "Temperature": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Humidity": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Pressure": {"textAlign": "right", "fontFamily": "monospaced"},
                },
                row_style={'paddingTop': 10, 'paddingBottom': 10}
            ),
            dash_table.Table(
                id='minimal-headers-understated',
                data=df.to_dict('rows'),
                columns=[{'id': c, 'name': c} for c in df.columns],

                content_style='grow',
                style_table={'width': '100%'},
                style_header={
                    'backgroundColor': 'white',
                    'borderBottom': '1px lightgrey solid',
                    'color': 'rgb(100, 100, 100)',
                    'fontSize': '14px'
                },
                style_cell={
                    # boxShadow doesn't work
                    'box-shadow': ', '.join([
                        'inset 0px 1px 0px 0px #CCC',
                        'inset 0px -1px 0px 0px #CCC'
                    ]),

                    # only applies on the headers?
                    'paddingTop': '10px',
                    'paddingBottom': '10px',
                },
            ),

            html.Hr(),

            section_title('Striped Rows'),

            dcc.Markdown(dedent('''
            When you're viewing datasets where you need to compare values within individual rows, it
            can sometimes be helpful to give the rows alternating background colors.
            We recommend using colors that are faded so as to not attract too much attention to the stripes.
            ''')),

            html_table(
                df,
                table_style={'width': '100%'},
                column_style={'width': '20%', 'paddingLeft': 20},
                cell_style={"paddingLeft": 5, "paddingRight": 5},
                header_style={'backgroundColor': 'rgb(235, 235, 235)', 'borderTop': 'thin lightgrey solid', 'borderBottom': 'thin lightgrey solid'},
                header_style_by_column={
                    "Temperature": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Humidity": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Pressure": {"textAlign": "right", "fontFamily": "monospaced"},
                },
                cell_style_by_column={
                    "Temperature": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Humidity": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Pressure": {"textAlign": "right", "fontFamily": "monospaced"},
                },
                row_style={'paddingTop': 10, 'paddingBottom': 10},
                odd_row_style={'backgroundColor': 'rgb(248, 248, 248)'}
            ),
            dash_table.Table(
                id='striped-rows',
                data=df.to_dict('rows'),
                columns=[{'id': c, 'name': c} for c in df.columns],

                content_style='grow',
                style_table={'width': '100%'},
                style_cell={
                    # boxShadow doesn't work
                    'box-shadow': ', '.join([
                        'inset 0px 1px 0px 0px #CCC',
                        'inset 0px -1px 0px 0px #CCC'
                    ]),

                    # only applies on the headers?
                    'paddingTop': '10px',
                    'paddingBottom': '10px',
                },
                style_cell_conditional=[{
                    'if': {'row_index': 'odd'},
                    'backgroundColor': 'rgb(248, 248, 248)'
                }]
            ),

            section_title('Dark Theme with Cells'),

            dcc.Markdown(dedent(
            """
            You have full control over all of the elements in the table.
            If you are viewing your table in an app with a dark background,
            you can provide inverted background and font colors.
            """
            )),

            html_table(
                df,
                table_style={
                    'backgroundColor': 'rgb(50, 50, 50)',
                    'color': 'white',
                    'width': '100%'
                },
                cell_style={'border': 'thin white solid'},
                header_style={'backgroundColor': 'rgb(30, 30, 30)'},
                row_style={'padding': 10},
                header_style_by_column={
                    "Temperature": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Humidity": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Pressure": {"textAlign": "right", "fontFamily": "monospaced"},
                },
                cell_style_by_column={
                    "Temperature": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Humidity": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Pressure": {"textAlign": "right", "fontFamily": "monospaced"},
                },
            ),
            dash_table.Table(
                id='dark-theme',
                data=df.to_dict('rows'),
                columns=[{'id': c, 'name': c} for c in df.columns],

                content_style='grow',
                style_table={'width': '100%'},
                style_header={'backgroundColor': 'rgb(30, 30, 30)'},
                style_cell={'backgroundColor': 'rgb(50, 50, 50)', 'color': 'white'},
            ),

            section_title('Dark Theme with Rows'),

            html_table(
                df,
                table_style={
                    'backgroundColor': 'rgb(50, 50, 50)',
                    'color': 'white',
                    'width': '100%'
                },
                row_style={
                    'borderTop': 'thin white solid',
                    'borderBottom': 'thin white solid',
                    'padding': 10
                },
                header_style={'backgroundColor': 'rgb(30, 30, 30)'},
                header_style_by_column={
                    "Temperature": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Humidity": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Pressure": {"textAlign": "right", "fontFamily": "monospaced"},
                },
                cell_style_by_column={
                    "Temperature": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Humidity": {"textAlign": "right", "fontFamily": "monospaced"},
                    "Pressure": {"textAlign": "right", "fontFamily": "monospaced"},
                },
            ),
            dash_table.Table(
                id='dark-theme-with-rows',
                data=df.to_dict('rows'),
                columns=[{'id': c, 'name': c} for c in df.columns],

                content_style='grow',
                style_table={'width': '100%'},
                style_header={'backgroundColor': 'rgb(30, 30, 30)'},
                style_cell={
                    'backgroundColor': 'rgb(50, 50, 50)',
                    'color': 'white',
                    # boxShadow doesn't work
                    'box-shadow': ', '.join([
                        'inset 0px 1px 0px 0px #CCC',
                        'inset 0px -1px 0px 0px #CCC'
                    ]),
                },
            ),

            section_title('Highlighting Certain Rows'),

            dcc.Markdown(dedent('''
            You can draw attention to certain rows by providing a unique
            background color, bold text, or colored text.
            ''')),

            html_table(
                df,
                cell_style={'border': 'thin lightgrey solid', 'color': 'rgb(60, 60, 60)'},
                table_style={'width': '100%'},
                column_style={'width': '20%', 'paddingLeft': 20},
                header_style={'backgroundColor': 'rgb(235, 235, 235)'},
                row_style_by_index={
                    4: {
                        'backgroundColor': '#3D9970',
                        'color': 'white',
                    }
                }
            ),

            dash_table.Table(
                id="highlighting-rows",
                data=df.to_dict("rows"),
                columns=[
                    {"name": i, "id": i} for i in df.columns
                ],
                content_style="grow",
                style_table={
                    "width": "100%"
                },
                style_data_conditional=[{
                    "color": "rgb(60, 60, 60)",
                    "padding_left": 20,
                    "text-align": "left",
                    "width": "20%"
                }, {
                    "if": {"row_index": 4},
                    "backgroundColor": "#3D9970",
                    'color': 'white',
                }]
            ),

            section_title('Highlighting Certain Columns'),

            dcc.Markdown(dedent('''
            Similarly, certain columns can be highlighted.
            ''')),

            html_table(
                df,
                cell_style={'border': 'thin lightgrey solid', 'color': 'rgb(60, 60, 60)'},
                table_style={'width': '100%'},
                column_style={'width': '20%', 'paddingLeft': 20},
                header_style={'backgroundColor': 'rgb(235, 235, 235)'},
                cell_style_by_column={
                    "Temperature": {
                        "backgroundColor": "#3D9970",
                        'color': 'white',
                    },
                }
            ),
            dash_table.Table(
                id="highlighting-columns",
                data=df.to_dict("rows"),
                columns=[
                    {"name": i, "id": i} for i in df.columns
                ],
                content_style="grow",
                style_table={
                    "width": "100%"
                },
                style_data_conditional=[{
                    "if": {"column_id": "Temperature"},
                    "backgroundColor": "#3D9970",
                    'color': 'white',
                }]
            ),

            section_title('Highlighting Certain Cells'),

            dcc.Markdown(dedent('''
            Similarly, certain columns can be highlighted.
            ''')),

            dash_table.Table(
                id="highlighting-cells",
                data=df.to_dict("rows"),
                columns=[
                    {"name": i, "id": i} for i in df.columns
                ],
                content_style="grow",
                style_table={
                    "width": "100%"
                },
                style_data_conditional=[{
                    "if": { "column_id": "Region", "filter": "Region eq str(Montreal)" },
                    "backgroundColor": "#3D9970",
                    'color': 'white',
                }, {
                    "if": { "column_id": "Humidity", "filter": "Humidity eq num(20)" },
                    "backgroundColor": "#3D9970",
                    'color': 'white',
                }]
            ),

        ],
    )
