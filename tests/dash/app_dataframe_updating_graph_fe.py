from dash.dependencies import Input, Output
import dash_core_components as dcc
import dash_html_components as html
import pandas as pd

import dash_table
from index import app

ID_PREFIX = 'app_dataframe_updating_graph'
IDS = {
    'table': ID_PREFIX,
    'container': '{}-container'.format(ID_PREFIX)
}


def layout():
    df = pd.read_csv("./datasets/gapminder.csv")
    return html.Div([
        html.Div(
            dash_table.Table(
                id=IDS['table'],
                columns=[{"name": i, "id": i} for i in df.columns],
                dataframe=df.to_dict("rows"),

                editable=True,
                filtering=True,
                sorting=True,
                sorting_type='multi'
            ),
            style={'height': 300, 'overflowY': 'scroll'}
        ),
        html.Div(id=IDS['container'])
    ])


@app.callback(Output(IDS['container'], 'children'),
              [Input(IDS['table'], 'dataframe')])
def update_graph(rows):
    dff = pd.DataFrame(rows)
    return html.Div([
        dcc.Graph(id=column, figure={
            'data': [{
                'x': dff['country'],
                'y': dff[column],
                'type': 'bar'
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
