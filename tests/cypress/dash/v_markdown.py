# pylint: disable=global-statement
import dash
import dash_html_components as html
import dash_table
import pandas as pd

url = "https://github.com/plotly/datasets/raw/master/" "26k-consumer-complaints.csv"
rawDf = pd.read_csv(url)

rawDf['Complaint ID'] = rawDf['Complaint ID'].map(lambda x: '**' + str(x) + '**')
rawDf['Product'] = rawDf['Product'].map(lambda x: '[' + str(x) + '](plot.ly)')
rawDf['Issue'] = rawDf['Issue'].map(lambda x: '![' + str(x) + '](https://dash.plot.ly/assets/images/logo.png)')
rawDf['State'] = rawDf['State'].map(lambda x: '```python\n"{}"\n```'.format(x))

df = rawDf.to_dict('rows')

def get_callbacks(app):
    return


def get_layout():
    return html.Div([
        html.Div(id="container_v_markdown", children="Hello World"),
        dash_table.DataTable(
            id="table_v_markdown",
            data=df[0:250],
            columns=[
                {"id": "Complaint ID", "name": "Complaint ID", "presentation": "markdown"},
                {"id": "Product", "name": "Product", "presentation": "markdown"},
                {"id": "Sub-product", "name": "Sub-product"},
                {"id": "Issue", "name": "Issue", "presentation": "markdown"},
                {"id": "Sub-issue", "name": "Sub-issue"},
                {"id": "State", "name": "State", "presentation": "markdown"},
                {"id": "ZIP", "name": "ZIP"}
            ],
            editable=True,
            sort_action='native',
            include_headers_on_copy_paste=True
        )
    ])