import os
import pandas as pd
import dash_table
import dash
import dash.testing.wait as wait


def test_tbex002_export_button(dash_duo):
    df = pd.read_csv(
        "https://raw.githubusercontent.com/plotly/datasets/master/solar.csv"
    )
    app = dash.Dash(__name__)
    app.layout = dash_table.DataTable(
        id="table",
        columns=[{"name": i, "id": i} for i in df.columns],
        data=df.to_dict("records"),
        export_format="csv",
        export_className="veryuniqueexportclassname",
        export_text="veryuniqueexporttext",
    )
    dash_duo.start_server(app)
    export_button = dash_duo.wait_for_element(".veryuniqueexportclassname", timeout=1)
    assert export_button.text == "veryuniqueexporttext"

    export_button.click()

    download = os.path.sep.join((dash_duo.download_path, "Data.csv"))
    wait.until(lambda: os.path.exists(download), timeout=2)

    df_bis = pd.read_csv(download)
    assert df_bis.equals(df)
