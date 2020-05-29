import dash
from dash_table import DataTable
import time
import pandas as pd

url = "https://github.com/plotly/datasets/raw/master/" "26k-consumer-complaints.csv"
rawDf = pd.read_csv(url)
rawDf["Complaint ID"] = rawDf["Complaint ID"].map(lambda x: "**" + str(x) + "**")
rawDf["Product"] = rawDf["Product"].map(lambda x: "[" + str(x) + "](plot.ly)")
rawDf["Issue"] = rawDf["Issue"].map(
    lambda x: "![" + str(x) + "](https://dash.plot.ly/assets/images/logo.png)"
)
rawDf["State"] = rawDf["State"].map(lambda x: '```python\n"{}"\n```'.format(x))

df = rawDf.to_dict("rows")


def get_app():
    md = "[Click me](https://www.google.com)"

    data = [
        dict(a=md, b=md),
        dict(a=md, b=md),
    ]

    app = dash.Dash(__name__)

    app.layout = DataTable(
        id="table",
        columns=[
            dict(name="a", id="a", type="text", presentation="markdown"),
            dict(name="b", id="b", type="text", presentation="markdown"),
        ],
        data=data,
    )

    return app


def test_tmdl001_copy_markdown_to_text(test):
    test.start_server(get_app())

    target = test.table("table")

    assert len(test.driver.window_handles) == 1
    target.cell(0, "a").get().find_element_by_css_selector("a").click()
    assert len(test.driver.window_handles) == 2
