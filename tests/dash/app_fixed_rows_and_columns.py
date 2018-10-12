import dash_table
from .utils import section_title, rand_id

import dash_core_components as dcc
import dash_html_components as html
from textwrap import dedent
import pandas as pd


df = pd.read_csv("./datasets/gapminder.csv")
df_small = pd.read_csv("./datasets/gapminder-small.csv")


def layout():
    return html.Div([
        dcc.Markdown(dedent('''

        The Dash Table supports rendering content with fixed rows and
        fixed columns.

        ''')),

        section_title('Fixed Rows'),

        dcc.Markdown(dedent('''
        To fix columns, set `n_fixed_rows` to the number of rows
        that you'd like to fix.

        A quick note on sizing: without fixed rows, the table's height
        will be as large as its content.

        With fixed rows, we bound the height of the table so that the content
        is scrollable. In this case, the height is ??.
        With a row height of ??, this will draw about ?? rows.
        ''')),

        dash_table.Table(
            id=rand_id(),
            dataframe=df.to_dict('rows')[:100],
            columns=[{'name': i, 'id': i} for i in df.columns],
            n_fixed_rows=1
        ),

        section_title('Adjusting the Height with Fixed Rows'),
        dcc.Markdown(dedent('''
        To adjust this height, set ???
        ''')),

        dash_table.Table(
            id=rand_id(),
            dataframe=df.to_dict('rows'),
            columns=[{'name': i, 'id': i} for i in df.columns],
            n_fixed_rows=1,
            # style={'height': 200}
        ),

        section_title('Fixed Columns'),

        dcc.Markdown(dedent('''
        To fix columns, set `n_fixed_columns` to the number of columns
        that you'd like to fix.

        Similar to fixing rows, when you fix columns we'll fix the width of the
        table's container to ?? pixels. Without fixed columns, the table's
        width will expand to its contents.
        ''')),

        dash_table.Table(
            id=rand_id(),
            dataframe=df.to_dict('rows')[:10],
            columns=[{'name': i, 'id': i} for i in df.columns],
            n_fixed_columns=2
        ),

        section_title('Overriding the Width with Fixed Columns'),
        dcc.Markdown(dedent('''
        To adjust the width of the table, set ??
        ''')),
        dash_table.Table(
            id=rand_id(),
            dataframe=df.to_dict('rows')[:10],
            columns=[{'name': i, 'id': i} for i in df.columns],
            n_fixed_columns=2,
            # style={'width': 300}
        ),

        section_title('Fixed Rows and Columns'),

        dcc.Markdown(dedent('''
        Combine the two to have both fixed rows and fixed columns.
        ''')),

        dash_table.Table(
            id=rand_id(),
            dataframe=df.to_dict('rows')[:100],
            columns=[{'name': i, 'id': i} for i in df.columns],
            n_fixed_columns=3,
            n_fixed_rows=1
        ),

        section_title('Fixed Multi-Line Headers'),

        dcc.Markdown(dedent('''
        With multi-line headers, you can increment n_fixed_rows to match
        the number of headers.
        ''')),

        dash_table.Table(
            id=rand_id(),
            columns=[
                {
                    'name': ['', '', 'Year'],
                    'id': 'year'
                },
                {
                    'name': ['City', 'Montreal', 'Rainfall'],
                    'id': 'montreal-rainfall'
                },
                {
                    'name': ['City', 'Montreal', 'Temperature'],
                    'id': 'montreal-temperature'
                },
                {
                    'name': ['City', 'New York City', 'Rainfall'],
                    'id': 'nyc-rainfall'
                },
                {
                    'name': ['City', 'New York City', 'Temperature'],
                    'id': 'nyc-temperature'
                }
            ],
            merge_duplicate_headers=True,
            n_fixed_rows=3,
            dataframe=[
                {'year': i, 'montreal-rainfall': i, 'montreal-temperature': i,
                 'nyc-rainfall': i, 'nyc-temperature': i}
                for i in range(10)
            ]
        ),

        dcc.Markdown(dedent('''
        ## Constraints

        **Background**
        The `dash_table` is rendered with standard HTML
        `<table/>` markup. This enables easy,
        transparent styling and sizing for most use cases.

        One use case that isn't natively supported by browsers
        and the CSS spec is fixed rows and columns.
        In order to support this feature, we needed to
        introduce some complexity in our markup.
        Technically, we're rendering multiple tables:
        one table for the content and an extra table for
        the fixed rows and/or columns.
        ''')),

        section_title('Constraint 1 - Fixed Column Widths'),
        dcc.Markdown(dedent('''
        Column widths need to be fixed with pixel widths.
            - Specifying the width of the columns with percentages isn't
            supported.
            - Column widths can't be "unset". In tables without fixed rows
            or columns, if leaving your column widths unset then the
            width of the columns will automatically grow in order to
            contain all of the text. This behavior isn't supported with
            fixed rows.
        ''')),

        section_title('Constraint 2 - Laggy Scroll Behaviour'),
        dcc.Markdown(dedent('''
        With fixed rows _and_ fixed columns, we are scrolling certain
        elements programatically. That is, we're not relying on the
        browser's native scroll behavior. You may notice that scrolling
        won't feel as smooth as usual.
        ''')),

        section_title('Constraint 3 - Merged Row Headers with Fixed Columns'),
        dcc.Markdown(dedent('''
        If you are merging your row headers, then your fix columns can only
        happen at the edges of the merged column sections.

        For example, in the table below, you can't set fixed columns to be
        1, 2, 4, or 5 (the columns in the middle of the "Experiment" headers).
        ''')),

        dash_table.Table(
            id='merged-row-headers-with-fixed-columns',
            n_fixed_columns=7,
            merge_duplicate_headers=True,
            columns=([
                {
                    'id': 'col-1',
                    'name': 'Experiment 1'
                },
                {
                    'id': 'col-2',
                    'name': 'Experiment 1'
                },
                {
                    'id': 'col-3',
                    'name': 'Experiment 1'
                },
                {
                    'id': 'col-4',
                    'name': 'Experiment 2'
                },
                {
                    'id': 'col-5',
                    'name': 'Experiment 2'
                },
                {
                    'id': 'col-6',
                    'name': 'Experiment 3'
                },
                {
                    'id': 'col-7',
                    'name': 'Experiment 3'
                },
            ] + [
                {
                    'id': 'col-{}'.format(i + 8),
                    'name': 'Reference {}'.format(i)
                } for i in range(10)
            ]),
            dataframe=[
                {'col-{}'.format(i+1): j for i in range(18)}
                for j in range(10)
            ]
        )

    ])
