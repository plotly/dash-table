
module DashTable
using Dash

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "4.7.0"

include("Dash_datatable.jl")

function __init__()
    Dash.register_package(
        Dash.ResourcePkg(
            "dash_table",
            resources_path,
            version = version,
            [
                Dash.Resource(
    relative_package_path = "async-export.js",
    external_url = "https://unpkg.com/dash-table@4.7.0/dash_table/async-export.js",
    dynamic = nothing,
    async = :true,
    type = :js
),
Dash.Resource(
    relative_package_path = "async-table.js",
    external_url = "https://unpkg.com/dash-table@4.7.0/dash_table/async-table.js",
    dynamic = nothing,
    async = :true,
    type = :js
),
Dash.Resource(
    relative_package_path = "async-highlight.js",
    external_url = "https://unpkg.com/dash-table@4.7.0/dash_table/async-highlight.js",
    dynamic = nothing,
    async = :true,
    type = :js
),
Dash.Resource(
    relative_package_path = "async-export.js.map",
    external_url = "https://unpkg.com/dash-table@4.7.0/dash_table/async-export.js.map",
    dynamic = true,
    async = nothing,
    type = :js
),
Dash.Resource(
    relative_package_path = "async-table.js.map",
    external_url = "https://unpkg.com/dash-table@4.7.0/dash_table/async-table.js.map",
    dynamic = true,
    async = nothing,
    type = :js
),
Dash.Resource(
    relative_package_path = "async-highlight.js.map",
    external_url = "https://unpkg.com/dash-table@4.7.0/dash_table/async-highlight.js.map",
    dynamic = true,
    async = nothing,
    type = :js
),
Dash.Resource(
    relative_package_path = "bundle.js",
    external_url = "https://unpkg.com/dash-table@4.7.0/dash_table/bundle.js",
    dynamic = nothing,
    async = nothing,
    type = :js
),
Dash.Resource(
    relative_package_path = "bundle.js.map",
    external_url = "https://unpkg.com/dash-table@4.7.0/dash_table/bundle.js.map",
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )
    )
end
end
