from dash.dependencies import Input, Output
import dash_core_components as dcc
import dash_html_components as html
import pandas as pd
from textwrap import dedent

import dash_table
from index import app

ID_PREFIX = 'app_dataframe_updating_graph'
IDS = {
    'table': ID_PREFIX,
    'container': '{}-container'.format(ID_PREFIX)
}


def layout():
    df = pd.read_csv("./datasets/gapminder.csv")
    df = df[df['year'] == 2007]
    return html.Div([
        html.Div(
            dash_table.Table(
                id=IDS['table'],
                columns=[{"name": i, "id": i} for i in df.columns],
                dataframe=df.to_dict("rows"),

                editable=True,
                filtering=True,
                sorting=True,
                sorting_type='multi',

                row_selectable='multi',
                selected_rows=[]
            ),
            style={'height': 300, 'overflowY': 'scroll'}
        ),
        html.Div(id=IDS['container']),

        dcc.Markdown(dedent(
            '''
            ***

            `Table` includes several features for modifying and transforming the
            view of the data. These include:

            - Sorting by column (`sorting=True`)
            - Filtering by column (`filtering=True`)
            - Editing the cells (`editable=True`)
            - Deleting rows (`row_deletable=True`)
            - Deleting columns (??)
            - Selecting rows (`row_selectable='single' | 'multi'`)

            > A quick note on filtering. We have defined our own
            > syntax for performing filtering operations. Here are some
            > examples for this particular dataset:
            > - `> 30` in the `lifeExp` column
            > - `> 30 && < 50` in the `lifeExp` column
            > - `Canada` in the `country` column
            > - `contains Can` in the `country` column

            By default, these transformations are done clientside.
            Your Dash callbacks can respond to these modifications
            by listening to the `dataframe` property as an `Input`.

            Note that if `dataframe` is an `Input` then the entire
            `dataframe` will be passed over the network: if your dataframe is
            large, then this will become slow. For large dataframes, you have
            two options:
            - Use `dataframe_indicies` instead
            - Perform the sorting or filtering in Python instead

            Issues with this example:
            - How to do vertical scrolling?
            - Where is the column deletable property?
            - Row deletable doesn't appear?
            - Filtering, sorting isn't updating the `dataframe` prop but editing the table is
            Should I be using a different property?
            - What are some basic filtering queries?
            - Columns don't expand to the width of the container
            - The numbers are getting modified on presentation: 12779.37964 becomes 12779.379640000001
            ''')
        ),

    ])


@app.callback(Output(IDS['container'], 'children'),
              [Input(IDS['table'], 'dataframe'),
               Input(IDS['table'], 'selected_rows')])
def update_graph(rows, selected_rows):
    dff = pd.DataFrame(rows)

    colors = []
    for i in range(len(dff)):
        if i in selected_rows:
            colors.append('#7FDBFF')
        else:
            colors.append('#0074D9')

    return html.Div([
        dcc.Graph(id=column, figure={
            'data': [{
                'x': dff['country'],
                'y': dff[column],
                'type': 'bar',
                'marker': {
                    'color': colors
                }
            }],
            'layout': {
                'xaxis': {'automargin': True},
                'yaxis': {'automargin': True},
                'height': 250,
                'margin': {'t': 10, 'l': 10, 'r': 10}
            }
        })
        for column in ['pop', 'lifeExp', 'gdpPercap']
    ])
