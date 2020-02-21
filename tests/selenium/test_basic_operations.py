import dash
from dash.dependencies import Input, Output, State
from dash.exceptions import PreventUpdate

import dash_core_components as dcc
import dash_html_components as html
from dash_table import DataTable

from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

import pandas as pd

url = "https://github.com/plotly/datasets/raw/master/" "26k-consumer-complaints.csv"
rawDf = pd.read_csv(url)
df = rawDf.to_dict('rows')

def get_app():
    app = dash.Dash(__name__)

    app.layout = DataTable(
        id="table",
        columns=[{"name": i, "id": i} for i in rawDf.columns],
        data=df,
        editable=True,
        filter_action="native",
        fixed_columns={ 'headers': True },
        fixed_rows={ 'headers': True },
        page_action="native",
        row_deletable=True,
        row_selectable=True,
        sort_action="native",
    )

    return app


def test_tbst001_get_cell(test):
    test.start_server(get_app())

    with test.table('table') as target:
        assert target.cell.get_text(0, 0) == '0'
        target.paging.click_next_page()
        assert target.cell.get_text(0, 0) == '250'


def test_tbst002_select_all_text(test):
    test.start_server(get_app())

    with test.table('table') as target:
        target.cell.click(0, 1)

        assert target.cell.get_text(0, 1) == test.get_selected_text()


# https://github.com/plotly/dash-table/issues/50
def test_tbst003_edit_on_enter(test):
    test.start_server(get_app())

    with test.table('table') as target:
        target.cell.click(249, 0)
        test.send_keys('abc' + Keys.ENTER)

        assert target.cell.get_text(249, 0) == 'abc'


# https://github.com/plotly/dash-table/issues/107
def test_tbst004_edit_on_tab(test):
    test.start_server(get_app())

    with test.table('table') as target:
        target.cell.click(249, 0)
        test.send_keys('abc' + Keys.TAB)

        assert target.cell.get_text(249, 0) == 'abc'


def test_tbst005_edit_last_row_on_click_outside(test):
    test.start_server(get_app())

    with test.table('table') as target:
        target.cell.click(249, 0)
        test.send_keys('abc')
        target.cell.click(248, 0)

        assert target.cell.get_text(249, 0) == 'abc'


# https://github.com/plotly/dash-table/issues/141
def test_tbst006_focused_arrow_left(test):
    test.start_server(get_app())

    with test.table('table') as target:
        target.cell.click(249, 1)
        test.send_keys('abc' + Keys.LEFT)

        assert target.cell.get_text(249, 1) == 'abc'
        assert target.cell.is_focused(249, 0)


# https://github.com/plotly/dash-table/issues/141
def test_tbst007_active_focused_arrow_right(test):
    test.start_server(get_app())

    with test.table('table') as target:
        target.cell.click(249, 0)
        test.send_keys('abc' + Keys.RIGHT)

        assert target.cell.get_text(249, 0) == 'abc'
        assert target.cell.is_focused(249, 1)


# https://github.com/plotly/dash-table/issues/141
def test_tbst008_active_focused_arrow_up(test):
    test.start_server(get_app())

    with test.table('table') as target:
        target.cell.click(249, 0)
        test.send_keys('abc' + Keys.UP)

        assert target.cell.get_text(249, 0) == 'abc'
        assert target.cell.is_focused(248, 0)


# https://github.com/plotly/dash-table/issues/141
def test_tbst009_active_focused_arrow_down(test):
    test.start_server(get_app())

    with test.table('table') as target:
        target.cell.click(249, 0)
        test.send_keys('abc' + Keys.DOWN)

        assert target.cell.get_text(249, 0) == 'abc'
        assert target.cell.is_focused(249, 0)


def test_tbst010_active_with_dblclick(test):
    test.start_server(get_app())

    with test.table('table') as target:
        target.cell.double_click(0, 0)
        assert target.cell.is_active(0, 0)
        assert target.cell.get_text(0, 0) == test.get_selected_text()


def test_tbst011_delete_row(test):
    test.start_server(get_app())

    with test.table('table') as target:
        text00 = target.cell.get_text(0, 0)
        text01 = target.cell.get_text(1, 0)
        target.row.delete(0)

        assert target.cell.get_text(0, 0) == text01


def test_tbst012_delete_sorted_row(test):
    test.start_server(get_app())

    with test.table('table') as target:
        target.column.sort(0, rawDf.columns[0]) # None -> ASC
        target.column.sort(0, rawDf.columns[0]) # ASC -> DESC

        text00 = target.cell.get_text(0, 0)
        text01 = target.cell.get_text(1, 0)
        target.row.delete(0)

        assert target.cell.get_text(0, 0) == text01


def test_tbst013_select_row(test):
    test.start_server(get_app())

    with test.table('table') as target:
        target.row.select(0)

        assert target.row.is_selected(0)


