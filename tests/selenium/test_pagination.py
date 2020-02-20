import dash
from dash.dependencies import Input, Output, State
from dash.exceptions import PreventUpdate

import dash_core_components as dcc
import dash_html_components as html
from dash_table import DataTable

import pytest
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

import math
import pandas as pd

url = "https://github.com/plotly/datasets/raw/master/" "26k-consumer-complaints.csv"
rawDf = pd.read_csv(url)
df = rawDf.to_dict('rows')

PAGE_SIZE = 5
pages = math.ceil(len(df) / PAGE_SIZE)

def get_app(mode, data=df, page_count=None):
    app = dash.Dash(__name__)

    if page_count is None:
        page_count = math.ceil(len(data) / PAGE_SIZE)

    app.layout = DataTable(
        id="table",
        columns=[{"name": i, "id": i} for i in rawDf.columns],
        data=data if mode == 'native' else data[0 : PAGE_SIZE],
        editable=True,
        fixed_columns={ 'headers': True },
        fixed_rows={ 'headers': True },
        page_action=mode,
        page_count=page_count,
        page_size=PAGE_SIZE,
        row_deletable=True,
        row_selectable=True,
    )

    if mode == 'custom':
        @app.callback(
            [Output('table', 'data')],
            [Input('table', 'page_current'), Input('table', 'page_size')]
        )
        def update_table(page_current, page_size):
            if page_current is None or page_size is None:
                raise PreventUpdate

            return data[
                page_current * page_size: (page_current + 1) * page_size
            ],

    return app


@pytest.mark.parametrize('mode', ['custom', 'native'])
def test_tpag001_next_previous(test, mode):
    test.start_server(get_app(mode))

    with test.table('table') as target:
        assert target.cell.get_text(0, 0) == '0'
        assert target.has_next_page()
        assert not target.has_prev_page()

        target.click_next_page()

        assert target.cell.get_text(0, 0) == '5'
        assert target.has_next_page()
        assert target.has_prev_page()

        target.click_prev_page()

        assert target.cell.get_text(0, 0) == '0'
        assert target.has_next_page()
        assert not target.has_prev_page()


@pytest.mark.parametrize('mode', ['custom', 'native'])
def test_tpag002_ops_on_first_page(test, mode):
    test.start_server(get_app(mode))

    with test.table('table') as target:
        assert target.get_current_page() == '1'
        assert not target.has_first_page()
        assert not target.has_prev_page()
        assert target.has_next_page()
        assert target.has_last_page()


@pytest.mark.parametrize('mode', ['custom', 'native'])
def test_tpag003_ops_on_last_page(test, mode):
    test.start_server(get_app(mode))

    with test.table('table') as target:
        target.click_last_page()

        assert target.get_current_page() == str(pages)
        assert target.has_first_page()
        assert target.has_prev_page()
        assert not target.has_next_page()
        assert not target.has_last_page()


def test_tpag004_ops_input_with_enter(test):
    test.start_server(get_app('native'))

    with test.table('table') as target:
        text00 = target.cell.get_text(0, 0)

        assert target.get_current_page() == '1'

        target.click_current_page()
        test.send_keys('100' + Keys.ENTER)

        assert target.get_current_page() == '100'
        assert target.cell.get_text(0, 0) != text00


def test_tpag005_ops_input_with_unfocus(test):
    test.start_server(get_app('native'))

    with test.table('table') as target:
        text00 = target.cell.get_text(0, 0)

        assert target.get_current_page() == '1'

        target.click_current_page()
        test.send_keys('100')
        target.cell.click(0, 0)

        assert target.get_current_page() == '100'
        assert target.cell.get_text(0, 0) != text00


@pytest.mark.parametrize('value,expected_value', [
    (0, 1),
    (-1, 1),
    ('a', 1),
    (pages * 2, pages)
])
def test_tpag006_ops_input_invalid_with_enter(test, value, expected_value):
    test.start_server(get_app('native'))

    with test.table('table') as target:
        text00 = target.cell.get_text(0, 0)

        assert target.get_current_page() == '1'

        target.click_current_page()
        test.send_keys(str(value) + Keys.ENTER)

        assert target.get_current_page() == str(expected_value)


@pytest.mark.parametrize('value,expected_value', [
    (0, 1),
    (-1, 1),
    ('a', 1),
    (pages * 2, pages)
])
def test_tpag007_ops_input_invalid_with_unfocus(test, value, expected_value):
    test.start_server(get_app('native'))

    with test.table('table') as target:
        text00 = target.cell.get_text(0, 0)

        assert target.get_current_page() == '1'

        target.click_current_page()
        test.send_keys(str(value))
        target.cell.click(0, 0)

        assert target.get_current_page() == str(expected_value)


@pytest.mark.parametrize('mode', ['custom', 'native'])
def test_tpag008_hide_with_single_page(test, mode):
    test.start_server(get_app(mode=mode, data=df[0: PAGE_SIZE]))

    with test.table('table') as target:
        assert not target.has_pagination()


def test_tpag009_hide_with_invalid_page_count(test):
    test.start_server(get_app(mode='custom', page_count=-1))

    with test.table('table') as target:
        assert not target.has_pagination()


def test_tpag010_limits_page(test):
    test.start_server(get_app(mode='custom', page_count=10))

    with test.table('table') as target:
        target.click_last_page()

        assert target.get_current_page() == '10'