import dash

from utils import get_props

from dash_table import DataTable


def get_app(props=dict()):
    app = dash.Dash(__name__)

    baseProps = get_props()

    for c in baseProps.get("columns"):
        c["clearable"] = True
        c["deletable"] = True
        c["hideable"] = "last"
        c["selectable"] = True

    baseProps["column_selectable"] = "multi"
    baseProps["filter_action"] = "native"
    baseProps["merge_duplicate_headers"] = True

    baseProps.update(props)

    app.layout = DataTable(**baseProps)

    return app


def test_colm001_can_delete(test):
    test.start_server(get_app())

    target = test.table("table")

    assert target.column(0).get_text(2) == "rows"
    assert target.column(1).get_text(0) == "City"
    assert target.column(1).get_text(1) == "Canada"
    assert target.column(1).get_text(2) == "Toronto"

    target.column("rows").delete(0)

    assert target.column(0).get_text(0) == "City"
    assert target.column(0).get_text(1) == "Canada"
    assert target.column(0).get_text(2) == "Toronto"

    # Remove Canada
    target.column("ccc").delete(1)

    assert target.column(0).get_text(0) == "City"
    assert target.column(0).get_text(1) == "America"
    assert target.column(0).get_text(2) == "New York City"

    # Remove Boston
    target.column("fff").delete(2)

    assert target.column(0).get_text(0) == "City"
    assert target.column(0).get_text(1) == "America"
    assert target.column(0).get_text(2) == "New York City"
    assert target.column(1).get_text(1) == "France"
    assert target.column(1).get_text(2) == "Paris"

    assert test.get_log_errors() == []


def test_colm002_keep_hidden_on_delete(test):
    test.start_server(get_app())

    target = test.table("table")
    target.column(4).hide(2)  # Boston
    target.column(2).hide(2)  # Montreal
    target.column("ccc").delete(0)  # City

    toggle = target.toggle_columns()

    toggle.open()
    assert toggle.is_opened()

    hidden = toggle.get_hidden()
    assert len(hidden) == 2

    for el in hidden:
        el.click()

    assert len(toggle.get_hidden()) == 0
