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
rawDf['Complaint ID'] = rawDf['Complaint ID'].map(lambda x: '**' + str(x) + '**')
rawDf['Product'] = rawDf['Product'].map(lambda x: '[' + str(x) + '](plot.ly)')
rawDf['Issue'] = rawDf['Issue'].map(lambda x: '![' + str(x) + '](https://dash.plot.ly/assets/images/logo.png)')
rawDf['State'] = rawDf['State'].map(lambda x: '```python\n"{}"\n```'.format(x))

df = rawDf.to_dict('rows')

def get_app():
    app = dash.Dash(__name__)

    app.layout = DataTable(
        id="table",
        data=df[0:250],
        columns=[
            {"id": "Complaint ID", "name": "Complaint ID", "presentation": "markdown"},
            {"id": "Product", "name": "Product", "presentation": "markdown"},
            {"id": "Sub-product", "name": "Sub-product"},
            {"id": "Issue", "name": "Issue", "presentation": "markdown"},
            {"id": "Sub-issue", "name": "Sub-issue"},
            {"id": "State", "name": "State", "presentation": "markdown"},
            {"id": "ZIP", "name": "ZIP"}
        ],
        editable=True,
        sort_action='native',
        include_headers_on_copy_paste=True
    )

    return app


def test_tmcp001_copy_markdown_to_text(dt):
    dt.start_server(get_app())

    with dt.table('table') as target:
        target.cell.click(0, 'Issue')
        with dt.copy():
            target.cell.click(0, 'Sub-product')

        assert target.cell.get_text(0, 2) == df[0].get('Issue')


def test_tmcp002_copy_markdown_to_markdown(dt):
    dt.start_server(get_app())

    with dt.table('table') as target:
        target.cell.click(0, 'Product')
        with dt.copy():
            target.cell.click(0, 'Complaint ID')

        assert target.cell.get_text(0, 'Complaint ID') == target.cell.get_text(0, 'Product')


def test_tmcp003_copy_text_to_markdown(dt):
    dt.start_server(get_app())

    with dt.table('table') as target:
        target.cell.click(1, 'Sub-product')
        with dt.copy():
            target.cell.click(1, 'Product')

        assert target.cell.get(1, 'Product').find_element_by_css_selector('.dash-cell-value > p').get_attribute('innerHTML') == df[1].get('Sub-product')


def test_tmcp004_copy_null_text_to_markdown(dt):
    dt.start_server(get_app())

    with dt.table('table') as target:
        target.cell.click(0, 'Sub-product')
        with dt.copy():
            target.cell.click(0, 'Product')

        assert target.cell.get(0, 'Product').find_element_by_css_selector('.dash-cell-value > p').get_attribute('innerHTML') == 'null'