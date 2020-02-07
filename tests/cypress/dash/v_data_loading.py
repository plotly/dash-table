# pylint: disable=global-statement
import dash
from dash.dependencies import Input, Output, State
from dash.exceptions import PreventUpdate
import dash_html_components as html
import dash_core_components as dcc
import dash_table
import pandas as pd
from time import sleep

url = "https://github.com/plotly/datasets/raw/master/" "26k-consumer-complaints.csv"
rawDf = pd.read_csv(url)
df = rawDf.to_dict('rows')

def get_callbacks(app):
    @app.callback(
        Output("table_v_data_loading", "style_cell_conditional"),
        [Input("change-other-property", "value")]
    )
    def dontTriggerWait(to_change):
        if to_change != 'dont_change_data':
            raise PreventUpdate

        sleep(5)
        return []


    @app.callback(
        Output("table_v_data_loading", "data"),
        [Input("change-data-property", "value")]
    )
    # pylint: disable=unused-argument
    def triggerWait(to_change):
        if to_change != 'change_data':
            raise PreventUpdate

        sleep(5)
        return df[0:250]


def get_layout():
    return html.Div([
        dcc.Input(id='change-data-property'),
        dcc.Input(id='change-other-property'),

        dash_table.DataTable(
            id="table_v_data_loading",
            data=df[0:250],
            columns=[
                {"name": i, "id": i, "hideable": i == "Complaint ID"}
                for i in rawDf.columns
            ],
            editable=True,
            sort_action='native',
            include_headers_on_copy_paste=True,

        )
    ])