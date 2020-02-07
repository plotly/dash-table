import dash
from dash.dependencies import Input, Output
import dash_html_components as html
import dash_core_components as dcc

import v_be_page
import v_copy_paste
import v_data_loading
import v_default
import v_fe_page
import v_markdown
import v_pagination

app = dash.Dash()

app.config.suppress_callback_exceptions = True
app.css.config.serve_locally = True
app.scripts.config.serve_locally = True

app.layout = html.Div([
    dcc.Location(id='url', refresh=False),
    html.Div(id='container')
])

v_be_page.get_callbacks(app)
v_copy_paste.get_callbacks(app)
v_data_loading.get_callbacks(app)
v_default.get_callbacks(app)
v_fe_page.get_callbacks(app)
v_markdown.get_callbacks(app)
v_pagination.get_callbacks(app)

@app.callback(
    Output('container', 'children'),
    [Input('url', 'pathname')]
)
def update_layout(pathname):
    print(pathname)
    if pathname == '/v_be_page':
        return v_be_page.get_layout()
    elif pathname == '/v_copy_paste':
        return v_copy_paste.get_layout()
    elif pathname == '/v_data_loading':
        return v_data_loading.get_layout()
    elif pathname == '/v_default':
        return v_default.get_layout()
    elif pathname == '/v_fe_page':
        return v_fe_page.get_layout()
    elif pathname == '/v_markdown':
        return v_markdown.get_layout()
    elif pathname == '/v_pagination':
        return v_pagination.get_layout()
    else:
        return html.Div(['Invalid page'])


if __name__ == "__main__":
    app.run_server(port=8081, debug=True)
