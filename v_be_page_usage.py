import dash
from dash.dependencies import Input, Output, State

import dash_html_components as html
import dash_table

import pandas as pd
df = pd.read_csv('https://github.com/plotly/datasets/raw/master/26k-consumer-complaints.csv')
df = df.values

app = dash.Dash()
app.css.config.serve_locally = True
app.scripts.config.serve_locally = True

app.layout = html.Div([
    html.Div(
        id='container',
        children='Hello World'
    ),
    dash_table.Table(
        id='table',
        dataframe=[],
        pagination_mode='be',
        pagination_settings={
            'displayed_pages': 1,
            'current_page': 0,
            'page_size': 5
        },
        navigation='page',
        columns=[
            {'id': 0, 'name': 'Complaint ID'},
            {'id': 1, 'name': 'Product'},
            {'id': 2, 'name': 'Sub-product'},
            {'id': 3, 'name': 'Issue'},
            {'id': 4, 'name': 'Sub-issue'},
            {'id': 5, 'name': 'State'},
            {'id': 6, 'name': 'ZIP'},
            {'id': 7, 'name': 'code'},
            {'id': 8, 'name': 'Date received'},
            {'id': 9, 'name': 'Date sent to company'},
            {'id': 10, 'name': 'Company'},
            {'id': 11, 'name': 'Company response'},
            {'id': 12, 'name': 'Timely response?'},
            {'id': 13, 'name': 'Consumer disputed?'}
        ],
        editable=True
    )
])

@app.callback(
    Output('table', 'dataframe'),
    [Input('table', 'pagination_settings')]
)
def updateDataframe(pagination_settings):
    print(pagination_settings)

    current_page = pagination_settings['current_page']
    displayed_pages = pagination_settings['displayed_pages']
    page_size = pagination_settings['page_size']

    start_index = current_page * page_size
    end_index = start_index + displayed_pages * page_size
    print(str(start_index) + ',' + str(end_index))

    return df[start_index:end_index]

hidden = False
@app.callback(
    Output('container', 'hidden'),
    [Input('table', 'derived_viewport_dataframe'), Input('table', 'derived_viewport_indices')]
)
def updateViewportDataframe(derived_viewport_dataframe, derived_viewport_indices):
    print(derived_viewport_dataframe)

    global hidden

    hidden = not hidden
    return hidden

if __name__ == '__main__':
    app.run_server(debug=True)
