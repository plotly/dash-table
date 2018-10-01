from dash.dependencies import Input, Output
import dash_core_components as dcc
import dash_html_components as html
import pandas as pd
from textwrap import dedent

import dash_table
from index import app
from .utils import section_title


ID_PREFIX = "app_dataframe_updating_graph_be"
IDS = {
    "table": ID_PREFIX,
    "container": "{}-container".format(ID_PREFIX),
    "table-sorting": "{}-sorting".format(ID_PREFIX),
    "table-multi-sorting": "{}-multi-sorting".format(ID_PREFIX),
    "table-filtering": "{}-filtering".format(ID_PREFIX),
    "table-sorting-filtering": "{}-sorting-filtering".format(ID_PREFIX),
}
df = pd.read_csv("./datasets/gapminder.csv")
df = df[df["year"] == 2007]
df[' index'] = range(1, len(df) + 1)


PAGE_SIZE = 5


def layout():
    return html.Div(
        [

            section_title('Backend Paging'),

            dash_table.Table(
                id=IDS["table"],
                columns=[
                    {"name": i, "id": i, "deletable": True} for i in sorted(df.columns)
                ],
                pagination_settings={
                    'displayed_pages': 2,
                    'current_page': 0,
                    'page_size': PAGE_SIZE
                },
                pagination_mode='be'
            ),

            html.Hr(),

            dcc.Markdown(dedent('''
            With backend paging, we can have front-end sorting and filtering
            but it will only filter and sort the data that exists on the page.

            This should be avoided. Your users will expect
            that sorting and filtering is happening on the entire dataset and,
            with large pages, might not be aware that this is only occuring
            on the current page.

            Instead, we recommend implmenting sorting and filtering on the
            backend as well. That is, on the entire underlying dataset.
            ''')),

            section_title('Backend Paging with Sorting'),

            dash_table.Table(
                id=IDS["table-sorting"],
                columns=[
                    {"name": i, "id": i, "deletable": True} for i in sorted(df.columns)
                ],
                pagination_settings={
                    'displayed_pages': 2,
                    'current_page': 0,
                    'page_size': PAGE_SIZE
                },
                pagination_mode='be',

                sorting='be',
                sorting_type='single',
                sorting_settings=[]
            ),

            section_title('Backend Paging with Multi Column Sorting'),

            dcc.Markdown(dedent('''
            Multi-column sort allows you to sort by multiple columns.
            This is useful when you have categorical columns with repeated
            values and you're interested in seeing the sorted values for
            each category.

            In this example, try sorting by continent and then any other column.
            ''')),

            dash_table.Table(
                id=IDS["table-multi-sorting"],
                columns=[
                    {"name": i, "id": i, "deletable": True} for i in sorted(df.columns)
                ],
                pagination_settings={
                    'displayed_pages': 2,
                    'current_page': 0,
                    'page_size': PAGE_SIZE
                },
                pagination_mode='be',

                sorting='be',
                sorting_type='multi',
                sorting_settings=[]
            ),

            section_title('Backend Paging with Filtering'),

            dcc.Markdown(dedent('''
            Dash Table's front-end filtering has its own filtering expression
            language.

            Currently, backend filtering must parse the same filtering language.
            If you write an expression that is not "valid" under the filtering
            language, then it will not be passed to the backend.

            This limitation will be removed in the future to allow you to
            write your own expression query language.

            In this example, we've written a Pandas backend for the filtering
            language. It supports `eq`, `<`, and `>`. For example, try:

            - Enter `eq Asia` in the "continent" column
            - Enter `> 5000` in the "gdpPercap" column
            - Enter `< 80` in the `lifeExp` column

            ''')),

            dash_table.Table(
                id=IDS["table-filtering"],
                columns=[
                    {"name": i, "id": i, "deletable": True} for i in sorted(df.columns)
                ],
                pagination_settings={
                    'displayed_pages': 2,
                    'current_page': 0,
                    'page_size': PAGE_SIZE
                },
                pagination_mode='be',

                filtering='be',
                filtering_settings=''
            ),

            section_title('Backend Paging with Filtering and Multi-Column Sorting'),

            dash_table.Table(
                id=IDS["table-sorting-filtering"],
                columns=[
                    {"name": i, "id": i, "deletable": True} for i in sorted(df.columns)
                ],
                pagination_settings={
                    'displayed_pages': 2,
                    'current_page': 0,
                    'page_size': PAGE_SIZE
                },
                pagination_mode='be',

                filtering='be',
                filtering_settings='',

                sorting='be',
                sorting_type='multi',
                sorting_settings=[]
            ),

        ]
    )


