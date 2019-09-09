# pylint: disable=global-statement
import dash
from dash.dependencies import Input, Output, State
import dash_html_components as html
import dash_core_components as dcc
import os
import pandas as pd
import sys
from time import sleep

sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(sys.argv[0]), os.pardir, os.pardir, os.pardir)
    )
)
module_names = ["dash_table"]
modules = [__import__(x) for x in module_names]
dash_table = modules[0]

url = "https://github.com/plotly/datasets/raw/master/" "26k-consumer-complaints.csv"
df = pd.read_csv(url)
df = df.values

app = dash.Dash()
app.css.config.serve_locally = True
app.scripts.config.serve_locally = True

app.layout = html.Div(
    [
        dcc.Input(id='change-property'),

        dash_table.DataTable(
            id="table",
            data=df[0:250],
            columns=[
                {"id": 0, "name": "Complaint ID", "hideable": True},
                {"id": 1, "name": "Product"},
                {"id": 2, "name": "Sub-product"},
                {"id": 3, "name": "Issue"},
                {"id": 4, "name": "Sub-issue"},
                {"id": 5, "name": "State"},
                {"id": 6, "name": "ZIP"},
                {"id": 7, "name": "code"},
                {"id": 8, "name": "Date received"},
                {"id": 9, "name": "Date sent to company"},
                {"id": 10, "name": "Company"},
                {"id": 11, "name": "Company response"},
                {"id": 12, "name": "Timely response?"},
                {"id": 13, "name": "Consumer disputed?"},
            ],
            editable=True,
            sort_action='native',
            include_headers_on_copy_paste=True,

        )
    ]
)


@app.callback(
    Output("table", "style_cell_conditional"),
    [Input("change-property", "value")]
)
def dontTriggerWait(to_change):
    if to_change == 'dont_change_data':
        sleep(5)
    return []


@app.callback(
    Output("table", "data"),
    [Input("change-property", "value")],
    [State("table", "data")]
)
# pylint: disable=unused-argument
def triggerWait(to_change, current):
    if to_change == 'change_data':
        sleep(5)
    return current


if __name__ == "__main__":
    app.run_server(port=8084, debug=False)
