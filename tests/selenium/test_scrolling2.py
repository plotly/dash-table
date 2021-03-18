import dash

from utils import (
    basic_modes,
    get_props,
    generate_mock_data,
    generate_markdown_mock_data,
    generate_mixed_markdown_data,
)

from dash_table import DataTable

import pytest


def scroll_by(test, value):
    test.driver.execute_script(
        "document.querySelector('#table .dt-table-container__row-1').scrollBy({}, 0);".format(
            value
        )
    )


def get_app(props, data_fn):
    app = dash.Dash(__name__)

    baseProps = get_props(data_fn=data_fn)

    baseProps.update(props)

    app.layout = DataTable(**baseProps)

    return app


@pytest.mark.parametrize("props", basic_modes)
@pytest.mark.parametrize(
    "data_fn",
    [generate_mock_data, generate_markdown_mock_data, generate_mixed_markdown_data],
)
def test_scrv001_select_an_scroll(test, props, data_fn):
    test.start_server(get_app(props, data_fn))

    target = test.table("table")
    target.cell(2, 2).click()

    scroll_by(test, 2000)
    assert target.cell(2, 2).is_focused()
    test.driver.find_element_by_css_selector(
        "tr:last-of-type td:not(.phantom-cell)"
    ).click()
    assert not target.cell(2, 2).is_focused()
    assert test.get_log_errors() == []
