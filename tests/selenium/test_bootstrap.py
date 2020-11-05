import dash
import pytest

import dash_bootstrap_components as dbc
import dash_html_components as html
from dash_table import DataTable

import pandas as pd

url = "https://github.com/plotly/datasets/raw/master/" "26k-consumer-complaints.csv"
rawDf = pd.read_csv(url)
df = rawDf.to_dict("rows")


def get_app(id, fixed_rows, fixed_columns, ops, iframe_url):
    stylesheets = [dbc.themes.BOOTSTRAP] if iframe_url is None else []

    app = dash.Dash(__name__, external_stylesheets=stylesheets)

    props = dict(
        id=id,
        data=df[0:250],
        columns=[
            {"name": i, "id": i, "hideable": i == "Complaint ID"} for i in rawDf.columns
        ],
        style_table=dict(height="500px", maxHeight="500px", overflow="auto"),
        editable=True,
        sort_action="native",
        include_headers_on_copy_paste=True,
        **fixed_rows,
        **fixed_columns,
        **ops
    )

    app.layout = html.Div(
        [
            DataTable(**props),
            html.Iframe(
                id="iframe", src=iframe_url, style=dict(height="600px", width="100%")
            )
            if iframe_url is not None
            else None,
        ]
    )

    return app


@pytest.mark.parametrize(
    "fixed_rows,fixed_rows_description",
    [(dict(), "unfixed_rows"), (dict(fixed_rows=dict(headers=True)), "fixed_rows")],
)
@pytest.mark.parametrize(
    "fixed_columns,fixed_columns_description",
    [
        (dict(), "unfixed_columns"),
        (dict(fixed_columns=dict(headers=True)), "fixed_columns"),
    ],
)
@pytest.mark.parametrize(
    "ops,ops_description",
    [
        (dict(), "ops: none"),
        (dict(row_selectable="single", row_deletable=True), "ops: sinle+deletable"),
        (dict(row_selectable="multi", row_deletable=True), "ops: multi+deletable"),
    ],
)
def test_tbbs001_display(
    dash_thread_server,
    dash_duo,
    test,
    fixed_rows,
    fixed_columns,
    ops,
    fixed_rows_description,
    fixed_columns_description,
    ops_description,
):
    iframe_app = get_app("framed_table", fixed_rows, fixed_columns, ops, None)
    dash_thread_server(iframe_app, port=8060)

    host_app = get_app(
        "host_table", fixed_rows, fixed_columns, ops, dash_thread_server.url
    )
    test.start_server(host_app, port=8050)

    test.table("host_table").is_ready()

    iframe = test.driver.find_element_by_css_selector("#iframe")
    test.driver.switch_to.frame(iframe)

    test.table("framed_table").is_ready()

    dash_duo.percy_snapshot(
        "DataTable Bootstrap side-effects with rows={} columns={} ops={}".format(
            fixed_rows_description, fixed_columns_description, ops_description
        )
    )
