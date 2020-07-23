import dash
from dash_table import DataTable
import pytest


def get_app(cell_selectable, markdown_options):
    md = "[Click me](https://www.google.com)"

    data = [
        dict(a=md, b=md),
        dict(a=md, b=md),
    ]

    app = dash.Dash(__name__)

    props = dict(
        id="table",
        columns=[
            dict(name="a", id="a", type="text", presentation="markdown"),
            dict(name="b", id="b", type="text", presentation="markdown"),
        ],
        data=data,
        cell_selectable=cell_selectable,
    )

    if markdown_options is not None:
        props["markdown_options"] = markdown_options

    app.layout = DataTable(**props)

    return app


@pytest.mark.parametrize(
    "markdown_options,new_tab",
    [
        [None, True],
        [dict(linkTarget="_blank"), True],
        [dict(linkTarget="_self"), False],
    ],
)
@pytest.mark.parametrize("cell_selectable", [True, False])
def test_tmdl001_click_markdown_link(test, markdown_options, new_tab, cell_selectable):
    test.start_server(get_app(cell_selectable, markdown_options))

    target = test.table("table")

    assert len(test.driver.window_handles) == 1
    target.cell(0, "a").get().find_element_by_css_selector("a").click()

    # Make sure the new tab is what's expected
    if new_tab:
        assert target.cell(0, "a").is_selected() == cell_selectable

        assert len(test.driver.window_handles) == 2
        test.driver.switch_to_window(test.driver.window_handles[1])
        assert test.driver.current_url.startswith("https://www.google.com")

        # Make sure the cell is still selected iff cell_selectable, after switching tabs
        test.driver.switch_to_window(test.driver.window_handles[0])
        assert target.cell(0, "a").is_selected() == cell_selectable

    else:
        assert len(test.driver.window_handles) == 1
        assert test.driver.current_url.startswith("https://www.google.com")
