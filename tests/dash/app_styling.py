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
    data = OrderedDict([

        ('Date', [
            '2015-01-01',
            '2015-10-24',
            '2016-05-10',
        ]),

        ('Region', [
            'Montreal',
            'Vermont',
            'New York City',
        ]),

        ('Temperature', [1, -20, 3.512]),
        ('Humidity', [10, 20, 30]),
        ('Pressure', [2, 10924, 3912]),

    ])

    df = pd.DataFrame(data)

    return html.Div(style={
        'marginLeft': 'auto',
        'marginRight': 'auto',
        'width': '80%'
    }, children=[
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
                'Temperature': {
                    'textAlign': 'right', 'fontFamily': 'monospaced'
                },
                'Humidity': {
                    'textAlign': 'right', 'fontFamily': 'monospaced'
                },
                'Pressure': {
                    'textAlign': 'right', 'fontFamily': 'monospaced'
                },
            }
        ),

    ])
