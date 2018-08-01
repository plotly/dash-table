import dash
from dash.dependencies import Input, Output, State
import dash_table
import dash_html_components as html
import json

app = dash.Dash()

app.css.config.serve_locally = True
app.scripts.config.serve_locally = True

dataframe=[
    {'ind': 0, 'temp': 80, 'climate': 'Tropical'},
    {'ind': 1, 'temp': 30, 'climate': 'Snowy'},
    {'ind': 2, 'temp': 20, 'climate': 'Rain Forests'},
]

dataframe2=[
    {'ind': 0, 'temp': 80, 'climate': 'Tropical'},
    {'ind': 1, 'temp': 30, 'climate': 'Snowy'},
    {'ind': 2, 'temp': 20, 'climate': 'Rain Forests'},
    {'ind': 2, 'temp': 20, 'climate': 'Rain Forests'},
    {'ind': 2, 'temp': 20, 'climate': 'Rain Forests'},
    {'ind': 2, 'temp': 20, 'climate': 'Rain Forests'},
]

app.layout = html.Div([
    dash_table.Table(
        id='table',
        dataframe=dataframe,
        virtualization={
            'type': 'be',
            'subType': 'page',
            'options': {
                'currentPage': 0,
                'pageSize': 100
            }
        },
        columns=[
            {
                'id': 'ind',
                'name': ''
            },
            {
                'id': 'temp',
                'name': 'Temperature'
            },
            {
                'id': 'climate',
                'name': 'Climate'
            },
        ],
        editable=True
    ),
    html.Div(id='container')
])

@app.callback(
    Output('table', 'dataframe'),
    [Input('table', 'virtualization')]
)
def updateDataframe(virtualization):
    return dataframe2

@app.callback(
    Output('container', 'children'),
    [Input('table', 'virtual_dataframe'), Input('table', 'virtual_dataframe_indices')]
)
def pouet(virtual_dataframe, virtual_dataframe_indices):
    print 'virtual_dataframe size: ' + str(len(virtual_dataframe))
    print 'virtual_indices: ' + str(virtual_dataframe_indices)
    return html.Pre('<div>Hello</div>')

if __name__ == '__main__':
    app.run_server(debug=True)
