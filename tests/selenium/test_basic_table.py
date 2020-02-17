import dash
from dash.dependencies import Input, Output, State
from dash.exceptions import PreventUpdate

import dash_core_components as dcc
import dash_html_components as html
from dash_table import DataTable

from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

import pandas as pd

url = "https://github.com/plotly/datasets/raw/master/" "26k-consumer-complaints.csv"
rawDf = pd.read_csv(url)
df = rawDf.to_dict('rows')

def get_app():
    app = dash.Dash(__name__)

    app.layout = DataTable(
        id="table",
        columns=[{"name": i, "id": i} for i in rawDf.columns],
        data=df,
        editable=True,
        filter_action="native",
        fixed_columns={ 'headers': True, 'data': -1 },
        fixed_rows={ 'headers': True, 'data': -1 },
        page_action="native",
        page_current=0,
        page_size=250,
        row_deletable=True,
        row_selectable=True,
        sort_action="native",
    )

    return app


def test_tbst001_get_cell(dt):
    dt.start_server(get_app())

    with dt.table('table') as target:
        assert target.cell.get_text(0, rawDf.columns[0]) == '0'
        target.click_next_page()
        assert target.cell.get_text(0, rawDf.columns[0]) == '250'
