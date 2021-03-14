import dash

from utils import get_props

from dash_table import DataTable
from selenium.webdriver.common.keys import Keys


def get_app(props=dict()):
    app = dash.Dash(__name__)

    baseProps = get_props(rows=200)

    for c in baseProps.get("columns"):
        if c["id"] == "bbb":
            c["id"] = "b+bb"
        elif c["id"] == "ccc":
            c["id"] = "c cc"
        elif c["id"] == "ddd":
            c["id"] = "d:dd"
        elif c["id"] == "eee":
            c["id"] = "e-ee"
        elif c["id"] == "fff":
            c["id"] = "f_ff"
        elif c["id"] == "ggg":
            c["id"] = "g.gg"

    for i in range(len(baseProps["data"])):
        d = baseProps["data"][i]
        d["b+bb"] = d["bbb"]
        d["c cc"] = d["ccc"]
        d["d:dd"] = d["ddd"]
        d["e-ee"] = d["eee"]
        d["f_ff"] = d["fff"]
        d["g.gg"] = d["ggg"]

    baseProps.update(dict(filter_action="native"))
    baseProps.update(props)

    app.layout = DataTable(**baseProps)

    return app


def test_spfi001_can_filter_columns_with_special_characters(test):
    test.start_server(get_app())

    target = test.table("table")

    target.column("b+bb").filter_click()
    test.send_keys("Wet" + Keys.ENTER)

    target.column("c cc").filter_click()
    test.send_keys("gt 90" + Keys.ENTER)

    target.column("d:dd").filter_click()
    test.send_keys("lt 12500" + Keys.ENTER)

    target.column("e-ee").filter_click()
    test.send_keys("is prime" + Keys.ENTER)

    target.column("f_ff").filter_click()
    test.send_keys("le 106" + Keys.ENTER)

    target.column("g.gg").filter_click()
    test.send_keys("gt 1000" + Keys.ENTER)

    target.column("b+bb").filter_click()

    assert target.cell(0, "rows").get_text() == "101"
    assert not target.cell(1, "rows").exists()

    assert target.column("b+bb").filter_value() == "Wet"
    assert target.column("c cc").filter_value() == "gt 90"
    assert target.column("d:dd").filter_value() == "lt 12500"
    assert target.column("e-ee").filter_value() == "is prime"
    assert target.column("f_ff").filter_value() == "le 106"
    assert target.column("g.gg").filter_value() == "gt 1000"

    assert test.get_log_errors() == []
