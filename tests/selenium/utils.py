read_write_modes = [dict(virtualization=False), dict(virtualization=True)]

basic_modes = read_write_modes + [dict(editable=False)]


def get_base_props(rows=100):
    mockProps = generate_mock_data(rows)

    for c in mockProps.get("columns"):
        c["name"] = c["name"] if "name" in c else c["id"]
        c["on_change"] = dict(action="none")
        c["renamable"] = True
        c["deletable"] = True

    baseProps = dict(
        id="table",
        dropdown={
            "bbb": dict(
                clearable=True,
                options=[
                    dict(label="label {}".format(i), value=i)
                    for i in ["Humid", "Wet", "Snowy", "Tropical Beaches"]
                ],
            ),
            "bbb-readonly": dict(
                clearable=True,
                options=[
                    dict(label="label {}".format(i), value=i)
                    for i in ["Humid", "Wet", "Snowy", "Tropical Beaches"]
                ],
            ),
        },
        editable=True,
        page_action="none",
        style_table=dict(
            maxHeight="800px", height="800px", maxWidth="1000px", width="1000px"
        ),
        style_cell=dict(maxWidth=150, minWidth=150, width=150),
        style_cell_conditional=[
            {
                "if": dict(column_id="rows",),
                "maxWidth": 60,
                "minWidth": 60,
                "width": 60,
            },
            {
                "if": dict(column_id="bbb",),
                "maxWidth": 200,
                "minWidth": 200,
                "width": 200,
            },
            {
                "if": dict(column_id="bbb-readonly",),
                "maxWidth": 200,
                "minWidth": 200,
                "width": 200,
            },
        ],
    )

    baseProps.update(mockProps)

    baseProps.update(generate_mock_data(rows))

    return baseProps


def generate_mock_data(rows=100):
    return dict(
        columns=[
            dict(id="rows", type="numeric", editable=False),
            dict(id="ccc", name=["City", "Canada", "Toronto"], type="numeric",),
            dict(id="ddd", name=["City", "Canada", "Montréal"], type="numeric",),
            dict(id="eee", name=["City", "America", "New York City"], type="numeric",),
            dict(id="fff", name=["City", "America", "Boston"], type="numeric",),
            dict(id="ggg", name=["City", "France", "Paris"], type="numeric",),
            dict(
                id="bbb",
                name=["", "Weather", "Climate"],
                type="text",
                presentation="dropdown",
            ),
            dict(
                id="bbb-readonly",
                name=["", "Weather", "Climate-RO"],
                type="text",
                editable=False,
                presentation="dropdown",
            ),
            dict(id="aaa", name=["", "Weather", "Temperature"], type="numeric"),
            dict(
                id="aaa-readonly",
                name=["", "Weather", "Temperature-RO"],
                type="numeric",
                editable=False,
            ),
        ],
        data=[
            {
                "rows": i,
                "ccc": i,
                "ddd": i,
                "eee": i,
                "fff": i + 1,
                "ggg": i * 10,
                "bbb": ["Humid", "Wet", "Snowy", "Tropical Beaches"][i % 4],
                "bbb-readonly": ["Humid", "Wet", "Snowy", "Tropical Beaches"][i % 4],
                "aaa": i + 1,
                "aaa-readonly": i + 1,
            }
            for i in range(rows)
        ],
    )
