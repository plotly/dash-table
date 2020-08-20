import dash
import pytest
from dash.dependencies import Input, Output, State
from dash.exceptions import PreventUpdate

import dash_html_components as html
from dash_table import DataTable

from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

import pandas as pd

url = "https://github.com/plotly/datasets/raw/master/" "26k-consumer-complaints.csv"
rawDf = pd.read_csv(url)
df = rawDf.to_dict("rows")


def get_app():
    app = dash.Dash(__name__)

    app.layout = html.Div(
        [
            DataTable(
                id="table",
                data=df[0:250],
                columns=[
                    {"name": i, "id": i, "hideable": i == "Complaint ID"}
                    for i in rawDf.columns
                ],
                editable=True,
                sort_action="native",
                include_headers_on_copy_paste=True,
            ),
            DataTable(
                id="table2",
                data=df[0:10],
                columns=[
                    {"name": i, "id": i, "deletable": True} for i in rawDf.columns
                ],
                editable=True,
                sort_action="native",
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

                if datum["Unnamed: 0"] != previous_datum["Unnamed: 0"]:
                    datum["Complaint ID"] = "MODIFIED"
                    modified = True

        if modified:
            return current
        else:
            raise PreventUpdate

    return app


def test_tbcp001_copy_paste_callback(test):
    test.start_server(get_app())

    target = test.table("table")
    target.cell(0, 0).click()

    test.copy()
    target.cell(1, 0).click()
    test.paste()

    assert target.cell(1, 0).get_text() == "0"
    assert target.cell(1, 1).get_text() == "MODIFIED"


def test_tbcp002_sorted_copy_paste_callback(test):
    test.start_server(get_app())

    target = test.table("table")
    target.column(rawDf.columns[2]).sort()

    assert target.cell(0, 0).get_text() == "11"

    target.cell(0, 0).click()

    test.copy()
    target.cell(1, 0).click()
    test.paste()

    assert target.cell(1, 0).get_text() == "11"
    assert target.cell(1, 1).get_text() == "MODIFIED"

    target.cell(1, 1).click()

    test.copy()
    target.cell(2, 1).click()
    test.paste()

    assert target.cell(1, 0).get_text() == "11"
    assert target.cell(2, 1).get_text() == "MODIFIED"


@pytest.mark.parametrize("mouse_navigation", [True, False])
def test_tbcp003_copy_multiple_rows(test, mouse_navigation):
    test.start_server(get_app())

    target = test.table("table")

    if mouse_navigation:
        with test.hold(Keys.SHIFT):
            target.cell(0, 0).click()
            target.cell(2, 0).click()
    else:
        target.cell(0, 0).click()
        with test.hold(Keys.SHIFT):
            test.send_keys(Keys.ARROW_DOWN + Keys.ARROW_DOWN)

    test.copy()
    target.cell(3, 0).click()
    test.paste()

    for i in range(3):
        assert target.cell(i + 3, 0).get_text() == target.cell(i, 0).get_text()
        assert target.cell(i + 3, 1).get_text() == "MODIFIED"


def test_tbcp004_copy_9_and_10(test):
    test.start_server(get_app())

    source = test.table("table")
    target = test.table("table2")

    source.cell(9, 0).click()
    with test.hold(Keys.SHIFT):
        ActionChains(test.driver).send_keys(Keys.DOWN).perform()

    test.copy()
    target.cell(0, 0).click()
    test.paste()

    for row in range(2):
        for col in range(1):
            assert (
                target.cell(row, col).get_text() == source.cell(row + 9, col).get_text()
            )


def test_tbcp005_copy_multiple_rows_and_columns(test):
    test.start_server(get_app())

    target = test.table("table")

    target.cell(0, 1).click()
    with test.hold(Keys.SHIFT):
        target.cell(2, 2).click()

    test.copy()
    target.cell(3, 1).click()
    test.paste()

    for row in range(3):
        for col in range(1, 3):
            assert (
                target.cell(row + 3, col).get_text() == target.cell(row, col).get_text()
            )


def test_tbcp006_copy_paste_between_tables(test):
    test.start_server(get_app())

    source = test.table("table")
    target = test.table("table2")

    source.cell(10, 0).click()
    with test.hold(Keys.SHIFT):
        source.cell(13, 3).click()

    test.copy()
    target.cell(0, 0).click()
    test.paste()

    for row in range(4):
        for col in range(4):
            assert (
                source.cell(row + 10, col).get_text()
                == target.cell(row, col).get_text()
            )


def test_tbcp007_copy_paste_with_hidden_column(test):
    test.start_server(get_app())

    target = test.table("table")

    target.column("Complaint ID").hide()
    target.cell(0, 0).click()
    with test.hold(Keys.SHIFT):
        target.cell(2, 2).click()

    test.copy()
    target.cell(3, 1).click()
    test.paste()

    for row in range(3):
        for col in range(3):
            assert (
                target.cell(row, col).get_text()
                == target.cell(row + 3, col + 1).get_text()
            )


def test_tbcp008_copy_paste_between_tables_with_hidden_columns(test):
    test.start_server(get_app())

    target = test.table("table")

    target.column("Complaint ID").hide()
    target.cell(10, 0).click()
    with test.hold(Keys.SHIFT):
        target.cell(13, 2).click()

    test.copy()
    target.cell(0, 0).click()
    test.paste()

    for row in range(4):
        for col in range(3):
            assert (
                target.cell(row + 10, col).get_text()
                == target.cell(row, col).get_text()
            )
