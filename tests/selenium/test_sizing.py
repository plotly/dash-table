import dash
from dash.dependencies import Input, Output
from dash.testing import wait
from dash_table import DataTable
from dash_html_components import Button, Div


def cells_are_same_width(target, table):
    wait.until(lambda: abs(target.size["width"] - table.size["width"]) <= 1, 3)

    target_cells = target.find_elements_by_css_selector(
        ".cell-1-1 > table > tbody > tr:last-of-type > *"
    )
    table_r0c0_cells = table.find_elements_by_css_selector(
        ".cell-0-0 > table > tbody > tr:last-of-type > *"
    )
    table_r0c1_cells = table.find_elements_by_css_selector(
        ".cell-0-1 > table > tbody > tr:last-of-type > *"
    )
    table_r1c0_cells = table.find_elements_by_css_selector(
        ".cell-1-0 > table > tbody > tr:last-of-type > *"
    )
    table_r1c1_cells = table.find_elements_by_css_selector(
        ".cell-1-1 > table > tbody > tr:last-of-type > *"
    )

    # this test is very dependent on the table's implementation details..  we are testing that all the cells are
    # the same width after all..

    # make sure the r1c1 fragment contains all the cells
    assert len(target_cells) == len(table_r1c1_cells)

    # for each cell of each fragment, allow a difference of up to 1px either way since
    # the resize algorithm can be off by 1px for cycles
    for i, target_cell in enumerate(target_cells):
        assert abs(target_cell.size["width"] - table_r1c1_cells[i].size["width"]) <= 1

    if len(table_r0c0_cells) != 0:
        assert abs(target_cell.size["width"] - table_r0c0_cells[i].size["width"]) <= 1

    if len(table_r0c1_cells) != 0:
        assert abs(target_cell.size["width"] - table_r0c1_cells[i].size["width"]) <= 1

    if len(table_r1c0_cells) != 0:
        assert abs(target_cell.size["width"] - table_r1c0_cells[i].size["width"]) <= 1


def test_szng001_widths_on_style_change(test):
    base_props = dict(
        data=[
            {"a": 85, "b": 601, "c": 891},
            {"a": 967, "b": 189, "c": 514},
            {"a": 398, "b": 262, "c": 743},
            {"a": 89, "b": 560, "c": 582},
            {"a": 809, "b": 591, "c": 511},
        ],
        columns=[
            {"id": "a", "name": "A"},
            {"id": "b", "name": "B"},
            {"id": "c", "name": "C"},
        ],
        style_data={
            "width": 100,
            "minWidth": 100,
            "maxWidth": 100,
            "border": "1px solid blue",
        },
        row_selectable="single",
        row_deletable=True,
    )

    styles = [
        dict(
            style_table=dict(
                width=500, minWidth=500, maxWidth=500, paddingBottom=10, display="none"
            )
        ),
        dict(style_table=dict(width=500, minWidth=500, maxWidth=500, paddingBottom=10)),
        dict(style_table=dict(width=750, minWidth=750, maxWidth=750, paddingBottom=10)),
        dict(
            style_table=dict(
                width=750, minWidth=750, maxWidth=750, paddingBottom=10, display="none"
            )
        ),
        dict(style_table=dict(width=350, minWidth=350, maxWidth=350, paddingBottom=10)),
    ]

    fixes = [
        dict(),
        dict(fixed_columns=dict(headers=True)),
        dict(fixed_rows=dict(headers=True)),
        dict(fixed_columns=dict(headers=True), fixed_rows=dict(headers=True)),
        dict(fixed_columns=dict(headers=True, data=1)),
        dict(fixed_rows=dict(headers=True, data=1)),
        dict(
            fixed_columns=dict(headers=True, data=1),
            fixed_rows=dict(headers=True, data=1),
        ),
    ]

    variations = []
    style = styles[0]
    i = 0
    for fix in fixes:
        variations.append({**style, **fix, **base_props, "id": "table{}".format(i)})
        i = i + 1

    variations_range = range(0, len(variations))

    tables = [DataTable(**variation) for variation in variations]

    app = dash.Dash(__name__)
    app.layout = Div(
        children=[
            Button(id="btn", children="Click me"),
            Div(
                [
                    DataTable(
                        **base_props,
                        id="table{}".format(width),
                        style_table=dict(
                            width=width,
                            minWidth=width,
                            maxWidth=width,
                            paddingBottom=10,
                        )
                    )
                    for width in [350, 500, 750]
                ]
            ),
            Div(tables),
        ]
    )

    @app.callback(
        [Output("table{}".format(i), "style_table") for i in variations_range],
        [Input("btn", "n_clicks")],
        prevent_initial_call=True,
    )
    def update_styles(n_clicks):
        if n_clicks < len(styles):
            style_table = styles[n_clicks]["style_table"]
            return [style_table for i in variations_range]

    test.start_server(app)

    for style in styles:
        display = style.get("style_table", dict()).get("display")
        width = style.get("style_table", dict()).get("width")
        target = (
            test.driver.find_element_by_css_selector("#table{}".format(width))
            if display != "none"
            else None
        )

        for variation in variations:
            table = test.driver.find_element_by_css_selector(
                "#{}".format(variation["id"])
            )
            if target is None:
                assert table is not None
                assert (
                    test.driver.execute_script(
                        "return getComputedStyle(document.querySelector('#{} .dash-spreadsheet-container')).display".format(
                            variation["id"]
                        )
                    )
                    == "none"
                )
            else:
                cells_are_same_width(target, table)

        test.driver.find_element_by_css_selector("#btn").click()


