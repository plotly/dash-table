from collections import OrderedDict
from dash.dependencies import Input, Output
import dash_core_components as dcc
import dash_html_components as html
import pandas as pd
from textwrap import dedent

import dash_table
from index import app
from .utils import section_title, html_table


def layout():
    data = OrderedDict(
        [
            (
                "Date",
                [
                    "July 12th, 2013 - July 25th, 2013",
                    "July 12th, 2013 - August 25th, 2013",
                    "July 12th, 2014 - August 25th, 2014",
                ],
            ),
            (
                "Election Polling Organization",
                ["The New York Times", "Pew Research", "The Washington Post"],
            ),
            ("Rep", [1, -20, 3.512]),
            ("Dem", [10, 20, 30]),
            ("Ind", [2, 10924, 3912]),
            (
                "Region",
                [
                    "Northern New York State to the Southern Appalachian Mountains",
                    "Canada",
                    "Southern Vermont",
                ],
            ),
        ]
    )

    df = pd.DataFrame(data)
    df_long = pd.DataFrame(
        OrderedDict([(name, col_data * 10) for (name, col_data) in data.items()])
    )
    df_long_columns = pd.DataFrame(
        {
            "This is Column {} Data".format(i): [1, 2]
            for i in range(10)
        }
    )

    return [
        html.H1("Sizing Guide"),
        html.Div(
            style={
                "marginLeft": "auto",
                "marginRight": "auto",
                "width": "80%",
                "borderLeft": "thin hotpink solid",
                "borderRight": "thin hotpink solid",
            },
            children=[
                section_title("Default Styles"),

                html.B('HTML Table'),
                html_table(df, table_style={}, base_column_style={}),
                html.B('Dash Table'),
                dash_table.Table(
                    id='default-style',
                    data=df.to_dict('rows'),
                    columns=[{'id': c, 'name': c} for c in df.columns]
                ),

                section_title("Responsive Table"),
                html.Div(
                    """
            With 100% width, the tables will expand to their
            container. When the table gets small, the text will break into
            multiple lines.
            """
                ),
                html_table(df, table_style={"width": "100%"}, base_column_style={}),
                dash_table.Table(
                    id='responsive',
                    data=df.to_dict('rows'),
                    columns=[{'id':c, 'name':c} for c in df.columns],
                    content_style='grow',
                    style_table={
                        'width': '100%',
                    }
                ),

                section_title("All Column Widths defined by Percent"),
                html.Div(
                    """
            The column widths can be definied by percents rather than pixels.
            """
                ),
                html_table(
                    df,
                    table_style={"width": "100%"},
                    column_style={
                        "Date": {"width": "30%"},
                        "Election Polling Organization": {"width": "25%"},
                        "Dem": {"width": "5%"},
                        "Rep": {"width": "5%"},
                        "Ind": {"width": "5%"},
                        "Region": {"width": "30%"},
                    },
                ),
                dash_table.Table(
                    id='column-percentage',
                    data=df.to_dict('rows'),
                    columns=[{'id':c, 'name':c} for c in df.columns],
                    content_style='grow',
                    style_cell_conditional=[
                        {'if': {'column_id': 'Date'},
                         'width': '30%'},
                        {'if': {'column_id': 'Election Polling Organization'},
                         'width': '25%'},
                        {'if': {'column_id': 'Dem'},
                         'width': '5%'},
                        {'if': {'column_id': 'Rep'},
                         'width': '5%'},
                        {'if': {'column_id': 'Ind'},
                         'width': '5%'},
                        {'if': {'column_id': 'Region'},
                         'width': '30%'},
                    ],
                    style_table={
                        'width': '100%',
                    }
                ),

                section_title("Single Column Width Defined by Percent"),
                html.Div(
                    """
            The width of one column (Region=50%) can be definied by percent.
            """
                ),
                html_table(
                    df,
                    table_style={"width": "100%"},
                    column_style={"Region": {"width": "50%"}},
                ),
                dash_table.Table(
                    id='single-column-percentage',
                    data=df.to_dict('rows'),
                    columns=[{'id':c, 'name':c} for c in df.columns],
                    content_style='grow',
                    style_table={'width': '100%'},
                    style_cell_conditional=[
                        {'if': {'column_id': 'Region'},
                         'width': '50%'},
                    ]
                ),

                section_title("Columns with min-width"),
                html.Div(
                    "Here, the min-width for the first column is 130px, or about the width of this line: "
                ),
                html.Div(
                    style={"width": 130, "height": 10, "backgroundColor": "hotpink"}
                ),
                html_table(
                    df,
                    table_style={"width": "100%"},
                    column_style={"Date": {"minWidth": "130"}},
                ),
                dash_table.Table(
                    id='single-column-min-width',
                    data=df.to_dict('rows'),
                    columns=[{'id': c, 'name': c} for c in df.columns],
                    content_style='grow',
                    style_table={'width': '100%'},
                    style_cell_conditional=[
                        {'if': {'column_id': 'Date'},
                         'minWidth': 130},
                    ]
                ),

                section_title("Underspecified Widths"),
                html.Div(
                    """
            The widths can be under-specified. Here, we're only setting the width for the three
            columns in the middle, the rest of the columns are automatically sized to fit the rest of the container.
            The columns have a width of 50px, or the width of this line:
            """
                ),
                html.Div(
                    style={"width": 50, "height": 10, "backgroundColor": "hotpink"}
                ),
                html_table(
                    df,
                    table_style={"width": "100%"},
                    column_style={
                        "Dem": {"width": 50},
                        "Rep": {"width": 50},
                        "Ind": {"width": 50},
                    },
                ),
                dash_table.Table(
                    id='multiple-column-min-width',
                    data=df.to_dict('rows'),
                    columns=[{'id': c, 'name': c} for c in df.columns],
                    content_style='grow',
                    style_table={'width': '100%'},
                    style_cell_conditional=[
                        {'if': {'column_id': 'Dem'},
                         'width': 50},
                        {'if': {'column_id': 'Rep'},
                         'width': 50},
                        {'if': {'column_id': 'Ind'},
                         'width': 50},
                    ]
                ),

                section_title("Widths that are smaller than the content"),
                html.Div(
                    """
            In this case, we're setting the width to 20px, which is smaller
            than the "10924" number in the "Ind" column.
            The table does not allow it.
            """
                ),
                html.Div(
                    style={"width": 20, "height": 10, "backgroundColor": "hotpink"}
                ),
                html_table(
                    df,
                    table_style={"width": "100%"},
                    column_style={
                        "Dem": {"width": 20},
                        "Rep": {"width": 20},
                        "Ind": {"width": 20},
                    },
                ),
                dash_table.Table(
                    id='multiple-column-min-width-small',
                    data=df.to_dict('rows'),
                    columns = [{'id':c, 'name':c} for c in df.columns],
                    content_style='grow',
                    style_table={'width': '100%'},
                    style_cell_conditional=[
                        {'if': {'column_id': 'Dem'},
                         'width': 20},
                        {'if': {'column_id': 'Rep'},
                         'width': 20},
                        {'if': {'column_id': 'Ind'},
                         'width': 20},
                    ]
                ),

                section_title("Content with Ellipses"),
                html.Div(
                    """
                With `max-width`, the content can collapse into
                ellipses once the content doesn't fit.

                Here, `max-width` is set to 0. It could be any number, the only
                important thing is that it is supplied. The behaviour will be
                the same whether it is 0 or 50.
            """
                ),
                html_table(
                    df,
                    table_style={"width": "100%"},
                    cell_style={
                        "whiteSpace": "nowrap",
                        "overflow": "hidden",
                        "textOverflow": "ellipsis",
                        "maxWidth": 0,
                    },
                ),
                dash_table.Table(
                    id='multiple-column-ellipsis',
                    data=df.to_dict('rows'),
                    columns = [{'id':c, 'name':c} for c in df.columns],
                    content_style='grow',
                    style_table={'width': '100%'},
                    style_cell={
                        "whiteSpace": "nowrap",
                        "overflow": "hidden",
                        "textOverflow": "ellipsis",
                        "maxWidth": 0,
                    },
                ),

                section_title("Vertical Scrolling"),
                html.Div(
                    """
            By supplying a max-height of the Table container and supplying
            `overflow-y: scroll`, the table will become scrollable if the
            table's contents are larger than the container.
            """
                ),
                html.Div(
                    style={"maxHeight": 300, "overflowY": "scroll"},
                    children=html_table(df_long, table_style={"width": "100%"}),
                ),
                dash_table.Table(
                    id='vertical-scrolling',
                    data=df_long.to_dict('rows'),
                    columns = [{'id':c, 'name':c} for c in df.columns],
                    content_style='grow',
                    style_table={'width': '100%', 'maxHeight': '300', 'overflowY': 'scroll'},
                ),

                section_title("Vertical Scrolling with Max Height"),
                html.Div(
                    """
            With `max-height`, if the table's contents are shorter than the
            `max-height`, then the container will be shorter.
            If you want a container with a constant height no matter the
            contents, then use `height`.

            Here, we're setting max-height to 300, or the height of this line:
            """
                ),
                html.Div(
                    style={"width": 5, "height": 300, "backgroundColor": "hotpink"}
                ),
                html.Div(
                    style={"maxHeight": 300, "overflowY": "scroll"},
                    children=html_table(df, table_style={"width": "100%"}),
                ),
                dash_table.Table(
                    id='vertical-scrolling-small',
                    data=df.to_dict('rows'),
                    columns = [{'id':c, 'name':c} for c in df.columns],
                    content_style='grow',
                    style_table={'width': '100%', 'maxHeight': '300', 'overflowY': 'scroll'},
                ),

                section_title("Vertical Scrolling with Height"),
                html.Div("and here is `height` with the same content"),
                html.Div(
                    style={"height": 300, "overflowY": "scroll"},
                    children=html_table(df, table_style={"width": "100%"}),
                ),
                dash_table.Table(
                    id='vertical-scrolling-with-height',
                    data=df.to_dict('rows'),
                    columns=[{'id': c, 'name': c} for c in df.columns],
                    style_table={'height': '300', 'overflowY': 'scroll'},
                ),

                section_title("Vertical Scrolling via Fixed Rows"),
                dash_table.Table(
                    id='vertical-scrolling-via-fixed-rows',
                    data = df.to_dict('rows'),
                    columns = [{'id':c, 'name':c} for c in df.columns],
                    content_style='grow',
                    style_table={'width': '100%', 'maxHeight': '300', 'overflowY': 'scroll'},
                    n_fixed_rows=1
                ),

                dash_table.Table(
                    id='vertical-scrolling-via-fixed-rows-long',
                    data=df_long.to_dict('rows'),
                    columns = [{'id':c, 'name':c} for c in df.columns],
                    content_style='grow',
                    style_table={'width': '100%', 'maxHeight': '300', 'overflowY': 'scroll'},
                    n_fixed_rows=1
                ),

                section_title("Horizontal Scrolling"),
                html.Div(
                    """
            With HTML tables, we can set `min-width` to be 100%.
            If the content is small, then the columns will have some extra
            space.
            But if the content of any of the cells is really large, then the
            cells will expand beyond the container and a scrollbar will appear.

            In this way, `min-width` and `overflow-x: scroll` is an alternative
            to `text-overflow: ellipses`. With scroll, the content that can't
            fit in the container will get pushed out into a scrollable zone.
            With text-overflow: ellipses, the content will get truncated by
            ellipses. Both strategies work with or without line breaks on the
            white spaces (`white-space: normal` or `white-space: nowrap`).

            These next two examples have the same styles applied:
            - `min-width: 100%`
            - `white-space: nowrap` (to keep the content on a single line)
            - A parent with `overflow-x: scroll`

            """
                ),
                section_title("Two Columns, 100% Min-Width"),
                html.Div(
                    html_table(
                        pd.DataFrame({"Column 1": [1, 2], "Column 2": [3, 3]}),
                        table_style={"minWidth": "100%"},
                        cell_style={"whiteSpace": "nowrap"},
                    ),
                    style={"overflowX": "scroll"},
                ),
                dash_table.Table(
                    id='min-width-one-hundred',
                    data=df_long.to_dict('rows'),
                    columns=[{'id': c, 'name': c} for c in df.columns],
                    style_table={'minWidth': '100%'},
                    style_cell={'whiteSpace': 'nowrap'}
                ),

                section_title("Long Columns, 100% Min-Width"),
                html.Div(
                    """
                Here is a table with several columns with long titles,
                100% min-width, and `'white-space': 'nowrap'`
                (to keep the text on a single line)
            """
                ),
                html.Div(
                    html_table(
                        df_long_columns,
                        table_style={"minWidth": "100%", "overflowX": "scroll"},
                        cell_style={"whiteSpace": "nowrap"},
                    ),
                    style={"overflowX": "scroll"},
                ),
                dash_table.Table(
                    id='min-width-long-columns',
                    data=df_long_columns.to_dict('rows'),
                    columns=[{'id': c, 'name': c} for c in df_long_columns.columns],
                    style_table={'minWidth': '100%', 'overflowX': 'scroll'},
                    style_cell={'whiteSpace': 'nowrap'}
                ),
            ]
        )
    ]
