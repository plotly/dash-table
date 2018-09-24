import dash_html_components as html


def merge(*args):
    merged = {}
    for arg in args:
        for key in arg:
            merged[key] = arg[key]
    return merged


def section_title(title):
    return html.H4(title, style={"marginTop": "20px"})


def html_table(
    df,
    base_column_style={},
    table_style={},
    column_style={},
    cell_style={},
    cell_style_by_column={},
):
    header = []
    for column in df.columns:
        header.append(
            html.Th(
                column,
                style=merge(
                    base_column_style,
                    cell_style,
                    column_style.get(column, {}),
                    cell_style_by_column.get(column, {}),
                ),
            )
        )

    rows = []
    for i in range(len(df)):
        row = []
        for column in df.columns:
            row.append(
                html.Td(
                    df.iloc[i][column],
                    style=merge(cell_style, cell_style_by_column.get(column, {})),
                )
            )
        rows.append(html.Tr(row))

    return html.Table(
        [html.Thead(header), html.Tbody(rows)],
        style=merge(table_style, {"marginTop": "20px", "marginBottom": "20px"}),
    )