def test_szng002_percentages_result_in_same_widths(test):
    base_props = dict(
        columns=[
            {"id": "_", "name": ["_", "_", "_"]},
            {
                "id": "a",
                "name": [
                    "A-----------------VERY LONG",
                    "A-----------------VERY LONG",
                    "A-----------------VERY LONG",
                ],
            },
            {
                "id": "b",
                "name": [
                    "A-----------------VERY LONG",
                    "A-----------------VERY LONG",
                    "B-----------------VERY LONG",
                ],
            },
            {
                "id": "c",
                "name": [
                    "A-----------------VERY LONG---",
                    "B-----------------VERY LONG---------",
                    "C-----------------VERY LONG------------------",
                ],
            },
        ],
        data=[
            {"_": 0, "a": 85, "b": 601, "c": 891},
            {"_": 0, "a": 967, "b": 189, "c": 514},
            {"_": 0, "a": 398, "b": 262, "c": 743},
            {"_": 0, "a": 89, "b": 560, "c": 582},
            {"_": 0, "a": 809, "b": 591, "c": 511},
        ],
        style_table=dict(width=500, minWidth=500, maxWidth=500, paddingBottom=10),
        style_cell=dict(width="25%", minWidth="25%", maxWidth="25%"),
    )

    _fixed_columns = [dict(headers=True, data=1), dict(headers=True)]

    _fixed_rows = [dict(headers=True, data=1), dict(headers=True)]

    _merge_duplicate_headers = [True, False]

    variations = []
    i = 0
    for fixed_columns in _fixed_columns:
        for fixed_rows in _fixed_rows:
            for merge_duplicate_headers in _merge_duplicate_headers:
                variations.append(
                    {
                        **base_props,
                        "fixed_columns": fixed_columns,
                        "fixed_rows": fixed_rows,
                        "merge_duplicate_headers": merge_duplicate_headers,
                        "id": "table{}".format(i),
                    }
                )
                i = i + 1

    tables = [DataTable(**variation) for variation in variations]

    app = dash.Dash(__name__)
    app.layout = Div(tables)

    test.start_server(app)

    target = test.driver.find_element_by_css_selector("#table0")
    cells_are_same_width(target, target)

    for i in range(1, len(variations)):
        table = test.driver.find_element_by_css_selector("#table{}".format(i))
        cells_are_same_width(target, table)
