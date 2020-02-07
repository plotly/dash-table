# pylint: disable=global-statement
import json
import pandas as pd

import dash
from dash.dependencies import Input, Output
import dash_html_components as html
import dash_table


url = ("https://github.com/plotly/datasets/raw/master/"
       "26k-consumer-complaints.csv")
rawDf = pd.read_csv(url, nrows=1000)
df = rawDf.to_dict('rows')

props = [
    'active_cell', 'start_cell', 'end_cell', 'selected_cells',
    'selected_rows', 'selected_row_ids',
    'derived_viewport_selected_rows', 'derived_viewport_selected_row_ids',
    'derived_virtual_selected_rows', 'derived_virtual_selected_row_ids',
    'derived_viewport_indices', 'derived_viewport_row_ids',
    'derived_virtual_indices', 'derived_virtual_row_ids'
]

def get_callbacks(app):
    @app.callback(
        Output("props_container_v_fe_page", "children"),
        [Input("_v_fe_page", prop) for prop in props]
    )
    def show_props(*args):
        return html.Table([
            html.Tr([
                html.Td(prop),
                html.Td(json.dumps(val), id=prop + '_container')
            ])
            for prop, val in zip(props, args)
        ])

def get_layout():
    return html.Div([
        dash_table.DataTable(
            id="table_v_fe_page",
            data=df,
            page_action="native",
            page_current=0,
            page_size=250,
            columns=[
                {"name": i, "id": i}
                for i in rawDf.columns
            ],
            fixed_columns={ 'headers': True },
            fixed_rows={ 'headers': True },
            row_selectable='single',
            row_deletable=True,
            sort_action="native",
            filter_action='native',
            editable=True,
        ),
        html.Div(id="props_container_v_fe_page")
    ])