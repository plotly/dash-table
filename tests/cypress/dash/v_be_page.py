# pylint: disable=global-statement
import dash
from dash.dependencies import Input, Output
import dash_html_components as html
import dash_table
import pandas as pd

url = "https://github.com/plotly/datasets/raw/master/" "26k-consumer-complaints.csv"
rawDf = pd.read_csv(url)
df = rawDf.to_dict('rows')

def get_callbacks(app):
    @app.callback(Output("table_v_be_page", "data"), [
        Input("table_v_be_page", "page_current"),
        Input("table_v_be_page", "page_size"),
        Input("table_v_be_page", "sort_by")
    ])
    def updateData(current_page, page_size, sort_by):
        start_index = current_page * page_size
        end_index = start_index + page_size
        print(str(start_index) + "," + str(end_index))
        print(sort_by)

        if (sort_by is None or len(sort_by) == 0):
            return df[start_index:end_index]

        sorted_df = df.sort_index(
            axis=sort_by[0]['column_id'],
            ascending=(sort_by[0]['direction'] == 'asc')
        ).values

        return sorted_df[start_index:end_index]


    @app.callback(
        Output("container_v_be_page", "children"),
        [Input("table_v_be_page", "data"), Input("table_v_be_page", "data_previous")],
    )
    def findModifiedValue(data, previous):
        modification = "None"

        if data is None or previous is None:
            return modification

        for (y, row) in enumerate(data):
            row_prev = previous[y]

            for (x, col) in enumerate(row):
                if col != row_prev[x]:
                    modification = "[{}][{}] = {} -> {}".format(y, x, row_prev[x], col)

        return modification


def get_layout():
    return html.Div([
        html.Div(id="container_v_be_page", children="Hello World"),
        dash_table.DataTable(
            id="table_v_be_page",
            page_action="custom",
            page_current=0,
            page_size=250,
            columns=[
                {"name": i, "id": i}
                for i in rawDf.columns
            ],
            data=[],
            fixed_columns={ 'headers': True, 'data': -1 },
            fixed_rows={ 'headers': True, 'data': -1 },
            row_selectable='single',
            row_deletable=True,
            sort_action="custom",
            filter_action='none',
            editable=True,
        ),
    ])