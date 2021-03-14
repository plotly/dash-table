import dash

from utils import get_props

from dash_table import DataTable
from selenium.webdriver.common.keys import Keys


def get_app(props=dict()):
    app = dash.Dash(__name__)

    baseProps = get_props()

    for c in baseProps.get("columns"):
        c.update(dict(on_change=dict(action="coerce", failure="reject")))

    baseProps.update(props)

    app.layout = DataTable(**baseProps)

    return app


def test_type001_can_edit_number_cell_with_number_string(test):
    test.start_server(get_app())

    target = test.table("table")
    cell = target.cell(0, "ccc")

    cell.click()
    test.send_keys("123" + Keys.ENTER)

    assert cell.get_text() == "123"


def test_type002_cannot_edit_number_cell_with_non_number_string(test):
    test.start_server(get_app())

    target = test.table("table")
    cell = target.cell(0, "ccc")

    initial_value = cell.get_text()
    cell.click()
    test.send_keys("abc" + Keys.ENTER)

    assert cell.get_text() == initial_value


def test_type003_copy_paste_string_into_number_does_nothing(test):
    test.start_server(get_app())

    target = test.table("table")
    source_cell = target.cell(0, "bbb-readonly")
    target_cell = target.cell(0, "ccc")

    initial = target_cell.get_text()
    assert source_cell.get_text() != initial

    source_cell.click()
    test.copy()
    target_cell.click()
    test.paste()

    assert target_cell.get_text() == initial


def test_type004_copy_paste_number_into_number(test):
    test.start_server(get_app())

    target = test.table("table")
    source_cell = target.cell(0, "ddd")
    target_cell = target.cell(0, "ccc")

    source_cell.click()
    test.copy()
    target_cell.click()
    test.paste()

    assert target_cell.get_text() == source_cell.get_text()
