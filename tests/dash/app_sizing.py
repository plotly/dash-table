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
                html.H1("Background - HTML Tables"),
                section_title("HTML Table - Default Styles"),
                html.Div("By default, HTML tables expand to their contents"),
                html_table(df, table_style={}, base_column_style={}),

                dash_table.TableLite(
                    rows=df.to_records(index=False),
                    columns=[{'name': i} for i in data.keys()],
                ),

                section_title("HTML Table - Padding"),
                html.Div(
                    """
                Since the table content is packed so tightly,
                it's usually a good idea to place some left
                on the columns.
            """
                ),
                html_table(df, table_style={}, cell_style={"paddingLeft": 10}),
                dash_table.TableLite(
                    rows=df.to_records(index=False),
                    columns=[{'name': i} for i in data.keys()],
                ),

                section_title("HTML Table - Responsive Table"),
                html.Div(
                    """
            With 100% width, the tables will expand to their
            container. When the table gets small, the text will break into
            multiple lines.
            """
                ),
                html_table(df, table_style={"width": "100%"}, base_column_style={}),
                dash_table.TableLite(
                    rows=df.to_records(index=False),
                    columns=[{'name': i} for i in data.keys()],
                    styles={
                        'table': {'width': '100%'}
                    }
                ),

                section_title("HTML Table - Columns with Pixel Width"),
                html.Div(
                    """
            The column widths can also be unresponsive, and fixed at a particular width.
            """
                ),
                html_table(
                    df,
                    column_style={
                        "Date": {"width": "200px"},
                        "Election Polling Organization": {"width": "200px"},
                        "Dem": {"width": "200px"},
                        "Rep": {"width": "200px"},
                        "Ind": {"width": "200px"},
                        "Region": {"width": "200px"},
                    },
                ),
                dash_table.TableLite(
                    rows=df.to_records(index=False),
                    columns=[
                        {'name': i, 'style': {'width': '200px'}}
                        for i in df.columns
                    ],
                    styles={}
                ),

                section_title("HTML Table - All Column Widths defined by Percent"),
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
                dash_table.TableLite(
                    rows=df.to_records(index=False),
                    columns=[
                        {'name': 'Date', 'style': {'width': '30%'}},
                        {'name': 'Election Polling Organization', 'style': {'width': '25%'}},
                        {'name': 'Rep', 'style': {'width': '5%'}},
                        {'name': 'Dem', 'style': {'width': '5%'}},
                        {'name': 'Ind', 'style': {'width': '5%'}},
                        {'name': 'Region', 'style': {'width': '30%'}},
                    ],
                    styles={
                        'table': {'width': '100%'}
                    }
                ),

                section_title("HTML Table - Single Column Width Defined by Percent"),
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
                dash_table.TableLite(
                    rows=df.to_records(index=False),
                    columns=[
                        {'name': 'Date'},
                        {'name': 'Election Polling Organization'},
                        {'name': 'Rep'},
                        {'name': 'Dem'},
                        {'name': 'Ind'},
                        {'name': 'Region', 'style': {'width': '50%'}},
                    ],
                    styles={
                        'table': {'width': '100%'}
                    }
                ),

                section_title("HTML Table - Columns with min-width"),
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
                dash_table.TableLite(
                    rows=df.to_records(index=False),
                    columns=[
                        {'name': 'Date', 'style': {'minWidth': '130px'}},
                        {'name': 'Election Polling Organization'},
                        {'name': 'Rep'},
                        {'name': 'Dem'},
                        {'name': 'Ind'},
                        {'name': 'Region'}
                    ],
                    styles={
                        'table': {'width': '100%'}
                    }
                ),

                section_title("HTML Table - Underspecified Widths"),
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
                dash_table.TableLite(
                    rows=df.to_records(index=False),
                    columns=[
                        {'name': 'Date'},
                        {'name': 'Election Polling Organization'},
                        {'name': 'Dem', 'style': {'width': 50}},
                        {'name': 'Rep', 'style': {'width': 50}},
                        {'name': 'Ind', 'style': {'width': 50}},
                        {'name': 'Region'}
                    ],
                    styles={
                        'table': {'width': '100%'}
                    }
                ),

                section_title("HTML Table - Widths that are smaller than the content"),
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
                dash_table.TableLite(
                    rows=df.to_records(index=False),
                    columns=[
                        {'name': 'Date'},
                        {'name': 'Election Polling Organization'},
                        {'name': 'Dem', 'style': {'width': 20}},
                        {'name': 'Rep', 'style': {'width': 20}},
                        {'name': 'Ind', 'style': {'width': 20}},
                        {'name': 'Region'}
                    ],
                    styles={
                        'table': {'width': '100%'}
                    }
                ),

                section_title("HTML Table - Content with Ellipses"),
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
                dash_table.TableLite(
                    rows=df.to_records(index=False),
                    columns=[
                        {'name': 'Date'},
                        {'name': 'Election Polling Organization'},
                        {'name': 'Rep'},
                        {'name': 'Dem'},
                        {'name': 'Ind'},
                        {'name': 'Region'}
                    ],
                    styles={
                        'table': {'width': '100%'},
                        'th': {
                            "whiteSpace": "nowrap",
                            "overflow": "hidden",
                            "textOverflow": "ellipsis",
                            "maxWidth": 0,
                        },
                        'td': {
                            "whiteSpace": "nowrap",
                            "overflow": "hidden",
                            "textOverflow": "ellipsis",
                            "maxWidth": 0,
                        }
                    }
                ),

                section_title("HTML Table - Vertical Scrolling"),
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
                section_title("HTML Table - Vertical Scrolling with Max Height"),
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
                section_title("HTML Table - Vertical Scrolling with Height"),
                html.Div("and here is `height` with the same content"),
                html.Div(
                    style={"height": 300, "overflowY": "scroll"},
                    children=html_table(df, table_style={"width": "100%"}),
                ),
                section_title("HTML Table - Horizontal Scrolling"),
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

                section_title("HTML Table - Two Columns, 100% Min-Width"),
                html.Div(
                    html_table(
                        pd.DataFrame({"Column 1": [1, 2], "Column 2": [3, 3]}),
                        table_style={"minWidth": "100%"},
                        cell_style={"whiteSpace": "nowrap"},
                    ),
                    style={"overflowX": "scroll"},
                ),
                html.Div(
                    dash_table.TableLite(
                        rows=[[1, 2]],
                        columns=[{'name': 'Column 1'}, {'name': 'Column 2'}],
                        styles={
                            "table": {"minWidth": "100%"},
                            "td": {"whiteSpace": "nowrap"}
                        },
                    )
                ),

                section_title("HTML Table - Long Columns, 100% Min-Width"),
                html.Div(
                    """
                Here is a table with several columns with long titles,
                100% min-width, and `'white-space': 'nowrap'`
                (to keep the text on a single line)
            """
                ),
                html.Div(
                    html_table(
                        pd.DataFrame(
                            {
                                "This is Column {} Data".format(i): [1, 2]
                                for i in range(10)
                            }
                        ),
                        table_style={"minWidth": "100%", "overflowX": "scroll"},
                        cell_style={"whiteSpace": "nowrap"},
                    ),
                    style={"overflowX": "scroll"},
                ),
                html.Div(
                    dash_table.TableLite(
                        rows=pd.DataFrame(
                            {
                                "This is Column {} Data".format(i): [1, 2]
                                for i in range(10)
                            }
                        ).to_records(index=False),
                        columns=[
                            {'name': "This is Column {} Data".format(i)}
                            for i in range(10)
                        ],
                        styles={
                            'table': {"minWidth": "100%", "overflowX": "scroll"},
                            'th': {"whiteSpace": "nowrap"},
                            'td': {"whiteSpace": "nowrap"},
                        }
                    ),
                    style={"overflowX": "scroll"},
                ),
            ],
        ),
    ]
