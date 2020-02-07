# pylint: disable=global-statement
import dash
from dash.dependencies import Input, Output, State
from dash.exceptions import PreventUpdate
import dash_html_components as html
import dash_table
import pandas as pd

url = "https://github.com/plotly/datasets/raw/master/" "26k-consumer-complaints.csv"
rawDf = pd.read_csv(url)
df = rawDf.to_dict('rows')

def get_callbacks(app):
    return


def get_layout():
    return html.Div([
        html.Div(id="container", children="Hello World"),
        dash_table.DataTable(
            id="table_v_default",
            data=df[0:250],
            columns=[
                {"name": i, "id": i, "hideable": i == "Complaint ID"}
                for i in rawDf.columns
            ],
            editable=True,
            sort_action='native',
            include_headers_on_copy_paste=True,

        ),
        dash_table.DataTable(
            id="table_v_default2",
            data=df[0:10],
            columns=[
                {"name": i, "id": i, "deletable": True}
                for i in rawDf.columns
            ],
            editable=True,
            sort_action='native',
            include_headers_on_copy_paste=True,
        ),
    ])