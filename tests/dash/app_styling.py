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
    return html.Div([
        html.H1('[WIP] - Styling the Table'),

        section_title('HTML Table - Alignment'),
        html.Div('''
        When displaying numerical data, it's a good practice to use
        monospaced fonts, to right-align the data, and to provide the same
        number of decimals throughout the column.

        Note that it's not possible to modify the number of decimal places
        in css. `dash-table` will provide formatting options in the future,
        until then you'll have to modify your data before displaying it.

        For textual data, left-aligning the data is usually easier to read.

        In both cases, the column headers should have the same alignment
        as the cell content.
        '''),
        html_table(
            df,
            cell_style={'paddingLeft': 5, 'paddingRight': 5},
            cell_style_by_column={
                'Rep': {'textAlign': 'right', 'fontFamily': 'monospaced'},
                'Ind': {'textAlign': 'right', 'fontFamily': 'monospaced'},
                'Dem': {'textAlign': 'right', 'fontFamily': 'monospaced'},
            }
        ),

    ])
