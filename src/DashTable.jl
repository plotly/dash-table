
module DashTable
using DashBase

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "4.11.3"

include("dash_datatable.jl")

function __init__()
    DashBase.register_package(
        DashBase.ResourcePkg(
            "dash_table",
            resources_path,
            version = version,
            [
                DashBase.Resource(
    relative_package_path = "async-export.js",
    external_url = "https://unpkg.com/dash-table@4.11.3/dash_table/async-export.js",
    dynamic = nothing,
    async = :true,
    type = :js
),
DashBase.Resource(
    relative_package_path = "async-table.js",
    external_url = "https://unpkg.com/dash-table@4.11.3/dash_table/async-table.js",
    dynamic = nothing,
    async = :true,
    type = :js
),
DashBase.Resource(
    relative_package_path = "async-highlight.js",
    external_url = "https://unpkg.com/dash-table@4.11.3/dash_table/async-highlight.js",
    dynamic = nothing,
    async = :true,
    type = :js
),
DashBase.Resource(
    relative_package_path = "async-export.js.map",
    external_url = "https://unpkg.com/dash-table@4.11.3/dash_table/async-export.js.map",
    dynamic = true,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "async-table.js.map",
    external_url = "https://unpkg.com/dash-table@4.11.3/dash_table/async-table.js.map",
    dynamic = true,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "async-highlight.js.map",
    external_url = "https://unpkg.com/dash-table@4.11.3/dash_table/async-highlight.js.map",
    dynamic = true,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "bundle.js",
    external_url = "https://unpkg.com/dash-table@4.11.3/dash_table/bundle.js",
    dynamic = nothing,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "bundle.js.map",
    external_url = "https://unpkg.com/dash-table@4.11.3/dash_table/bundle.js.map",
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )

    )
end
end
