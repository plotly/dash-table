import dash

from utils import basic_modes, get_base_props

from dash_table import DataTable

from selenium.webdriver.common.keys import Keys

import pytest


def get_app(props=dict()):
    app = dash.Dash(__name__)

    baseProps = get_base_props()

    baseProps.update(props)

    app.layout = DataTable(**baseProps)

    return app


@pytest.mark.parametrize("props", basic_modes)
def test_knav001_navigate_9_10_cells(test, props):
    test.start_server(get_app(props))

    target = test.table("table")

    target.cell(9, 1).click()
    with test.hold(Keys.SHIFT):
        target.cell(10, 2).click()

    for row in range(9, 11):
        for col in range(1, 3):
            assert target.cell(row, col).is_selected()

    assert target.cell(9, 1).is_focused()
    test.send_keys(Keys.ENTER)
    assert target.cell(10, 1).is_focused()
    test.send_keys(Keys.ENTER)
    assert target.cell(9, 2).is_focused()
    test.send_keys(Keys.ENTER)
    assert target.cell(10, 2).is_focused()
    test.send_keys(Keys.ENTER)
    assert target.cell(9, 1).is_focused()
    assert test.get_log_errors() == []


@pytest.mark.parametrize("props", basic_modes)
@pytest.mark.parametrize(
    "key,d_column,d_row",
    [
        [Keys.ARROW_DOWN, 0, 1],
        [Keys.ARROW_UP, 0, -1],
        [Keys.ARROW_LEFT, -1, 0],
        [Keys.ARROW_RIGHT, 1, 0],
    ],
)
def test_knav002_can_move(test, props, key, d_column, d_row):
    test.start_server(get_app(props))

    target = test.table("table")

    target.cell(3, 1).click()
    test.send_keys(key)

    assert not target.cell(3, 1).is_focused()
    assert target.cell(3 + d_row, 1 + d_column).is_focused()


# Issue: https://github.com/plotly/dash-table/issues/49
@pytest.mark.parametrize("props", basic_modes)
def test_knav003_can_move_after_copy(test, props):
    test.start_server(get_app(props))

    target = test.table("table")

    target.cell(3, 1).click()
    test.copy()
    test.send_keys(Keys.ARROW_DOWN)
    assert not target.cell(3, 1).is_focused()
    assert target.cell(4, 1).is_focused()


def test_knav004_can_move_out_of_viewport(test):
    test.start_server(get_app(dict(virtualization=True)))

    target = test.table("table")

    target.cell(3, 1).click()
    for i in range(25):
        test.send_keys(Keys.ARROW_DOWN)

    test.send_keys(Keys.ARROW_RIGHT)

    assert target.cell(28, 2).is_focused()
