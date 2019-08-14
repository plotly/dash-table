import pandas as pd
import dash_table
import dash_html_components as html
import dash_core_components as dcc
import dash
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains



def test_copy_paste_headers(dash_duo):
    df = pd.read_csv(
        "https://raw.githubusercontent.com/plotly/datasets/master/solar.csv"
    )
    app = dash.Dash(__name__)
    app.layout = html.Div([
        dash_table.DataTable(
            id="table",
            columns=[{"name": i, "id": i} for i in df.columns],
            data=df.to_dict("records"),
            editable=True,
            sort_action='native',
            include_headers_on_copy_paste=True,
        ),
        dcc.Input(
            id="inputBox",
            placeholder='Enter a value...',
            type='text',
            value=''
        ),
    ])
    dash_duo.start_server(app)

    start = dash_duo.find_element('table > tbody > tr:nth-child(4) > td.column-1')
    end = dash_duo.find_element('table > tbody > tr:nth-child(6) > td.column-2')
    inputElement = dash_duo.find_element('#inputBox')

    actionChains = ActionChains(dash_duo.driver)
    #select the cells we want to copy
    actionChains.move_to_element(start).click().key_down(Keys.SHIFT).click(end).send_keys(Keys.CONTROL, 'c').perform()

    #paste in the input
    actionChains.move_to_element(inputElement).send_keys(Keys.CONTROL, 'p').perform()
