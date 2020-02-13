import dash
from dash.dependencies import Input, Output, State
from dash.exceptions import PreventUpdate

import dash_core_components as dcc
import dash_html_components as html
from dash_table import DataTable

from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

import pandas as pd
import time

url = "https://github.com/plotly/datasets/raw/master/" "26k-consumer-complaints.csv"
rawDf = pd.read_csv(url)
df = rawDf.to_dict('rows')

def get_app():
    app = dash.Dash(__name__)

    app.layout = html.Div(
        [
            DataTable(
                id="table",
                data=df[0:250],
                columns=[{"name": i, "id": i, "hideable": i == "Complaint ID"} for i in rawDf.columns],
                editable=True,
                sort_action='native',
                include_headers_on_copy_paste=True,
            ),
            DataTable(
                id="table2",
                data=df[0:10],
                columns=[{"name": i, "id": i, "deletable": True} for i in rawDf.columns],
                editable=True,
                sort_action='native',
                include_headers_on_copy_paste=True,
            ),
        ]
    )

    @app.callback(
        Output("table", "data"),
        [Input("table", "data_timestamp")],
        [State("table", "data"), State("table", "data_previous")],
    )
    # pylint: disable=unused-argument
    def update_data(timestamp, current, previous):
        # pylint: enable=unused-argument
        if timestamp is None or current is None or previous is None:
            raise PreventUpdate

        modified = False
        if len(current) == len(previous):
            for (i, datum) in enumerate(current):
                previous_datum = previous[i]

                if datum['Unnamed: 0'] != previous_datum['Unnamed: 0']:
                    datum['Complaint ID'] = 'MODIFIED'
                    modified = True

        if modified:
            return current
        else:
            raise PreventUpdate

    return app


def test_tbcp001_copy_paste_callback(dt):
    dt.start_server(get_app())

    with dt.table('table') as target:
        target.cell.click(0, 0)
        with dt.copy():
            target.cell.click(1, 0)

        assert target.cell.get_text(1, 0) == '0'
        assert target.cell.get_text(1, 1) == 'MODIFIED'


def test_tbcp002_sorted_copy_paste_callback(dt):
    dt.start_server(get_app())

    with dt.table('table') as target:
        target.column.sort(0, rawDf.columns[2])

        assert target.cell.get_text(0,0) == '11'

        target.cell.click(0,0)
        with dt.copy():
            target.cell.click(1,0)

        assert target.cell.get_text(1,0) == '11'
        assert target.cell.get_text(1,1) == 'MODIFIED'

        target.cell.click(1,1)
        with dt.copy():
            target.cell.click(2,1)

        assert target.cell.get_text(1,0) == '11'
        assert target.cell.get_text(2,1) == 'MODIFIED'


def test_tbcp003_copy_multiple_rows(dt):
    dt.start_server(get_app())

    with dt.table('table') as target:
        with dt.hold(Keys.SHIFT):
            target.cell.click(0, 0)
            target.cell.click(2, 0)

        with dt.copy():
            target.cell.click(3, 0)

        for i in range(3):
            assert target.cell.get_text(i + 3, 0) == target.cell.get_text(i, 0)
            assert target.cell.get_text(i + 3, 1) == 'MODIFIED'


def test_tbcp004_copy_9_and_10(dt):
    dt.start_server(get_app())

    with dt.table('table') as source, dt.table('table2') as target:
        source.cell.click(9, 0)
        with dt.hold(Keys.SHIFT):
            ActionChains(dt.driver).send_keys(Keys.DOWN).perform()

        with dt.copy():
            target.cell.click(0, 0)

        for row in range(2):
            for col in range(1):
                assert target.cell.get_text(row, col) == source.cell.get_text(row + 9, col)


def test_tbcp005_copy_multiple_rows_and_columns(dt):
    dt.start_server(get_app())

    with dt.table('table') as table:
        table.cell.click(0, 1)
        with dt.hold(Keys.SHIFT):
            table.cell.click(2, 2)

        with dt.copy():
            table.cell.click(3, 1)

        for row in range(3):
            for col in range(1, 3):
                assert table.cell.get_text(row + 3, col) == table.cell.get_text(row, col)


def test_tbcp006_copy_paste_between_tables(dt):
    dt.start_server(get_app())

    with dt.table('table') as source, dt.table('table2') as target:
        source.cell.click(10, 0)
        with dt.hold(Keys.SHIFT):
            source.cell.click(13, 3)

        with dt.copy():
            target.cell.click(0, 0)

        for row in range(4):
            for col in range(4):
                assert source.cell.get_text(row + 10, col) == target.cell.get_text(row, col)


def test_tbcp007_copy_paste_with_hidden_column(dt):
    dt.start_server(get_app())

    with dt.table('table') as target:
        target.column.hide(0, 'Complaint ID')
        target.cell.click(0, 0)
        with dt.hold(Keys.SHIFT):
            target.cell.click(2, 2)

        with dt.copy():
            target.cell.click(3, 1)

        for row in range(3):
            for col in range(3):
                assert target.cell.get_text(row, col) == target.cell.get_text(row + 3, col + 1)


def test_tbcp008_copy_paste_between_tables_with_hidden_columns(dt):
    dt.start_server(get_app())

    with dt.table('table') as target:
        target.column.hide(0, 'Complaint ID')
        target.cell.click(10, 0)
        with dt.hold(Keys.SHIFT):
            target.cell.click(13, 2)

        with dt.copy():
            target.cell.click(0, 0)

        for row in range(4):
            for col in range(3):
                assert target.cell.get_text(row + 10, col) == target.cell.get_text(row, col)
