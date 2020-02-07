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
    @app.callback(
        Output("table_v_copy_paste", "data"),
        [Input("table_v_copy_paste", "data_timestamp")],
        [State("table_v_copy_paste", "data"), State("table_v_copy_paste", "data_previous")],
    )
    # pylint: disable=unused-argument
    def updateData(timestamp, current, previous):
        # pylint: enable=unused-argument
        if timestamp is None or current is None or previous is None:
            raise PreventUpdate

        modified = False
        if len(current) == len(previous):
            for (i, datum) in enumerate(current):
                previous_datum = previous[i]
                if datum[0] != previous_datum[0]:
                    modified = True
                    datum[1] = "MODIFIED"

        if not modified:
            raise PreventUpdate

        return current

def get_layout():
    return html.Div([
        html.Div(id="container", children="Hello World"),
        dash_table.DataTable(
            id="table_v_copy_paste",
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
            id="table_v_copy_paste2",
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
