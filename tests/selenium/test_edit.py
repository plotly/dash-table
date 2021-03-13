import dash

from utils import get_props, read_write_modes

from dash_table import DataTable

import pytest


def get_app(props=dict()):
    app = dash.Dash(__name__)

    baseProps = get_props()

    baseProps.update(props)

    app.layout = DataTable(**baseProps)

    return app


@pytest.mark.parametrize("props", read_write_modes)
def test_edit001_can_delete_dropdown(test, props):
    test.start_server(get_app(props))

    target = test.table("table")
    cell = target.cell(0, "bbb")

    cell.click()
    assert cell.is_dropdown()

    cell.get().find_element_by_css_selector(".Select-clear").click()
    assert cell.get().find_element_by_css_selector(".Select-placeholder") is not None


@pytest.mark.parametrize("props", read_write_modes)
def test_edit002_can_delete_dropown_and_set(test, props):
    test.start_server(get_app(props))

    target = test.table("table")
    cell = target.cell(0, "bbb")

    cell.click()
    assert cell.is_dropdown()

    cell.get().find_element_by_css_selector(".Select-clear").click()
    assert cell.get().find_element_by_css_selector(".Select-placeholder") is not None

    cell.get().find_element_by_css_selector(".Select-arrow").click()
    cell.get().find_element_by_css_selector(".Select-option").click()

    assert len(cell.get().find_elements_by_css_selector(".Select-placeholder")) == 0


@pytest.mark.parametrize("props", read_write_modes)
def test_edit003_can_edit_dropdown(test, props):
    test.start_server(get_app(props))

    target = test.table("table")
    cell = target.cell(0, "bbb")

    cell.get().find_element_by_css_selector(".Select-arrow").click()
    cell.get().find_element_by_css_selector(".Select-arrow").click()

    for i in range(len(cell.get().find_elements_by_css_selector(".Select-option"))):
        option = cell.get().find_elements_by_css_selector(".Select-option")[i]

        value = option.get_attribute("innerHTML")
        option.click()

        assert (
            cell.get()
            .find_element_by_css_selector(".Select-value-label")
            .get_attribute("innerHTML")
            == value
        )
        cell.get().find_element_by_css_selector(".Select-arrow").click()
