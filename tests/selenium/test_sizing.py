import dash
from dash.dependencies import Input, Output
from dash.testing import wait
from dash_table import DataTable
from dash_html_components import Button, Div

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
    style_data_conditional=[{"if": {}, "width": 100, "minWidth": 100, "maxWidth": 100}],
    style_data={"border": "1px solid blue"},
    row_selectable="single",
    row_deletable=True,
)

styles = [
    dict(
        style_table=dict(
            width=500, minWidth=500, maxWidth=500, paddingBottom=10, display="none"
        )
    ),
]

fixes = [
    dict(),
    dict(fixed_columns=dict(headers=True)),
    dict(fixed_rows=dict(headers=True)),
    dict(fixed_columns=dict(headers=True), fixed_rows=dict(headers=True)),
    dict(fixed_columns=dict(headers=True, data=1)),
    dict(fixed_rows=dict(headers=True, data=1)),
    dict(
        fixed_columns=dict(headers=True, data=1), fixed_rows=dict(headers=True, data=1)
    ),
]

variations = []
i = 0
for style in styles:
    for fix in fixes:
        variations.append({**style, **fix, **base_props, "id": "table{}".format(i)})
        i = i + 1

variations_range = range(0, len(variations))


def get_app():
    global base_props, variations, variations_range

    tables = [DataTable(**variation) for i, variation in enumerate(variations)]

    app = dash.Dash(__name__)
    app.layout = Div(
        children=[
            Button(id="btn", children="Click me"),
            DataTable(
                **base_props,
                id="table350",
                style_table=dict(
                    width=350, minWidth=350, maxWidth=350, paddingBottom=10
                )
            ),
            DataTable(
                **base_props,
                id="table500",
                style_table=dict(
                    width=500, minWidth=500, maxWidth=500, paddingBottom=10
                )
            ),
            DataTable(
                **base_props,
                id="table750",
                style_table=dict(
                    width=750, minWidth=750, maxWidth=750, paddingBottom=10
                )
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
        if n_clicks == 1:
            return [
                dict(width=500, minWidth=500, maxWidth=500, paddingBottom=10)
                for i in variations_range
            ]
        elif n_clicks == 2:
            return [
                dict(width=750, minWidth=750, maxWidth=750, paddingBottom=10)
                for i in variations_range
            ]
        elif n_clicks == 3:
            return [
                dict(
                    width=750,
                    minWidth=750,
                    maxWidth=750,
                    display="none",
                    paddingBottom=10,
                )
                for i in variations_range
            ]
        elif n_clicks:
            return [
                dict(width=350, minWidth=350, maxWidth=350, paddingBottom=10)
                for i in variations_range
            ]

    return app


def test_empt001_clear_(test):
    global variations

    test.start_server(get_app())

    targets = [None, "table500", "table750", None, "table350"]

    for targetId in targets:
        target = (
            test.driver.find_element_by_css_selector("#{}".format(targetId))
            if targetId is not None
            else None
        )

        for variation in variations:
            table = test.driver.find_element_by_css_selector(
                "#{}".format(variation["id"])
            )
            if targetId is None:
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
                wait.until(
                    lambda: target.size["width"] == table.size["width"],
                    3,
                    "mismatched width for {} and {}, {} vs {}".format(
                        variation["id"],
                        targetId,
                        table.size["width"],
                        target.size["width"],
                    ),
                )

                target_cells = target.find_elements_by_css_selector(
                    ".cell-1-1 > table > tbody > tr:first-of-type > *"
                )
                table_r0c0_cells = table.find_elements_by_css_selector(
                    ".cell-0-0 > table > tbody > tr:first-of-type > *"
                )
                table_r0c1_cells = table.find_elements_by_css_selector(
                    ".cell-0-1 > table > tbody > tr:first-of-type > *"
                )
                table_r1c0_cells = table.find_elements_by_css_selector(
                    ".cell-1-0 > table > tbody > tr:first-of-type > *"
                )
                table_r1c1_cells = table.find_elements_by_css_selector(
                    ".cell-1-1 > table > tbody > tr:first-of-type > *"
                )

                # this test is very dependent on the table's implementation details..  we are testing that all the cells are
                # the same width after all..

                # make sure the r1c1 fragment contains all the cells
                assert len(target_cells) == len(table_r1c1_cells)

                # for each cell of each fragment, allow a difference of up to 1px either way since
                # the resize algorithm can be off by 1px for cycles
                for i, target_cell in enumerate(target_cells):
                    assert (
                        abs(
                            target_cell.size["width"]
                            - table_r1c1_cells[i].size["width"]
                        )
                        <= 1
                    )

                if len(table_r0c0_cells) != 0:
                    assert (
                        abs(
                            target_cell.size["width"]
                            - table_r0c0_cells[i].size["width"]
                        )
                        <= 1
                    )

                if len(table_r0c1_cells) != 0:
                    assert (
                        abs(
                            target_cell.size["width"]
                            - table_r0c1_cells[i].size["width"]
                        )
                        <= 1
                    )

                if len(table_r1c0_cells) != 0:
                    assert (
                        abs(
                            target_cell.size["width"]
                            - table_r1c0_cells[i].size["width"]
                        )
                        <= 1
                    )

        test.driver.find_element_by_css_selector("#btn").click()