@app.callback(
    Output(IDS["table"], "dataframe"),
    [Input(IDS["table"], "pagination_settings")])
def update_graph(pagination_settings):
    return df.iloc[
        pagination_settings['current_page']*pagination_settings['page_size']:
        (pagination_settings['current_page'] + 1)*pagination_settings['page_size']
    ].to_dict('rows')


@app.callback(
    Output(IDS["table-sorting"], "dataframe"),
    [Input(IDS["table-sorting"], "pagination_settings"),
     Input(IDS["table-sorting"], "sorting_settings")])
def update_graph(pagination_settings, sorting_settings):
    print(sorting_settings)
    if len(sorting_settings):
        dff = df.sort_values(
            sorting_settings[0]['columnId'],
            ascending=sorting_settings[0]['direction'] == 'asc',
            inplace=False
        )
    else:
        # No sort is applied
        dff = df

    return dff.iloc[
        pagination_settings['current_page']*pagination_settings['page_size']:
        (pagination_settings['current_page'] + 1)*pagination_settings['page_size']
    ].to_dict('rows')



@app.callback(
    Output(IDS["table-multi-sorting"], "dataframe"),
    [Input(IDS["table-multi-sorting"], "pagination_settings"),
     Input(IDS["table-multi-sorting"], "sorting_settings")])
def update_graph(pagination_settings, sorting_settings):
    print(sorting_settings)
    if len(sorting_settings):
        dff = df.sort_values(
            [col['columnId'] for col in sorting_settings],
            ascending=[
                col['direction'] == 'asc'
                for col in sorting_settings
            ],
            inplace=False
        )
    else:
        # No sort is applied
        dff = df

    return dff.iloc[
        pagination_settings['current_page']*pagination_settings['page_size']:
        (pagination_settings['current_page'] + 1)*pagination_settings['page_size']
    ].to_dict('rows')


@app.callback(
    Output(IDS["table-filtering"], "dataframe"),
    [Input(IDS["table-filtering"], "pagination_settings"),
     Input(IDS["table-filtering"], "filtering_settings")])
def update_graph(pagination_settings, filtering_settings):
    print(filtering_settings)
    filtering_expressions = filtering_settings.split(' && ')
    dff = df
    for filter in filtering_expressions:
        if ' eq ' in filter:
            col_name = filter.split(' eq ')[0]
            filter_value = filter.split(' eq ')[1]
            dff = dff.loc[dff[col_name] == filter_value]
        if ' > ' in filter:
            col_name = filter.split(' > ')[0]
            filter_value = float(filter.split(' > ')[1])
            dff = dff.loc[dff[col_name] > filter_value]
        if ' < ' in filter:
            col_name = filter.split(' < ')[0]
            filter_value = float(filter.split(' < ')[1])
            dff = dff.loc[dff[col_name] < filter_value]

    return dff.iloc[
        pagination_settings['current_page']*pagination_settings['page_size']:
        (pagination_settings['current_page'] + 1)*pagination_settings['page_size']
    ].to_dict('rows')


@app.callback(
    Output(IDS["table-sorting-filtering"], "dataframe"),
    [Input(IDS["table-sorting-filtering"], "pagination_settings"),
     Input(IDS["table-sorting-filtering"], "sorting_settings"),
     Input(IDS["table-sorting-filtering"], "filtering_settings")])
def update_graph(pagination_settings, sorting_settings, filtering_settings):
    print(filtering_settings)
    filtering_expressions = filtering_settings.split(' && ')
    dff = df
    for filter in filtering_expressions:
        if ' eq ' in filter:
            col_name = filter.split(' eq ')[0]
            filter_value = filter.split(' eq ')[1]
            dff = dff.loc[dff[col_name] == filter_value]
        if ' > ' in filter:
            col_name = filter.split(' > ')[0]
            filter_value = float(filter.split(' > ')[1])
            dff = dff.loc[dff[col_name] > filter_value]
        if ' < ' in filter:
            col_name = filter.split(' < ')[0]
            filter_value = float(filter.split(' < ')[1])
            dff = dff.loc[dff[col_name] < filter_value]

    if len(sorting_settings):
        dff = dff.sort_values(
            [col['columnId'] for col in sorting_settings],
            ascending=[
                col['direction'] == 'asc'
                for col in sorting_settings
            ],
            inplace=False
        )

    return dff.iloc[
        pagination_settings['current_page']*pagination_settings['page_size']:
        (pagination_settings['current_page'] + 1)*pagination_settings['page_size']
    ].to_dict('rows')
