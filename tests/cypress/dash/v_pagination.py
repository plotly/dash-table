import dash
from dash.dependencies import Input, Output
from dash.exceptions import PreventUpdate
import dash_table
import dash_core_components as dcc
import dash_html_components as html
import pandas as pd


rawDf = pd.read_csv('https://raw.githubusercontent.com/plotly/datasets/master/gapminder2007.csv')
rawDf[' index'] = range(1, len(rawDf) + 1)
df = rawDf.to_dict('rows')

def get_callbacks(app):
    @app.callback(
        [Output('table_v_pagination', 'data'),
        Output('table_v_pagination', 'page_action'),
        Output('table_v_pagination', 'page_count')],
        [Input('table_v_pagination', 'page_current'),
        Input('table_v_pagination', 'page_size'),
        Input('url', 'search')]
    )
    def update_table(page_current, page_size, pagination_mode):

        if not pagination_mode:
            raise PreventUpdate

        mode = {
            param.split('=')[0]: param.split('=')[1]
            for param in pagination_mode.strip('?').split('&')
        }

        data = None

        if mode['page_action'] == 'native':
            data = df.to_dict('records')
        else:
            data = df.iloc[
                page_current * page_size: (page_current + 1) * page_size
            ].to_dict('records')

        return data, mode.get('page_action', 'native'), \
            int(mode.get('page_count')) if mode.get('page_count') else None


PAGE_SIZE = 5

def get_layout():
    return html.Div([
        dash_table.DataTable(
            id='table_v_pagination',
            columns=[
                {'name': i, 'id': i} for i in sorted(rawDf.columns)
            ],
            page_current=0,
            page_size=PAGE_SIZE,
            page_count=None
        )
    ])