def test_tbst014_selected_sorted_row(test):
    test.start_server(get_app())

    with test.table('table') as target:
        target.column.sort(0, rawDf.columns[0]) # None -> ASC
        target.column.sort(0, rawDf.columns[0]) # ASC -> DESC
        target.row.select(0)

        assert target.row.is_selected(0)


def test_tbst015_selected_row_respects_sort(test):
    test.start_server(get_app())

    with test.table('table') as target:
        target.row.select(0)

        assert target.row.is_selected(0)

        target.column.sort(0, rawDf.columns[0]) # None -> ASC
        target.column.sort(0, rawDf.columns[0]) # ASC -> DESC

        assert not target.row.is_selected(0)

        target.column.sort(0, rawDf.columns[0]) # DESC -> None

        assert target.row.is_selected(0)


def test_tbst016_delete_cell(test):
    test.start_server(get_app())

    with test.table('table') as target:
        target.cell.click(0, 1)
        test.send_keys(Keys.BACKSPACE)
        test.send_keys(Keys.ENTER)

        assert target.cell.get_text(0, 1) == ''


# # https://github.com/plotly/dash-table/issues/700
# def test_tbst017_delete_cell_updates_while_selected(test):
#     test.start_server(get_app())

#     with test.table('table') as target:
#         target.cell.click(0, 1)
#         test.send_keys(Keys.BACKSPACE)

#         assert target.cell.get_text(0, 1) == ''


def test_tbst018_delete_multiple_cells(test):
    test.start_server(get_app())

    with test.table('table') as target:
        target.cell.click(0, 1)
        with test.hold(Keys.SHIFT):
            ActionChains(test.driver).send_keys(Keys.DOWN).send_keys(Keys.RIGHT).perform()

        ActionChains(test.driver).send_keys(Keys.BACKSPACE).send_keys(Keys.ENTER).perform()

    for row in range(2):
        for col in range(1, 3):
            assert target.cell.get_text(row, col) == ''


# # https://github.com/plotly/dash-table/issues/700
# def test_tbst019_delete_multiple_cells_while_selected(test):
#     test.start_server(get_app())

#     with test.table('table') as target:
#         target.cell.click(0, 1)
#         with test.hold(Keys.SHIFT):
#             ActionChains(test.driver).send_keys(Keys.DOWN).send_keys(Keys.RIGHT).perform()

#         ActionChains(test.driver).send_keys(Keys.BACKSPACE).perform()

#     for row in range(2):
#         for col in range(1, 3):
#             assert target.cell.get_text(row, col) == ''


def test_tbst020_sorted_table_delete_cell(test):
    test.start_server(get_app())

    with test.table('table') as target:
        target.column.sort(0, rawDf.columns[0]) # None -> ASC
        target.column.sort(0, rawDf.columns[0]) # ASC -> DESC

        target.cell.click(0, 1)
        test.send_keys(Keys.BACKSPACE)
        test.send_keys(Keys.ENTER)

        assert target.cell.get_text(0, 1) == ''


# # https://github.com/plotly/dash-table/issues/700
# def test_tbst021_sorted_table_delete_cell_updates_while_selected(test):
#     test.start_server(get_app())

#     with test.table('table') as target:
#         target.column.sort(0, rawDf.columns[0]) # None -> ASC
#         target.column.sort(0, rawDf.columns[0]) # ASC -> DESC

#         target.cell.click(0, 1)
#         test.send_keys(Keys.BACKSPACE)

#         assert target.cell.get_text(0, 1) == ''


def test_tbst022_sorted_table_delete_multiple_cells(test):
    test.start_server(get_app())

    with test.table('table') as target:
        target.column.sort(0, rawDf.columns[0]) # None -> ASC
        target.column.sort(0, rawDf.columns[0]) # ASC -> DESC

        target.cell.click(0, 1)
        with test.hold(Keys.SHIFT):
            ActionChains(test.driver).send_keys(Keys.DOWN).send_keys(Keys.RIGHT).perform()

        ActionChains(test.driver).send_keys(Keys.BACKSPACE).send_keys(Keys.ENTER).perform()

    for row in range(2):
        for col in range(1, 3):
            assert target.cell.get_text(row, col) == ''

# # https://github.com/plotly/dash-table/issues/700
# def test_tbst023_sorted_table_delete_multiple_cells_while_selected(test):
#     test.start_server(get_app())

#     with test.table('table') as target:
#         target.column.sort(0, rawDf.columns[0]) # None -> ASC
#         target.column.sort(0, rawDf.columns[0]) # ASC -> DESC

#         target.cell.click(0, 1)
#         with test.hold(Keys.SHIFT):
#             ActionChains(test.driver).send_keys(Keys.DOWN).send_keys(Keys.RIGHT).perform()

#         ActionChains(test.driver).send_keys(Keys.BACKSPACE).perform()

#     for row in range(2):
#         for col in range(1, 3):
#             assert target.cell.get_text(row, col) == ''