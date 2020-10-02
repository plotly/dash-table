# For comprehensive documentation of this package's features,
# please consult https://dashr.plot.ly/datatable
#
# A package vignette is currently in development and will
# provide many of the same examples currently available online
# in an offline-friendly format.

# The following if statement is not required to run this
# example locally, but was added at the request of CRAN
# maintainers.
if (interactive() && require(dash)) {
    library(dash)
    library(dashTable)

    app <- Dash$new()

    # We can easily restrict the number of rows to display at
    # once by using style_table:
    app$layout(
    dashDataTable(
        id = "table",
        columns = lapply(colnames(iris),
                        function(colName){
                            list(
                            id = colName,
                            name = colName
                            )
                        }),
        style_table = list(
        maxHeight = "250px",
        overflowY = "scroll"
        ),
        data = df_to_list(iris)
    )
    )

    app$run_server()

    app <- Dash$new()

    # We can also make rows and columns selectable/deletable
    # by setting a few additional attributes:
    app$layout(
    dashDataTable(
        id = "table",
        columns = lapply(colnames(iris),
                        function(colName){
                            list(
                            id = colName,
                            name = colName,
                            deletable = TRUE
                            )
                        }),
        style_table = list(
        maxHeight = "250px",
        overflowY = "scroll"
        ),
        data = df_to_list(iris),
        editable = TRUE,
        filter_action = "native",
        sort_action = "native",
        sort_mode = "multi",
        column_selectable = "single",
        row_selectable = "multi",
        row_deletable = TRUE
    )
    )

    app$run_server()
}