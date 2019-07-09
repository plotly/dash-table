import pandas as pd
import dash
import dash_table

df = pd.read_csv('https://raw.githubusercontent.com/plotly/datasets/master/solar.csv')


def test_tbex001_table_export(dash_duo):
    app = dash.Dash(__name__)
    app.layout = dash_table.DataTable(
        id='table',
        columns=[{"name": i, "id": i} for i in df.columns],
        data=df.to_dict('records'),
        export_format='xlsx'
    )
    dash_duo.start_server(app)
    dash_duo.find_element(".export").click()

    import time
    time.sleep(600)