import dash

from utils import get_props, generate_markdown_mock_data

from dash_table import DataTable


def get_app(props=dict(), data_fn=generate_markdown_mock_data):
    app = dash.Dash(__name__)

    baseProps = get_props(data_fn=data_fn)

    baseProps.update(dict(sort_action="native"))
    baseProps.update(props)

    app.layout = DataTable(**baseProps)

    return app


def test_mark001_header(test):
    test.start_server(get_app())

    target = test.table("table")

    target.column(0).sort(1)
    assert (
        target.cell(0, "markdown-headers")
        .get()
        .find_element_by_css_selector(".dash-cell-value > p")
        .get_attribute("innerHTML")
        == "row 0"
    )

    target.column(0).sort(1)
    assert (
        target.cell(0, "markdown-headers")
        .get()
        .find_element_by_css_selector(".dash-cell-value > h5")
        .get_attribute("innerHTML")
        == "row 95"
    )


def test_mark002_emphasized_text(test):
    test.start_server(get_app())

    target = test.table("table")

    target.column(1).sort(1)
    assert (
        target.cell(0, "markdown-italics")
        .get()
        .find_element_by_css_selector(".dash-cell-value > p > em")
        .get_attribute("innerHTML")
        == "1"
    )

    target.column(1).sort(1)
    assert (
        target.cell(0, "markdown-italics")
        .get()
        .find_element_by_css_selector(".dash-cell-value > p > em")
        .get_attribute("innerHTML")
        == "98"
    )


def test_mark003_link(test):
    test.start_server(get_app())

    target = test.table("table")

    target.column(2).sort(1)
    assert (
        target.cell(0, "markdown-links")
        .get()
        .find_element_by_css_selector(".dash-cell-value > p > a")
        .get_attribute("innerHTML")
        == "Learn about 0"
    )

    target.column(2).sort(1)
    assert (
        target.cell(0, "markdown-links")
        .get()
        .find_element_by_css_selector(".dash-cell-value > p > a")
        .get_attribute("innerHTML")
        == "Learn about 9"
    )


def test_mark004_image(test):
    test.start_server(get_app())

    target = test.table("table")

    target.column(8).sort(1)
    assert (
        target.cell(0, "markdown-images")
        .get()
        .find_element_by_css_selector(".dash-cell-value > p > img")
        .get_attribute("alt")
        == "image 0 alt text"
    )

    target.column(8).sort(1)
    assert (
        target.cell(0, "markdown-images")
        .get()
        .find_element_by_css_selector(".dash-cell-value > p > img")
        .get_attribute("alt")
        == "image 99 alt text"
    )


def test_mark005_table(test):
    test.start_server(get_app())

    target = test.table("table")

    target.column(4).sort(1)
    assert (
        target.cell(0, "markdown-tables")
        .get()
        .find_element_by_css_selector(".dash-cell-value > table > tbody > tr > td")
        .get_attribute("innerHTML")
        == "0"
    )

    target.column(4).sort(1)
    assert (
        target.cell(0, "markdown-tables")
        .get()
        .find_element_by_css_selector(".dash-cell-value > table > tbody > tr > td")
        .get_attribute("innerHTML")
        == "99"
    )
